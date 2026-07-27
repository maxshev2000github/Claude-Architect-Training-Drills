# DRILLS.md

Running log of CCA-F hands-on practice drills (newest first).

## 2026-07-27 · Cycle 2 · Day 22 · D1 Agentic Architecture — orchestration pattern matching

**Drill:** Create `DRILLS/day_c2d22_pattern_match.md`. Match five business scenarios to the single best orchestration pattern from the five-pattern taxonomy (prompt chaining, routing, parallelization/fan-out, orchestrator-worker, evaluator-optimizer), with a one-line justification and the pattern you rejected for each. Exercises Cycle-2 Day-22 D1: choosing the *simplest sufficient* pattern, and the two exam traps (chaining vs orchestrator-worker = known vs runtime-discovered steps; fan-out vs orchestrator-worker = predefined vs dynamic subtasks). Salesforce-flavored scenarios encouraged.

**Acceptance criteria:**
- [ ] `DRILLS/day_c2d22_pattern_match.md` exists.
- [ ] Five distinct scenarios, each mapped to **exactly one** of the five patterns; at least four patterns used across the set.
- [ ] Each scenario has a **one-line justification** grounded in the deciding property (steps known vs discovered, subtasks independent vs dependent, quality-criterion-driven iteration).
- [ ] Each scenario names **one pattern rejected** and why (must reference the trap where relevant).
- [ ] At least one scenario correctly picks **orchestrator-worker** for *runtime-discovered* scope, and one picks **prompt chaining** for a *fixed* sequence — and the write-up states the difference explicitly.
- [ ] At least one scenario uses **evaluator-optimizer** and notes it needs a **termination cap**.
- [ ] Closing line: the default bias is the **simplest pattern that meets the requirement**; added agents/loops are cost, not merit.
- [ ] Stretch: one scenario that is a **trap** — looks like orchestrator-worker but is really fan-out (predefined subtasks) — with a note on why.

## 2026-07-16 · Cycle 2 · Day 11 · D3 Prompt Engineering — SPIFF payout extractor (tool schema vs prefill vs prose)

**Drill:** Create `DRILLS/day_c2d11_spiff_extract.md`. A rep-comp email announces a SPIFF (sales incentive); Claude must extract a structured payout record that feeds a commission adjustment in Salesforce. Build the **tool-schema** version of the extractor, contrast it against prefill and prose, and prove why the schema wins. Target object: `{ spiff_name, product_family, payout_type, payout_value, effective_date, end_date }`. Exercises Cycle-2 Day-11 D3 (structured-output deep dive): the tool-schema > prefill > prose reliability ranking, enums to constrain, nullable + "don't guess" for legitimately-absent fields, quote-then-extract to cut hallucination, and the retry-loop-can't-recover-missing-data trap.

**Acceptance criteria:**
- [ ] `DRILLS/day_c2d11_spiff_extract.md` exists.
- [ ] Defines a valid tool **`input_schema`** (JSON Schema: `type`/`properties`/`required`) with all six fields; each field has a one-line `description`.
- [ ] `payout_type` is an **enum** (`flat_amount | percentage | multiplier`) and `product_family` is an **enum** of ≥3 values — states why the enum protects downstream commission math.
- [ ] `end_date` is **nullable** (open-ended SPIFF) with an explicit "output `null`, do not guess" rule; ≥3 fields marked `required`.
- [ ] Includes the **prefill** equivalent (`{` + the stop sequence that closes it) + one line on what prefill buys (anchors JSON, drops preamble) and what it does **not** (no validation).
- [ ] One-line **reliability ranking**: tool schema > prefill > prose, with the reason (schema is *enforced*; prefill/prose are *encouraged*).
- [ ] Applies **quote-then-extract**: one line on how quoting the source span before filling `payout_value` cuts hallucination.
- [ ] One line: why a **validation-retry loop** can't recover a genuinely absent `effective_date` (handle via nullable + escalation, not retries).
- [ ] **Placement line**: reusable extraction rules → **system prompt**; per-email body → **XML tags in the user turn** (untrusted data).
- [ ] Stretch: per-field `confidence` enum (`high|medium|low`) routing `low` → human review before the commission write (D3 → D5 escalation bridge).

