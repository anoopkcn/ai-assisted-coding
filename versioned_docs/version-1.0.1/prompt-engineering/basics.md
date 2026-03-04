---
sidebar_position: 1
---

import Mascot from '@site/src/components/Mascot';

# Prompt Engineering Basics

<Mascot src={require('./img/slug_lab.png').default} />

The quality of your prompt directly affects the quality of AI-generated code.

## Be Specific

Bad:
```
Make this faster
```

Good:
```
Optimize the database query in getUserOrders() to use a JOIN
instead of N+1 queries. The function is in src/services/orders.js.
```

## Define "Done" Clearly

Tell the model what a successful answer must include:

- **Expected behavior** — "Returns 404 when user is missing"
- **Non-goals** — "Do not change API response shape"
- **Acceptance checks** — "Must pass existing test suite"

Example:
```
Update createOrder() to reject negative quantities.
Done criteria:
1. Returns 400 with error code INVALID_QUANTITY
2. Adds unit tests for zero and negative values
3. No changes to successful response payload
```

## Provide Context

Include relevant details:

- **Language and framework** — "Using TypeScript with Express"
- **Existing patterns** — "Follow the repository pattern used in UserRepository"
- **Constraints** — "Must be backward compatible with the v2 API"
- **Touched files** — "Limit changes to src/orders/* and tests/orders/*"

## Separate Instructions from Data

If your prompt includes large user input (logs, docs, code), mark boundaries clearly.

Bad:
```text
Rewrite this email politely:
Yo Claude rewrite this draft:
I need a refund and this product keeps crashing.
```

Better:
```text
Rewrite the email in a professional tone.

<email_draft>
I need a refund and this product keeps crashing.
</email_draft>
```

Explicit separators reduce misreads where model treats your instructions as part of the data (or vice versa).

## Ask for a Specific Output Format

If you define output shape, you get easier-to-review responses.

Example:
```
Return:
1. A short plan (3 bullets max)
2. Unified diff patch
3. Test commands to run
4. Risk notes (if any)
```

## Break Down Complex Tasks

Instead of asking for an entire feature at once, break it into steps:

1. "Create the database schema for a comments system"
2. "Write the API endpoints for CRUD operations on comments"
3. "Add input validation and error handling"
4. "Write unit tests for the comment service"

## Put the Actual Question Near the End for Long Context

When you include long documents or logs, place the final task/request after the data block:

```text
<release_notes>
...long content...
</release_notes>

Based only on the release notes above, list breaking changes for API clients.
If there is insufficient evidence, say so explicitly.
```

This reduces ambiguity about what the model should do right now.

## Iterate on Results

AI-generated code is a starting point. Review it, ask for changes, and refine:

```
The function works but doesn't handle the case where the user
has no orders. Add a check for an empty result set and return
an appropriate response.
```

## Reusable Prompt Template

Use this template for most coding tasks:

```
Task: <what to change>
Context: <language/framework/files>
Constraints: <style/performance/security/dependency limits>
Done criteria: <observable requirements>
Output format: <plan / patch / tests / notes>
```

### Structured Template (Exercise-Derived)

```text
Role/Task Context:
You are a <role>. Goal: <outcome>.

Input Data:
<code_or_docs>
{INPUT}
</code_or_docs>

Rules:
- Must: ...
- Must not: ...

Immediate Task:
Do exactly: ...

Output Contract:
- Format: <xml/json/markdown schema>
- Include: tests, assumptions, risks
```

<p><small>Sources: <a href="https://platform.openai.com/docs/guides/prompt-engineering">OpenAI prompt engineering guide</a>, <a href="https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview">Anthropic prompt engineering overview</a>, <a href="https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags">Anthropic: XML tags</a></small></p>
