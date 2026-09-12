/**
 * CCA-F Exam Simulator
 *
 * Loads question banks from CONTEXT/ folder (JSON files) and runs
 * a timed, randomized mock exam mimicking the real CCA-F format:
 *   - 60 scenario-based MCQs
 *   - 120-minute time limit
 *   - Pass mark: 720 / 1000
 *   - Results broken down by domain
 *
 * Usage:
 *   node exam.mjs                  # full 60-question exam
 *   node exam.mjs --questions 10   # quick 10-question quiz
 *   node exam.mjs --domain 1       # filter to domain 1 only
 *   node exam.mjs --domain 2,3    # diagnostic across several domains
 *   node exam.mjs --no-timer       # disable countdown timer
 *   node exam.mjs --no-shuffle     # keep options in bank order (debugging)
 *   node exam.mjs --no-log         # don't record the session
 *   npm run exam                   # full exam via npm
 *   npm run quiz                   # quick 10-question quiz
 *   npm run diagnostic -- -d 2,3  # per-domain diagnostic
 *
 * Answer options are reordered per question at presentation time. The bank's
 * stored answers are ~81% "B", so without this the correct letter is
 * predictable and scores are inflated.
 *
 * Every completed session is appended to RESULTS/exam_log.jsonl (full detail,
 * including which questions were missed) and as one row in the
 * TRAINING_PROGRAM.md scoring log. Logging by hand has never once happened,
 * so it is automatic.
 */

import { createInterface } from "node:readline";
import { readdir, readFile, writeFile, appendFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseArgs } from "node:util";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTEXT_DIR = join(__dirname, "CONTEXT");
const RESULTS_DIR = join(__dirname, "RESULTS");
const RESULTS_LOG = join(RESULTS_DIR, "exam_log.jsonl");
const PROGRAM_FILE = join(__dirname, "TRAINING_PROGRAM.md");

const TOTAL_QUESTIONS = 60;
const TIME_LIMIT_SEC = 120 * 60;
const PASS_SCORE = 720;
const MAX_SCORE = 1000;

const DOMAINS = {
  1: "Agentic Architecture & Orchestration",
  2: "Claude Code Configuration & Workflows",
  3: "Prompt Engineering & Structured Output",
  4: "Tool Design & MCP Integration",
  5: "Context Management & Reliability",
};

// ── Readline helper ──────────────────────────────────────────

function createPrompt() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q) => new Promise((resolve) => rl.question(q, resolve));
  const close = () => rl.close();
  return { ask, close };
}

// ── Load & validate ──────────────────────────────────────────

async function loadQuestions() {
  const questions = [];
  let files;
  try {
    files = await readdir(CONTEXT_DIR);
  } catch {
    return questions;
  }

  for (const file of files.filter((f) => f.endsWith(".json")).sort()) {
    try {
      const raw = await readFile(join(CONTEXT_DIR, file), "utf-8");
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        questions.push(...data);
      } else if (data.questions) {
        questions.push(...data.questions);
      }
    } catch (err) {
      console.warn(`Warning: skipping ${file} (${err.message})`);
    }
  }
  return questions;
}

function validateQuestion(q, idx) {
  const required = ["question", "options", "answer", "domain"];
  const missing = required.filter((k) => !(k in q));
  if (missing.length) {
    console.warn(`Warning: question ${idx + 1} missing ${missing.join(", ")}, skipping.`);
    return false;
  }
  if (!(q.answer in q.options)) {
    console.warn(`Warning: question ${idx + 1} answer key not in options, skipping.`);
    return false;
  }
  return true;
}

// ── Helpers ──────────────────────────────────────────────────

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Rewrite option-letter references in an explanation so they match the
 * reordered options. `map` is originalLetter -> newLetter. Handles a bare
 * "(C)" and "Option C" / "Options A, B and D" — the whole letter list is
 * remapped, not just the first letter.
 */
