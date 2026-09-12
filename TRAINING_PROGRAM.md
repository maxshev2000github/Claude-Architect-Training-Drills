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
| 2026-07-26 | 20q D2+D3 | 16/20 (80%) | D2 — Claude Code Configuration & Workflows (6/9) | 4 missed: D2×3, D3×1; options shuffled: yes |

## Integration

- The `cca-f-daily-tutor` scheduled task (8am) should follow this program day-by-day and log drills to `DRILLS.md`.
- Cycle position: track it here → **Current: Cycle 4, Day 6 (2026-09-04)** *(On schedule. **Day 6 = quiz day** — first Day-6 quiz actually delivered since Cycle 2; Cycle 3's was skipped and never made up. Session in `CCA-F_Daily_2026-09-04.md`: **10 fresh mixed MCQs, 2 per domain**, closed-book/12 min, none reused from `CONTEXT/example_questions.json`, answer key + per-question explanations in §2 (each explanation names *why the runner-up distractor is attractive*, not just why the key is right). Coverage: D1 sequential-chain-doesn't-need-subagents + fail-one-worker-not-the-batch; D2 `deny` > `allow` with non-overridable enterprise policy + hook-vs-CLAUDE.md for a "no exceptions" guarantee; D3 forced tool schema atop the reliability ladder + docs-top/quotes-first on a 180-page MSA; D4 **Streamable HTTP + OAuth 2.1 vs legacy SSE** (deliberately re-tested — the single logged miss in the whole scoring log) + primitives-by-controller (model/app/user); D5 two-symptoms-two-fixes compaction (rule → system prompt, state → file) + termination conditions with **silent failure** as the decisive detail. Answer key: 1-B 2-C 3-C 4-A 5-B 6-B 7-C 8-B 9-B 10-B. Drill = **the sitting plus a ten-row runner-up table** (every question, hit or miss: the most plausible distractor + the one *general* rule that kills it), then knowledge-miss vs reading-miss tagging and a per-domain score. **Cycle-4 rule #2 is settleable today by construction** — the quiz produces a number, so both the 2026-09-04 row and the six-days-carried `2026-08-28` mini-mock row go in the Scoring log, today's one written *before* reading the key. **Rule #1 still unmet, sixth day running:** `DRILLS/` holds only `.gitkeep`; five artifacts now owed (Days 1, 2, 3, 5, 6). Working tree still has four uncommitted modified files. Day 7 = review (one flashcard per miss); **Day 8 opens the Cycle-4 D4-primary deep block and must not be skipped** — Day 4 was already lost.)* *(Prior: **Cycle 4, Day 5 (2026-09-03)** — **Day 4 skipped** — no session ran 09-02, so the calendar advanced Day 3 (09-01) → Day 4 (09-02, skipped) → Day 5 (09-03). Day 4 was D4 MCP basics and D4 is the standing weak domain, so a 60-second D4 catch-up (primitives by controller, stdio vs Streamable HTTP, **SSE is legacy**) is carried as §0 of `CCA-F_Daily_2026-09-03.md` rather than lost; the Cycle-4 **D4-primary deep block still opens Day 8** and must not be skipped. Day 5 = D5 Context Management. Session delivered in `CCA-F_Daily_2026-09-03.md`: Learn block framed as **context is a budget, not a container** — degradation is a signal-to-noise collapse well before the limit, so "bigger window" postpones the slope rather than removing it; four techniques with what each actually buys (compaction with verbatim-recent + **rule re-injection into the system prompt** / externalized state because files survive compaction and conversation does not / subagents returning a **digest not a transcript** / just-in-time over pre-loading), then escalation triggers and anti-triggers (transient 503 → retry; ambiguous or destructive → escalate; **silent failure is worse than either**). 3 program self-checks + 3 fresh D5 MCQs (larger-window-as-capacity-fix → rejected / uniform summarization losing state *and* a standing rule for two different reasons → two different fixes / empty `soql_query` result ambiguous between no-rows and permission-denied → false green, fix the **return contract** before adding a human gate). Drill = **compaction policy against a live failure trace**: exactly 5 lines for a 5-day 40-component Copado release agent, a 6-row survives-verbatim / summarized / externalized table with a named failure per misplacement, and three one-liners separating retry (bounded) from escalate from **fix-the-contract**. Fourth pass on D5 Day 5: wrote cold → memory layout → placed survivors → **write the policy and defend each column**. **Both Cycle-4 standing rules still unmet, fifth day running:** `DRILLS/` holds only `.gitkeep` (Days 1, 2 and 3 artifacts never created), and the 08-28 mini-mock score row is still absent — both re-carried into today's acceptance criteria. Working tree also has four uncommitted modified files.)* *(Prior: **Cycle 4, Day 3 (2026-09-01)** — On schedule. Day 3 = D3 Prompt Engineering; Cycle-4 Week 1 is unchanged (the D4-primary deep block starts Day 8). Session delivered in `CCA-F_Daily_2026-09-01.md`: Learn block reframed as **four mechanisms as a ladder of guarantees** (tags = separation not sanitization → prefill = opening-token anchor → few-shot = encouragement → tool schema = the only enforced layer, and even it guarantees shape not truth; quote-then-extract buys truth separately), plus tag collision and the prefill/extended-thinking incompatibility. 3 program self-checks + 3 fresh D3 MCQs (more-happy-path-examples ≠ coverage / prefill rejected under extended thinking → tool schema / embedded instruction in a promotion request → structural instruction-data separation, not a regex denylist). Drill = **few-shot adjudication**: pick exactly 4 examples from a pool of 8 for a `parse_promotion_request` extractor feeding a Copado **auto-approval Flow**, then fill a 4×3 guarantee table. Fourth pass on D3 Day 3: write cold → schema-vs-prefill → surgery → **adjudicate**. **Both Cycle-4 standing rules still unmet, third day running:** `DRILLS/` holds only `.gitkeep` (Day 1's `day_c4d1_agent_count.md` and Day 2's `day_c4d2_config_audit.md` were never created), and the 08-28 mini-mock score row is still absent — both re-carried into today's acceptance criteria. Working tree also has four uncommitted modified files.)* *(Prior: **Cycle 4, Day 2 (2026-08-31)** — On schedule. Day 2 = D2 Claude Code config; Cycle-4 Week 1 is unchanged (the D4-primary deep block starts Day 8). Session delivered in `CCA-F_Daily_2026-08-31.md`: two-hierarchies Learn block (memory vs settings, probabilistic vs deterministic, placement-determines-audience), 5 self-check questions, 3 fresh D2 MCQs (hook in a gitignored layer / CLAUDE.md-instruction vs hook / enterprise `deny` beats layered `allow`). Drill = **live audit of this repo's own `CLAUDE.md` + `.claude/settings*.json`** — six real defects, corrected `settings.json` fragment with a `deny` block, three one-liners. Fourth pass on D2 Day 2: predict → resolve → design → **diagnose**. **Both Cycle-4 standing rules still unmet:** `DRILLS/` holds only `.gitkeep` (Day 1's `day_c4d1_agent_count.md` uncommitted), and the 08-28 mini-mock score row is still absent from the Scoring log — both re-carried into today's acceptance criteria.)* *(Prior: **Cycle 4, Day 1 (2026-08-30)** — Cycle rollover. No session ran 08-29, so the **Day 28 retro was compressed into §0 of `CCA-F_Daily_2026-08-30.md`** rather than being lost, and the calendar advanced Cycle 3 Day 27 → Day 28 (08-29) → **Cycle 4 Day 1** (08-30). Retro findings: Cycle 3 delivered 13 sessions (Days 5–7, 12–20 skipped); `DRILLS/` finished the cycle holding only `.gitkeep` — **zero committed drill artifacts**, the cycle's biggest defect; Day 6 quiz never taken; neither the 08-23 D4+D5 stand-in check nor the 08-28 mini-mock has a logged score row, so the retro had no numbers to score. **Weakest domain: D4** (only logged miss in the entire scoring log — 2026-06-13 SSE vs Streamable HTTP; provisional, one June data point). **Cycle-4 deep-block swap: Week 2 changes from D2+D3 → D4 primary** (transports/auth, tool schema quality, MCP security, error contracts & idempotency, retaining one D3 structured-output day at Day 11); **Week 3 changes from D4+D5 → D5 primary + D2**; Weeks 1 and 4 unchanged. Two standing Cycle-4 rules: (1) every drill produces a committed file in `DRILLS/`; (2) every quiz gets a score row the same day. Day 1 drill = agent-count adjudication across three constraint variants.)* *(Prior: **Cycle 3, Day 27 (2026-08-28)** — On schedule. Day 27 mini-mock delivered in `CCA-F_Daily_2026-08-28.md` — 20 fresh MCQs at exam weights (D1×5, D2×4, D3×4, D4×4, D5×3), closed-book, timed 40 min, answer key in §2. **Day 28 retro → 2026-08-29**: score by domain, re-plan Cycle 4 (swap one deep-block week to the weakest domain). Outstanding for the retro: mini-mock score row not yet logged; Cycle-3 Day 6 quiz never taken; the 08-23 stand-in D4+D5 check has no logged score row; `DRILLS/` backlog (Days 22, 24, 25, 26) still uncommitted — the retro scores artifacts. D4 remains the standing weak domain.)* *(Prior: **Cycle 3, Day 26 (2026-08-27)** — Day 26 delivered the compressed all-domain review sheet + a G/A/R triage of all 64 flashcards in `CCA-F_Daily_2026-08-27.md`. Outstanding: Cycle-3 Day 6 quiz never taken; the Day 20 stand-in D4+D5 check from 08-23 has no logged score row; Days 8–11 + Day 22 + Day 24 + Day 25 + Day 26 drill artifacts uncommitted — `DRILLS/` still contains only `.gitkeep`, so the Day 26 drill asks Max to commit the backlog before the mini-mock. D4 remains the standing weak domain.)* *(Prior: two sessions ran 08-26 — Day 24 earlier, then Day 25 — the cycle advanced rather than duplicating Day 24, recovering the day lost to the 08-25 skip. Outputs are cleared between sessions, so Day 24's `CCA-F_Daily_2026-08-26.md` is gone; its research-agent spec is restored in Appendix A of `CCA-F_Daily_2026-08-26_Day25.md`.)* *(Prior: Day 23 skipped — no session ran 08-25; Day 24's drill normally builds on the Day 23 research agent, so that spec was supplied inline.)* *(Prior: Week 4 D1 consolidation block opened on schedule 08-24; Day 22 drill was the first `DRILLS/` artifact assigned this cycle.)* *(Days 12–20 skipped — no sessions ran 08-14…08-22; Week 3 D4+D5 Learn blocks were compressed into the Day 21 review sheet and the Day 20 quiz was replaced by a 10-question D4+D5 check in `CCA-F_Daily_2026-08-23.md`. Days 5–7 also skipped earlier — Day 6 quiz still not taken. `DRILLS/` is empty: no drill artifacts committed this cycle.)*. *(Cycle 2 wrapped 2026-08-02; Days 27–28 (mini-mock + retro) have no logged score row — if the mini-mock was taken, backfill the Scoring log. Cycle 1 note: retro + Cycle-2 plan in `CCA-F_Daily_2026-07-06.md` §0.)*
