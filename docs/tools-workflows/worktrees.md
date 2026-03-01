---
sidebar_position: 6
---

import Mascot from '@site/src/components/Mascot';

# Worktrees

<Mascot src={require('./img/slug_trees.png').default} />

Git worktrees let you have multiple working directories sharing the same repository. Each worktree has its own files, branch, and working state while sharing commit history and remotes. This enables **parallel, isolated sessions**.

## When to use worktrees

- Working on multiple features simultaneously in separate terminals
- Running a subagent that needs to make changes without conflicting with your main session
- Experimenting with an approach you might want to discard

## Manual worktree management

Since worktrees are a standard [Git feature](https://git-scm.com/docs/git-worktree), you can manage them directly:

```bash
# List active worktrees
git worktree list

# Create one manually
git worktree add ../feature-branch -b my-feature
```

This works with any tool, not just Claude Code.

## Claude Code worktrees

```bash
# Start Claude Code in a new worktree
claude --worktree feature-auth

# Auto-generated name
claude --worktree
```

Claude Code can create an isolated worktree session for you. Exact directory naming and branch naming conventions can vary by version, so verify with your installed CLI output.

### Cleanup behavior

- **No changes made** - tool-managed cleanup may remove temporary worktree state automatically
- **Changes exist** - you are typically prompted to keep or remove the worktree state

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

<p><small>Source: <a href="https://docs.anthropic.com/en/docs/claude-code/common-workflows#use-git-worktrees">Anthropic Claude Code worktree workflows</a></small></p>
