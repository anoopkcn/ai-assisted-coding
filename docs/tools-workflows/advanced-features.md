---
sidebar_position: 3
---

# Advanced AI Tooling Features

Modern AI coding tools go beyond simple chat and autocomplete. This guide covers the advanced features that let you customize, extend, and orchestrate AI assistants in your development workflow.

Most of these features originate in **Claude Code** but the underlying concepts — delegating tasks, extending tools via protocols, lifecycle automation, and parallel workspaces — apply broadly. Where other tools offer equivalent functionality, it's noted.

## Subagents

Subagents are specialized AI assistants that run in isolated contexts with their own conversation history and restricted tool access. Instead of handling everything in a single conversation, the main agent delegates focused tasks to subagents that work independently and return results.

### Why subagents matter

- **Context isolation** — verbose output (test results, large searches) stays out of your main conversation
- **Tool restrictions** — a research subagent can be limited to read-only tools
- **Parallelism** — multiple subagents can work simultaneously on different parts of a codebase
- **Cost control** — route simple tasks to faster, cheaper models

### Built-in subagent types (Claude Code)

| Type | Model | Tools | Purpose |
|------|-------|-------|---------|
| **Explore** | Haiku (fast) | Read-only | File discovery, code search, codebase exploration |
| **Plan** | Inherited | Read-only | Research and design during plan mode |
| **General-purpose** | Inherited | All | Complex multi-step tasks requiring both reading and writing |

Claude automatically delegates to these based on what the task requires. You can also request a specific type:

```
Use an Explore subagent to find all files that import the auth module
```

### Custom subagents

Create a custom subagent by adding a `SKILL.md` file:

**`.claude/agents/code-reviewer/SKILL.md`**

```yaml
---
name: code-reviewer
description: Reviews code for quality and best practices
tools: Read, Grep, Glob
model: sonnet
maxTurns: 10
---

You are a senior code reviewer. When invoked:

1. Review modified files for clarity and correctness
2. Check error handling and edge cases
3. Flag any security concerns

Organize feedback by priority: Critical → Warning → Suggestion
```

Subagents can be scoped to a project (`.claude/agents/`) or to all your projects (`~/.claude/agents/`).

### Comparison with other tools

**Cursor** has an agent mode that operates similarly to Claude Code's agentic loop — it can read, write, and run commands autonomously. However, Cursor doesn't expose the concept of multiple specialized subagents running in parallel; its agent mode is a single execution context.

## Skills (Slash Commands)

Skills are reusable instruction sets that extend what an AI assistant can do. You invoke them with `/skill-name` or the assistant loads them automatically when they match the current task.

### Built-in vs custom skills

Claude Code ships with built-in skills like `/commit`, `/review-pr`, and `/init`. You can create your own for workflows you repeat often.

**`~/.claude/skills/explain-code/SKILL.md`** (available in all projects):

```yaml
---
name: explain-code
description: Explains code with diagrams and analogies
argument-hint: "[file-path]"
user-invocable: true
allowed-tools: Read, Grep, Glob
---

When explaining code:

1. **Analogy first**: Compare the code to something from everyday life
2. **Draw a diagram**: Use ASCII art to show flow or structure
3. **Walk through**: Step-by-step explanation of what happens
4. **Highlight a gotcha**: Common mistakes or misconceptions
```

Then invoke it:

```
/explain-code src/auth/middleware.ts
```

### Key frontmatter fields

| Field | Purpose |
|-------|---------|
| `name` | Identifier (lowercase, hyphens) |
| `description` | When to auto-load; also shown in `/` menu |
| `argument-hint` | Autocomplete hint, e.g. `[file-path]` |
| `user-invocable` | `true` = appears in `/` menu; `false` = only auto-loaded |
| `allowed-tools` | Tools available without permission prompts |
| `model` | `sonnet`, `opus`, `haiku`, or `inherit` |
| `context` | `default` (inline) or `fork` (isolated subagent) |

### Dynamic content

Skills support string substitutions and inline command execution:

```yaml
---
name: pr-summary
description: Summarize a pull request
---

Summary of PR $ARGUMENTS:

Changes: !`gh pr diff $ARGUMENTS`
Comments: !`gh pr view $ARGUMENTS --comments`
```

| Variable | Expands to |
|----------|-----------|
| `$ARGUMENTS` | All arguments passed to the skill |
| `$0`, `$1`, … | Individual arguments (0-based) |
| `` !`command` `` | Output of the shell command |

### Organizing skill files

For complex skills, add supporting files alongside `SKILL.md`:

```
.claude/skills/my-skill/
├── SKILL.md          # Main instructions (loaded first)
├── reference.md      # API docs (loaded when needed)
├── examples.md       # Usage examples
└── scripts/helper.sh # Executed, not loaded as context
```

### Analogous features in other tools

**Cursor** uses rules files (`.cursor/rules/`) that inject instructions into conversations, serving a similar purpose to skills but without the invocation model or argument passing. **GitHub Copilot** has instructions files (`.github/copilot-instructions.md`) that set project-level context.

## MCP (Model Context Protocol)

