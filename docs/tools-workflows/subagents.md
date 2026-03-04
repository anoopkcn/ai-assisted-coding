---
sidebar_position: 2
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

Create a custom subagent by adding a markdown file.

**`.claude/agents/code-reviewer.md`**

```yaml
---
name: code-reviewer
description: Reviews code for quality and best practices
allowed-tools: Read, Grep, Glob
model: sonnet
---

You are a senior code reviewer. When invoked:

1. Review modified files for clarity and correctness
2. Check error handling and edge cases
3. Flag any security concerns

Organize feedback by priority: Critical -> Warning -> Suggestion
```

Subagents can be scoped to a project (`.claude/agents/`) or to all your projects (`~/.claude/agents/`).

### Download my custom subagents

**Sage** — A powerful "second opinion" reasoning agent for complex analysis, debugging, architecture review, and hard problems. Use when the main agent needs deeper reasoning — code review, root cause analysis, refactoring strategy, tricky bugs, security audits, or evaluating trade-offs.

<div className="contact-actions" style={{justifyContent: 'flex-start'}}>
  <a className="contact-button" href="/ai-assisted-coding/downloads/sage.md" download>
    Download the markdown for Sage subagent
  </a>
</div>
<p></p>

Example prompt:
```
The function check_balance() returns None intermittently. Use the sage to trace all code 
paths and find where it fails: @src/services/payment.py
```
**Scribe** — A research agent for searching and reading remote codebases on GitHub. Use when you need to look up how a library or framework is implemented, search across multiple repositories, find usage examples in open-source code, investigate dependency source code, or trace bugs into third-party libraries.

<div className="contact-actions" style={{justifyContent: 'flex-start'}}>
  <a className="contact-button" href="/ai-assisted-coding/downloads/scribe.md" download>
    Download the markdown for Scribe subagent
  </a>
</div>
<p><small> <b>scribe</b> subagent requires you to have `gh` the github CLI installed and authenticated: https://cli.github.com </small></p>

Example prompt:
```
Use the scribe to find open-source projects that implement 
rate limiting middleware in Starlette. Show me different approaches.
```
```
Use the scribe to check if any of our team's repos already have 
a retry decorator utility so I don't duplicate it.
```

If you want these subagents to act autonomously(without user input) then change the [access permissions for `gh` tool](https://code.claude.com/docs/en/permissions#wildcard-patterns) 

**WARNING: Giving unvetted `write` access to any tool is not a good idea**

<details>

<summary>Edit read permissions for `gh` tool</summary>

Edit the settings file `~/.config/claude/settings.json`

For example set permissions for the  `gh api` command:
```json
{
  "permissions": [
    { "tool": "Bash", "matches": { "cmd": "gh api *" }, "action": "allow" }
  ]
}
```
</details>
