---
sidebar_position: 2
---

# Setting Up Your Environment

Get your AI coding tools configured and ready to use.

## Prerequisites

Before configuring individual tools, make sure you have:

- Accounts ready for providers you plan to use (Anthropic, OpenAI, Google, GitHub)

## Claude Code

1. Install the Claude Code CLI from official instructions
2. Authenticate with your Claude account/API key
3. Run it inside your project folder so it can use local repository context

## OpenAI Codex CLI

1. Install the OpenAI Codex CLI from OpenAI's official instructions
2. Authenticate with your OpenAI account/API key
3. Run it inside your project folder so it can use local repository context

## Gemini CLI

1. Install Gemini CLI from Google's official documentation
2. Sign in with your Google account or configure API credentials
3. Start it from your project root to work against your codebase

## GitHub Copilot

1. Install the GitHub Copilot extension in your IDE
2. Sign in with your GitHub account
3. Start typing — suggestions appear inline

## Gemini Code Assist

1. Install Gemini Code Assist in your IDE (VS Code or JetBrains)
2. Authenticate with your Google account/workspace
3. Use inline suggestions and chat to iterate on code changes

## Cursor

1. Download Cursor from the official website
2. Import your VS Code settings and extensions
3. Use `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) to open the AI prompt

## Chat-Based Assistants

### ChatGPT (OpenAI)

1. Sign in to ChatGPT
2. Use a coding-capable model
3. Paste focused snippets and include clear requirements for best results

### Gemini (Google)

1. Sign in to Gemini
2. Choose a model suited for coding tasks
3. Share concise context and ask for patches, tests, or refactors

## Verify Your Setup

Run a quick smoke test in each tool:

- Ask it to explain a small file in your repo
- Ask it to make a tiny, safe refactor
- Ask it to generate or update a unit test

## Tips for All Tools

- **Provide context** — Open relevant files so the tool understands your codebase
- **Use project files** — Add a `CLAUDE.md`, `AGENTS.md`, or tool-specific rules file for project conventions
- **Start small** — Try AI assistance on small tasks first before tackling complex features
