---
sidebar_position: 1
---

import Mascot from '@site/src/components/Mascot';

# AI Coding Tools Overview

<Mascot src={require('./img/slug_clipboard.png').default} />

A quick look at the most popular AI coding assistants available.

> Last reviewed: February 26, 2026. Tool names, links, and product capabilities can change quickly.

## API Platforms

| Platform | Description |
|----------|-------------|
| [**Anthropic API**](https://docs.anthropic.com/en/api/getting-started) | Access to Claude models for building AI-powered coding tools and applications |
| [**OpenAI API**](https://platform.openai.com/docs) | Access to GPT and Codex models for code generation, editing, and analysis |
| [**Google Gemini API**](https://ai.google.dev/docs) | Access to Gemini models for building generative AI coding applications |
| [**Blablador**](https://sdlaml.pages.jsc.fz-juelich.de/ai/guides/blablador_api_access/) | Access to models hosted by Blablador for building generative AI coding applications |

<p><small>Not all models hosted by Blablador are trained by [JSC](https://www.fz-juelich.de/en/jsc), you can check the model details to look for the ones trained by [JSC AI team](https://sdlaml.pages.jsc.fz-juelich.de/ai/)</small></p>

Using API for coding purposes is okay however coding oriented models and tools more suited for this job since they offer:

- A strong default instruction scaffold (coding-focused behavior).
- Tool loop: run shell commands, read/write files, test, retry.
- Repo/context loading (files, diffs, diagnostics) before each call.
- Safety controls (sandboxing, approvals, blocked commands).
- Structured output expectations (patches, commit-ready edits).

## CLI Tools

| Tool | Description |
|------|-------------|
| [**Claude Code**](https://docs.anthropic.com/en/docs/claude-code/overview) | Anthropic's CLI agent for code generation, debugging, and refactoring |
| [**OpenAI Codex CLI**](https://github.com/openai/codex) | OpenAI's terminal coding agent for editing, running, and reviewing code |
| [**Gemini CLI**](https://github.com/google-gemini/gemini-cli) | Google's command-line coding assistant for repo-aware development workflows |
| [**GitHub Copilot CLI**](https://github.com/github/copilot-cli) | Archived project (historical reference only; prefer current Copilot Chat/agent workflows) |
| [**OpenCode**](https://opencode.ai/) | OpenSource AI coding assistant for code generation, debugging, and refactoring |

<p><small>Use opencode for Blablador models https://sdlaml.pages.jsc.fz-juelich.de/ai/guides/blablador_opencode</small></p>

## IDE Extensions

| Tool | Description |
|------|-------------|
| [**GitHub Copilot**](https://github.com/features/copilot) | Inline code completions for VS Code, JetBrains, and more |
| [**Gemini Code Assist**](https://codeassist.google/) | Google's AI coding assistant for IDEs with code completion and chat |
| [**Cursor**](https://cursor.com/) | AI-first code editor built on VS Code |
| [**Windsurf**](https://windsurf.com/) | AI-powered IDE by Codeium |

<p><small>Use VsCode extension for Blablador models https://sdlaml.pages.jsc.fz-juelich.de/ai/guides/blablador_on_vscode</small></p>

## Chat-Based Assistants

| Tool | Description |
|------|-------------|
| [**Claude (Anthropic)**](https://claude.ai/) | General-purpose AI assistant with strong coding, analysis, and reasoning capabilities |
| [**ChatGPT (OpenAI)**](https://chatgpt.com/) | General-purpose AI assistant commonly used for code generation, debugging, and design help |
| [**Gemini (Google)**](https://gemini.google.com/) | General-purpose AI assistant useful for coding support, explanations, and refactoring ideas |
| [**Jan.ai**](https://www.jan.ai/) | General-purpose AI assistant with strong coding, analysis, and reasoning capabilities |

<p><small>Use jan.ai for Blablador models https://sdlaml.pages.jsc.fz-juelich.de/ai/guides/blablador_on_janai</small></p>

<p><small>Sources: <a href="https://docs.anthropic.com/en/docs/claude-code/overview">Claude Code overview</a>, <a href="https://github.com/openai/codex">OpenAI Codex</a>, <a href="https://github.com/google-gemini/gemini-cli">Gemini CLI</a>, <a href="https://github.com/github/copilot-cli">GitHub Copilot CLI (archived)</a></small></p>
