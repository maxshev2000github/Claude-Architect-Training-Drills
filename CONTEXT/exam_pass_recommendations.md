# CCA-F Exam: Pass Experiences & Recommendations

Summary of insights from people who passed the Claude Certified Architect - Foundations exam, compiled from 8+ web sources (June 2026).

---

## Reported Scores & Prep Timelines

| Person | Score | Prep Time | Background |
|--------|-------|-----------|------------|
| Sarvesh (Big Tech Careers) | 911/1000 | 5 days (35-40 hrs) | Daily Claude user with production experience |
| Sachin Trivedi (Substack) | Not disclosed | 5-week plan | 8 months building with Claude APIs, shipped multi-agent workflows |
| Kishor Kukreja (Medium) | 893/1000 | Not disclosed | Hands-on Claude experience |
| Hong Chu (Medium) | 843/1000 | 2 weeks | Built mental framework during prep |
| John Mathew (Medium) | Not disclosed | Not disclosed | Among first cohort globally |
| Balaji Ashok Kumar (Medium) | 904/1000 | Not disclosed | TPM (Technical Program Manager) |

**Takeaway:** Experienced Claude users pass in 5 days to 2 weeks. Beginners need 5-12 weeks. Budget 35-40 hours of focused study regardless.

---

## Common Preparation Strategies

### The Core Principle
> "When something must happen, you use code. When something should happen, you use prompts."
> — Sachin Trivedi

Prompt-based guidance feels right, but programmatic enforcement is required for non-negotiable business requirements. This single insight unlocks many exam questions.

### Proven Study Plans

**5-Week Plan (Sachin Trivedi):**
1. Week 1: Complete all 13 Anthropic Academy courses at anthropic.skilljar.com
2. Week 2: Study the official exam guide — read wrong answer explanations to understand the exam's logic
3. Week 3: Sketch architectures for all six scenarios on paper (hook placement, state persistence, context flow)
4. Week 4: Take the official 60-question practice test, identify weakest domain
5. Week 5: Drill weakest domain with 40-50 targeted practice questions

**3-Week Plan (Claude Certification Guide):**
1. Week 1: Master Domains 1 & 3 (47% of exam) — agentic loop lifecycle and settings hierarchy
2. Week 2: Study Domains 4 & 2 — practice scenario-based judgment calls
3. Week 3: Complete Domain 5, diagnostic exam, then full practice exam

**5-Day Sprint (Sarvesh, for experienced users):**
1. Days 1-2: Foundation — Anthropic Academy courses, decision-making frameworks (8 hrs/day)
2. Day 3: Specialized domains — MCP, Claude Code, CLAUDE.md hierarchies (7 hrs)
3. Day 4: Intensive drilling on distractor patterns (9 hrs)
4. Day 5: Mock testing and final review (6 hrs)

### Universal Advice
- **Build first, drill second, sit the exam last** — this is not a memorization test
- Complete the official practice test before booking the real exam
- Aim for 85%+ on mock exams before attempting the real thing
- Study all six scenarios — don't skip unfamiliar ones
- Read wrong answer explanations, not just correct ones
- "Reading alone does not bridge the gap. Practice does."

---

## Domain-Specific Advice

### Domain 1: Agentic Architecture & Orchestration (27%)

The heaviest domain — if you only have a few hours, spend them here.

- Build an agent end-to-end using the Claude Agent SDK with real tool calling
- Never parse natural language ("I'm done") to detect completion — rely only on `stop_reason`
- Don't hardcode iteration caps as your primary exit condition
- Text appearing alongside `tool_use` blocks doesn't mean the loop is finished
- **Subagents do NOT inherit context automatically** — one of the biggest exam traps
- Study subagent spawning and task decomposition patterns

### Domain 2: Tool Design & MCP Integration (18%)

- "Claude picks which tool to call based primarily on the tool's description, not its name or parameter schema"
- Write explicit, detailed tool descriptions — the simplest fix usually wins
- Implement structured error responses with `errorCategory` and `isRetryable` flags
- Create actual MCP servers and test tool disambiguation actively
- Design similar tools and verify Claude selects appropriately

### Domain 3: Claude Code Configuration & Workflows (20%)

- Create hierarchical CLAUDE.md files at user, project, and directory levels
- Enterprise settings override user settings, which override project settings — but CLAUDE.md at working directory level is always included
- Set up path-scoped rules in `.claude/rules/` with YAML frontmatter
- Write custom skills with `context: fork` and `allowed-tools` restrictions
- Configure Claude Code for a real project to internalize best practices

### Domain 4: Prompt Engineering & Structured Output (20%)

- "There's a difference between advice that sounds right and a fix that solves the stated problem"
- Few-shot examples won't fix tool misrouting — explicit categorical criteria will
- Use `tool_use` with JSON schemas for reliable structured output
- Build validation-retry loops to catch hallucinations
- Use explicit criteria instead of vague instructions

### Domain 5: Context Management & Reliability (15%)

Frequently underestimated despite lower weight — deserves equal attention to Domain 4.

