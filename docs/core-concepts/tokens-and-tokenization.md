---
sidebar_position: 1
---

import Mascot from '@site/src/components/Mascot';

# Tokens and Tokenization

<Mascot src={require('./img/slug_token.png').default} />

Tokens are the fundamental unit that language models operate on. Everything you send to a model and everything it sends back is measured in tokens.

## What is a token?

A **token** is a chunk of text that the model's **tokenizer** has learned to treat as a single unit. In English prose, a token is roughly 4 characters or about three-quarters of a word.

Common words like "the" or "function" are usually a single token. Less common words get split into multiple tokens. Code tokenizes differently from prose: variable names, operators, and whitespace are treated differently by each tokenizer.

Some examples to build intuition:

- `hello` → 1 token
- `indistinguishable` → 4 tokens
- `function getData()` → 3–4 tokens (depending on the tokenizer)
- `console.log("Hello, world!")` → ~7 tokens

The exact tokenization depends on which model you're using. Claude, GPT, and Gemini all use different tokenizers, so the same text produces different token counts across models.

## How tokenization works

Many modern language models use subword tokenization methods such as **BPE** or **SentencePiece/Unigram** variants. During tokenizer training, frequent character or subword patterns are merged into reusable token units, so common words often stay whole while rarer strings split into smaller pieces.

This is why you'll sometimes see strange splits. A tokenizer trained mostly on English text will handle `function` as one token but might split a variable name like `getUserAccountBalance` into several pieces (`get`, `User`, `Account`, `Balance`). Code-specialized tokenizers are trained on more source code, so they handle programming patterns more efficiently.

You don't need to memorize how any specific tokenizer works. The key takeaway is that **different content produces different token counts**, and code tends to use more tokens per character than prose.

## Why tokens matter for cost

API pricing is measured in tokens. You pay separately for **input tokens** (what you send to the model) and **output tokens** (what the model generates back). For many current flagship model APIs, output tokens cost more than input tokens (often several times higher), but the exact ratio varies by provider and model tier.

A practical example: if you send a 200-line file (~4,000 characters) to Claude Sonnet for review, that's roughly 1,000 input tokens. If the model responds with a detailed review of about 800 words, that's roughly another 1,000 output tokens. At typical pricing, the output costs significantly more than the input.

For detailed pricing across models, see the [pricing table in the Context Window doc](./context-window.md#context-window-limit-for-popular-models).

This has real implications for how you use AI coding tools:

- **Sending entire files when you only need help with one function wastes input tokens**
- **Asking the model to rewrite entire files when a targeted edit would suffice wastes output tokens**
- **Multi-turn conversations accumulate tokens quickly** because every previous message is re-sent with each request

## Why tokens matter for context

The [context window](./context-window.md) (think of it as the model's "working memory") is measured in tokens. A 200k-token context window doesn't mean 200,000 words. For code, a rough rule of thumb is:

- **1,000 tokens ≈ 40–60 lines of code** (depending on line length and language)
- **A 200k-token context window ≈ 8,000–12,000 lines of code** at most, and that's before accounting for system prompts, tool definitions, and conversation history

This means that even with large context windows, you can fill them up faster than you would expect during a coding session. Understanding tokens helps you predict when you'll hit context limits and plan accordingly.

## Practical tips

- **Be reasonably concise in your prompts** - send the relevant code snippet, not the entire file, when asking for help with a specific function
- **Structured formats are token-heavy** - JSON, XML, and markdown tables consume more tokens than plain text for the same information. Use them when they add clarity, but be aware of the cost
- **Code comments and whitespace count** - heavily commented code or code with excessive blank lines uses more tokens than you might expect
- **Check token counts when cost matters** - most API dashboards show token usage per request, and tools like Claude Code show context window consumption in real time
- **Different languages tokenize differently** - verbose languages like Java tend to use more tokens per line than concise ones like Python

<p><small>Sources: <a href="https://platform.openai.com/tokenizer">OpenAI tokenizer reference</a>, <a href="https://cookbook.openai.com/examples/how_to_count_tokens_with_tiktoken">OpenAI token counting with tiktoken</a>, <a href="https://github.com/google/sentencepiece">SentencePiece</a>, <a href="https://platform.openai.com/pricing">OpenAI pricing</a>, <a href="https://www.anthropic.com/pricing">Anthropic pricing</a></small></p>
