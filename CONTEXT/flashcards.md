# CCA-F Exam Flashcards

Use: cover the **Q** (question), recall your answer, then check the **A** (answer).

---

## Domain 1 — Agentic Architecture & Orchestration (27%)

### Card 1.1
**Q:** What are the three `stop_reason` values in the agentic loop, and what does each mean?
**A:** `"tool_use"` = Claude wants to call a tool (continue looping) | `"end_turn"` = Claude is done (exit loop) | `"max_tokens"` = output truncated (handle accordingly). Anti-pattern: parsing natural language like "I am done."

### Card 1.2
**Q:** Name the 5 multi-agent orchestration patterns.
**A:** 1) Supervisor (coordinator-worker) — hierarchical delegation. 2) Fan-out (scatter-gather) — parallel independent tasks. 3) Pipeline (prompt chaining) — sequential steps. 4) Debate (multi-perspective) — agents critique each other. 5) Swarm — self-organizing peers, no central coordinator.

### Card 1.3
**Q:** Orchestrator-worker vs Evaluator-optimizer — when to use each?
**A:** **Orchestrator-worker**: tasks are decomposable into subtasks. Coordinator splits, delegates, merges. **Evaluator-optimizer**: quality is measurable and first drafts are unreliable. Generator produces, evaluator scores, loop until pass or max iterations.

### Card 1.4
**Q:** What is the routing pattern?
**A:** Classifies input then dispatches to a specialized handler. Best when categories are distinct with different processing needs.

### Card 1.5
**Q:** Do subagents inherit the coordinator's context automatically?
**A:** No. The coordinator must explicitly pass relevant findings, structure handoffs with task description + prior outputs, and separate content from metadata. Anti-pattern: passing raw user query to every subagent.

### Card 1.6
**Q:** When is parallelization dangerous? How to fix?
**A:** Dangerous when agents share mutable state — race conditions cause silent data loss. Fix: append-only patterns, coordinator-mediated writes, or optimistic locking. Don't abandon parallelism — coordinate writes.

### Card 1.7
**Q:** What are the three tiers of cost caps?
**A:** 1) Per-task ceilings (runaway loop protection). 2) Per-user daily/monthly limits (abuse prevention). 3) Per-tenant monthly budgets (multi-tenant safety). Must be hard caps checked before every API call, not billing alerts.

### Card 1.8
**Q:** What is a circuit breaker in agentic systems?
**A:** Hard iteration cap (e.g., 25 iterations) + repetition detection (hash tool call signatures, trip when identical calls repeat 3x). Surface failures explicitly — never silently retry.

### Card 1.9
**Q:** What model cascade strategy is recommended?
**A:** Haiku for triage/classification (fast, cheap) → Sonnet for mid-complexity/policy lookup → Opus for complex reasoning/edge cases. Attempt cheaper model first, escalate on low confidence or validation failure.

### Card 1.10
**Q:** When should an agent escalate to a human?
**A:** Explicit customer request | policy gaps agent can't resolve | genuine inability to progress | destructive/irreversible bulk operations | legal threats or safety concerns. Anti-patterns: sentiment-based escalation, self-reported confidence scores.

### Card 1.11
**Q:** When should you NOT chunk a document?
**A:** If it fits within the context window (e.g., 125K tokens in 200K window), process it in a single call. Unnecessary chunking loses cross-section relationships, adds merge complexity, latency, and cost.

### Card 1.12
**Q:** Why should SDK sessions be treated as ephemeral?
**A:** Persist all messages, tool calls, and results to durable storage (Postgres, Redis, object storage). Conversation log = source of truth. Enables checkpoint-and-resume for crash recovery without replaying side effects.

---

## Domain 2 — Claude Code Configuration & Workflows (20%)

### Card 2.1
**Q:** What is the CLAUDE.md hierarchy and precedence?
**A:** User-level (`~/.claude/CLAUDE.md`) → Project-level (`<repo>/CLAUDE.md`) → Subdirectory-level (`<repo>/src/.../CLAUDE.md`). Project-level > user-level. Subdirectory extends/overrides parent. Keep it lean — bloated CLAUDE.md wastes context every session.

### Card 2.2
**Q:** What are the three settings file scopes?
**A:** `.claude/settings.json` = project-wide, shared, version-controlled | `.claude/settings.local.json` = personal, machine-specific, gitignored | `~/.claude/settings.json` = user-level, all projects, personal.