- Study escalation patterns — knowing when to hand off to humans is critical
- Extract structured facts from verbose outputs to preserve context
- Use scratchpad files for long multi-turn conversations
- Covers "lost in the middle" solutions and context ceiling patterns
- Understand how "when not to resolve" decisions differ from technical solutions

---

## Eight Distractor Patterns to Recognize

These are the most common wrong-answer traps on the exam:

1. **System prompts over code gates** — Relying on system prompts instead of programmed gates for business logic
2. **Examples over descriptions** — Adding few-shot examples when the root cause is inadequate tool descriptions
3. **Over-engineering** — Complex solutions before simpler fixes are tried
4. **Sentiment-based escalation** — Escalating on emotional tone rather than explicit policy gaps
5. **Too many tools** — Giving agents too many tools diminishes selection reliability
6. **Wrong API for the job** — Using Message Batches API for blocking workflows requiring quick turnaround
7. **Self-review** — Same session reviewing its own generated code (needs a separate evaluator)
8. **Text-based loop detection** — Checking text content instead of using `stop_reason` for loop termination

---

## Exam Day Tips

- **2 minutes per question** — tight, but manageable with preparation
- Read complete question stems **twice** before examining options — critical constraints often hide in the middle of descriptions, not opening sentences
- Select the **best** solution, not just a correct one — all four options may sound plausible
- Use all available time — speed provides no advantage
- The exam is proctored online, closed book, no AI assistance allowed
- Questions follow the pattern: "You have a system that does X. It's failing because Y. What's the right fix?"

---

## Recommended Resources

### Free (Essential)
- **Anthropic Academy courses** (anthropic.skilljar.com) — Claude 101, AI Fluency, Building with Claude API, MCP Introduction & Advanced Topics, Claude Code in Action, Agent Skills Introduction (13 courses total)
- **Official exam guide** — upload to a Claude Project for reference
- **Official 60-question practice test** — provided after registration, complete before booking
- [Claude Certifications](https://claudecertifications.com/) — free study guides, 25 practice questions, 5 domain breakdowns, 12-week prep plan
- [Claude Certification Guide](https://claudecertificationguide.com/) — 30 lessons, 150+ practice questions, mock exams, hands-on exercises

### Community Guides
- [GitHub: claude-architect-exam-guide](https://github.com/daronyondem/claude-architect-exam-guide) — community study guide for developers
- [DEV Community: 5 Domains, 6 Scenarios](https://dev.to/aws-builders/the-claude-certified-architect-exam-5-domains-6-scenarios-and-everything-you-need-to-know-4le3) — domain-by-domain breakdown with study strategies
- [Tutorials Dojo: CCA-F Study Guide](https://tutorialsdojo.com/cca-f-claude-certified-architect-foundations-study-guide/)

### Personal Experience Posts
- [Sachin Trivedi: "I passed the CCA-F exam. Here is what I would actually tell you."](https://aiwithsachin.substack.com/p/i-passed-the-claude-certified-architect) — 5-week study plan, core principles
- [Hong Chu: "How I Passed in 2 Weeks"](https://medium.com/@yeesun.chu/how-i-passed-the-claude-certified-architect-foundations-cca-f-exam-in-2-weeks-6b967e6effb4) — 843/1000
- [Kishor Kukreja: "I passed with 893/1000"](https://medium.com/@kishorkukreja/i-passed-anthropics-claude-certified-architect-foundations-exam-with-a-score-of-893-1000-2206c27efd6c)
- [John Mathew: Complete Preparation Guide](https://medium.com/@johnelanji/how-i-passed-the-anthropic-claude-certified-architect-foundations-cca-f-exam-a-complete-1108dce46e9b)
- [Sarvesh: Step-by-Step Guide (scored 911)](https://newsletter.bigtechcareers.com/p/step-by-step-guide-to-achieve-claude-certification) — 5-day sprint plan
- [Rick Hightower: Complete Guide to Passing](https://pub.towardsai.net/claude-certified-architect-the-complete-guide-to-passing-the-cca-foundations-exam-9665ce7342a8)

### Paid (Optional)
- [Udemy: 6 Complete Practice Tests (360 questions)](https://www.udemy.com/course/claude-certified-architect-practice-tests/)
- [Udemy: CCA-F 2026 Exam Prep](https://www.udemy.com/course/certified-claude-architect-masterclass-2026/)

> **Note from multiple sources:** Avoid Udemy courses that teach to the exam rather than building underlying concepts. Free official resources are sufficient if combined with hands-on practice.

---

## Key Mindset Shifts

1. **Design systems, not prompts** — "Don't trust the model alone; design the system around the model." The workflow around the model matters just as much.
2. **Think production, not theory** — The exam rewards people who actually build with Claude, not people who've read the docs once.
3. **Learn anti-patterns** — "The exam tests whether you know the wrong ways to do it" alongside correct approaches.
4. **Simplest fix first** — Over-engineering is a common distractor. Better tool descriptions solve most routing issues.
5. **The exam rewards meticulous thinking** — Rushing produces lower scores. Constraints hide in the middle of question stems.
6. **Practice question dumps won't save you** — "People who try to shortcut through practice question dumps without building the underlying mental models are the ones retaking it."
