# DRILLS.md

Running log of CCA-F hands-on practice drills (newest first).

## 2026-06-22 · Day 15 · D4 MCP — transport & auth decision table

**Drill:** Create `DRILLS/day15_transport_table.md` — a decision table for 4 deployment scenarios (local CLI wrapper; company-hosted multi-rep Salesforce server; ephemeral CI Jira server; public partner analytics server needing resume). For each, pick **transport** (stdio / Streamable HTTP) + **auth** (env var / OAuth 2.1 / bearer) + one-line justification. Add a footnote on what replaced SSE and why a 2025-era design shouldn't pick it. Reinforces the SSE-vs-Streamable-HTTP trap (Max's only Day-6 quiz miss).

**Acceptance criteria:**
- [ ] `DRILLS/day15_transport_table.md` exists; all 4 rows have transport + auth + 1-line justification.
- [ ] Scenario 1 = **stdio** + **env var**; Scenarios 2 & 4 = **Streamable HTTP**.
- [ ] Scenario 2 names **OAuth 2.1** and ties it to **per-user identity** (each rep acts as themselves; Salesforce sharing rules apply).
- [ ] Scenario 4 cites **resumability / session reconnect** as the reason HTTP wins.
- [ ] Scenario 3 justified on lifecycle (ephemeral, machine-to-machine); bearer/service token acceptable, with a note on stdio-in-runner vs HTTP.
- [ ] Footnote states **Streamable HTTP replaced HTTP+SSE**; SSE is legacy/deprecated.
- [ ] Stretch: 5th "biggest risk" column per row (e.g. token leak via logs, confused deputy on shared server) — bridges to Day 17.

## 2026-06-21 · Day 14 · Review — Week 2 (D2+D3) closed-book recall

**Drill:** Build a closed-book recall map. From memory, create `DRILLS/day14_week2_recall.md` with a one-line answer to each of the 12 prompts in `CCA-F_Daily_2026-06-21.md` (§2) covering Week-2 material: CLAUDE.md hierarchy & settings precedence, slash-command location, `allowed-tools` vs prose, hooks vs prompts, headless flags, CI repo-context, the four permission modes, the 3 JSON-forcing techniques + enums, and long-context layout / quotes-first. Then re-read the review sheet, grade each line ✓/✗, and star every miss. Finally, log the unlogged Day 13 quiz score in the `TRAINING_PROGRAM.md` Scoring Log.

