---
sidebar_position: 2
---

import Mascot from '@site/src/components/Mascot';

# Workflow Tips
<Mascot src={require('./img/slug_thinking.png').default} />

Practical advice for integrating AI tools into your daily development workflow.

## Start with Clear Intent

Before prompting an AI tool, know what you want:
- What problem are you solving?
- What does "done" look like?
- What constraints exist?

## Use [Version Control](https://git-scm.com/video/what-is-version-control)

Always commit before starting an AI-assisted task. This gives you a clean rollback point if the generated code doesn't work out.

- [Git Cheat Sheet](https://git-scm.com/cheat-sheet)
- [Make use of Git worktree](https://git-scm.com/docs/git-worktree)

## Incremental Changes

Make small, testable changes rather than generating large amounts of code at once:

1. Generate a small piece of functionality
2. Review and test it
3. Commit if it works
4. Move to the next piece

## Know When NOT to Use AI

AI coding tools are not always the right choice:

- **Security-critical code** — Crypto, auth logic, and access control deserve extra human attention
- **Performance-critical paths** — Profile first, then optimize deliberately
- **Domain-specific logic** — The AI may not understand your business rules
- **When you need to learn** — Using AI to skip understanding leads to fragile codebases

For risk controls, see [Safety and Risk Management](/best-practices/safety-and-risk).

## Pair with AI, Don't Defer to It

Think of AI as a junior developer with broad knowledge but no judgment. You provide the direction, review the output, and make the final call.

<p><small>Sources: <a href="https://git-scm.com/docs/gittutorial">Git tutorial and workflow basics</a>, <a href="https://trunkbaseddevelopment.com/short-lived-feature-branches/">Trunk-based development (small, incremental changes)</a>, <a href="https://cloud.google.com/devops/state-of-devops">DORA / State of DevOps reports</a></small></p>