## 2026-07-08 · Cycle 2 · Day 3 · D3 Prompt Engineering — invoice→JSON extractor (tags + prefill + tool schema)

**Drill:** Create `DRILLS/day_c2d3_invoice_extract.md`. Build a complete extraction prompt that pulls `{vendor, invoice_date, amount, currency}` from a raw invoice/AP email, using XML tags to separate instructions from untrusted data, a prefill, and a nullable-field rule — then write the equivalent as a forced tool `input_schema` and justify why the tool-schema version is more reliable. Salesforce flavor: output feeds an expense→Opportunity sync, so a wrong `currency` corrupts commission math. Exercises Cycle-2 Day-3 D3: XML-tag boundaries (incl. injection defense), prefill/stop-sequence format control, the tool-schema > prefill > prose reliability ranking, and nullable fields + validation-retry limits.

**Acceptance criteria:**
- [ ] `DRILLS/day_c2d3_invoice_extract.md` exists.
- [ ] Prompt uses **XML tags** separating at least `<instructions>` from `<email>` (untrusted data); notes the injection risk of imperative text in the email body.
- [ ] Names a **prefill** (`{`) + what it buys (anchors JSON, drops preamble) and the **stop sequence** that closes it.
- [ ] Target object has all four fields; `currency` is an **enum** (`USD|EUR|GBP|UAH`); every field has a one-line description.
- [ ] ≥1 field is **nullable** with an explicit "output `null`, do not guess" instruction.
- [ ] Includes a matching **tool `input_schema`** (valid JSON Schema: `type`/`properties`/`required`) + one-line ranking **tool schema > prefill > prose**.
- [ ] One line: why a **validation-retry loop** can't recover a genuinely missing `invoice_date` (handle at schema level via nullable).
- [ ] Placement line: reusable rules → **system prompt**; per-invoice data → **tags in the user turn**.
- [ ] Stretch: per-field `confidence` enum (`high|medium|low`) routing `low` → human review (D3 → D5 escalation bridge).

## 2026-07-07 · Cycle 2 · Day 2 · D2 Claude Code Config — CLAUDE.md precedence resolution table

**Drill:** Create `DRILLS/day_c2d2_precedence.md`. Build a **conflict-resolution table** proving you can predict which memory/config layer wins, set in a Salesforce/Copado repo. Don't restate the hierarchy — resolve 5 concrete conflicts and justify each. Exercises Cycle-2 Day-2 D2: enterprise > project > user precedence on conflict, additive loading of all applicable files, on-demand subdirectory `CLAUDE.md` scoping, and the `CLAUDE.md` (probabilistic) vs `settings.json`/`settings.local.json`/hooks (deterministic) distinction.

**Acceptance criteria:**
- [ ] `DRILLS/day_c2d2_precedence.md` exists with the 5-row table filled in.
- [ ] Row 1 → **enterprise/managed** wins (non-overridable).
- [ ] Row 2 → **project** wins over user *in this repo*; note the user rule still applies in the teammate's other repos.
- [ ] Row 3 → **both apply** (additive); subdirectory file loads **on-demand**, scoped to that folder — an extension, not a "winner."
- [ ] Row 4 → **`.claude/settings.local.json`**, **not committed**; note it's *settings*, not `CLAUDE.md`.
- [ ] Row 5 → keep root lean + **`@path` imports / on-demand files**; state *why* (loaded every session, consumes context, buries rules).
- [ ] Closing line distinguishes **`CLAUDE.md` (probabilistic)** from **hooks/settings (deterministic)**.

