---
sidebar_position: 1
---
import Mascot from '@site/src/components/Mascot';

# Exercises
<Mascot src={require('./img/slug_homework.png').default} />

The exercise is designed to practice specific techniques from the documentation sections. You'll alternate between writing prompts, reviewing AI output, running tests, and committing your work. Just like a real development workflow.

## How the Exercises Work

Each exercise follows a progressive structure:

1. **You get a starting point** — a problem description and some starter code
2. **You build the rest with AI** — using the prompting, review, and workflow techniques described in the documentation
3. **Each task maps to a documentation section** — so you can reference the concepts as you go
4. **Solutions are provided** — including recommended prompts, expected code, and self-assessment criteria

The exercise tasks emphasize **test-driven development**: you write tests first with AI help, then implement code to make them pass. This mirrors how experienced developers use AI tools in practice.

## How to Track Progress

For each task in an exercise, check:

- **Time box** - expected duration so you know when to move on
- **Success checkpoint** - the observable result that proves task completion
- **Failure signals** - common signs that your prompt or implementation needs revision

## Prerequisites

- **Python 3.10+** installed
- **An AI coding tool** set up and working (Claude Code, Codex, Gemini, GitHub Copilot, or similar)
- **git** installed and basic familiarity with version control
- **uv** package manager ([install instructions](https://docs.astral.sh/uv/getting-started/installation/)) or your favourite Python package manager

## Available Exercises

| Exercise | Difficulty | Topics Practiced |
|----------|-----------|-----------------|
| [FizzBuzz ML exercise](fizzbuzz-ml-exercise) | Intermediate | TDD(test-driven development), prompt engineering, PyTorch, agentic workflows, project context |
