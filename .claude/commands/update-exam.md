Search the web for the latest information about the Claude Certified Architect - Foundations (CCA-F) exam and update the question bank in this repo.

## Steps

1. **Search for updates** — Use WebSearch to find the latest CCA-F exam info:
   - Search: "Claude Certified Architect Foundations CCA-F exam 2025 2026"
   - Search: "Anthropic CCA-F exam domains questions preparation"
   - Search: "CCA-F certification study guide updated"

2. **Fetch key pages** — Use WebFetch on any relevant results (official Anthropic docs, certification pages, community study guides) to extract:
   - Any changes to exam domains or weight percentages
   - New topic areas or removed topics
   - Sample questions or scenario patterns
   - Updated best practices for Claude architecture

3. **Read the current question bank** — Read `CONTEXT/example_questions.json` to understand existing questions and avoid duplicates.

4. **Generate new questions** — Based on newly found information, create new scenario-based MCQs that:
   - Follow the exact JSON schema used in `example_questions.json` (domain, scenario, question, options A-D, answer, explanation)
   - Cover topics or nuances NOT already in the question bank
   - Are realistic CCA-F-style scenario questions (not trivia)
   - Span all 5 exam domains proportionally to their weights

5. **Update the question bank** — Append new questions to `CONTEXT/example_questions.json`. Do NOT remove or modify existing questions.

6. **Report changes** — Summarize what was found and what questions were added, noting any exam changes detected.

## Important
- Only add questions backed by information found in the search results
- If no new information is found, say so — do not fabricate updates
- Preserve the existing JSON array structure (append to it, keep valid JSON)
