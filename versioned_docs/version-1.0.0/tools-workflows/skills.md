---
sidebar_position: 2
---
import Mascot from '@site/src/components/Mascot';

# Skills (Commands)
<Mascot src={require('./img/slug_juggle.png').default} />

Skills are reusable instruction sets that extend what an AI assistant can do. You invoke them with `/skill-name` (in Claude Code), `$skill-name` (in Codex) or the assistant loads them automatically when they match the current task.

## Built-in vs custom skills

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

## Key frontmatter fields

| Field | Purpose |
|-------|---------|
| `name` | Identifier (lowercase, hyphens) |
| `description` | When to auto-load; also shown in `/` menu |
| `argument-hint` | Autocomplete hint, e.g. `[file-path]` |
| `user-invocable` | `true` = appears in `/` menu; `false` = only auto-loaded |
| `allowed-tools` / `tools` | Tool access control field (exact key can vary by feature/version) |
| `model` | `sonnet`, `opus`, `haiku`, or `inherit` |
| `context` | `default` (inline) or `fork` (isolated subagent) |

## Dynamic content

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

## Organizing skill files

For complex skills, add supporting files alongside `SKILL.md`:

```
.claude/skills/my-skill/
├── SKILL.md          # Main instructions (loaded first)
├── reference.md      # API docs (loaded when needed)
├── examples.md       # Usage examples
└── scripts/helper.sh # Executed, not loaded as context
```

## Analogous features in other tools

**Cursor** uses rules files (`.cursor/rules/`) that inject instructions into conversations, serving a similar purpose to skills but without the invocation model or argument passing. **GitHub Copilot** has instructions files (`.github/copilot-instructions.md`) that set project-level context.
