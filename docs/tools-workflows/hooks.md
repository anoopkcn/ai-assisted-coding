---
sidebar_position: 4
---

import Mascot from '@site/src/components/Mascot';

# Hooks

<Mascot src={require('./img/slug_hooks.png').default} />

Hooks are shell commands that execute automatically at specific points in Claude Code's lifecycle. Unlike model decisions (which can vary), **hooks are deterministic:** they run when their trigger condition is met. Well-designed hooks can save context and reduce repeated manual steps.

> Last reviewed: February 26, 2026. Event names and schema details may change across versions.

## Common use cases

- Auto-format files after every edit
- Block edits to protected files. For example `.env`, lock files
- Send desktop notifications when Claude needs attention
- Run linters or validators after code changes
- Log all shell commands for auditing

## Supported events

| Event | Fires when | Example use |
|-------|-----------|------------|
| `PreToolUse` | Before a tool executes | Block dangerous commands |
| `PostToolUse` | After a tool succeeds | Auto-format edited files |
| `Notification` | Claude needs attention | Desktop notification |
| `Stop` | Claude finishes responding | Verify task completion |
| `SubagentStop` | A subagent completes | Post-process subagent output |
| `PreCompact` | Before context compaction | Preserve key context before summarization |
| `SessionEnd` | Session exits/ends | Cleanup and export logs |
| `SessionStart` | Session begins/resumes | Re-inject context |
| `UserPromptSubmit` | Before processing a prompt | Validate input |

## Configuration

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
            "command": "jq -r '.tool_input.file_path' | xargs ruff format"
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
            "command": "FILE=$(jq -r '.tool_input.file_path'); case \"$FILE\" in *.env*|*requirements*.txt|*lock*) echo \"Blocked: $FILE is protected\" >&2; exit 2;; esac"
          }
        ]
      }
    ]
  }
}
```

## How hooks communicate

- **Input**: Hook receives JSON on stdin with session info, tool name, and tool input
- **Exit code 0**: Action allowed (stdout added to context for `SessionStart`/`UserPromptSubmit`)
- **Exit code 2**: Action **blocked** — stderr is sent back to Claude as feedback
- **Other exit codes**: Action allowed, stderr logged silently

## Matchers

The `matcher` field filters which tool or event triggers the hook:

- `"Edit|Write"` — matches Edit or Write tools
- `"Bash"` — matches only Bash tool calls
- `"mcp__github__.*"` — matches any GitHub MCP tool (regex)
- `""` (empty) — matches everything

<p><small>Source: <a href="https://docs.anthropic.com/en/docs/claude-code/hooks-reference">Anthropic Claude Code hooks reference</a></small></p>
