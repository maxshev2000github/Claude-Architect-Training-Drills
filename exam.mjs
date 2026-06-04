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
 *   node exam.mjs --no-timer       # disable countdown timer
 *   npm run exam                   # full exam via npm
 *   npm run quiz                   # quick 10-question quiz
 */

import { createInterface } from "node:readline";
import { readdir, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTEXT_DIR = join(__dirname, "CONTEXT");

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

function formatTime(sec) {
  const m = Math.floor(Math.max(0, sec) / 60);
  const s = Math.max(0, sec) % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function progressBar(pct) {
  const filled = Math.round(pct / 5);
  return "\u2588".repeat(filled) + "\u2591".repeat(20 - filled);
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

async function runExam(questions, numQuestions, useTimer) {
  shuffle(questions);
  const pool = questions.slice(0, numQuestions);
  const total = pool.length;

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
        showResults(correct, i, domainStats, (Date.now() - startTime) / 1000);
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
    }

    if (q.explanation) {
      console.log(`  -> ${q.explanation}`);
    }
  }

  prompt.close();
  showResults(correct, total, domainStats, (Date.now() - startTime) / 1000);
}

// ── CLI ──────────────────────────────────────────────────────

async function main() {
  const { values } = parseArgs({
    options: {
      questions: { type: "string", short: "n", default: String(TOTAL_QUESTIONS) },
      domain: { type: "string", short: "d" },
      "no-timer": { type: "boolean", default: false },
    },
    strict: true,
  });

  const numRequested = parseInt(values.questions, 10);
  const domainFilter = values.domain ? parseInt(values.domain, 10) : null;
  const useTimer = !values["no-timer"];

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
    valid = valid.filter((q) => q.domain === domainFilter);
    if (valid.length === 0) {
      console.log(`No questions found for domain ${domainFilter}.`);
      process.exit(1);
    }
  }

  const num = Math.min(numRequested, valid.length);
  if (num < numRequested) {
    console.log(`Note: only ${num} questions available (requested ${numRequested}).`);
  }

  await runExam(valid, num, useTimer);
}

main();
