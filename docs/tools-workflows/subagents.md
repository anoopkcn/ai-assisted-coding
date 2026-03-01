---
sidebar_position: 5
---

import Mascot from '@site/src/components/Mascot';

# Subagents

<Mascot src={require('./img/slug_subagents.png').default} />

Subagents are specialized AI assistants that run in isolated contexts with their own conversation history and restricted tool access. Instead of handling everything in a single conversation, the main agent delegates focused tasks to subagents that work independently and return results.

## Why subagents matter

- **Context isolation** - verbose output (test results, large searches) stays out of your main conversation
- **Tool restrictions** - a research subagent can be limited to read-only tools
- **Parallelism** - multiple subagents can work simultaneously on different parts of a codebase
- **Cost control** - route simple tasks to faster, cheaper models

## Built-in subagent patterns (Claude Code)

| Type | Typical tools | Purpose |
|------|---------------|---------|
| **Explore** | Usually read-focused | File discovery, code search, codebase exploration |
| **Plan** | Usually read-focused | Research and design during plan mode |
| **General-purpose** | Full tool access | Complex multi-step tasks requiring both reading and writing |

Claude automatically delegates to these based on what the task requires. You can also request a specific type:

```
Use an Explore subagent to find all files that import the auth module
```

<p><small>Sources: <a href="https://docs.anthropic.com/en/docs/claude-code/sub-agents">Anthropic Claude Code subagents</a>, <a href="https://docs.cursor.com/agent/overview">Cursor agent overview</a>, <a href="https://docs.cursor.com/tools/overview">Cursor tools overview</a></small></p>

## Custom subagents

Create a custom subagent by adding a `SKILL.md` file (see [Skills](skills.md) for the full skill format):

**`.claude/agents/code-reviewer/SKILL.md`**

```yaml
---
name: code-reviewer
description: Reviews code for quality and best practices
allowed-tools: Read, Grep, Glob
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

If your tool version uses `tools` instead of `allowed-tools`, use the key your tool expects.

## Comparison with other tools

**Cursor** has an agent mode that operates similarly to Claude Code's agentic loop - it can read, write, and run commands autonomously. However, Cursor doesn't expose the concept of multiple specialized subagents running in parallel; its agent mode is a single execution context.