function remapExplanationLetters(text, map) {
  if (!text) return text;
  return text
    .replace(/\b(Options?\s+)([A-Z](?:\s*(?:,|and)\s*[A-Z])*)\b/g, (m, prefix, list) =>
      prefix + list.replace(/[A-Z]/g, (l) => map[l] || l)
    )
    .replace(/\(([A-Z])\)/g, (m, l) => (map[l] ? `(${map[l]})` : m));
}

/**
 * Return a copy of the question with its options reordered, the answer key
 * remapped, and letter references in the explanation kept consistent.
 */
function shuffleOptions(q) {
  const letters = Object.keys(q.options).sort();
  const entries = shuffle(letters.map((l) => [l, q.options[l]]));

  const options = {};
  const map = {};
  entries.forEach(([originalLetter, text], i) => {
    options[letters[i]] = text;
    map[originalLetter] = letters[i];
  });

  return {
    ...q,
    options,
    answer: map[q.answer],
    explanation: remapExplanationLetters(q.explanation, map),
  };
}

function formatTime(sec) {
  const m = Math.floor(Math.max(0, sec) / 60);
  const s = Math.max(0, sec) % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function progressBar(pct) {
  const filled = Math.round(pct / 5);
  return "\u2588".repeat(filled) + "\u2591".repeat(20 - filled);
}

// ── Persistence ──────────────────────────────────────────────

/** Lowest-scoring domain in this session; ties broken by most questions missed. */
function weakestDomain(domainStats) {
  const rows = Object.entries(domainStats)
    .filter(([, s]) => s.total > 0)
    .map(([id, s]) => ({ id, ...s, pct: Math.round((s.correct / s.total) * 100) }));
  if (!rows.length) return null;
  rows.sort((a, b) => a.pct - b.pct || b.total - b.correct - (a.total - a.correct));
  return rows[0];
}

/** Insert a row at the end of the scoring-log table in TRAINING_PROGRAM.md. */
async function appendScoringLogRow(row) {
  let text;
  try {
    text = await readFile(PROGRAM_FILE, "utf-8");
  } catch {
    return false;
  }

  const lines = text.split("\n");
  const heading = lines.findIndex((l) => /^##\s+Scoring log/i.test(l));
  if (heading === -1) return false;

  // Walk to the last consecutive table row after the heading.
  let last = -1;
  for (let i = heading + 1; i < lines.length; i++) {
    if (lines[i].trim().startsWith("|")) last = i;
    else if (last !== -1) break;
  }
  if (last === -1) return false;

  lines.splice(last + 1, 0, row);
  await writeFile(PROGRAM_FILE, lines.join("\n"));
  return true;
}

async function persistSession(session) {
  await mkdir(RESULTS_DIR, { recursive: true });
  await appendFile(RESULTS_LOG, JSON.stringify(session) + "\n");

  const weak = weakestDomain(session.domainStats);
  const weakLabel = weak
    ? `D${weak.id} — ${DOMAINS[weak.id] || "?"} (${weak.correct}/${weak.total})`
    : "n/a";

  const missBreakdown = Object.entries(
    session.missed.reduce((acc, m) => ({ ...acc, [m.domain]: (acc[m.domain] || 0) + 1 }), {})
  )
    .sort()
    .map(([d, n]) => `D${d}×${n}`)
    .join(", ");

  const note = [
    session.aborted ? "aborted early" : null,
    session.missed.length ? `${session.missed.length} missed: ${missBreakdown}` : "no misses",
    `options shuffled: ${session.optionsShuffled ? "yes" : "no"}`,
  ]
    .filter(Boolean)
    .join("; ");

  const label = `${session.total}q ${
    session.domainFilter ? session.domainFilter.map((d) => `D${d}`).join("+") : "mixed"
  }`;
  const row = `| ${session.date} | ${label} | ${session.correct}/${session.total} (${session.percent}%) | ${weakLabel} | ${note} |`;

  const logged = await appendScoringLogRow(row);
  return { logged, weakLabel };
}

// ── Results ──────────────────────────────────────────────────

function showResults(correct, total, domainStats, elapsedSec) {
  if (total === 0) {
    console.log("\nNo questions answered.");
    return;
  }

  const score = Math.round((correct / total) * MAX_SCORE);
  const passed = score >= PASS_SCORE;

  console.log("\n" + "=".repeat(60));
  console.log("  EXAM RESULTS");
  console.log("=".repeat(60));
  console.log(`  Score    : ${score} / ${MAX_SCORE}  (${correct}/${total} correct)`);
  console.log(`  Time     : ${formatTime(Math.floor(elapsedSec))}`);
  console.log(`  Result   : ${passed ? "PASS" : "FAIL"}`);
  console.log();
  console.log("  Domain breakdown:");

  for (const dId of Object.keys(domainStats).sort()) {
    const ds = domainStats[dId];
    const name = (DOMAINS[dId] || `Domain ${dId}`).padEnd(40).slice(0, 40);
    const pct = ds.total ? Math.round((ds.correct / ds.total) * 100) : 0;
    const bar = progressBar(pct);
    console.log(
      `    ${dId}. ${name} ${String(ds.correct).padStart(2)}/${String(ds.total).padEnd(2)}  ${bar} ${pct}%`
    );
  }
  console.log("=".repeat(60));
}

// ── Main exam loop ───────────────────────────────────────────

async function runExam(questions, numQuestions, useTimer, opts = {}) {
  const { shuffleAnswers = true, logResults = true, domainFilter = null } = opts;

  shuffle(questions);
  const pool = questions
    .slice(0, numQuestions)
    .map((q) => (shuffleAnswers ? shuffleOptions(q) : q));
  const total = pool.length;
  const missed = [];

  // Record the session, whether it finished, timed out, or was aborted.
  const finish = async (correctCount, answeredCount, domainStats, elapsedSec, aborted) => {
    showResults(correctCount, answeredCount, domainStats, elapsedSec);
    if (!logResults || answeredCount === 0) return;

    const percent = Math.round((correctCount / answeredCount) * 100);
    const { logged, weakLabel } = await persistSession({
      date: new Date().toISOString().slice(0, 10),
      total: answeredCount,
      correct: correctCount,
      percent,
      score: Math.round((correctCount / answeredCount) * MAX_SCORE),
      elapsedSec: Math.floor(elapsedSec),
      domainFilter,
      optionsShuffled: shuffleAnswers,
      aborted,
      domainStats,
      missed,
    });

    console.log(`\n  Weakest this session: ${weakLabel}`);
    console.log(`  Logged to RESULTS/exam_log.jsonl`);
    console.log(
      logged
        ? `  Scoring log row added to TRAINING_PROGRAM.md`
        : `  Could not find the scoring log table in TRAINING_PROGRAM.md — row not added`
    );
  };

  console.log("\n" + "=".repeat(60));
  console.log("  CCA-F EXAM SIMULATOR");
  console.log("=".repeat(60));
  console.log(`  Questions : ${total}`);
  console.log(`  Time limit: ${useTimer ? "120 minutes" : "unlimited"}`);
  console.log(`  Pass score: ${PASS_SCORE} / ${MAX_SCORE}`);
  console.log("=".repeat(60));

  const prompt = createPrompt();
  await prompt.ask("\nPress Enter to start...");

  const startTime = Date.now();
  let correct = 0;
  const domainStats = {};

  for (let i = 0; i < total; i++) {
    const elapsedSec = (Date.now() - startTime) / 1000;

    if (useTimer && elapsedSec >= TIME_LIMIT_SEC) {
      console.log("\nTime is up!");
      for (let r = i; r < total; r++) {
        const d = pool[r].domain;
        domainStats[d] = domainStats[d] || { correct: 0, total: 0 };
        domainStats[d].total++;
      }
      break;
    }

    const q = pool[i];
    const domainId = q.domain;
    const domainName = DOMAINS[domainId] || `Domain ${domainId}`;
    domainStats[domainId] = domainStats[domainId] || { correct: 0, total: 0 };
    domainStats[domainId].total++;

    const remainingSec = useTimer ? TIME_LIMIT_SEC - Math.floor(elapsedSec) : null;
    const timerStr = remainingSec != null ? `  [${formatTime(remainingSec)} remaining]` : "";

    console.log(`\n--- Question ${i + 1}/${total}${timerStr} ---`);
    console.log(`[${domainName}]\n`);

    if (q.scenario) {
      console.log(`Scenario: ${q.scenario}\n`);
    }

    console.log(q.question);
    console.log();

    const optionKeys = Object.keys(q.options).sort();
    for (const key of optionKeys) {
      console.log(`  ${key}) ${q.options[key]}`);
    }

    let choice;
    while (true) {
      const raw = await prompt.ask(`\nYour answer (${optionKeys.join("/")}, or 'q' to quit): `);
      choice = raw.trim().toUpperCase();
      if (choice === "Q") {
        console.log("\nExam aborted.");
        prompt.close();
        // This question was displayed but not answered; don't count it.
        domainStats[domainId].total--;
        await finish(correct, i, domainStats, (Date.now() - startTime) / 1000, true);
        return;
      }
      if (optionKeys.includes(choice)) break;
      console.log(`Invalid choice. Enter one of: ${optionKeys.join(", ")}`);
    }

    const isCorrect = choice === q.answer;
    if (isCorrect) {
      correct++;
      domainStats[domainId].correct++;
      console.log("Correct!");
    } else {
      console.log(`Wrong. Correct answer: ${q.answer}) ${q.options[q.answer]}`);
      missed.push({
        domain: domainId,
        question: q.question,
        scenario: q.scenario ? q.scenario.slice(0, 200) : null,
        chose: q.options[choice],
        correct: q.options[q.answer],
      });
    }

    if (q.explanation) {
      console.log(`  -> ${q.explanation}`);
    }
  }

  prompt.close();
  await finish(correct, total, domainStats, (Date.now() - startTime) / 1000, false);
}

// ── CLI ──────────────────────────────────────────────────────

async function main() {
  const { values } = parseArgs({
    options: {
      questions: { type: "string", short: "n", default: String(TOTAL_QUESTIONS) },
      domain: { type: "string", short: "d" },
      "no-timer": { type: "boolean", default: false },
      "no-shuffle": { type: "boolean", default: false },
      "no-log": { type: "boolean", default: false },
    },
    strict: true,
  });

  const numRequested = parseInt(values.questions, 10);
  const domainFilter = values.domain
    ? values.domain
        .split(",")
        .map((d) => parseInt(d.trim(), 10))
        .filter((d) => !Number.isNaN(d))
    : null;
  const useTimer = !values["no-timer"];
  const shuffleAnswers = !values["no-shuffle"];
  const logResults = !values["no-log"];

  const allQuestions = await loadQuestions();
  if (allQuestions.length === 0) {
    console.log(`No questions found. Add JSON question files to CONTEXT/`);
    console.log(`See CONTEXT/example_questions.json for the expected format.`);
    process.exit(1);
  }

  let valid = allQuestions.filter((q, i) => validateQuestion(q, i));
  if (valid.length === 0) {
    console.log("No valid questions found after validation.");
    process.exit(1);
  }

  if (domainFilter) {
    valid = valid.filter((q) => domainFilter.includes(q.domain));
    if (valid.length === 0) {
      console.log(`No questions found for domain(s) ${domainFilter.join(", ")}.`);
      process.exit(1);
    }
  }

  const num = Math.min(numRequested, valid.length);
  if (num < numRequested) {
    console.log(`Note: only ${num} questions available (requested ${numRequested}).`);
  }

  await runExam(valid, num, useTimer, { shuffleAnswers, logResults, domainFilter });
}

// Only run when invoked directly, so the helpers above stay importable for tests.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}

export {
  shuffleOptions,
  remapExplanationLetters,
  loadQuestions,
  validateQuestion,
  weakestDomain,
  appendScoringLogRow,
  persistSession,
};
