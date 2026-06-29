# CCA-F Daily Training Program

Rolling 4-week cycle, **15 minutes per day**. No exam date set — repeat the cycle, shifting emphasis to weak domains each pass (see Scoring Log). Weighted toward Max's focus areas: Claude Code & Prompting (D2+D3, 40%) and MCP & Context (D4+D5, 33%).

## Daily session format (15 min)

| Phase | Time | What |
|---|---|---|
| Learn | 5 min | Read the day's concept block below (+ linked section in `REFERENCES/CCA-F_References.md`) |
| Drill | 7 min | Do the micro-drill; log it in `DRILLS.md` if it produces an artifact |
| Check | 3 min | Answer the self-check questions from memory, then verify |

Quiz days use `exam.mjs` / `CONTEXT/example_questions.json`.

---

## Week 1 — Baseline sweep (all 5 domains)

### Day 1 · D1 Agentic Architecture
**Learn:** Single-agent vs multi-agent: add agents only when the task parallelizes or contexts must be isolated. Orchestrator-worker = central agent decomposes, workers execute, orchestrator merges. Hub-and-spoke = workers never talk to each other, only the hub.
**Drill:** Sketch (text) the architecture for "review a 200-package monorepo": pattern, worker scope, merge step.
**Check:** When is multi-agent *wrong*? What does the orchestrator do when one worker fails? Why don't workers share context?

### Day 2 · D2 Claude Code config
**Learn:** CLAUDE.md hierarchy: enterprise policy → project (`./CLAUDE.md`, checked in) → user (`~/.claude/CLAUDE.md`) → local overrides. More specific scope wins on conflict; all applicable files are loaded together. Subdirectory CLAUDE.md loads on demand when working there.
**Drill:** In this repo, write a one-line conflicting rule in a scratch user-style note and predict precedence; verify against docs.
**Check:** Which file is shared with the team? Where do personal preferences go? What loads when you `cd` into a subfolder?

### Day 3 · D3 Prompt engineering
**Learn:** XML tags separate instructions/data/examples (`<instructions>`, `<example>`, `<document>`). Prefilling the assistant turn (e.g. `{`) forces format and skips preamble. Few-shot: 3–5 diverse examples beat long prose rules.
**Drill:** Write a prompt that extracts `{name, date, amount}` JSON from an invoice email using tags + prefill.
**Check:** Why prefill `{`? When do examples beat instructions? What goes in tags vs system prompt?

### Day 4 · D4 MCP basics
**Learn:** Host (app) → client (1:1 connection) → server (exposes tools/resources/prompts). Tools = model-invoked actions; resources = app-controlled data; prompts = user-invoked templates. Transports: stdio (local, spawned process) vs streamable HTTP (remote, multi-client, OAuth).
**Drill:** For a CRM integration, list 3 tools with names + one-line descriptions + input schemas (sketch).
**Check:** Tool vs resource? Who initiates sampling? Which transport for a shared team server?