**Acceptance criteria:**
- [ ] `DRILLS/day14_week2_recall.md` exists with all 12 prompts answered **before** re-reading the sheet.
- [ ] Each answer graded ✓/✗ and missed lines starred.
- [ ] ≥9/12 correct on first pass (else flag the weakest sub-area for next cycle's Week-2 pass).
- [ ] Day 13 D2+D3 quiz score added as a row in the `TRAINING_PROGRAM.md` Scoring Log (date, session, score, weakest sub-area, note).
- [ ] Weakest sub-area named from: CLAUDE.md precedence / hooks-vs-prompt / headless-CI / permission-modes / structured-output ranking / enums-schema / long-context-quotes-first / few-shot.

## 2026-06-20 · Day 13 · Quiz — D2+D3 mid-cycle check (10 MCQs)

**Drill:** Take the 10-question quiz in `CCA-F_Daily_2026-06-20.md` (Cowork outputs), **closed-book**, timed ~20 min (exam pace ≈ 2 min/question). Covers Domains 2 (Claude Code config) + 3 (Prompt engineering) only — the Week-2 deep block. Mark every answer before viewing the key. Then log score + weakest sub-area in the `TRAINING_PROGRAM.md` Scoring Log.

**Acceptance criteria:**
- [ ] All 10 questions answered before viewing the answer key.
- [ ] Completed in ≤20 min (exam pace check).
- [ ] Score recorded (target ≥8/10; pass bar ≈72%).
- [ ] Weakest sub-area identified (CLAUDE.md precedence / hooks-vs-prompt / headless CI / structured-output / few-shot / long-context) and noted for the Day 14 review.
- [ ] Score row added to the `TRAINING_PROGRAM.md` Scoring Log.

## 2026-06-18 · Day 11 · D3 Prompt Engineering — receipt line-item extraction tool schema

**Drill:** Create `DRILLS/day11_receipt_schema.json` — a tool/function-call `input_schema` (JSON Schema) that extracts line items from a receipt (image/OCR text), plus a 3–4 line note on why a forced tool schema beats a prose "return JSON" prompt. Salesforce flavor: this feeds an expense-to-Opportunity sync, so mistyped `amount`/`currency` would corrupt downstream SPIFF/commission math — the schema must be strict.

**Acceptance criteria:**
- [ ] Valid JSON Schema usable as a tool `input_schema` (object with `type`, `properties`, `required`).
- [ ] A `lineItems` array of objects with at least `description` (string), `quantity` (number/integer), `unitPrice` (number).
- [ ] Receipt-level fields: `merchant` (string), `total` (number), `currency` as an **enum** (e.g. `USD|EUR|GBP|UAH`).
- [ ] At least 3 fields marked `required`; each field has a one-line `description`.
- [ ] A `date` field with a format hint (`"format": "date"` or `YYYY-MM-DD`).
- [ ] Note (3–4 lines) ranking tool-schema vs prefill vs prose, + one line on what **quote-then-extract** would add.
- [ ] Stretch: per-line `confidence` enum (`high|medium|low`) + one sentence on routing `low` items to human review (D3 → D5 escalation).

## 2026-06-17 · Day 10 · D2 Claude Code config — headless CI PR-review step

**Drill:** Draft a GitHub Actions workflow step (YAML sketch) that runs Claude Code headless to review the diff on every pull request and post findings as a PR comment. Save as `DRILLS/day10_ci_pr_review.yml` (study sketch, not a live workflow). Salesforce flavor: imagine it flagging Apex anti-patterns (SOQL-in-loops, missing `with sharing`) before a Copado promotion.

**Acceptance criteria:**
- [ ] Triggers on `pull_request`.
- [ ] Checks out repo with enough history to diff (`fetch-depth: 0` or explicit base ref) + one line on *why* this is how Claude gets context.
- [ ] Runs Claude **headless** (`claude -p` or `anthropics/claude-code-action`), not interactive.
- [ ] Uses `--output-format json` or explains where structured output is parsed.
- [ ] Non-`default`, write-incapable permission posture (`plan` mode or read-only `--allowedTools`) + one line on why `default` and `bypassPermissions` are both wrong here.
- [ ] `ANTHROPIC_API_KEY` from `secrets`, never inline.
- [ ] Posts findings back to the PR (`gh pr comment` or the action's comment step).
- [ ] Stretch: second job with `--permission-mode acceptEdits` auto-applying lint fixes on a label trigger; note the blast-radius difference.

## 2026-06-16 · Day 9 · D2 Claude Code config — `/quiz` slash command

**Drill:** Create `.claude/commands/quiz.md` (project scope). The command pulls N scenario MCQs from `CONTEXT/example_questions.json`, optionally filtered to one domain, and presents them one at a time without revealing answers until the user responds. Invocation `/quiz <domain> <count>` (e.g. `/quiz 2 5`); both args optional, default mixed + N=10. Use `$ARGUMENTS`/positional args, pull the bank via `@CONTEXT/example_questions.json`, and set frontmatter `description`, `argument-hint`, `allowed-tools: Read`.

**Acceptance criteria:**
- [ ] File exists at `.claude/commands/quiz.md` (project scope, not `~/.claude/`).
- [ ] Frontmatter sets `description`, `argument-hint`, and `allowed-tools: Read`.
- [ ] Uses `$ARGUMENTS` or `$1`/`$2` for domain + count, with sensible defaults.
- [ ] References the bank via `@CONTEXT/example_questions.json`.
- [ ] Instructions explicitly defer answers/explanations until after the user answers, then score.
- [ ] One sentence explaining why `allowed-tools: Read` (deterministic restriction) is used instead of a prose "don't edit" instruction.
- [ ] Stretch (optional): sibling `/quiz-hard` pulling only anti-pattern questions.

## 2026-06-13 · Day 6 · Quiz — Week 1 mixed baseline (10 MCQs, 2/domain)

**Drill:** Take the 10-question mixed quiz in `CCA-F_Daily_2026-06-13.md` (Cowork outputs), closed-book, timed ~20 min (~2 min/question, exam pace). Mark each answer before checking the key. Then log your score and weakest domain in the Scoring Log table in `TRAINING_PROGRAM.md`.

**Acceptance criteria:**
- [ ] All 10 questions answered before viewing the answer key.
- [ ] Completed in ≤20 min (exam pace check).
- [ ] Score recorded (target ≥8/10; pass bar ~72%).
- [ ] Weakest domain identified and noted for the Day 7 review.
- [ ] Score row added to the `TRAINING_PROGRAM.md` Scoring Log.

## 2026-06-09 · Day 2 · D2 Claude Code config — CLAUDE.md precedence

**Drill:** Predict-then-verify precedence. In a scratch file `DRILLS/day2_precedence_scratch.md`, document two CLAUDE.md conflicts and predict the winner of each:
1. An *authority-based* conflict — a user-style rule that contradicts an existing project `./CLAUDE.md` rule (e.g. "always produce exhaustive drills" vs the project's "favor clarity over completeness").
2. A *scope-based* conflict — a hypothetical `DRILLS/CLAUDE.md` rule vs the root `./CLAUDE.md`, predicting which governs inside `DRILLS/`.
Verify both predictions against `REFERENCES/CCA-F_References.md` / docs.

**Acceptance criteria:**
- [ ] Scratch file with two documented conflicts (one authority-based, one scope-based).
- [ ] Each has an explicit prediction *with a reason*.
- [ ] Predictions verified against references; correctness noted.
- [ ] One sentence on the context-cost implication of stacking many CLAUDE.md files.
