---
sidebar_position: 4
---

import Mascot from '@site/src/components/Mascot';

# System Prompts and Roles

<Mascot src={require('./img/slug_system_prompt.png').default} />

Every message you send to a language model has a **role** attached to it. These roles are system, user, and assistant. These roles tell the model how to interpret each piece of the conversation. Understanding this structure is essential for getting reliable results from AI coding tools, and it's the foundation of how tools like Claude Code and Cursor work behind the scenes.

## The message structure

When you interact with a model through an API, your request isn't a single block of text. It's a structured list of messages, each with a role:

```json
{
  "system": "You are a senior Python developer. Write clean, well-tested code.",
  "messages": [
    { "role": "user", "content": "Write a function to validate email addresses." },
    { "role": "assistant", "content": "Here's a function that validates..." },
    { "role": "user", "content": "Can you add support for subdomains?" }
  ]
}
```

The model sees **all** of these messages at once, it doesn't process them one at a time. The roles tell it which parts are instructions, which parts are the human's input, and which parts are its own previous responses.

## System prompts

The **system prompt** is a special message that sets the model's behavior for the entire conversation. It gets elevated attention from the model i.e instructions in the system prompt are weighted more heavily than the same instructions placed in a user message.

Every AI coding tool uses a system prompt, whether you see it or not. When you open Claude Code, it injects a system prompt that tells the model to behave like a coding assistant, what tools it has access to, and how to format its responses.

### What goes in a system prompt

- **Persona and expertise** - "You are a senior developer specializing in TypeScript and React"
- **Format constraints** - "Always include type annotations" or "Use JSDoc comments"
- **Behavioral rules** - "Never modify files without asking first" or "Always explain your reasoning"
- **Project context** - relevant architecture decisions, coding standards, framework versions
- **Configuration files** - tools like Claude Code read `CLAUDE.md` files and Cursor reads `.cursorrules` files, injecting their contents into the system prompt automatically

### Writing effective system prompts

When you're building your own tools or customizing existing ones, these principles apply:

- **Be specific** - "Write Python 3.12+ code using type hints and dataclasses" beats "write good Python code"
- **Put important things first** - models pay more attention to the beginning of the system prompt. Lead with your most critical instructions
- **Use structured formatting** - bullet lists and clear sections are easier for the model to parse than dense paragraphs
- **Keep it concise** - system prompts consume [tokens](./tokens-and-tokenization.md) from the [context window](./context-window.md) on every request. A 2,000-token system prompt is fine; a 10,000-token one starts eating into useful context

## User and assistant messages

**User messages** represent human input. In a coding tool, this is your prompt - the question you ask or the instruction you give.

**Assistant messages** represent the model's previous responses. In a multi-turn conversation, these are included so the model has context about what it already said and did.

An important detail: because models are [stateless](./context-window.md#why-previous-messages-stay-in-the-context-window), every request re-sends the entire conversation history. The model doesn't "remember" previous turns it re-reads them. This means user and assistant messages accumulate in the context window with each exchange.

**Assistant prefilling** is a technique where you start the assistant's response with specific text, nudging the model to continue in a particular direction. For example, you might prefill with ` ```python\n` to ensure the model responds with a Python code block. This is an API-level technique you won't typically use it in coding tools directly, but it's happening behind the scenes.

## Roles in practice: how coding tools use them

### Claude Code

Claude Code constructs a detailed system prompt that includes:

- Base instructions defining behavior and capabilities
- Available [tool definitions](./tool-use-and-agentic-coding.md) (file read/write, bash, search, etc.)
- Contents of `CLAUDE.md` files found in your project
- Project-specific context

When you type a message, it becomes a user message. Claude's response is an assistant message. Tool calls and their results are woven into the conversation as additional messages, all building up in the context window.

### Cursor and Copilot

Cursor uses a similar structure but with different system prompts depending on the mode (normal chat vs. agent mode). It also reads `.cursorrules` files for project-specific instructions.

Copilot operates differently for inline completions, it uses the surrounding code as context rather than explicit message roles. But for Copilot Chat, it follows the standard system/user/assistant pattern.

### Custom API usage

When building your own tools, you have full control over the message structure. A common pattern for a code review tool:

```python
messages = [
    {
        "role": "user",
        "content": f"Review this code for bugs and security issues:\n\n```python\n{code}\n```"
    }
]

response = client.messages.create(
    model="claude-sonnet-4-20250514",
    system="You are a code reviewer. Focus on correctness, security, and performance. "
           "Flag any issues with severity (critical, warning, info). "
           "Do not suggest style changes unless they affect readability.",
    max_tokens=4096,
    temperature=0,
    messages=messages
)
```

## Practical tips

- **Keep system prompts concise and focused** - every token in your system prompt is sent with every request. Remove anything that isn't actively improving the model's behavior
- **Version-control your system prompts** - treat `CLAUDE.md` and `.cursorrules` like any other project configuration. Review changes, keep them up to date, and remove stale instructions
- **Check system prompt placement when the model ignores instructions** - if the model isn't following a rule, make sure the instruction is in the system prompt (not buried in a user message from 20 turns ago). System prompt instructions persist; user message instructions can get lost to [autocompaction](./context-window.md#autocompaction)
- **Don't duplicate tool-injected context** - if your coding tool already injects project context via CLAUDE.md, don't also paste the same information into your prompts
- **Use the right role for the job** - persistent rules go in the system prompt; task-specific instructions go in user messages. Mixing these up leads to unpredictable behavior
