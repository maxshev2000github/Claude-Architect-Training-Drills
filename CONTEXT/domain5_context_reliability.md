# Domain 5 — Context Management & Reliability (15%)

Covers context window management, compaction, prompt caching, escalation, evaluation, guardrails, and token budget management. Reliability concepts bleed into all other domains.

## Context Window Management

### Scratchpad Pattern
Write critical decisions, plans, and state to a persistent file before compaction occurs. The agent re-reads the scratchpad after compaction to restore essential state. More reliable than trying to avoid compaction.

### Progressive Summarization Risk
Summarization can lose specific transactional details (order numbers, amounts, dates). Extract critical facts into a persistent "case facts" block preserved outside the summarized content.

### Lost-in-the-Middle Effect
Information in the middle of large inputs receives less attention than beginning/end. Place critical summaries and instructions at the beginning of aggregated inputs.

## Prompt Caching

### How It Works
- `cache_control` breakpoints on content blocks
- Cached content reused across requests sharing the same prefix
- Reduces latency (cached tokens processed faster) and cost

### Caching + Extended Thinking Interaction
| Component | Survives budget_tokens change? |
|-----------|-------------------------------|
| System prompt cache | Yes — operates independently |
| Message-level cache | No — budget change alters request prefix |

### Thinking Block Caching
- Thinking blocks from previous turns CAN be cached when passed in subsequent requests
- When cached, they count as input tokens (cheaper but still billable)
- Creates cost tradeoff: reasoning quality vs. cumulative costs

## Token Budget Management

Track ALL token categories:
- Input tokens (including cached reads — cheaper but billable)
- Output tokens
- Thinking tokens (billed as output tokens — more expensive)

Set per-request budgets and alerts for anomalous usage spikes. Tracking only output tokens misses the majority of costs.

## Evaluation Best Practices

### Aggregate Metrics Are Insufficient
94% overall accuracy can mask a 68% failure rate in one category. Always:
- Track accuracy **by category/document type**
- Use field-level confidence scores
- Route low-confidence categories to human review or specialized handlers

### Fixed Test Suites Create False Confidence
Production-readiness requires:
- Out-of-distribution test cases (unexpected real-world inputs)
- Live monitoring with alerting for accuracy degradation
- Regression baselines to detect degradation over time
- Adversarial inputs not in the original test set

### LLM-as-Judge Reliability
- Use multiple independent judge evaluations and aggregate scores
- Provide explicit rubric criteria and few-shot scoring examples
- Reduces variance from single-judge evaluation

## Escalation Patterns

### Correct Triggers
- Explicit customer request to speak with a human
- Policy gaps the agent cannot resolve
- Genuine inability to make progress
- Destructive/irreversible bulk operations
- Legal threats, safety concerns

### Anti-Pattern Triggers
- Sentiment-based escalation
- Self-reported confidence scores
- Fixed attempt counts (e.g., "escalate after 10 failures")

### Warm Handoff
Preserve full conversation context and attach a structured summary when escalating. Never do a cold transfer that loses context.

## Guardrails (Input/Output)

### Input Guardrails
- Validate user intent at prompt level (UserPromptSubmit hooks)
- Sanitize user input at application boundary
- Screen for prompt injection attempts

### Output Guardrails
- Check model responses against safety classifiers and rule-based filters before delivery
- Separate system instructions from user input using XML tags
- Limit tool permissions to minimum required scope

Defense-in-depth: multiple layers, not single-point defenses.

## Retry Strategy for API Failures

- **Exponential backoff with jitter** — prevents retry storms
- **Distinguish retryable from non-retryable errors**:
  - Retryable: rate limits (429), server errors (5xx)
  - Non-retryable: validation errors (4xx)
- **Maximum retry count** — prevents infinite loops
- Anti-pattern: immediate retries (amplify rate limiting)

## Information Provenance

In multi-agent research systems:
- Maintain claim-source mappings (URLs, excerpts, publication dates)
- Preserve attribution through synthesis
- When data conflicts, annotate both with sources and flag the conflict
- Never average conflicting data or pick arbitrarily

## Session State Management

For long multi-turn interactions:
- Maintain an explicit session state object (current issue, actions taken, pending steps)
- Update after each turn, inject into next prompt as structured context
- Prevents agent from losing track of progress or suggesting already-tried actions

## Explicit State Tracking Across Context Boundaries

When transitioning to a new context window mid-task:
- Serialize state into JSON checkpoints (memory tool pattern)
- Enables clean, auditable transitions
- Implicit summarization risks losing critical details

## Key Anti-Patterns (Exam Favorites)

1. Aggregate accuracy masking per-category failures
2. Sentiment-based escalation
3. Self-reported confidence scores
4. Same-session self-review (biased by prior reasoning)
5. Prompt-based enforcement of critical business rules (use programmatic hooks)
6. Storing agent state only in memory (use durable storage)
7. Over-chunking documents that fit in context window

## Key Exam Scenarios (Domain 5)

- Customer Support Agent: escalation triggers, session state, case facts preservation
- Structured Data Extraction: per-category accuracy tracking, confidence routing
- Any scenario involving production reliability, monitoring, or cost management