### Card 2.3
**Q:** How do `.claude/rules/` files work?
**A:** Rule files with YAML frontmatter containing `globs` patterns. Rules only activate when Claude works with files matching the glob. Example: `globs: ["**/*.test.tsx"]` → "Always use React Testing Library."

### Card 2.4
**Q:** Where are custom slash commands defined?
**A:** `.claude/commands/` = project-level (version-controlled, shared) | `~/.claude/commands/` = user-level (personal). Frontmatter options: `context: fork` (isolated subagent), `allowed-tools` (restrict tools).

### Card 2.5
**Q:** What are hooks? How do they differ from CLAUDE.md instructions?
**A:** Hooks are system-triggered shell commands at lifecycle events. They are **deterministic** (always fire). CLAUDE.md instructions are **probabilistic** (Claude may not follow). Use hooks for linting, blocking dangerous commands, redacting secrets.

### Card 2.6
**Q:** Name the hook lifecycle events.
**A:** Per-session: `SessionStart`, `SessionEnd`. Per-turn: `UserPromptSubmit`, `Stop`, `StopFailure`. Per tool call: `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PostToolBatch`.

### Card 2.7
**Q:** What do hook exit codes mean?
**A:** `0` = success (stdout parsed for JSON). `2` = blocking error (stderr fed to Claude, action blocked). Other = non-blocking error (execution continues).

### Card 2.8
**Q:** What are the 4 PreToolUse permission decisions?
**A:** `"allow"` = approve | `"deny"` = block | `"ask"` = escalate to user dialog | `"defer"` = normal permission flow. Also supports `updatedInput` to rewrite tool arguments.

### Card 2.9
**Q:** How does the Stop hook work as a quality gate?
**A:** Exit code 2 from a Stop hook prevents Claude from completing its turn. Stderr is fed back as an error. Claude continues working. Use case: "tests must pass before done."

### Card 2.10
**Q:** What flags are essential for CI/CD headless mode?
**A:** `-p "prompt"` = non-interactive mode | `--output-format json` = structured output for pipelines. Each `-p` invocation runs in an isolated session.

### Card 2.11
**Q:** Hooks vs Skills — when to use each?
**A:** **Hooks**: system-triggered at lifecycle events regardless of task (linting, blocking, redacting). **Skills**: agent-driven, Claude invokes based on task relevance (fetching status, running research).

---

## Domain 3 — Prompt Engineering & Structured Output (20%)

### Card 3.1
**Q:** Rank the 3 structured output techniques by reliability.
**A:** 1) Tool use with JSON schema (most reliable — enforced at API level). 2) Prefilling assistant turn with `{` (anchors JSON mode). 3) Prose instructions like "return JSON" (least reliable, probabilistic).

### Card 3.2
**Q:** What does prefilling do and how?
**A:** Sets the beginning of the assistant message. Start with `{` → forces JSON, eliminates preamble. Start with `<analysis>` → forces XML structure. Prefilling controls where output begins; stop sequences control where it ends.

### Card 3.3
**Q:** How do stop sequences work?
**A:** `stop_sequences: ["</product>"]` halts generation when that string is produced. Deterministic termination. Pair with prefilling for full format control (e.g., prefill `<product>`, stop at `</product>`).

### Card 3.4
**Q:** Why use XML tags in prompts?
**A:** Delimit sections: `<instructions>`, `<document>`, `<examples>`, `<query>`. Prevents Claude from confusing document content with instructions. Claude is trained to respect XML tag boundaries. More precise than headers or backticks.

### Card 3.5
**Q:** Best practices for few-shot examples?
**A:** 2-4 targeted examples. Most effective for format consistency and ambiguous edge cases. Use XML tags to wrap each example. Cover diverse scenarios including edge cases, not just happy paths.

### Card 3.6
**Q:** How to handle missing fields in data extraction?
**A:** Make optional fields `nullable` in the JSON schema. Instruct Claude to output `null` for absent data. Prevents hallucination of missing values. Add validation-retry loop for schema violations.

### Card 3.7
**Q:** What can validation-retry loops fix vs. what they can't?
**A:** **Can fix**: format/syntax mismatches, schema violations. **Cannot fix**: missing information. If source data lacks a field, retries won't produce it — handle at schema level by making fields optional.

### Card 3.8
**Q:** When should you use extended thinking?
**A:** Complex multi-step reasoning, architectural analysis, deep edge-case identification, classification requiring internal reasoning. Key: `budget_tokens` must be < `max_tokens`. Only supports `tool_choice: "auto"` and `"none"`.

