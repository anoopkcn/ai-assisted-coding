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
app/middleware/auth.py and create a similar middleware
in app/middleware/rate_limit.py that limits requests per IP.
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

## Use a Complex Prompt Blueprint

For harder tasks, a consistent structure performs better than ad-hoc prompts. A strong blueprint:

1. **Task context** (role + goal)
2. **Tone/context** (optional)
3. **Detailed rules** (must/must-not)
4. **Examples** (especially edge cases)
5. **Input data** (in explicit tags)
6. **Immediate task** (what to do now)
7. **Think step-by-step instruction** (when task is multi-stage)
8. **Output format contract**
9. **Optional prefill**

Use more elements first to get reliability, then remove what is unnecessary.

## Ground Answers in Real Files

Reduce hallucinations by requiring concrete file references:

```
Only use APIs and modules that already exist in this repository.
List exact files/functions you used as references.
If something is missing, state it explicitly instead of inventing it.
```

## Reduce Hallucinations with Evidence-First Prompts

For long documents or policy/code context, ask for evidence extraction before final answer:

```text
First extract the most relevant quotes in <evidence></evidence>.
Then answer only using that evidence.
If evidence is insufficient, explicitly say "insufficient evidence".
```

This pattern is usually stronger than "just answer the question."

## Request Tests Alongside Code

```
Write a function to parse CSV files with custom delimiters,
and include unit tests covering: empty files, files with headers
only, malformed rows, and unicode content.
```

## Multi-File Changes

When a change spans multiple files, describe the full scope:

```
Add a "last_login" timestamp to the User SQLAlchemy model. This will need:
- An Alembic migration
- Updated model definition in app/models/user.py
- Changes to the login route handler to record the timestamp
- Updated Pydantic response schema to include the field
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

## Use Few-Shot for Output Stability

When formatting matters, examples often beat verbose instructions:

```text
Classify each ticket as A/B/C.

Examples:
Input: "Cannot login after reset"
Output: <answer>A</answer>

Input: "Request for invoice copy"
Output: <answer>C</answer>
```

Include examples for common failure modes, not only happy paths.

## Chain Prompts for Better Quality

For complex writing/reasoning tasks, run staged prompts:

1. Draft
2. Critique (against a checklist)
3. Revise

Prompt chaining gives you control points and makes failures easier to debug.

## Evaluate Prompt Changes with a Small Test Set

Treat prompts like code: regression-test them.

1. Build 10-30 representative inputs
2. Define expected outputs or a scoring rubric
3. Compare old vs new prompt
4. Track pass rate and failure modes

Use code-based checks where possible; use rubric/model grading for subjective tasks.

<p><small>Sources: <a href="https://platform.openai.com/docs/guides/prompt-engineering">OpenAI prompt engineering guide</a>, <a href="https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview">Anthropic prompt engineering overview</a>, <a href="https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags">Anthropic: XML tags</a>, <a href="https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/chain-prompts">Anthropic: Prompt chaining</a>, <a href="https://arxiv.org/abs/2201.11903">Chain-of-Thought Prompting Elicits Reasoning in Large Language Models</a>, <a href="https://github.com/anthropics/prompt-eng-interactive-tutorial">prompt-eng-interactive-tutorial</a></small></p>
