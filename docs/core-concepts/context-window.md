import ModelPricingTable from '@site/src/components/ModelPricingTable';

# Context Window

The **context window** is the total amount of text (measured in tokens) that a language model can process in a single request. It includes everything: your input, the model's previous responses, system instructions, and any other context. Think of it as the model's working memory — everything it can "see" when generating a response.

## How a single request works

When you send a message to a model, your input is tokenized (broken into small chunks called tokens) and placed into the context window. The model processes these tokens and generates a response, which also consumes tokens from the context window.


![A single input-output exchange](./img/context_window_1.svg)


In this example, the input `"some text"` takes up 2 tokens and the model produces `"some response"` using another 2 tokens. The context window (shown on the right) tracks what the model has seen so far.

## Why previous messages stay in the context window

Language models are **stateless** — they don't remember previous conversations on their own. To maintain a coherent multi-turn conversation, every previous message (both your inputs and the model's responses) must be sent back as part of the next request. This means the context window fills up with each exchange.


![A multi-turn conversation showing accumulated tokens](./img/context_window_2.svg)


Here, the second request includes the original input and response *plus* the new follow-up message. The context window now holds 11 tokens (2 + 2 + 3 + 4). As the conversation grows longer, more of the context window is consumed.

This is why long conversations can eventually hit the context limit — the model simply runs out of space to hold all the previous exchanges plus generate a new response.

## Context window in practice

Tools like Claude Code show you exactly how the context window is being used. The breakdown typically includes:

- **System prompt** — instructions that define the model's behavior
- **System tools** — tool definitions available to the model
- **Messages** — the actual conversation history (inputs + outputs)
- **Free space** — remaining capacity for new messages and responses
<div style={{maxWidth: '600px', margin: '0 auto'}}>
    ![Claude Code context](./img/context_window_3.png)
    <p><small>Source: Output of <code>/contex</code> command in Claude Code v2.1.52</small></p>
</div>


When the context window fills up, the system must either compress older messages, drop them, or start a new conversation. Understanding this helps you write more efficient prompts and manage longer coding sessions.

## Context window limit for popular models

Different models offer different context window sizes and pricing. Larger context windows allow for longer conversations and more code to be analyzed at once, but typically cost more per million token.

<ModelPricingTable />
