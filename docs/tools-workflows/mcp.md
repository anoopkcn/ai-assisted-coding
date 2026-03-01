---
sidebar_position: 3
---

import Mascot from '@site/src/components/Mascot';

# MCP (Model Context Protocol)

<Mascot src={require('./img/slug_search.png').default} />

The **Model Context Protocol (MCP)** is an open standard for connecting language models to external tools and data sources. Think of it like USB for AI tools, a standardized way to plug in new capabilities without building custom integrations for each one.

> Last reviewed: February 26, 2026. Verify CLI flags and auth flows against current vendor docs before rollout.

## Adding MCP servers (Claude Code)

```bash
claude mcp add --transport http --scope user context7 https://mcp.context7.com/mcp
```

## Configuration scopes `--scope` (alias: `-s`)

| Scope | flag | Stored in  | Use for |
|-------|-------|--------|---------|
| **User** | `-s user` | `~/.claude.json` (global) | Personal utilities across all projects |
| **Local** | `-s local` | `~/.claude.json` (project path)  | Personal servers, sensitive credentials |
| **Project** | `-s project` | `.mcp.json` (repo root)  | Team-shared tools, project services |

## Team configuration with `.mcp.json`

Check this into your repo so the whole team gets the same MCP servers:

```json
{
  "mcpServers": {
    "postgres": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@bytebase/dbhub", "--dsn", "${DATABASE_URL}"]
    },
    "sentry": {
      "type": "http",
      "url": "https://mcp.sentry.dev/mcp"
    }
  }
}
```

Environment variables like `${DATABASE_URL}` expand at startup. Use `${VAR:-default}` for fallback values.

## OAuth authentication

Some MCP servers require OAuth. After adding the server, authenticate inside Claude Code:

```
/mcp
```

This opens a browser login flow. Credentials are cached locally.

## Popular MCP servers

| Server | What it does |
|--------|-------------|
| **GitHub** | PRs, issues, code search, repo management |
| **Sentry** | Error monitoring, crash analysis |
| **PostgreSQL / MySQL** | Direct database queries |
| **Slack** | Messages, channel history |
| **Notion** | Read/write Notion pages and databases |
| **Jira / Asana** | Task and issue management |

Browse the full directory at [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers).

## MCP in other tools

**Cursor** also supports MCP servers, configured in its settings UI or via JSON config. The protocol is tool-agnostic by design — an MCP server built for Claude Code works with any MCP-compatible client.

<p><small>Sources: <a href="https://docs.anthropic.com/en/docs/claude-code/mcp">Anthropic MCP docs</a>, <a href="https://modelcontextprotocol.io/docs/getting-started/intro">Model Context Protocol docs</a>, <a href="https://docs.cursor.com/context/model-context-protocol">Cursor MCP documentation</a></small></p>
