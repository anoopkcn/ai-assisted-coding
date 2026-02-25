---
sidebar_position: 2
---

# FizzBuzz ML exercise

Build a supervised machine learning algorithm that learns to predict FizzBuzz from integers.  Use an AI agent to help you every step of the way.

**Example of a fizzbuzz sequence: 1, 2, fizz, 4, buzz, fizz, 7, 8, fizz, buzz, 11, fizz, 13, 14, fizzbuzz, 16**

Numbers that are divisible by 3 is 'fizz', numbers that are divisible by 5 is 'buzz', and numbers that are divisible by both 3 and 5 is 'fizzbuzz'.

## Overview

You start with a classic FizzBuzz function and some data generation code. Your job is to use AI assistance to build a complete [PyTorch](https://pytorch.org/) neural network that learns the FizzBuzz pattern from examples. Along the way you'll practice test-driven development, prompt engineering, code review, and agentic workflows.

## What You Start With

The problem description and non-ML starter code — nothing else:

```python
# FizzBuzz: For numbers 1 to N:
#   - divisible by 3 → "fizz"
#   - divisible by 5 → "buzz"
#   - divisible by both → "fizzbuzz"
#   - otherwise → the number as a string

def fizzbuzz(number):
    fizz = (number % 3) == 0
    buzz = (number % 5) == 0
    if fizz and buzz:
        return 'fizzbuzz'
    elif fizz:
        return 'fizz'
    elif buzz:
        return 'buzz'
    else:
        return str(number)

# Data generation
import random
import pandas as pd

numbers = random.sample(range(1, 1_000_000), 200_000)
examples = pd.DataFrame(
    [(n, fizzbuzz(n)) for n in numbers],
    columns=['n', 'fizzbuzz']
)
```

You must use AI to build everything else: feature engineering, model training (PyTorch), evaluation, serialization, and tests.

## Learning Objectives

After completing this exercise, you will have learned:

- Using AI to understand a problem and plan an ML approach
- Writing effective prompts that produce actionable AI output
- **Test-driven development** with AI assistance (write tests first, then implement)
- Building a PyTorch neural network with AI guidance
- Conducting AI-assisted code review
- Iterating incrementally with version control discipline
- Running multi-step agentic workflows
- Configuring project context (`CLAUDE.md` and/or `AGENTS.md`) to guide AI behavior

---

## Task 0: Set Up the Project Environment

**Objective:** Create a Python environment using `uv`, initialize a git repo, and write a `CLAUDE.md` file.

**Steps:**
1. Install `uv` if not already installed
2. Create a new project directory and init git
3. Create a virtual environment with `uv`
4. Install base dependencies: `torch`, `pandas`, `pytest`
5. Create `CLAUDE.md` with instructions for the AI agent
6. Commit the initial setup

<details>
<summary>Solution — Environment setup</summary>

```bash
mkdir fizzbuzz-ml && cd fizzbuzz-ml
git init
uv init
uv add torch pandas pytest
```

</details>

<details>
<summary>Solution — CLAUDE.md</summary>

```markdown
# FizzBuzz ML Project

## Environment
This project uses a uv-managed Python environment.
Always run Python code using `uv run`:

- Run scripts: `uv run python <script.py>`
- Run tests: `uv run pytest`
- Run a module: `uv run python -m <module>`

Never use bare `python` or `pip` commands.

## Project Structure
- `fizzbuzz.py` — Main FizzBuzz ML pipeline
- `tests/` — Test directory (pytest)
```

</details>

**Why this matters:** The CLAUDE.md ensures the AI agent always executes code inside the managed environment. Without it, the agent may use the system Python and miss dependencies. This practices [System Prompts and Roles](/core-concepts/system-prompts-and-roles) — you're shaping AI behavior through project-level instructions.

**Practices:** [System Prompts and Roles](/core-concepts/system-prompts-and-roles)

---

## Task 1: Understand the Problem and Plan

**Objective:** Use AI to understand the FizzBuzz ML problem and plan the approach. Do not write implementation code yet.

**Prompt guidance — ask the AI to plan:**

```text
I have a FizzBuzz function and 200K labeled examples.
I want to train a neural network in PyTorch that learns
to predict fizz/buzz/fizzbuzz/number from an integer input.

Before writing any code, help me plan:
1. What feature engineering is needed? Why can't we feed
   raw integers directly to a neural network?
2. What should the network architecture look like?
3. How should we encode the labels?
4. What metrics should we use to evaluate?
5. What's a reasonable train/test split?
```

<details>
<summary>Solution — what the AI should cover</summary>

- **Binary encoding** of integers (e.g., 20-bit) as input features — raw integers create an ordinal relationship that doesn't reflect the modular arithmetic of FizzBuzz
- A simple **feedforward network** (2–3 hidden layers, ReLU activations)
- Labels encoded as **4 classes**: fizz, buzz, fizzbuzz, number (classification, not regression)
- **Accuracy per class** + overall accuracy, confusion matrix
- **80/20 train/test split** with stratification (since "fizzbuzz" is rarest at ~7%)

</details>

**Anti-pattern:**

```text
Write a PyTorch model for FizzBuzz.
```

Too vague — skips the planning phase entirely and you lose the opportunity to understand design decisions.

**What to look for:** Can you explain *why* binary encoding is necessary before seeing any implementation?

**Practices:** [Prompt Engineering Basics](/category/prompt-engineering) (be specific, break down tasks), [Advanced Techniques](/prompt-engineering/advanced-techniques) (two-pass workflow: plan first)

---

## Task 2: Write Tests First (TDD)

**Objective:** Before implementing any ML code, use AI to write tests that define what "done" looks like.

**Prompt guidance:**

```text
I'm going to build a FizzBuzz ML pipeline. Before writing
any implementation, help me write pytest tests for:

1. Feature engineering:
   - `encode_number(n, n_bits=20)` → returns a list of 0s and 1s
   - Length should equal n_bits
   - Known values: encode_number(0) → all zeros,
     encode_number(1) → [..., 0, 1]

2. Data preparation:
   - `prepare_dataset(numbers)` → returns (features_tensor, labels_tensor)
   - Features shape: (len(numbers), n_bits)
   - Labels should be integers 0-3 mapping to fizz/buzz/fizzbuzz/number

3. Model:
   - `FizzBuzzNet(n_bits)` → a nn.Module that accepts (batch, n_bits) input
   - Output shape: (batch, 4) for 4 classes

4. Prediction:
   - `predict(model, number)` → returns one of "fizz", "buzz", "fizzbuzz", or str(number)

Use pytest. Tests should be runnable with `uv run pytest`.
```

<details>
<summary>Solution — tests/test_fizzbuzz_ml.py</summary>

```python
import torch
import pytest


def test_encode_number_length():
    from fizzbuzz_ml import encode_number
    result = encode_number(42, n_bits=20)
    assert len(result) == 20
    assert all(b in (0, 1) for b in result)


def test_encode_number_zero():
    from fizzbuzz_ml import encode_number
    result = encode_number(0, n_bits=20)
    assert result == [0] * 20


def test_encode_number_one():
    from fizzbuzz_ml import encode_number
    result = encode_number(1, n_bits=20)
    assert result[-1] == 1
    assert sum(result) == 1


def test_encode_number_roundtrip():
    from fizzbuzz_ml import encode_number
    for n in [0, 1, 15, 255, 1023]:
        bits = encode_number(n, n_bits=20)
        reconstructed = int("".join(str(b) for b in bits), 2)
        assert reconstructed == n


def test_prepare_dataset_shapes():
    from fizzbuzz_ml import prepare_dataset
    features, labels = prepare_dataset([1, 2, 3, 5, 15])
    assert features.shape == (5, 20)
    assert labels.shape == (5,)
    assert features.dtype == torch.float32
    assert labels.dtype == torch.long


def test_prepare_dataset_labels():
    from fizzbuzz_ml import prepare_dataset, LABEL_MAP
    _, labels = prepare_dataset([3, 5, 15, 7])
    # 3→fizz, 5→buzz, 15→fizzbuzz, 7→number
    assert labels[0].item() == LABEL_MAP["fizz"]
    assert labels[1].item() == LABEL_MAP["buzz"]
    assert labels[2].item() == LABEL_MAP["fizzbuzz"]
    assert labels[3].item() == LABEL_MAP["number"]


def test_model_output_shape():
    from fizzbuzz_ml import FizzBuzzNet
    model = FizzBuzzNet(n_bits=20)
    x = torch.zeros(8, 20)
    output = model(x)
    assert output.shape == (8, 4)


def test_predict_returns_valid_string():
    from fizzbuzz_ml import FizzBuzzNet, predict
    model = FizzBuzzNet(n_bits=20)
    result = predict(model, 15)
    assert result in ("fizz", "buzz", "fizzbuzz", "15")
```

</details>

**Commit:** `git add tests/ && git commit -m "Add tests for FizzBuzz ML pipeline"`

**Key point:** All tests should **fail** at this point — the `fizzbuzz_ml` module doesn't exist yet. That's the point of TDD.

**Practices:** [Prompt Engineering Basics](/prompt-engineering/basics) (define "done" clearly), [Workflow Tips](/best-practices/workflow-tips) (incremental changes, version control)

---

## Task 3: Implement Feature Engineering (Make Tests Pass)

**Objective:** Use AI to implement `encode_number` and `prepare_dataset` so the first group of tests pass.

**Prompt guidance:**

```text
I have these failing tests (show test code). Implement the
functions in fizzbuzz_ml.py to make them pass:

1. encode_number(n, n_bits=20) → list of ints (binary encoding)
2. prepare_dataset(numbers) → (features_tensor, labels_tensor)
   - Use the fizzbuzz() function to generate labels
   - Map labels to integers via LABEL_MAP
   - Return torch tensors

Use the existing fizzbuzz() function for labeling.
Run `uv run pytest tests/test_fizzbuzz_ml.py -k "encode or prepare"` to verify.
```

<details>
<summary>Solution — fizzbuzz_ml.py (partial)</summary>

```python
import torch
import random
import pandas as pd

LABEL_MAP = {"fizz": 0, "buzz": 1, "fizzbuzz": 2, "number": 3}
INDEX_TO_LABEL = {v: k for k, v in LABEL_MAP.items()}
N_BITS = 20


def fizzbuzz(number):
    fizz = (number % 3) == 0
    buzz = (number % 5) == 0
    if fizz and buzz:
        return "fizzbuzz"
    elif fizz:
        return "fizz"
    elif buzz:
        return "buzz"
    else:
        return str(number)


def encode_number(n, n_bits=N_BITS):
    return [int(b) for b in format(n, "b").zfill(n_bits)]


def prepare_dataset(numbers, n_bits=N_BITS):
    features = [encode_number(n, n_bits) for n in numbers]
    labels = []
    for n in numbers:
        fb = fizzbuzz(n)
        if fb == "fizzbuzz":
            labels.append(LABEL_MAP["fizzbuzz"])
        elif fb == "fizz":
            labels.append(LABEL_MAP["fizz"])
        elif fb == "buzz":
            labels.append(LABEL_MAP["buzz"])
        else:
            labels.append(LABEL_MAP["number"])
    return (
        torch.tensor(features, dtype=torch.float32),
        torch.tensor(labels, dtype=torch.long),
    )
```

</details>

**Verify:** `uv run pytest tests/test_fizzbuzz_ml.py -k "encode or prepare" -v`

**Commit after tests pass.**

**Practices:** [Prompt Engineering Basics](/prompt-engineering/basics) (provide context — the test code), [Reviewing AI-Generated Code](/best-practices/code-review) (check correctness)

---

## Task 4: Build and Train the PyTorch Model

**Objective:** Use AI to implement `FizzBuzzNet` and a training loop. Make the model tests pass, then train to a reasonable accuracy.

**Prompt guidance:**

```text
Implement a PyTorch neural network for FizzBuzz classification
in fizzbuzz_ml.py:

1. FizzBuzzNet(n_bits) — a nn.Module with:
   - Input: n_bits features
   - 2 hidden layers (128, 64 neurons), ReLU activation
   - Output: 4 classes
   - Include dropout (0.2) between layers

2. A train_model(model, features, labels, epochs=100, lr=0.01)
   function that:
   - Uses CrossEntropyLoss and Adam optimizer
   - Prints loss every 10 epochs
   - Returns the trained model

3. A predict(model, number) function that:
   - Encodes the number, runs it through the model
   - Returns "fizz", "buzz", "fizzbuzz", or str(number)

Run `uv run pytest` to verify the model tests pass.
```

<details>
<summary>Solution — model and training code (add to fizzbuzz_ml.py)</summary>

```python
import torch.nn as nn


class FizzBuzzNet(nn.Module):
    def __init__(self, n_bits=N_BITS):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(n_bits, 128),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(64, 4),
        )

    def forward(self, x):
        return self.net(x)


def train_model(model, features, labels, epochs=100, lr=0.01):
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=lr)
    model.train()
    for epoch in range(epochs):
        optimizer.zero_grad()
        output = model(features)
        loss = criterion(output, labels)
        loss.backward()
        optimizer.step()
        if (epoch + 1) % 10 == 0:
            print(f"Epoch {epoch+1}/{epochs}, Loss: {loss.item():.4f}")
    return model


def predict(model, number, n_bits=N_BITS):
    model.eval()
    with torch.no_grad():
        encoded = torch.tensor(
            [encode_number(number, n_bits)], dtype=torch.float32
        )
        output = model(encoded)
        idx = output.argmax(dim=1).item()
    label = INDEX_TO_LABEL[idx]
    return label if label != "number" else str(number)
```

</details>

<details>
<summary>Solution — additional test for training convergence (tests/test_training.py)</summary>

```python
def test_model_trains_and_improves():
    from fizzbuzz_ml import FizzBuzzNet, prepare_dataset, train_model
    import torch

    numbers = list(range(1, 1001))
    features, labels = prepare_dataset(numbers)
    model = FizzBuzzNet()

    # Loss before training
    model.eval()
    with torch.no_grad():
        before = torch.nn.CrossEntropyLoss()(model(features), labels).item()

    # Train
    train_model(model, features, labels, epochs=50, lr=0.01)

    # Loss after training should be significantly lower
    model.eval()
    with torch.no_grad():
        after = torch.nn.CrossEntropyLoss()(model(features), labels).item()

    assert after < before * 0.5, f"Loss didn't decrease enough: {before} -> {after}"
```

</details>

**Verify:** `uv run pytest -v`

**Commit after all tests pass.**

**Practices:** [Advanced Techniques](/prompt-engineering/advanced-techniques) (reference existing code, ask for explanations), [Tool Use and Agentic Coding](/core-concepts/tool-use-and-agentic-coding) (understanding how AI reads context)

---

## Task 5: Evaluate and Improve

**Objective:** Use AI to add proper evaluation: accuracy per class, confusion matrix, and comparison with the ground truth `fizzbuzz()` function.

**Prompt guidance:**

```text
Add evaluation to fizzbuzz_ml.py:

1. An evaluate(model, numbers) function that:
   - Compares predict(model, n) vs fizzbuzz(n) for all numbers
   - Returns a dict with: overall accuracy, per-class accuracy,
     and a confusion matrix (as a dict or pandas DataFrame)

2. Write a test that trains on range(1, 10_001), evaluates on
   range(10_001, 11_001), and asserts overall accuracy > 90%.

3. Add a __main__ block that:
   - Generates training data (range 1 to 100_000)
   - Trains the model
   - Evaluates on a held-out range (100_001 to 110_000)
   - Prints the full evaluation report
   - Saves the model with torch.save()

Run everything with `uv run python fizzbuzz_ml.py` and
`uv run pytest -v`.
```

<details>
<summary>Solution — evaluation code (add to fizzbuzz_ml.py)</summary>

```python
def evaluate(model, numbers):
    correct = 0
    total = len(numbers)
    class_correct = {k: 0 for k in LABEL_MAP}
    class_total = {k: 0 for k in LABEL_MAP}
    confusion = {true: {pred: 0 for pred in LABEL_MAP} for true in LABEL_MAP}

    for n in numbers:
        truth = fizzbuzz(n)
        truth_label = truth if truth in LABEL_MAP else "number"
        prediction = predict(model, n)
        pred_label = prediction if prediction in LABEL_MAP else "number"

        class_total[truth_label] += 1
        if truth == prediction:
            correct += 1
            class_correct[truth_label] += 1
        confusion[truth_label][pred_label] += 1

    return {
        "accuracy": correct / total,
        "per_class": {
            k: class_correct[k] / class_total[k] if class_total[k] > 0 else 0
            for k in LABEL_MAP
        },
        "confusion": confusion,
    }


if __name__ == "__main__":
    # Generate data
    train_numbers = list(range(1, 100_001))
    features, labels = prepare_dataset(train_numbers)

    # Train
    model = FizzBuzzNet()
    train_model(model, features, labels, epochs=200, lr=0.005)

    # Evaluate
    test_numbers = list(range(100_001, 110_001))
    results = evaluate(model, test_numbers)
    print(f"\nOverall accuracy: {results['accuracy']:.2%}")
    for cls, acc in results["per_class"].items():
        print(f"  {cls}: {acc:.2%}")

    # Save model
    torch.save(model.state_dict(), "fizzbuzz_model.pt")
    print("\nModel saved to fizzbuzz_model.pt")
```

</details>

**Commit after tests pass.**

**Practices:** [Reviewing AI-Generated Code](/best-practices/code-review) (check edge cases), [Workflow Tips](/best-practices/workflow-tips) (incremental changes)

---

## Task 6: Agentic Workflow (Advanced)

**Objective:** Use an AI agent in autonomous mode to perform a multi-step improvement. Commit all current work first.

**Prerequisites:** A tool with agentic capabilities (Claude Code, Cursor agent mode, or similar).

**Prompt guidance — give the agent a high-level goal:**

```text
Improve the FizzBuzz ML project:

1. Add hyperparameter experimentation — try different architectures
   (vary hidden sizes, number of layers, dropout rates) and report
   which configuration gives the best accuracy
2. Add a learning rate scheduler
3. Add proper logging (replace print statements)
4. Ensure all changes have corresponding tests
5. Update CLAUDE.md if the project structure changed

Read the existing code and tests first. Run tests after each change.
```

**What to observe:**
- Does the agent read files before editing?
- Does it run tests after each change?
- How does it handle test failures — does it fix them or get stuck in a loop?
- Does it update `CLAUDE.md` as instructed?

<details>
<summary>Bonus — Create a custom subagent</summary>

Create a custom subagent for ML code review (see [Subagents](/tools-workflows/subagents)):

```yaml
# .claude/agents/ml-reviewer/SKILL.md
---
name: ml-reviewer
description: Reviews ML code for best practices
tools: Read, Grep, Glob
model: sonnet
---
Review the ML script for:
1. Data leakage between train and test sets
2. Appropriate metrics for the task type
3. Reproducibility (random seeds, deterministic behavior)
4. Hyperparameter choices
```

</details>

**Practices:** [Tool Use and Agentic Coding](/core-concepts/tool-use-and-agentic-coding) (agentic loop), [Subagents](/tools-workflows/subagents), [Skills](/tools-workflows/skills)

---

## Reflection and Self-Assessment

After completing the exercise, consider these questions:

1. **Prompting effectiveness** — Which prompts gave you the best results? Which needed multiple iterations?
2. **TDD experience** — Did writing tests first change how you prompted the AI for implementation?
3. **Review quality** — Did you catch any issues in AI-generated code before running tests?
4. **Workflow discipline** — How often did you commit? Did small commits make it easier to debug problems?
5. **CLAUDE.md impact** — Did the AI agent respect the environment instructions? What happened when you removed them?
6. **Tool comparison** — If you tried multiple AI tools, how did their approaches differ?