## 2026-07-06 · Cycle 2 · Day 1 · D1 Agentic Architecture — large-review multi-agent architecture sketch

**Drill:** Create `DRILLS/day_c2d1_review_arch.md`. Sketch (in text) the multi-agent architecture for **"review every changed component in a large, variable-size Salesforce automation/PR set before a Copado promotion"** — where the set of changed items is only known at runtime and per-item reviews are independent. Specify the pattern, worker scope, and merge step, and prove you didn't over-engineer. Exercises Cycle-2 Day-1 D1: single-vs-multi-agent (add agents only for parallelism or context isolation), orchestrator-worker vs parallelization (runtime-discovered vs known-up-front decomposition), and hub-and-spoke (no worker-to-worker comms; deterministic hub merge).

**Acceptance criteria:**
- [ ] `DRILLS/day_c2d1_review_arch.md` exists.
- [ ] Names the pattern (**orchestrator-worker**) and states the **deciding signal** — decomposition **discovered at runtime**, not known up front (vs parallelization/sectioning).
- [ ] Defines **worker scope**: objective + parseable output schema + **read-only** tool boundary + a numeric **max-iteration / budget cap**.
- [ ] Defines the **merge step** as **deterministic at the hub** (per-worker output files → mechanical merge + conflict check); workers return a **digest, not a transcript**.
- [ ] States the condition under which this is **over-engineering** and a **single agent** is correct instead (small/sequential, fits one context, no isolation need).
- [ ] Names one **hub-and-spoke** property used (no worker-to-worker comms; hub detects/handles a failed worker so one failure doesn't kill the batch) and why.
- [ ] One line on the **human gate** at the prod-deploy boundary (bridges D1 → D5).
- [ ] Stretch: name the failure mode a **bad worker digest** most enables (**context poisoning** of the hub merge) + one defense (hub **verification step** before merging).

## 2026-07-04 · Day 27 · MINI-MOCK — 20 mixed MCQs, timed 40 min (per exam weights)

**Drill (mini-mock day):** Take the 20-question mini-mock in `CCA-F_Daily_2026-07-04.md` (Cowork outputs), **closed-book, timed 40 min** (~2 min/question, exam pace). Distribution mirrors exam weights: **D1×5, D2×4, D3×4, D4×4, D5×3**. Mark every answer before viewing the key. Then log score + weakest domain in the `TRAINING_PROGRAM.md` Scoring Log — this is the last data point before the Day-28 retro that re-plans Cycle 2.

**Acceptance criteria:**
- [ ] All 20 answered **before** viewing the answer key.
- [ ] Completed in ≤40 min (exam-pace check).
- [ ] Score recorded (pass bar ≈72% → **≥15/20**).
- [ ] Per-domain miss tally kept (D1–D5) so the weakest domain is identifiable, not just the total.
- [ ] Score row added to the `TRAINING_PROGRAM.md` Scoring Log (date, "Wk4 Day 27 mini-mock (20 mixed)", score, weakest domain, note).
- [ ] Weakest domain named from {D1, D2, D3, D4, D5} and carried into the Day-28 retro to pick which deep-block week Cycle 2 swaps.
- [ ] Sanity-check the two highest-value traps were answered right: SSE is legacy/Streamable-HTTP replaced it (Q14), and silent failure is the worst mode (Q3, Q20).
- [ ] Stretch: for every miss, write a one-line flashcard in `CONTEXT/` tagged with its trap-family before Cycle 2 begins.

## 2026-07-03 · Day 26 · Full-domain rapid review — shaky-item triage (all 5 domains)

**Drill:** Create `DRILLS/day26_rapid_review.md`. Using the cycle key-fact sheet in `CCA-F_Daily_2026-07-03.md` (condensed from `CONTEXT/flashcards.md`), cover each of the ~23 key-fact prompts, recall from memory, and mark ✓ (solid) or ✗ (shaky) **before** peeking. For every ✗, write one line: the correct fact **and** its trap-family {over-engineering, deterministic-vs-probabilistic enforcement, reliability-ranking, transport/auth, silent-failure/false-green, escalation-anti-triggers}. This produces the targeted study list for Cycle 2, ahead of tomorrow's Day-27 mini-mock.

**Acceptance criteria:**
- [ ] `DRILLS/day26_rapid_review.md` exists, covering all 5 domains.
- [ ] Each of the ~23 key-fact prompts marked ✓ or ✗ from memory before verifying against `flashcards.md`.
- [ ] Every ✗ has the correct fact + a named trap-family from the set above.
- [ ] A "Cycle 2 focus" line names the 1–2 weakest domains, cross-checked against the `TRAINING_PROGRAM.md` Scoring log.
- [ ] Score row added to the Scoring log table (Day 26, review).
- [ ] Stretch: for any prompt marked ✓ but only barely, note it as a "brittle" item to re-drill — these are the mini-mock risks.

## 2026-07-02 · Day 25 · D1 Agentic Architecture — hardest D1 scenarios (rejected-option justifications)

**Drill:** Create `DRILLS/day25_hard_d1.md`. Work the **5 hardest D1 questions** in `CONTEXT/example_questions.json` (indices **88, 126, 159, 190, 137**). For each: commit an answer *before* checking the key, write a **one-line rejection rationale for every distractor** (why wrong, not just that it's wrong), and tag the **trap-family** it tests {over-engineering, parallelization-vs-orchestrator, evaluator-optimizer, context-isolation, coordination/shared-state}. Exercises Day-25 D1: reading scenario questions like an architect and defeating the built-in distractors.

**Acceptance criteria:**
- [ ] `DRILLS/day25_hard_d1.md` exists, covering all 5 questions.
- [ ] Each question has a **committed answer recorded before** the key, then graded ✓/✗ vs the JSON key.
- [ ] Each question lists a **one-line rejection rationale for all 3 distractors** (why wrong, not just "wrong").
- [ ] Each question tagged with its **trap-family** from the set above.
- [ ] One line stating the **parallelization vs orchestrator-worker** deciding signal (split known up front vs decided at runtime) — the #1 D1 trap.
- [ ] For **#137**, the Salesforce-native fix (per-worker output field/record + deterministic hub merge, or row-level locking) — not "just retry."
- [ ] For **#190**, one line naming the correct approach (pass scoped context in the task spec; worker returns a digest, not inherited history).
- [ ] Stretch: for any question answered correctly but distractor-tempting, note **which distractor you almost picked and why it's seductive** — the real weak spot for next cycle.

## 2026-07-01 · Day 24 · D1 Agentic Architecture — research-agent failure modes + defenses

**Drill:** Create `DRILLS/day24_failure_modes.md`. For **yesterday's Day-23 research subagent** (the read-only worker researching how a third-party billing system's API maps to Salesforce `Order`/`OrderItem`), list **3 distinct failure modes**, each with (a) a concrete scenario in *this* research-agent context, (b) exactly **one** defense, and (c) which mechanism the defense is (verification step / checkpoint / circuit breaker / honest surfacing / blast-radius isolation). Then answer the three Day-24 Check questions. Exercises Day-24 D1: infinite loops, context poisoning, cascade failure, and silent failure (the worst) plus their defenses.

**Acceptance criteria:**
- [ ] `DRILLS/day24_failure_modes.md` exists with exactly 3 failure modes, each having scenario + 1 defense + named mechanism.
- [ ] The 3 modes are **distinct classes** (not 3 variants of one) — drawn from {infinite loop, context poisoning, cascade failure, silent failure}.
- [ ] **≥1 mode is silent failure**, and the entry states *why it's the worst* (false green is trusted downstream; erodes confidence in all results; delayed detection).
- [ ] Each scenario is grounded in the **research-agent** context (billing-API → SFDC mapping), not generic — e.g. mis-read `Amount` units poisoning `findings.md`, worker looping on an unreachable doc section, worker crash aborting a multi-endpoint sweep.
- [ ] Each defense names its **mechanism** and matches the mode (verification→poisoning, isolation+checkpoint→cascade, honest surfacing→silent, three-stop termination→loop).
- [ ] The three **Check** questions answered: silent-failure worst-why, checkpoint (crash + resume), circuit-breaker vs plain retry cap.
- [ ] Ties back to the Day-23 handoff: since the worker is **read-only** and returns a *digest*, note which mode a bad digest most enables (context poisoning of the orchestrator's merge).
- [ ] Stretch: one line adding a **verification/checkpoint step** to the Day-23 subagent contract so the orchestrator can detect a poisoned or partial digest before merging.

## 2026-06-30 · Day 23 · D1 Agentic Architecture — subagent task spec (handoff contract)

**Drill:** Create `DRILLS/day23_subagent_spec.md`. Write the **task spec an orchestrator would hand a research subagent** — the explicit handoff contract that lets a worker run in an isolated context and return a mergeable result. Frame it as Salesforce research: *"Research how a third-party billing system's API maps to our Salesforce `Order`/`OrderItem` objects for a planned integration."* Write it **as the orchestrator → worker contract**, not as prose about contracts. Exercises Day-23 D1: scoped worker contexts, the four-part handoff (objective/output/tools/limits), files-not-chat for shared state, and the vague-objective duplication/omission trap.

**Acceptance criteria:**
- [ ] `DRILLS/day23_subagent_spec.md` exists, structured as a spec the orchestrator passes down (not an essay).
- [ ] **Objective** — one unambiguous goal sentence; no compound "and also" tasks.
- [ ] **Output format** — explicit parseable schema (JSON keys *or* fixed markdown) the orchestrator merges mechanically; states it returns a **distilled digest, not a transcript**.
- [ ] **Tool boundaries** — names allowed tools, marks the worker **read-only** (no Salesforce writes), states what's out of scope.
- [ ] **Limits** — a numeric **max-iteration / tool-call cap** + a **budget** (tokens/time) + a stated **failure behavior** (return partial + flag, don't loop).
- [ ] **Scope boundary** — one line on what this worker owns vs. a sibling worker, to prevent duplication/omission.
- [ ] **Escalation gate** — one line: when to hand back to human/orchestrator instead of guessing (ambiguous mapping, missing access).
- [ ] Footnote: **why files (not chat) for shared state** — parallel workers can't see each other; survives compaction.
- [ ] Stretch: show the **merge step** — one line on how the orchestrator combines this digest with a sibling's output.

## 2026-06-29 · Day 22 · D1 Agentic Architecture — orchestration pattern matching

**Drill:** Create `DRILLS/day22_pattern_matching.md`. Match 5 business scenarios (routing inbound support email; runtime-discovered Apex-class refactor; draft→critique→revise blog post; fixed lead-notes→enrich→score→email pipeline; same risk prompt run 5× for consensus) to exactly one of the five orchestration patterns — prompt chaining, routing, parallelization (sectioning/voting), orchestrator-worker, evaluator-optimizer — with a one-line justification naming the *deciding signal* for each. Exercises Day-22 D1: picking the simplest pattern that works and the parallelization-vs-orchestrator-worker distinction.

**Acceptance criteria:**
- [ ] `DRILLS/day22_pattern_matching.md` exists; all 5 scenarios mapped to exactly one pattern each.
- [ ] Each mapping names the **deciding signal** (fixed-order → chain; classify-then-one-path → routing; known independent split → parallelization-sectioning; runtime-unknown decomposition → orchestrator-worker; generate-critique-iterate → evaluator-optimizer; same-task-N-times-consensus → parallelization-voting).
- [ ] Correct keys: 1=Routing, 2=Orchestrator-worker, 3=Evaluator-optimizer, 4=Prompt chaining, 5=Parallelization (voting).
- [ ] One line distinguishing **parallelization vs orchestrator-worker** (split known up front vs decided at runtime) — the most common D1 trap.
- [ ] One line stating the **default bias** (simplest pattern; single call < chain < multi-agent) and when adding agents is justified (true parallelism or context isolation).
- [ ] Stretch: for scenario 4, name one **gate** between steps (e.g. escalate to human if lead score is borderline) — bridges D1 → D5.

## 2026-06-28 · Day 21 · REVIEW — Week 3 (D4 MCP + D5 Context/Reliability) closed-book recall

**Drill (review day):** Work the Week-3 review sheet in `CCA-F_Daily_2026-06-28.md` (Cowork outputs). Read §1 (key facts, Days 15–20), then close it and answer the 12 closed-book recall prompts in §2 from memory — one line each — covering stdio-vs-Streamable-HTTP + auth, tool-design quality, MCP security (injection / confused deputy / untrusted output), context engineering (compaction / notes / subagent digests / JIT), and reliability (loop, three termination conditions, retry-vs-escalate, blast radius, silent failure). Then log the still-unlogged Day 20 quiz score.

**Acceptance criteria:**
- [ ] All 12 recall prompts answered **before** re-reading §1.
- [ ] Each answer graded ✓/✗; every miss starred.
- [ ] ≥10/12 on first pass (else name the weakest sub-area for next cycle's Week-3 pass).
- [ ] Day 20 D4+D5 quiz score added as a row in `TRAINING_PROGRAM.md` Scoring Log (date, "Wk3 Day 20 quiz (10, D4+D5)", score, weakest sub-area, note).
- [ ] Weakest sub-area named from {D4-transport, D4-tool-design, D4-security, D5-context, D5-reliability}.
- [ ] Each Day-20 miss carried into a flashcard in `CONTEXT/` (one per miss).
- [ ] Sanity check the two highest-value traps answered correctly: SSE is legacy (Streamable HTTP replaced it) and silent failure is the worst mode.

## 2026-06-27 · Day 20 · QUIZ — D4+D5 (MCP, Tool Design, Context, Reliability)

**Drill (quiz day):** Take the 10-MCQ Week-3 deep-block quiz in `CCA-F_Daily_2026-06-27.md` (Cowork outputs). Domains 4 + 5 only — 5 MCP/tool-design questions, 5 context/reliability questions, Salesforce-flavored. Answer from memory, then check the key.

**Acceptance criteria:**
- [ ] All 10 answered before looking at the key.
- [ ] Score recorded in `TRAINING_PROGRAM.md` → Scoring log (date, "Wk3 Day 20 quiz (10, D4+D5)", score, weakest domain, note).
- [ ] Weakest sub-area identified among {D4-transport, D4-tool design, D5-context, D5-reliability}.
- [ ] Any miss carried into Day 21 review as a flashcard in `CONTEXT/`.

## 2026-06-26 · Day 19 · D5 Reliability — termination + escalation policy (auto-fix tests)

**Drill:** Create `DRILLS/day19_termination_escalation.md`. Write the **termination + escalation policy (≈5–8 lines)** for an agent that **auto-fixes a failing test suite**, framed as a Copado/Salesforce CI agent fixing failing Apex tests before promotion. Exercises Day-19 reliability: the agentic loop (gather → act → verify → repeat), the three independent termination conditions, retry-vs-escalate by failure type, and minimal blast radius / honest failure surfacing.

**Acceptance criteria:**
- [ ] `DRILLS/day19_termination_escalation.md` exists.
- [ ] Names **all three** termination conditions with concrete values: explicit success criterion (observable signal), a numeric **max-iteration** cap, and a **budget cap** (tokens / time / $).
- [ ] States the success predicate as a **checkable signal** (e.g. "all Apex tests pass + ≥75% coverage + deploy validation clean"), not a subjective judgment.
- [ ] **Retry rule** for transient failures naming backoff (exponential + jitter, ≤N attempts) with ≥1 concrete transient example (rate limit / flaky test / API timeout).
- [ ] **Escalate-to-human rule** with ≥2 triggers — at least one **destructive/irreversible** (prod deploy, bulk delete) and one **low-confidence/ambiguous**.
- [ ] One line on **minimal blast radius** (fix on branch/sandbox, fail one attempt without aborting the batch, human gate at prod boundary).
- [ ] One line on **honest failure surfacing** (report "could not fix, N attempts exhausted" — never false success).
- [ ] Stretch: a **circuit breaker** — if the same test fails M times after distinct fix attempts, stop retrying it specifically and escalate that test, to avoid burning the budget.

## 2026-06-25 · Day 18 · D5 Context — week-long migration agent memory layout

**Drill:** Create `DRILLS/day18_memory_layout.md`. Design the on-disk **memory layout** for an agent running a **week-long Salesforce org-to-org metadata migration** (objects, flows, Apex, profiles) that is compacted repeatedly and may crash/resume. Specify 4–6 files; for each give name + one-line purpose + contents + when written vs read. Add a section on what stays in the live context window (and may be lost on compaction). Exercises Day-18 context engineering: compaction + re-pinning rules, externalized state, subagent isolation (digests not transcripts), and pre-load vs JIT.

**Acceptance criteria:**
- [ ] `DRILLS/day18_memory_layout.md` exists with 4–6 files, each having name + purpose + contents + write/read timing.
- [ ] Exactly one file is the **durable progress/state** ledger (e.g. `progress.json`) that survives compaction and enables resume — states what a resuming agent reads first.
- [ ] ≥1 file captures **standing rules/constraints** that must be **re-pinned after compaction** (e.g. "no prod deploy without human approval").
- [ ] ≥1 file holds **subagent outputs** as distilled per-object digests — orchestrator stores summaries, not raw worker transcripts.
- [ ] "Live context window" section names ≥2 things safely lost on compaction (tool-call chatter, intermediate reasoning).
- [ ] One sentence distinguishing **pre-load vs JIT** for ≥1 file (what is fetched on demand vs kept resident).
- [ ] Stretch: a "compaction checklist" — 3 bullets the agent runs each compaction (summarize done → re-pin rules → flush state to disk).

## 2026-06-24 · Day 17 · D4 MCP — Salesforce write-server risk register

**Drill:** Create `DRILLS/day17_sfdc_security.md`. For an MCP server with **write** access to Salesforce (create/update/delete records, send email), produce a risk register of the **top 3 risks**, each with (a) a concrete Salesforce-context attack scenario, (b) one mitigation, (c) the MCP layer the mitigation lives at (tool schema / auth / host policy / server config). Exercises the Day-17 MCP security threat model: prompt injection via tool output, confused deputy / over-privilege, token theft, malicious servers — plus the cross-cutting human-approval rule for destructive writes.

**Acceptance criteria:**
- [ ] `DRILLS/day17_sfdc_security.md` exists with exactly 3 risks, each having scenario + mitigation + layer.
- [ ] Risks span distinct threat classes (not 3 variants of one) — e.g. one injection, one confused-deputy/over-privilege, one destructive-write/token issue.
- [ ] ≥1 risk names a **Salesforce-specific** mechanism (integration user with *Modify All Data*, sharing rules, poisoned `Case.Description`, Apex side effects).
- [ ] Confused-deputy mitigation ties to **per-user OAuth identity** so SFDC sharing & profile permissions are enforced (not one shared admin token).
- [ ] ≥1 mitigation routes **destructive writes** (bulk delete/update, mass email) through **human approval**.
- [ ] Footnote: why tool output is untrusted even from your *own* org.
- [ ] Stretch: residual-likelihood rating (L/M/H) per risk + the single control to ship first.

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
