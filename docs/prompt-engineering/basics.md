---
sidebar_position: 1
---

# Prompt Engineering Basics

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

## Provide Context

Include relevant details:

- **Language and framework** — "Using TypeScript with Express"
- **Existing patterns** — "Follow the repository pattern used in UserRepository"
- **Constraints** — "Must be backward compatible with the v2 API"

## Break Down Complex Tasks

Instead of asking for an entire feature at once, break it into steps:

1. "Create the database schema for a comments system"
2. "Write the API endpoints for CRUD operations on comments"
3. "Add input validation and error handling"
4. "Write unit tests for the comment service"

## Iterate on Results

AI-generated code is a starting point. Review it, ask for changes, and refine:

```
The function works but doesn't handle the case where the user
has no orders. Add a check for an empty result set and return
an appropriate response.
```
