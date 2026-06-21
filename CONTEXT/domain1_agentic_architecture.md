# Domain 1 — Agentic Architecture & Orchestration (27%)

The heaviest domain. Covers designing multi-agent systems, agentic loops, orchestration patterns, and reliability for autonomous systems.

## Core Agentic Loop

The canonical loop checks `stop_reason` in the API response:
- `stop_reason: "tool_use"` → Claude wants to call a tool → continue looping
- `stop_reason: "end_turn"` → Claude is done → exit loop
- `stop_reason: "max_tokens"` → output truncated → handle accordingly

Anti-pattern: parsing natural language ("I am done") or using fixed iteration counts as primary termination signals.

## Five Multi-Agent Orchestration Patterns

| Pattern | When to use | Key trait |
|---------|------------|-----------|
| **Supervisor (coordinator-worker)** | Hierarchical delegation with accountability | Lead agent decomposes, delegates, synthesizes. 2026 production default. |
| **Fan-out (scatter-gather)** | Independent parallel subtasks | Dispatch N tasks simultaneously, aggregate results. Sub-pattern of supervisor. |
| **Pipeline (prompt chaining)** | Sequential transformations with dependencies | Each step validates/transforms before passing to next. |
| **Debate (multi-perspective)** | Quality through critique | Multiple agents critique each other's output. |
| **Swarm (dynamic peers)** | Self-organizing agents without central control | No single coordinator; peers negotiate. |

## Orchestrator-Worker vs. Evaluator-Optimizer

- **Orchestrator-worker**: Coordinator decomposes work, delegates to subagents, synthesizes. Best when tasks are decomposable.
- **Evaluator-optimizer**: Generator produces output, evaluator scores against criteria, loop until pass or max iterations. Best when quality is measurable and first drafts are unreliable.
- **Routing**: Classifies input, dispatches to specialized handler. Best when categories are distinct with different processing needs.

## Managed Agents API Constraints

- **One-level-deep limit**: Coordinator delegates to roster agents; those agents cannot spawn further subagents.
- **Roster limit**: Maximum 20 unique agents in `multiagent.agents`.
- **Thread limit**: Maximum 25 concurrent threads per session.
- **Thread persistence**: Coordinator can send follow-ups to existing threads; agents retain full history.
- **Version pinning**: Roster is snapshotted at coordinator creation. Referenced agents don't auto-update.
- **Shared sandbox**: All agents share filesystem and vault credentials. Conversation, tools, MCP servers, and system prompt are isolated per thread.

## Context Passing Between Subagents

Subagents do NOT inherit the coordinator's context automatically. The coordinator must:
- Pass relevant findings explicitly when spawning or messaging subagents
- Structure handoffs with task description + relevant prior outputs
- Separate content from metadata so attribution survives handoff

Anti-pattern: Passing the raw user query to every subagent instead of curated context from prior stages.

## Dynamic Replanning

The orchestrator can revise its execution plan mid-run based on intermediate results. More resilient than static plans. Avoids brittleness of enumerating all possibilities upfront.

## Parallelization Safety

Parallelism is safe for independent tasks. Dangerous for shared mutable state:
- Race conditions cause silent data loss when parallel subagents write to the same resource
- Fix: append-only patterns, coordinator-mediated writes, or optimistic locking
- Don't abandon parallelism — coordinate writes

## Production Safeguards

### Circuit Breakers
- Hard iteration cap (e.g., 25 iterations)
- Repetition detection: hash tool call signatures, trip when identical calls repeat 3x
- Surface failures explicitly — never silently retry

### Cost Caps (Three Tiers)
- Per-task ceilings (runaway loop protection)
- Per-user daily/monthly limits (abuse prevention)
- Per-tenant monthly budgets (multi-tenant safety)
- Must be hard caps checked before every API call — not billing alerts

### Tool Permissioning
- Scope tools per session, task type, and tenant
- Never give agents the union of all capabilities
- Prompt-based tool restrictions are probabilistic and bypassable

### Durable State
- Treat SDK sessions as ephemeral
- Persist all messages, tool calls, and results to durable storage (Postgres, Redis, object storage)
- Conversation log = source of truth and handoff contract
- Enable checkpoint-and-resume for crash recovery without replaying side effects

## Model Selection by Role

| Role | Model | Rationale |
|------|-------|-----------|
| Triage classifier | Haiku | Fast, cheap classification |
| Policy lookup / mid-complexity | Sonnet | Balanced reasoning |
| Complex reasoning / edge cases | Opus | Deep multi-step reasoning |

Model cascade: attempt with cheaper model first, escalate on low confidence or validation failure.

## Human-in-the-Loop Triggers

Escalate to humans for:
- Explicit customer requests to speak with a human
- Policy gaps the agent cannot resolve
- Genuine inability to make progress
- Destructive/irreversible bulk operations (surface exact scope for confirmation)
- Legal threats or safety concerns

Anti-patterns: sentiment-based escalation, self-reported confidence scores.

## Anti-Pattern: Over-Chunking

If a document fits within the context window (e.g., 125K tokens in a 200K window), process it in a single call. Unnecessary chunking:
- Loses cross-section relationships
- Introduces merge complexity
- Adds latency and cost

Chunk only when documents exceed the context window.

## Key Exam Scenarios (Domain 1)

- Customer Support Agent: escalation, resolution rates, handoff patterns
- Multi-Agent Research System: coordinator + specialists, conflict resolution, attribution
- Developer Productivity Tools: codebase navigation, MCP integration