### Day 5 · D5 Context management
**Learn:** Degradation near the limit → compact: summarize completed work, keep recent turns verbatim, re-inject standing rules into system prompt. Externalize state to files/memory instead of conversation. Escalate to human on low confidence or destructive actions.
**Drill:** Write a 5-line compaction policy for a support agent (what's summarized, what's kept, what's pinned).
**Check:** What must survive compaction? Why files over conversation for state? Name 2 human-in-the-loop triggers.

### Day 6 · Quiz
10 mixed questions from `CONTEXT/example_questions.json` (2 per domain). Log score below.

### Day 7 · Review
Re-read explanations for every miss. Write one flashcard-style note per miss in `CONTEXT/`.

---

## Week 2 — Deep block: Claude Code & Prompting (D2 + D3)

### Day 8 · CLAUDE.md & settings precedence
**Learn:** Settings precedence mirrors memory: enterprise managed > CLI args > local project > shared project > user. CLAUDE.md supports `@path` imports. Keep it short — it's loaded every session and consumes context.
**Drill:** Audit this repo's CLAUDE.md: cut or tighten 3 lines without losing meaning.
**Check:** What wins: enterprise policy or project CLAUDE.md? Cost of a bloated CLAUDE.md?

### Day 9 · Slash commands & hooks
**Learn:** Custom commands = markdown in `.claude/commands/` (project) or `~/.claude/commands/` (user); `$ARGUMENTS` for params; frontmatter for `allowed-tools`/`description`. Hooks run shell commands on lifecycle events (PreToolUse, PostToolUse, Stop) — deterministic guardrails, unlike prompts.
**Drill:** Write a `/quiz <domain>` command file for this repo that pulls N questions from the bank.
**Check:** Project vs user command location? Why a hook instead of a CLAUDE.md rule for "always run lint"?

### Day 10 · Headless & CI/CD
**Learn:** `claude -p "prompt"` = non-interactive headless mode; `--output-format json` for pipelines; GitHub Actions integration for PR review/issue triage. Permission modes: default / acceptEdits / plan / bypassPermissions (dangerous, sandbox only).
**Drill:** Draft the CI step (YAML sketch) that runs Claude to review PR diffs and posts findings.
**Check:** Which flag for scripted runs? When is bypassPermissions acceptable? How does CI get repo context?

### Day 11 · Structured output deep dive
**Learn:** Most reliable JSON: tool-use schema (forced function call) > prefill + stop sequence > prose instruction. JSON schema: mark required fields, use enums to constrain, describe each field. For extraction, quote-then-extract reduces hallucination.
**Drill:** Define a tool schema for extracting line items from receipts (fields, types, enum for currency).
**Check:** Rank the 3 JSON-forcing techniques. Why enums? What does quotes-first buy you?

### Day 12 · Long-context & few-shot patterns
**Learn:** Put long documents at the TOP, query/instructions at the bottom (~30% quality gain). Ask for relevant quotes first, then the answer. Few-shot examples should cover edge cases, not just the happy path.
**Drill:** Restructure a "summarize this contract" prompt to docs-top, quotes-first.
**Check:** Where do documents go? Why quotes-first? What makes a few-shot set good?

### Day 13 · Quiz — 10 questions, D2+D3 only.
### Day 14 · Review misses; update flashcards.

---

## Week 3 — Deep block: MCP & Context/Reliability (D4 + D5)

### Day 15 · Transports & auth
**Learn:** stdio: server is a subprocess, creds via env vars, one client. Streamable HTTP: single `/mcp` endpoint, supports many clients, sessions, resumability; auth via OAuth 2.1 / bearer tokens. SSE-only transport is legacy/deprecated.
**Drill:** Decision table: 4 deployment scenarios → transport + auth choice, one line of justification each.
**Check:** How do stdio servers get secrets? What replaced SSE? When is HTTP mandatory?

### Day 16 · Tool design quality
**Learn:** Good tools: clear verb-noun names, descriptions written for the *model* (when to use, when not), strict input schemas, meaningful error messages the model can act on, idempotent where possible. Fewer well-scoped tools beat many overlapping ones.
**Drill:** Take a bad tool (`doStuff(data: string)`) and rewrite it properly for a calendar booking use case.
**Check:** Who is the tool description for? Why do overlapping tools hurt? What makes an error message "actionable"?

### Day 17 · MCP security
**Learn:** Threats: prompt injection via tool results/resources, confused deputy (server misusing delegated auth), token theft, malicious servers. Mitigations: treat tool output as untrusted data, least-privilege scopes, human approval for destructive actions, allowlisted servers.
**Drill:** List the top 3 risks for an MCP server with write access to Salesforce, with one mitigation each.
**Check:** Why is tool output untrusted? What's a confused deputy? Which actions need human approval?

### Day 18 · Context engineering
**Learn:** Compaction (summarize + restart), structured note-taking (NOTES.md / memory files persist across compactions), subagents for context isolation — workers burn tokens, return distilled summaries. Just-in-time retrieval beats pre-loading everything.
**Drill:** Design the memory layout (files + what goes in each) for a week-long migration agent.
**Check:** Three context-scaling techniques? What do subagents return to the orchestrator? Pre-load vs JIT?

### Day 19 · Reliability & escalation
**Learn:** Agentic loop: gather context → act → verify → repeat. Termination: explicit success criteria, max iterations, budget caps — never "loop until done" alone. Failure handling: retry with backoff for transient, escalate to human for ambiguous/destructive, fail one worker without killing the batch.
**Drill:** Write termination + escalation rules (5 lines) for an agent that auto-fixes failing tests.
**Check:** Name 3 termination conditions. Retry vs escalate — which when? Minimal blast radius means what?

### Day 20 · Quiz — 10 questions, D4+D5 only.
### Day 21 · Review misses; update flashcards.

---

## Week 4 — Agentic Architecture (D1) + consolidation

### Day 22 · Orchestration patterns
**Learn:** Patterns: prompt chaining (fixed steps), routing (classify then dispatch), parallelization (fan-out/fan-in), orchestrator-worker (dynamic decomposition), evaluator-optimizer (generate + critique loop). Use the simplest pattern that works.
**Drill:** Match 5 business scenarios to patterns, one line each.
**Check:** Chaining vs orchestrator-worker? When does evaluator-optimizer pay off? Default bias: simple or complex?

### Day 23 · Coordination & state
**Learn:** Workers get clean, scoped contexts (objective, output format, tool boundaries). Shared state via files/artifacts, not chat history. Clear handoff contracts prevent duplicate or missed work.
**Drill:** Write the task spec (objective/output/tools/limits) an orchestrator would hand a research subagent.
**Check:** What's in a good handoff? Why files for shared state? What happens with vague worker objectives?

### Day 24 · Failure modes
**Learn:** Infinite loops (missing termination), context poisoning (one bad result propagates), cascade failures, silent failures (worst — report success on error). Defenses: verification steps, checkpoints, circuit breakers, honest error surfacing.
**Drill:** For yesterday's research agent, list 3 failure modes + 1 defense each.
**Check:** Why is silent failure worst? What's a checkpoint for? Circuit breaker in agent terms?

### Day 25 · Hard scenarios D1
Work through 5 hardest D1 questions in the bank; write a one-line justification for each option you *rejected*.

### Day 26 · Full-domain rapid review
Skim all flashcards + `REFERENCES/CCA-F_References.md`. Mark anything still shaky.

### Day 27 · Mini-mock
20 questions, mixed per exam weights, timed 40 min. Log score.

### Day 28 · Retro & re-plan
Score by domain. Next cycle: swap one deep-block week to your weakest domain.

---

## Scoring log

| Date | Session | Score | Weakest domain | Note |
|---|---|---|---|---|
| 2026-06-13 | Wk1 Day 6 quiz (10 mixed) | 9/10 (90%) | D4 — MCP transport | Only miss: SSE vs Streamable HTTP for remote multi-client server. |

## Integration

- The `cca-f-daily-tutor` scheduled task (8am) should follow this program day-by-day and log drills to `DRILLS.md`.
- Cycle position: track it here → **Current: Cycle 1, Day 22 (started 2026-06-08)**.
