---
sidebar_position: 2
---

# Advanced Techniques

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
