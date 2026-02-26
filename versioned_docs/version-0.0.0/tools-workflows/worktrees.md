---
sidebar_position: 6
---

# Worktrees

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

# Remove when done
git worktree remove ../feature-branch
```

This works with any tool, not just Claude Code.

## Claude Code worktrees

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

- **No changes made** - worktree and branch are removed automatically on exit
- **Changes exist** - Claude prompts you to keep (preserves directory and branch) or remove (discards everything)

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
