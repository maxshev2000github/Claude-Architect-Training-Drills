# Domain 4 — Tool Design & MCP Integration (18%)

Covers MCP architecture, primitives, transports, authentication, tool descriptions, error responses, and configuration.

## MCP Architecture Hierarchy

**Host → Client → Server**

- **Hosts** (e.g., Claude Code, IDE extensions) contain one or more MCP clients
- Each **client** maintains a connection to an MCP server
- **Servers** expose three primitives: tools, resources, and prompts
- Communication uses JSON-RPC over the chosen transport

## Three MCP Primitives

| Primitive | Purpose | Side effects? | Example |
|-----------|---------|---------------|---------|
| **Tools** | Actions and computations | Yes (may have) | Query database, create record, run API call |
| **Resources** | Read-only content catalogs | No | Company directory, file listings, static datasets |
| **Prompts** | Reusable parameterized templates | No | "summarize-for-executive", "extract-action-items" |

Decision guide:
- Static data loaded at startup → Resource
- Requires API call each time → Tool
- Reusable instruction template → Prompt

## Transport Protocols

| Transport | Use case | Key traits |
|-----------|----------|------------|
| **stdio** | Local, single-client | 1:1 (one client per process), secrets via env vars |
| **Streamable HTTP** | Remote, multi-client (RECOMMENDED) | Single `/mcp` endpoint, stateless load-balancing, Mcp-Session-Id headers, OAuth 2.1 |
| **SSE** | Remote (DEPRECATED for new servers) | Two endpoints (send/receive), harder to load-balance |

### Mcp-Session-Id Headers
- Server generates session ID on initialization, returns in response header
- Client includes ID in all subsequent requests
- Enables stateless load balancing — any backend instance looks up session in shared storage (e.g., Redis)
- Sticky sessions NOT required

## MCP Initialization Handshake

**Required before any other protocol messages.**

1. Client sends `initialize` request declaring its capabilities (roots, sampling support)
2. Server responds with its capabilities (tools, resources, prompts)
3. Client sends `initialized` notification to confirm readiness
4. Only then can meaningful operations begin

Skipping initialization → server rejects requests or behaves unpredictably.

## Server Capabilities

### Sampling
- Lets servers request LLM completions from the host
- Enables server-side workflows needing intermediate model reasoning (classify-then-route)
- Host controls approval (human-in-the-loop)
- Server doesn't need its own LLM access

### Roots
- Client declares which directories/URIs the server may operate within
- Enforces operational boundaries at protocol level (principle of least privilege)
- Server knows its allowed scope before any operations begin

### Elicitation (2025 addition)
- Servers can gather supplementary information from users dynamically
- Preserves user control and privacy

## Authentication

- **Streamable HTTP**: OAuth 2.1 — industry-standard, proper token management, scoped permissions, refresh flows
- **stdio**: Environment variables (local-only, no network auth needed)

## Tool Descriptions — Critical for Correct Selection

Effective tool descriptions must include:
1. What the tool does
2. Expected inputs (types, constraints, examples)
3. Output format
4. **When NOT to use it** (negative guidance for disambiguation)

Example: "Reads the full contents of a single file given an absolute path. Returns file content as text. Use Grep instead when searching for patterns across multiple files."

### Optimal Tool Count
4-5 tools per agent is optimal. 18+ tools significantly degrades selection reliability. Split across specialized agents if needed.

## Structured Error Responses

Tool errors should include:
- `errorCategory`: e.g., "transient", "validation", "permission", "service_unavailable"
- `isRetryable`: boolean flag — retryable (transient) vs. non-retryable (permanent)
- Human-readable message

Anti-patterns: empty results masquerading as success, suppressing errors, returning only plain error strings.

## Distinguishing Empty Results from Errors

Return structured responses that explicitly state the outcome:
```json
{"resultCount": 0, "status": "success", "query": "..."}
```
vs.
```json
{"error": "access_denied", "isRetryable": false}
```

Claude cannot distinguish "no data found" from "access denied" if both return empty results.

## Idempotent Tool Design

Tools that create state should accept idempotency keys (or dedupe on natural keys). Repeated calls with the same key return the existing record instead of creating duplicates. Essential under retry conditions.

## MCP Configuration in Claude Code

### .mcp.json (Project-Level)
- Declares server names, transport types, command/URL settings
- Supports environment variable expansion for credentials (e.g., `$DB_PASSWORD`)
- Committed to version control — shared with team

### Managed Agents API
- MCP servers are **agent-scoped** (declared per agent definition)
- Vault credentials are **session-scoped** (passed at session creation, available to all threads)
- Credential's `mcp_server_url` must match agent's `mcp_servers[].url` exactly

## tool_choice Modes

| Mode | Behavior |
|------|----------|
| `"auto"` | Claude may return text or call a tool |
| `"any"` | Claude must call some tool but chooses which |
| `{"type": "tool", "name": "..."}` | Claude must call that exact tool |

Note: Extended thinking only supports `"auto"` and `"none"`. Forced selection → 400 error with thinking enabled.

## MCP Notification Patterns

- Subscription-based filtering: clients subscribe to specific resources
- Server only sends `resource_updated` notifications for subscribed resources
- Reduces traffic vs. broadcasting every change to every client

## Key Exam Scenarios (Domain 4)

- Developer Productivity Tools: codebase navigation, MCP server integration
- Any scenario involving tool selection, error handling, or MCP configuration
