---
sidebar_position: 2
---

import Mascot from '@site/src/components/Mascot';

# Temperature and Sampling

<Mascot src={require('./img/slug_thermo.png').default} />

Language models don't retrieve pre-written answers. They **generate** text one token at a time, choosing each token based on a probability distribution. The parameters that control how the model makes these choices (temperature, top-p, and top-k) directly affect the quality and consistency of the code you get back.

## How models generate text

When a model processes your prompt, it produces a probability distribution over its entire vocabulary for the next token. For example, given the prompt `def calculate_`, the model might assign certain probability for next token(word):

- `total` → 18% probability
- `sum` → 12% probability
- `area` → 9% probability
- `average` → 7% probability
- thousands of other tokens with smaller probabilities

The model then **samples** from this distribution to pick the next token. This is why the same prompt can produce different outputs each time. **The model doesn't always pick the most likely token**.

The sampling parameters let you control how these choices are made.

## Temperature

**Temperature** controls how spread out or concentrated the probability distribution is before sampling.

- **Temperature = 0** - the model always picks the most probable token (deterministic, greedy decoding). This gives you the most predictable, consistent output
- **Temperature = 0.5** - the distribution is moderately concentrated. High-probability tokens are still favored, but there's some variety
- **Temperature = 1.0** - the raw probabilities are used as-is. More diverse, sometimes surprising output
- **Temperature > 1.0** - the distribution is flattened. Even low-probability tokens get a real chance of being picked. Output becomes increasingly random

For coding tasks, lower temperatures almost always produce better results. You want the model to pick the most likely (and usually most correct) completion, not a creative one.

| Task | Recommended temperature | Why |
|------|------------------------|-----|
| Code generation | 0 | Consistency and correctness matter most |
| Bug fixing | 0 | You want the most probable fix |
| Code review | 0–0.3 | Slight variation can surface different issues |
| Documentation | 0.3–0.5 | Some natural language variety is fine |
| Brainstorming | 0.7–1.0 | You want diverse ideas |
| Creative writing | 0.8–1.0 | Variety and surprise are the point |

<p><small>The temperature recommendations are based on the author's experience. Research such as <a href="https://arxiv.org/pdf/2402.05201">this study</a> broadly supports this direction.</small></p>

## Top-p (nucleus sampling)

**Top-p** (also called **nucleus sampling**) is an alternative way to control randomness. Instead of adjusting the distribution shape, it limits which tokens the model can choose from.

With top-p = 0.9, the model considers only the smallest set of tokens whose combined probability is at least 90%, and samples from that subset. This cuts off the long tail of unlikely tokens while preserving natural variation among the likely ones.

In practice, you rarely need to adjust both temperature and top-p. For coding tasks, setting temperature to 0 makes top-p irrelevant (the model always picks the single most probable token). If you're using a higher temperature for non-code tasks, leaving top-p at its default (usually 0.95 or 1.0) is generally fine.

## Top-k

**Top-k** is simpler: the model only considers the top k most probable tokens and samples from those. For example, top-k = 40 means the model picks from the 40 most likely next tokens.

Top-k is less commonly used than temperature or top-p, and most coding-focused tools don't expose it. You can safely ignore it for most use cases.

## Putting it together: API parameters

When you call a model API directly, you control these parameters in your request. Here's what a typical coding-focused request looks like:

```python
# Anthropic API
import anthropic

client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=4096,
    temperature=0,        # deterministic for code
    messages=[
        {"role": "user", "content": "Write a Python function to merge two sorted lists."}
    ]
)
```

```javascript
// OpenAI API
import OpenAI from "openai";

const openai = new OpenAI();
const response = await openai.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 4096,
    temperature: 0,       // deterministic for code
    messages: [
        { role: "user", content: "Write a Python function to merge two sorted lists." }
    ]
});
```

Note that `max_tokens` (or `max_output_tokens`) controls response length, not randomness. It's separate from sampling parameters. Setting it too low can truncate code.

## Practical tips

- **Default to temperature 0 for code** - consistency and correctness matter more than creativity for almost all coding tasks
- **Prompt quality matters more than temperature** - a well-written prompt at temperature 0 will outperform a vague prompt at any temperature. Invest your time in better prompts, not tuning sampling parameters
- **Most coding tools handle this for you** - Claude Code, Cursor, and Copilot all set appropriate temperatures internally. You only need to think about this when using the API directly
- **Use temperature 0 for reproducibility** - if you're building automated pipelines or evaluations, temperature 0 ensures you get the same output for the same input
- **Don't combine temperature and top-p adjustments** - pick one knob to turn. Adjusting both at once makes it hard to reason about the behavior

## When this guidance may not apply

- Some providers ignore or constrain sampling parameters for specific model families or modes
- For brainstorming and alternative designs, higher temperature can be more useful than strict determinism
- In production pipelines that need consistency and diversity, you may intentionally use controlled randomness with post-validation
