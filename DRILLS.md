# DRILLS.md

Running log of CCA-F hands-on practice drills (newest first).

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
