---
sidebar_position: 1
---

import Mascot from '@site/src/components/Mascot';

# Reviewing AI-Generated Code
<Mascot src={require('./img/slug_debug.png').default} />

AI-generated code needs the same scrutiny as human-written code — sometimes more.

## What to Check

### Correctness
- Does it handle edge cases (empty inputs, nulls, boundaries)?
- Are error paths handled properly?
- Does it match the actual requirements, not just the prompt?

### Security
- No hardcoded secrets or credentials
- Input validation on all external data
- No SQL injection, XSS, or command injection vulnerabilities

### Performance
- No unnecessary loops or redundant operations
- Appropriate data structures for the use case
- Database queries are efficient (watch for N+1 problems)

### Maintainability
- Code is readable and follows project conventions
- No over-engineering or unnecessary abstractions
- Dependencies are justified and well-maintained

## Common AI Code Pitfalls

- **Hallucinated APIs** — The AI may use functions or methods that don't exist
- **Outdated patterns** — Generated code may use deprecated libraries or syntax
- **Over-engineering** — AI tends to add more abstraction than needed
- **Missing error handling** — Happy path code without proper error recovery
- **Incorrect imports** — Package names or import paths may be wrong

## Review Checklist

- [ ] Code compiles and runs without errors
- [ ] All tests pass (including new tests for new code)
- [ ] No security vulnerabilities introduced
- [ ] Follows existing project conventions
- [ ] Dependencies are appropriate and up to date
- [ ] Edge cases are handled

For broader operational safeguards, see [Safety and Risk Management](/best-practices/safety-and-risk).
