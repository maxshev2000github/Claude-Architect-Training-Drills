# CCA-F Exam References

Curated links and resources for the Claude Certified Architect – Foundations (CCA-F) exam.

---

## Exam overview

- **Format:** 60 scenario-based MCQs, 120 minutes, pass at 720 / 1000
- **Launched:** March 12, 2026, as part of the Claude Partner Network
- **Delivery:** 6 production scenarios (4 randomly selected per sitting); every question is anchored to a realistic scenario
- **Domains:** Agentic Architecture (27%), Claude Code (20%), Prompt Engineering (20%), Tool Design & MCP (18%), Context & Reliability (15%)

---

## Official Anthropic resources

### Documentation
- [Anthropic API Docs – Get started](https://docs.anthropic.com/en/docs/get-started)
- [Features overview](https://docs.anthropic.com/en/docs/build-with-claude/overview)
- [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
- [Model Context Protocol (MCP)](https://docs.anthropic.com/en/docs/agents-and-tools/mcp)
- [MCP Connector](https://docs.anthropic.com/en/docs/agents-and-tools/mcp-connector)
- [Remote MCP Servers](https://docs.anthropic.com/en/docs/agents-and-tools/remote-mcp-servers)
- [Claude Code – MCP integration](https://docs.anthropic.com/en/docs/claude-code/mcp)
- [Agent SDK overview (Claude Code Docs)](https://code.claude.com/docs/en/agent-sdk/overview)
- [Agent SDK overview (Claude API Docs)](https://platform.claude.com/docs/en/agent-sdk/overview)
- [Client SDKs](https://platform.claude.com/docs/en/api/client-sdks)

### Agent SDK source code
- [claude-agent-sdk-python (GitHub)](https://github.com/anthropics/claude-agent-sdk-python)
- [@anthropic-ai/claude-agent-sdk (npm)](https://www.npmjs.com/package/@anthropic-ai/claude-agent-sdk)

### Anthropic Academy – free courses (anthropic.skilljar.com)
- [Course catalog](https://anthropic.skilljar.com/)
- [Building with the Claude API](https://anthropic.skilljar.com/claude-with-the-anthropic-api) — API operations, prompting, tool integration, architectural patterns
- [Introduction to Model Context Protocol](https://anthropic.skilljar.com/introduction-to-model-context-protocol) — build MCP servers/clients in Python; tools, resources, prompts primitives
- [Introduction to Subagents](https://anthropic.skilljar.com/introduction-to-subagents) — sub-agent design, /agents command, when to use them

### Anthropic blog / announcements
- [Introducing the Model Context Protocol](https://www.anthropic.com/news/model-context-protocol)
- [Claude Partner Network announcement](https://www.anthropic.com/news/claude-partner-network)
- [Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
- [Anthropic Academy – Build with Claude](https://www.anthropic.com/learn/build-with-claude)
- [Anthropic Learn hub](https://www.anthropic.com/learn)

---

## Domain 1 – Agentic Architecture & Orchestration (27%)

**Key topics:** multi-agent design, orchestrator-worker / hub-and-spoke, agentic loops, termination conditions, subagent coordination, parallel vs sequential execution, minimal-footprint design, human-in-the-loop interrupt design, recovery strategies on subagent failure.

- [The Claude Certified Architect Exam: 5 Domains, 6 Scenarios (DEV Community)](https://dev.to/aws-builders/the-claude-certified-architect-exam-5-domains-6-scenarios-and-everything-you-need-to-know-4le3)
- [Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview)
- [Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)

## Domain 2 – Claude Code Configuration & Workflows (20%)

**Key topics:** CLAUDE.md hierarchy & precedence, custom slash commands, Agent Skills, plan mode, CI/CD pipeline integration, persistent project context, AI-first development workflows.

- [A Detailed Claude Code Guide for the CCA-F (Medium)](https://medium.com/@roanmonteiro/a-detailed-claude-code-guide-for-the-anthropic-certified-architect-foundations-exam-cca-f-bd916130d8ec)
- [Claude Code MCP docs](https://docs.anthropic.com/en/docs/claude-code/mcp)

## Domain 3 – Prompt Engineering & Structured Output (20%)

**Key topics:** JSON schema enforcement, few-shot techniques, XML tags, prefilling, data extraction, validation retry loops, programmatic enforcement.

- [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
- [Building with the Claude API (course)](https://anthropic.skilljar.com/claude-with-the-anthropic-api)

## Domain 4 – Tool Design & MCP Integration (18%)

**Key topics:** MCP servers/clients, tool boundaries, stdio vs SSE/HTTP transport, authentication patterns, reliable tool schemas, resources, prompts primitives.

- [What is the Model Context Protocol (MCP)?](https://docs.anthropic.com/en/docs/mcp)
- [MCP Connector](https://docs.anthropic.com/en/docs/agents-and-tools/mcp-connector)
- [Remote MCP Servers](https://docs.anthropic.com/en/docs/agents-and-tools/remote-mcp-servers)
- [Introduction to MCP (course)](https://anthropic.skilljar.com/introduction-to-model-context-protocol)

## Domain 5 – Context Management & Reliability (15%)

**Key topics:** CALM framework (context-aware LLM management), prompt caching with `cache_control` breakpoints, conversation compaction & summarisation, token estimation & budget management, multi-turn conversation design, escalation patterns, error propagation.

- [Features overview](https://docs.anthropic.com/en/docs/build-with-claude/overview)

---

## Study guides & community resources

- [Tutorials Dojo – CCA-F Study Guide](https://tutorialsdojo.com/cca-f-claude-certified-architect-foundations-study-guide/)
- [Claude Certified Architects – Exam Guide 2026](https://www.claudecertifiedarchitects.com/blog/cca-foundations-exam-guide-2026/)
- [Claude Certifications – Free Study Guide & Practice Questions](https://claudecertifications.com/claude-certified-architect)
- [daronyondem/claude-architect-exam-guide (GitHub)](https://github.com/daronyondem/claude-architect-exam-guide)
- [Complete Guide to Passing the CCA Foundations Exam (Towards AI)](https://pub.towardsai.net/claude-certified-architect-the-complete-guide-to-passing-the-cca-foundations-exam-9665ce7342a8)
- [CCA-F Preparation Guide (Medium)](https://dynamicbalaji.medium.com/claude-certified-architect-foundations-certification-preparation-guide-c70546b51f51)
- [Preporato – CCA-F Complete Guide 2026](https://preporato.com/blog/claude-certified-architect-complete-guide-2026)
- [CertLand – CCA-F Free Study Resources](https://certland.net/blog/cca-f-free-study-resources-2026/)
- [Panaversity – CCA-F Certification](https://panaversity.org/certifications/exams/CCA-F)
- [CCA-F Exam Guide: 5 Domains, 6 Scenarios, 60 Questions](https://claudearchitectcertification.com/exam-guide)

## Practice exams

- [Claude Certified Architects – 300+ Practice Questions](https://www.claudecertifiedarchitects.com/cca-foundations-exam/)
- [CertificationPractice – Free Practice Tests](https://certificationpractice.com/practice-exams/anthropic-claude-certified-architect-foundations)
- [ExamPro – CCA-F](https://www.exampro.co/cca-f)
- [Udemy – CCA-F Practice Exams (various)](https://www.udemy.com/course/claude-certified-architect-foundations-cca-f-practice-exams/)

## Paid courses

- [Udemy – Claude Certified Architect Masterclass 2026](https://www.udemy.com/course/certified-claude-architect-masterclass-2026/)
- [SimpliAxis – CCA-F Training Course](https://www.simpliaxis.com/claude-certified-architect-foundations-course)
