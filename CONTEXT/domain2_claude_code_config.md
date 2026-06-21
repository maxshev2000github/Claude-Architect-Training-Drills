# Domain 2 — Claude Code Configuration & Workflows (20%)

Covers CLAUDE.md hierarchy, custom commands/skills, hooks, settings, CI/CD integration, and permission modes.

## CLAUDE.md Hierarchy & Precedence

| Level | Location | Scope | Version-controlled? |
|-------|----------|-------|-------------------|
| User-level | `~/.claude/CLAUDE.md` | Personal defaults, all projects | No (personal) |
| Project-level | `<repo>/CLAUDE.md` | Entire project | Yes |
| Subdirectory-level | `<repo>/src/frontend/CLAUDE.md` | That directory + children | Yes |

**Precedence**: Project-level > user-level. Subdirectory CLAUDE.md files override/extend parent scope. User-level provides defaults that project-level can override.

**Best practice**: Keep CLAUDE.md lean with only always-relevant rules. Move bulky reference material to separate files read on demand via `@path` imports. A 600-line CLAUDE.md wastes context every session.

## Settings Files

| File | Scope | Version-controlled? |
|------|-------|-------------------|
| `.claude/settings.json` | Project-wide, shared | Yes |
| `.claude/settings.local.json` | Personal, machine-specific | No (gitignored) |
| `~/.claude/settings.json` | User-level, all projects | No (personal) |

Use `settings.local.json` for personal tool permissions that shouldn't affect teammates.

## Rules Directory

`.claude/rules/` supports rule files with YAML frontmatter for path-scoped rules:

```yaml
---
globs: ["**/*.test.tsx"]
---
Always use React Testing Library. Prefer userEvent over fireEvent.
```

Rules activate only when Claude works with files matching the glob pattern.

## Custom Slash Commands (Skills)

Defined as markdown files in `.claude/commands/` (project-level) or `~/.claude/commands/` (personal).

### YAML Frontmatter Options

| Key | Purpose | Example |
|-----|---------|---------|
| `context: fork` | Run in isolated subagent context | Prevents intermediate work from cluttering main conversation |
| `allowed-tools` | Restrict which tools the command can use | `allowed-tools: Read, Grep, Glob` |

- Project-level `.claude/commands/` are version-controlled and shared with team
- User-level `~/.claude/commands/` are personal and not shared

## Hooks — Deterministic Lifecycle Events

Hooks are system-triggered shell commands (or HTTP/MCP/prompt/agent handlers) that execute at lifecycle points. Unlike CLAUDE.md instructions (probabilistic), hooks are deterministic.

### Lifecycle Events

| Cadence | Events |
|---------|--------|
| Per-session | `SessionStart`, `SessionEnd` |
| Per-turn | `UserPromptSubmit`, `Stop`, `StopFailure` |
| Per tool call | `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PostToolBatch` |

### Exit Codes

| Code | Effect |
|------|--------|
| 0 | Success. Stdout parsed for JSON output. |
| 2 | Blocking error. Stderr fed to Claude. Action blocked. |
| Other | Non-blocking error. Execution continues. |

### PreToolUse Decision Control

Four permission decisions via `hookSpecificOutput.permissionDecision`:

| Decision | Effect |
|----------|--------|
| `"allow"` | Approve tool call |
| `"deny"` | Block tool call |
| `"ask"` | Escalate to user permission dialog |
| `"defer"` | Let normal permission flow apply |

**Input modification**: `updatedInput` rewrites tool arguments before execution.

### PostToolUse Capabilities

- `updatedToolOutput`: Replace raw tool result before Claude sees it (e.g., redaction)
- `additionalContext`: Inject contextual notes for Claude (appears as system reminder)
- `decision: "block"`: Prevent Claude from using the result

### Stop Hook Quality Gate

Exit code 2 from a Stop hook prevents Claude from completing its turn. Stderr is fed back as an error message. Claude continues working and tries again later. Use for: "tests must pass before done."

### Hook Types

| Type | Description |
|------|-------------|
| `command` | Shell script receiving JSON on stdin |
| `http` | POST to endpoint |
| `mcp_tool` | Call to MCP server tool |
| `prompt` | Single-turn LLM evaluation |
| `agent` | Subagent-based verification (experimental) |

### Hooks vs. Skills Decision

- **Hooks**: System-triggered at lifecycle events regardless of task context. Use for: linting after edits, blocking dangerous commands, redacting secrets.
- **Skills**: Agent-driven, Claude invokes based on task relevance. Use for: fetching deployment status, running research tasks.

## CI/CD Integration

Essential flags for headless (non-interactive) usage:
- `-p "prompt"` — Non-interactive mode with a single prompt
- `--output-format json` — Structured JSON output for pipeline parsing

Each `-p` invocation runs in an isolated session (natural isolation between CI runs).

## Plan Mode

Best for large-scale changes (50+ files) and architectural decisions. Direct execution suits single-file fixes. Plan Mode provides full scope understanding before acting.

## Key Exam Scenarios (Domain 2)

- Claude Code Team Setup: CLAUDE.md hierarchy, settings precedence, onboarding consistency
- Claude Code in CI/CD: headless flags, PR review automation, false positive minimization
