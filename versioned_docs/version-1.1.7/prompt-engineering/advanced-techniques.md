---
sidebar_position: 2
---

import Mascot from '@site/src/components/Mascot';

# Advanced Techniques

<Mascot src={require('./img/slug_plane.png').default} />

Go beyond basic prompts to get more reliable and higher-quality results.

## Reference Existing Code

Point the AI to existing patterns in your codebase:

```
Look at how authentication middleware is implemented in
src/middleware/auth.js and create a similar middleware
for rate limiting.
```

## Ask for Explanations

When you need to understand generated code:

```
Explain the regex pattern you used in the email validation
function and what edge cases it handles.
```

## Use Constraints

Set boundaries to get code that fits your project:

```
Implement the search feature using only the standard library —
no external dependencies. Target Python 3.10+.
```

## Require Clarifying Questions for Ambiguous Tasks

Prevent incorrect assumptions by telling the model to ask before coding:

```
If any requirement is ambiguous, ask up to 3 clarifying questions
before proposing implementation details.
```

## Use a Two-Pass Workflow

For complex changes, separate planning from implementation:

1. **Pass 1 (Plan)** — Ask for approach, risks, and files to change
2. **Pass 2 (Implement)** — Ask for the actual patch and tests

Example:
```
First, provide a plan only: architecture impact, files to edit,
and migration risk. Do not write code yet.
```

## Ground Answers in Real Files

Reduce hallucinations by requiring concrete file references:

```
Only use APIs and modules that already exist in this repository.
List exact files/functions you used as references.
If something is missing, state it explicitly instead of inventing it.
```

## Request Tests Alongside Code

```
Write a function to parse CSV files with custom delimiters,
and include unit tests covering: empty files, files with headers
only, malformed rows, and unicode content.
```

## Multi-File Changes

When a change spans multiple files, describe the full scope:

```
Add a "last_login" timestamp to the User model. This will need:
- A database migration
- Updated model definition
- Changes to the login endpoint to record the timestamp
- Updated API response to include the field
```

## Ask for Self-Checks Before Final Output

Have the model verify its own output before presenting:

```
Before finalizing:
1. Check for breaking API changes
2. Check for missing imports
3. Check that tests cover happy path and key edge cases
Then provide final patch and test commands.
```