### Card 3.9
**Q:** What constraints exist with extended thinking?
**A:** Only `tool_choice: "auto"` or `"none"` (forced tool → 400 error). Thinking blocks must be preserved unchanged in multi-turn. The `signature` field is encrypted reasoning — stripping it causes `invalid_request_error`.

### Card 3.10
**Q:** What is the Message Batches API?
**A:** Up to 50% cost savings for async processing. Results within 24 hours. For large volumes of independent, latency-tolerant requests. NOT for real-time or blocking operations.

### Card 3.11
**Q:** How does multi-turn conversation drift happen and how to fix it?
**A:** System prompt influence diminishes as conversation grows. Fix: re-inject key constraints at strategic points, use prompt caching for system instructions, extract critical facts into persistent blocks outside summarized content.

### Card 3.12
**Q:** Why is same-session self-review an anti-pattern?
**A:** Biased by prior reasoning context. Use an independent session (separate API call) without the original generation context for unbiased review.

---

## Domain 4 — Tool Design & MCP Integration (18%)

### Card 4.1
**Q:** What is the MCP architecture hierarchy?
**A:** Host → Client → Server. Hosts (Claude Code, IDEs) contain MCP clients. Each client maintains a 1:1 connection to a server. Servers expose tools, resources, and prompts. Communication uses JSON-RPC.

### Card 4.2
**Q:** What are the 3 MCP primitives and their differences?
**A:** **Tools** = model-invoked actions (may have side effects). **Resources** = app-controlled, read-only content catalogs (no side effects). **Prompts** = user-invoked reusable templates (no side effects). Static data → resource. API call each time → tool. Instruction template → prompt.

### Card 4.3
**Q:** Compare stdio vs Streamable HTTP vs SSE transports.
**A:** **stdio**: local, 1:1 client-per-process, secrets via env vars. **Streamable HTTP** (recommended): remote, multi-client, single `/mcp` endpoint, OAuth 2.1, session IDs, stateless load-balancing. **SSE**: deprecated for new servers, two endpoints, harder to load-balance.

### Card 4.4
**Q:** How does Mcp-Session-Id enable stateless load balancing?
**A:** Server generates session ID on init, returns in response header. Client includes it in all requests. Any backend instance looks up session in shared storage (e.g., Redis). Sticky sessions NOT required.

### Card 4.5
**Q:** What is the MCP initialization handshake?
**A:** 1) Client sends `initialize` (declares capabilities: roots, sampling). 2) Server responds with its capabilities (tools, resources, prompts). 3) Client sends `initialized` notification. Only then can operations begin. Skipping → server rejects requests.

### Card 4.6
**Q:** What is MCP sampling?
**A:** Lets servers request LLM completions from the host. Enables server-side workflows needing model reasoning (classify-then-route). Host controls approval (human-in-the-loop). Server doesn't need its own LLM access.

### Card 4.7
**Q:** What are MCP roots?
**A:** Client declares which directories/URIs the server may operate within. Enforces operational boundaries at protocol level (least privilege). Server knows its allowed scope before any operations begin.

### Card 4.8
**Q:** What makes a good tool description?
**A:** Must include: 1) What the tool does. 2) Expected inputs (types, constraints, examples). 3) Output format. 4) When NOT to use it (negative guidance). Written for the model, not the developer.

### Card 4.9
**Q:** What is the optimal tool count per agent?
**A:** 4-5 tools is optimal. 18+ tools significantly degrades selection reliability. Split across specialized agents if needed.

### Card 4.10
**Q:** What should structured error responses include?
**A:** `errorCategory` (transient, validation, permission), `isRetryable` (boolean), human-readable message. Anti-patterns: empty results as success, suppressing errors, plain error strings.

### Card 4.11
**Q:** How to distinguish empty results from errors?
**A:** Return structured responses: `{"resultCount": 0, "status": "success"}` vs `{"error": "access_denied", "isRetryable": false}`. Claude can't distinguish "no data" from "access denied" if both return empty.

### Card 4.12
**Q:** What are the `tool_choice` modes?
**A:** `"auto"` = Claude may return text or call a tool. `"any"` = must call some tool, chooses which. `{"type": "tool", "name": "..."}` = must call that exact tool. Extended thinking only supports `"auto"` and `"none"`.