MCP is an open standard for connecting AI tools to external services. For a conceptual overview, see [Tool Use and Agentic Coding](../core-concepts/tool-use-and-agentic-coding.md#model-context-protocol-mcp). This section focuses on practical setup.

### Adding MCP servers (Claude Code)

```bash
# Remote HTTP server
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp

# Remote server with auth header
claude mcp add --transport http stripe \
  --header "Authorization: Bearer $STRIPE_KEY" \
  https://mcp.stripe.com

# Local stdio server
claude mcp add --transport stdio postgres \
  -- npx -y @bytebase/dbhub --dsn "postgresql://user:pass@localhost:5432/mydb"
```

### Configuration scopes

| Scope | Stored in | Shared | Use for |
|-------|-----------|--------|---------|
| **Local** | `~/.claude.json` (project path) | No | Personal servers, sensitive credentials |
| **Project** | `.mcp.json` (repo root) | Yes (commit it) | Team-shared tools, project services |
| **User** | `~/.claude.json` (global) | No | Personal utilities across all projects |

```bash
# Add to project scope (team-shared)
claude mcp add --transport http notion --scope project https://mcp.notion.com/mcp
```

### Team configuration with `.mcp.json`

Check this into your repo so the whole team gets the same MCP servers:

```json
{
  "mcpServers": {
    "postgres": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@bytebase/dbhub", "--dsn", "${DATABASE_URL}"]
    },
    "sentry": {
      "type": "http",
      "url": "https://mcp.sentry.dev/mcp"
    }
  }
}
```

Environment variables like `${DATABASE_URL}` expand at startup. Use `${VAR:-default}` for fallback values.

### OAuth authentication

Some MCP servers require OAuth. After adding the server, authenticate inside Claude Code:

```
/mcp
```

This opens a browser login flow. Credentials are cached locally.

### Popular MCP servers

| Server | What it does |
|--------|-------------|
| **GitHub** | PRs, issues, code search, repo management |
| **Sentry** | Error monitoring, crash analysis |
| **PostgreSQL / MySQL** | Direct database queries |
| **Slack** | Messages, channel history |
| **Notion** | Read/write Notion pages and databases |
| **Jira / Asana** | Task and issue management |

Browse the full directory at [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers).

### MCP in other tools

**Cursor** also supports MCP servers, configured in its settings UI or via JSON config. The protocol is tool-agnostic by design — an MCP server built for Claude Code works with any MCP-compatible client.

## Hooks

Hooks are shell commands that execute automatically at specific points in Claude Code's lifecycle. Unlike the AI's decisions (which can vary), hooks are **deterministic** — they always run when their trigger condition is met.

### Common use cases

- Auto-format files after every edit
- Block edits to protected files (`.env`, lock files)
- Send desktop notifications when Claude needs attention
- Run linters or validators after code changes
- Log all shell commands for auditing

### Supported events

| Event | Fires when | Example use |
|-------|-----------|------------|
| `PreToolUse` | Before a tool executes | Block dangerous commands |
| `PostToolUse` | After a tool succeeds | Auto-format edited files |
| `Notification` | Claude needs attention | Desktop notification |
| `Stop` | Claude finishes responding | Verify task completion |
| `SessionStart` | Session begins/resumes | Re-inject context |
| `UserPromptSubmit` | Before processing a prompt | Validate input |

### Configuration

Hooks live in `.claude/settings.json` (project-scoped, shareable) or `~/.claude/settings.json` (personal, all projects).

**Auto-format files after edits:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write"
          }
        ]
      }
    ]
  }
}
```

**Desktop notification (macOS):**

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Claude needs attention\" with title \"Claude Code\"'"
          }
        ]
      }
    ]
  }
}
```

**Block edits to protected files:**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "FILE=$(jq -r '.tool_input.file_path'); case \"$FILE\" in *.env*|*lock.json) echo \"Blocked: $FILE is protected\" >&2; exit 2;; esac"
          }
        ]
      }
    ]
  }
}
```

### How hooks communicate

- **Input**: Hook receives JSON on stdin with session info, tool name, and tool input
- **Exit code 0**: Action allowed (stdout added to context for `SessionStart`/`UserPromptSubmit`)
- **Exit code 2**: Action **blocked** — stderr is sent back to Claude as feedback
- **Other exit codes**: Action allowed, stderr logged silently

### Matchers

The `matcher` field filters which tool or event triggers the hook:

- `"Edit|Write"` — matches Edit or Write tools
- `"Bash"` — matches only Bash tool calls
- `"mcp__github__.*"` — matches any GitHub MCP tool (regex)
- `""` (empty) — matches everything

## Worktrees

Git worktrees let you have multiple working directories sharing the same repository. Each worktree has its own files, branch, and working state while sharing commit history and remotes. Claude Code uses worktrees to enable **parallel, isolated sessions**.

### When to use worktrees

- Working on multiple features simultaneously in separate terminals
- Running a subagent that needs to make changes without conflicting with your main session
- Experimenting with an approach you might want to discard

### Usage

```bash
# Start Claude Code in a new worktree
claude --worktree feature-auth

# Auto-generated name
claude --worktree

# From within a running session
> Start a worktree for the payment integration
```

This creates a directory at `.claude/worktrees/<name>/` with a new branch `worktree-<name>`, giving you a fully isolated copy of the repository.

### Cleanup behavior

- **No changes made** — worktree and branch are removed automatically on exit
- **Changes exist** — Claude prompts you to keep (preserves directory and branch) or remove (discards everything)

### Worktrees in subagents

Custom subagents can be configured to run in worktrees, which is useful for parallel tasks that modify files:

```yaml
---
name: parallel-optimizer
description: Optimize code in an isolated workspace
isolation: worktree
---

Analyze and optimize the target module for performance...
```

### Manual worktree management

Since worktrees are a standard Git feature, you can manage them directly:

```bash
# List active worktrees
git worktree list

# Create one manually
git worktree add ../feature-branch -b my-feature

# Remove when done
git worktree remove ../feature-branch
```

This works with any tool, not just Claude Code.
