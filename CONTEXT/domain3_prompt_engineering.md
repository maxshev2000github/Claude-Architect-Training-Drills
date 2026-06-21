# Domain 3 — Prompt Engineering & Structured Output (20%)

Covers JSON schema enforcement, few-shot techniques, XML tags, prefilling, validation loops, extended thinking, and batch processing.

## Structured Output Techniques (Ranked by Reliability)

1. **Tool use with JSON schema** — Most reliable. Eliminates syntax errors and enforces field presence at API level. Use `tool_use` with `input_schema`.
2. **Prefilling** — Start assistant response with `{` to anchor into JSON mode. Combine with schema definition.
3. **Prose instructions** — Least reliable. "Return JSON" in the system prompt is probabilistic.

## Prefilling

Set the beginning of the assistant message to control output format:
- Start with `{` → forces JSON output, eliminates conversational preamble
- Start with `<analysis>` → forces specific XML structure
- Controls where output **begins**; stop sequences control where it **ends**

## Stop Sequences

Set `stop_sequences: ["</product>"]` to halt generation immediately when that string is produced. Deterministic mechanism for controlling output termination. Pair with prefilling for full format control.

## XML Tags for Prompt Structure

Use XML tags to delimit sections in complex prompts:
- `<instructions>`, `<document>`, `<examples>`, `<query>`
- Prevents Claude from confusing document content with instructions
- Claude is trained to respect XML tag boundaries
- More precise than numbered headers or backticks

## Few-Shot Examples

- 2-4 targeted examples significantly improve classification reliability
- Most effective for: format consistency, ambiguous edge cases
- Use XML tags to wrap each example for clean separation
- Cover diverse scenarios, not just happy paths

## Nullable Fields for Data Extraction

When extracting from messy documents (legal contracts, OCR text):
- Make optional fields `nullable` in the JSON schema
- Instruct Claude to output `null` for absent data rather than guessing
- Prevents hallucination of missing values
- Add validation-retry loop to catch schema violations

## Validation-Retry Loops

Effective for: format/syntax mismatches, schema violations.
**Cannot fix**: missing information. If source data lacks a field, retries won't produce it — handle at schema level (make fields optional).

## Extended Thinking

### When to Use
- Complex multi-step reasoning, architectural analysis
- Tasks requiring deep edge-case identification
- Classification where internal reasoning improves accuracy

### Key Parameters
- `budget_tokens`: Maximum tokens for thinking. Must be **less than** `max_tokens`.
- `display`: `"summarized"` (default on Claude 4) or `"omitted"` (empty thinking text, signature preserved)

### Constraints with Tool Use
- Only supports `tool_choice: "auto"` and `"none"`
- `tool_choice: "any"` or forced tool name → 400 error
- Thinking blocks **must be preserved unchanged** in multi-turn conversations
- `signature` field carries encrypted reasoning for continuity — stripping it causes `invalid_request_error`

### Interleaved Thinking
Claude can think **between** tool calls for sophisticated multi-step reasoning:
```
[thinking] → [tool_use] → [thinking] → [tool_use] → [thinking] → [text]
```
With interleaved thinking, `budget_tokens` can exceed `max_tokens` (total across all thinking blocks).

### Cost Implications
- Thinking tokens billed as output tokens (more expensive)
- In multi-turn with caching, thinking blocks from prior turns become cached input tokens
- Creates compounding cost effect

## Message Batches API

- Up to 50% cost savings for asynchronous processing
- Results within 24 hours
- Ideal for: large volumes of independent, latency-tolerant requests
- NOT for: real-time or blocking operations

## Multi-Turn Conversation Drift

System prompt influence can diminish as conversation grows. Mitigations:
- Re-inject key constraints at strategic points
- Use prompt caching to keep system instructions prominent
- Extract critical facts into persistent blocks outside summarized content

## Prompt Caching

- `cache_control` breakpoints cache static content across requests
- Reduces latency and cost for repeated system prompts
- System prompt caches survive thinking parameter changes
- Message-level caches invalidated by `budget_tokens` changes

## Self-Review Anti-Pattern

Same-session self-review is biased by prior reasoning context. Use an independent session (separate API call) without the original generation context for unbiased review.

## Key Exam Scenarios (Domain 3)

- Structured Data Extraction: JSON schemas, nullable fields, validation loops, batch strategies
- Classification tasks: few-shot, explicit criteria, enum constraints