### Card 4.13
**Q:** Why is idempotent tool design important?
**A:** Tools that create state should accept idempotency keys. Repeated calls with same key return existing record instead of creating duplicates. Essential under retry conditions in agentic loops.

### Card 4.14
**Q:** How does MCP authentication work per transport?
**A:** Streamable HTTP: OAuth 2.1 (industry-standard, scoped permissions, refresh flows). stdio: environment variables (local-only, no network auth needed).

---

## Domain 5 — Context Management & Reliability (15%)

### Card 5.1
**Q:** What is the scratchpad pattern?
**A:** Write critical decisions, plans, and state to a persistent file before compaction occurs. Agent re-reads the scratchpad after compaction to restore essential state. More reliable than trying to avoid compaction.

### Card 5.2
**Q:** What is progressive summarization risk?
**A:** Summarization can lose specific transactional details (order numbers, amounts, dates). Fix: extract critical facts into a persistent "case facts" block preserved outside summarized content.

### Card 5.3
**Q:** What is the lost-in-the-middle effect?
**A:** Information in the middle of large inputs receives less attention than beginning/end. Fix: place critical summaries and instructions at the beginning of aggregated inputs.

### Card 5.4
**Q:** How does prompt caching interact with extended thinking?
**A:** System prompt cache survives `budget_tokens` changes. Message-level cache does NOT — budget change alters request prefix and invalidates it. Thinking blocks from prior turns can be cached as input tokens.

### Card 5.5
**Q:** What token categories must you track for budget management?
**A:** Input tokens (including cached reads — cheaper but billable), output tokens, thinking tokens (billed as output tokens — more expensive). Tracking only output tokens misses the majority of costs.

### Card 5.6
**Q:** Why is 94% aggregate accuracy potentially misleading?
**A:** Can mask a 68% failure rate in one category. Always track accuracy by category/document type, use field-level confidence scores, route low-confidence categories to human review or specialized handlers.

### Card 5.7
**Q:** Why are fixed test suites insufficient for production?
**A:** Need: out-of-distribution test cases, live monitoring with degradation alerts, regression baselines, adversarial inputs. Fixed suites create false confidence.

### Card 5.8
**Q:** How to improve LLM-as-judge reliability?
**A:** Use multiple independent judge evaluations and aggregate scores. Provide explicit rubric criteria and few-shot scoring examples. Reduces variance from single-judge evaluation.

### Card 5.9
**Q:** Name 3 anti-pattern escalation triggers.
**A:** 1) Sentiment-based escalation. 2) Self-reported confidence scores. 3) Fixed attempt counts ("escalate after 10 failures"). All are unreliable and don't reflect actual need for human help.

### Card 5.10
**Q:** What is a warm handoff?
**A:** Preserve full conversation context and attach a structured summary when escalating to human. Never do a cold transfer that loses context.

### Card 5.11
**Q:** What are input vs output guardrails?
**A:** **Input**: validate user intent (UserPromptSubmit hooks), sanitize at application boundary, screen for prompt injection. **Output**: check responses against safety classifiers and rule-based filters before delivery. Defense-in-depth: multiple layers, not single-point defenses.

### Card 5.12
**Q:** What is the correct retry strategy for API failures?
**A:** Exponential backoff with jitter (prevents retry storms). Distinguish retryable (429, 5xx) from non-retryable (4xx validation). Maximum retry count. Anti-pattern: immediate retries (amplify rate limiting).

### Card 5.13
**Q:** How to handle conflicting data in multi-agent research?
**A:** Maintain claim-source mappings (URLs, excerpts, dates). Preserve attribution through synthesis. When data conflicts, annotate both with sources and flag the conflict. Never average conflicting data or pick arbitrarily.

### Card 5.14
**Q:** What is explicit state tracking across context boundaries?
**A:** Serialize state into JSON checkpoints (memory tool pattern) when transitioning to a new context window. Enables clean, auditable transitions. Implicit summarization risks losing critical details.

---

## Cross-Domain Anti-Patterns (Exam Favorites)

### Card X.1
**Q:** List 7 key anti-patterns the exam loves to test.
**A:** 1) Aggregate accuracy masking per-category failures. 2) Sentiment-based escalation. 3) Self-reported confidence scores. 4) Same-session self-review. 5) Prompt-based enforcement of critical business rules (use hooks). 6) Storing agent state only in memory (use durable storage). 7) Over-chunking documents that fit in context window.
