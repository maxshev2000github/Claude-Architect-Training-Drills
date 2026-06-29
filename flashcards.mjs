#!/usr/bin/env node
/**
 * CCA-F Flashcard quiz — random order, one card at a time.
 *
 * Usage:
 *   node flashcards.mjs            # all domains, random
 *   node flashcards.mjs 1          # domain 1 only
 *   node flashcards.mjs 2 4        # domains 2 and 4
 */

import { readFileSync } from "fs";
import { createInterface } from "readline";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dir = dirname(fileURLToPath(import.meta.url));
const md = readFileSync(join(__dir, "CONTEXT", "flashcards.md"), "utf-8");

// ── Parse cards from markdown ──────────────────────────────────────────
const cards = [];
let currentDomain = "";
let currentId = "";
let currentQ = "";
let currentA = "";

for (const line of md.split(/\r?\n/)) {
  const domainMatch = line.match(/^## Domain (\d) — (.+)$/);
  if (domainMatch) {
    currentDomain = `D${domainMatch[1]}: ${domainMatch[2].replace(/ \(\d+%\)/, "")}`;
    continue;
  }
  if (line.startsWith("## Cross-Domain")) {
    currentDomain = "Cross-Domain Anti-Patterns";
    continue;
  }
  const cardMatch = line.match(/^### Card (.+)$/);
  if (cardMatch) {
    if (currentQ && currentA) {
      cards.push({ id: currentId, domain: currentDomain, q: currentQ.trim(), a: currentA.trim() });
    }
    currentId = cardMatch[1];
    currentQ = "";
    currentA = "";
    continue;
  }
  if (line.startsWith("**Q:**")) {
    currentQ = line.replace("**Q:** ", "");
  } else if (line.startsWith("**A:**")) {
    currentA = line.replace("**A:** ", "");
  }
}
if (currentQ && currentA) {
  cards.push({ id: currentId, domain: currentDomain, q: currentQ.trim(), a: currentA.trim() });
}

// ── Filter by domain args ──────────────────────────────────────────────
const domainFilter = process.argv.slice(2).map(Number).filter(Boolean);
const deck = domainFilter.length
  ? cards.filter((c) => domainFilter.some((d) => c.id.startsWith(`${d}.`)) || (domainFilter.includes(0) && c.id.startsWith("X.")))
  : cards;

if (!deck.length) {
  console.log("No cards found. Check domain arguments (1-5, or omit for all).");
  process.exit(1);
}

// ── Shuffle (Fisher-Yates) ─────────────────────────────────────────────
for (let i = deck.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [deck[i], deck[j]] = [deck[j], deck[i]];
}

// ── Interactive loop ───────────────────────────────────────────────────
const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (prompt) => new Promise((res) => rl.question(prompt, res));

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";

let correct = 0;
let wrong = 0;
let skipped = 0;

console.log(`\n${BOLD}CCA-F Flashcards${RESET}  |  ${deck.length} cards  |  ${domainFilter.length ? `Domain(s): ${domainFilter.join(", ")}` : "All domains"}`);
console.log(`${DIM}Controls: Enter = reveal answer  |  y = got it  |  n = missed it  |  s = skip  |  q = quit${RESET}\n`);

for (let i = 0; i < deck.length; i++) {
  const c = deck[i];
  console.log(`${DIM}── Card ${i + 1}/${deck.length} ──  [${c.domain}]${RESET}`);
  console.log(`${CYAN}${BOLD}Q: ${c.q}${RESET}\n`);

  const preAnswer = await ask(`${DIM}(Enter to reveal, s=skip, q=quit)${RESET} `);
  if (preAnswer.trim().toLowerCase() === "q") break;
  if (preAnswer.trim().toLowerCase() === "s") {
    skipped++;
    console.log("");
    continue;
  }

  console.log(`\n${GREEN}A: ${c.a}${RESET}\n`);

  const verdict = await ask(`${YELLOW}Did you know it? (y/n/q)${RESET} `);
  if (verdict.trim().toLowerCase() === "q") break;
  if (verdict.trim().toLowerCase() === "y") correct++;
  else wrong++;

  console.log("");
}

// ── Summary ────────────────────────────────────────────────────────────
const total = correct + wrong;
const pct = total ? Math.round((correct / total) * 100) : 0;
console.log(`\n${BOLD}Session results${RESET}`);
console.log(`  Correct:  ${correct}/${total} (${pct}%)`);
if (skipped) console.log(`  Skipped:  ${skipped}`);
if (wrong) console.log(`  Review:   ${wrong} card(s) need more practice`);
console.log("");

rl.close();
