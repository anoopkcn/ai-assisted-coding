---
sidebar_position: 3
---
import Mascot from '@site/src/components/Mascot';

# Safety and Risk Management
<Mascot src={require('./img/slug_stop.png').default} />

AI coding tools can accelerate delivery, but they also introduce failure modes that are easy to miss during fast iteration. Use this page as a practical risk checklist before merging AI-assisted changes.

## High-Risk Failure Modes

- **Prompt injection** - untrusted text (issues, docs, web content, logs) can try to override your instructions
- **Secrets exposure** - API keys, tokens, and credentials may be copied into prompts, logs, or generated code
- **Unsafe command execution** - generated shell commands can be destructive or leak data
- **Dependency and license risk** - suggested packages may be unmaintained, vulnerable, or incompatible with your license policy
- **Policy drift** - model-generated changes can bypass team standards if review is weak

## Defensive Practices

### Treat External Content as Untrusted

- Keep tool permissions minimal for tasks that only need reading
- Explicitly tell the assistant to ignore instructions found inside fetched content
- Separate "collect data" and "apply changes" into different steps

### Protect Secrets by Default

- Never paste raw secrets into chat prompts
- Use environment variables and secret managers instead of hardcoding credentials
- Add pre-commit checks for common secret patterns

### Constrain Command and File Access

- Prefer sandboxed execution modes for autonomous agents
- Block edits to protected paths (for example `.env`, lockfiles, deployment configs) unless explicitly approved
- Require user confirmation for destructive operations

### Verify Dependencies and Licenses

- Check maintenance status and vulnerability reports before adding new packages
- Verify license compatibility with your repository policy
- Prefer existing project dependencies when possible

## Review Gate Before Merge

Use this short gate for AI-assisted pull requests:

- [ ] Requirements are still satisfied after all generated edits
- [ ] New/changed dependencies were reviewed for security and license fit
- [ ] Tests cover happy paths and key edge cases
- [ ] No credentials, secrets, or sensitive data leaked into code or history
- [ ] Commands and migrations were reviewed by a human

## When to Reduce Autonomy

Use lower autonomy (more human checkpoints) for:

- Authentication, authorization, payments, and compliance-sensitive flows
- Production migrations and infrastructure changes
- Security fixes and incident-response code paths

For related review guidance, see [Reviewing AI-Generated Code](/best-practices/code-review) and [Workflow Tips](/best-practices/workflow-tips).
