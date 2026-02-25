---
sidebar_position: 5
---

# Tool Use and Agentic Coding

Language models can generate text, but they can't read files, run tests, or execute commands on their own. **Tool use** is the mechanism that bridges this gap, it allows a model to request that external code be run on its behalf. When tool use is combined with a loop that lets the model act, observe, and act again, you get **agentic coding**: an AI that can autonomously complete multi-step software engineering tasks.

## What is tool use?

Tool use (also called **function calling**) lets you define external functions that a model can invoke during a conversation. The model doesn't execute these functions directly. It returns a structured request describing which tool to call and with what arguments. Your application then executes the tool and sends the result back to the model.

This is a critical distinction: **the model never runs code**. It generates a request, your code executes it, and you return the result. This keeps the human (or the application) in control of what actually happens.

Tool definitions consume [context window](./context-window.md) space. Each tool you define adds its name, description, and parameter schema to the prompt. More tools means more [tokens](./tokens-and-tokenization.md) used before the conversation even starts.

## How tool use works

A tool use interaction follows a specific flow:

**Step 1: Define tools and send a message**

You send the model a list of available tools (with descriptions and parameter schemas) along with the user's message.

**Step 2: Model returns a tool call**

Instead of (or in addition to) generating text, the model responds with a `tool_use` block specifying which tool to call and the arguments.

**Step 3: Execute the tool**

Your application runs the requested tool - reading a file, running a command, querying a database, etc.

**Step 4: Send the result back**

You send the tool's output back to the model as a `tool_result` message.

**Step 5: Model responds**

The model processes the tool result and either generates a final response or makes another tool call.

Here's what this looks like in practice:

```python
import anthropic

client = anthropic.Anthropic()

# Define available tools
tools = [
    {
        "name": "read_file",
        "description": "Read the contents of a file at the given path.",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "The file path to read"
                }
            },
            "required": ["path"]
        }
    }
]

response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=4096,
    tools=tools,
    messages=[
        {"role": "user", "content": "What does the main function in app.py do?"}
    ]
)

# The model might respond with:
# { "type": "tool_use", "name": "read_file", "input": { "path": "app.py" } }
```

### Tool definitions

Good tool definitions make a significant difference in how well the model uses them:

- **Clear descriptions** - the model relies on the description to decide when to use a tool. "Read the contents of a file at the given path" is better than "read file"
- **Precise parameter schemas** - use proper JSON Schema types, add parameter descriptions, and mark required fields
- **Fewer is better** - each tool definition consumes tokens. Only define tools the model actually needs for the current task

## The agentic loop

Tool use becomes truly powerful when it's placed inside a loop. Instead of a single request-response, the model can:

1. **Think** - analyze the current state and decide what to do next
2. **Act** - request a tool call (read a file, run a test, edit code)
3. **Observe** - process the tool result
4. **Repeat** - decide whether to take another action or respond to the user

This is how Claude Code, Cursor's agent mode, and similar tools work. When you ask Claude Code to "fix the failing tests," it doesn't just suggest a fix. It reads the test file, reads the source code, makes an edit, runs the tests, reads the error output, adjusts the fix, and runs the tests again - all autonomously.

### What makes agentic coding powerful

- **Multi-step reasoning** - the model can break down complex tasks into a sequence of actions, adjusting its approach based on what it discovers along the way
- **Read-fix-test cycles** - the model can make a change, verify it works, and iterate until the tests pass, mimicking the workflow of a human developer
- **Context gathering** - instead of requiring you to provide all relevant code upfront, the model can explore the codebase itself, finding the files and functions it needs

### Limitations

- **Context exhaustion** - every tool call and result adds to the context window. A long agentic session can fill up the context, leading to [autocompaction](./context-window.md#autocompaction) and degraded performance
- **Error loops** - the model can get stuck in a cycle, repeatedly trying the same failing approach. Good agentic frameworks include loop detection and breakout logic
- **Cost** - agentic sessions use significantly more tokens than single-turn interactions. A complex task might involve dozens of tool calls, each adding input and output tokens
- **Trust boundary** - the model is making decisions about what files to read, what commands to run, and what code to write. Tools like Claude Code add permission checks and sandboxing to keep this under control

## Model Context Protocol (MCP)

The **Model Context Protocol (MCP)** is an open standard for connecting language models to external tools and data sources. Think of it like USB for AI tools, a standardized way to plug in new capabilities without building custom integrations for each one.

Before MCP, every tool integration was bespoke. If you wanted Claude Code to access your Jira board, you'd need to build a custom tool from scratch. MCP standardizes this so that a single MCP server can work with any MCP-compatible client.

### MCP in practice

MCP defines three types of capabilities that a server can expose:

- **Tools** - executable functions the model can call (query a database, create a ticket, fetch API data)
- **Resources** - data the model can read (documentation, configuration files, database schemas)
- **Prompts** - reusable prompt templates the server provides

A typical setup involves configuring MCP servers in your tool's settings. For example, in Claude Code, you'd add an MCP server to your project configuration:

```json
{
  "mcpServers": {
    "jira": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-jira"],
      "env": {
        "JIRA_URL": "https://your-org.atlassian.net",
        "JIRA_TOKEN": "${JIRA_API_TOKEN}"
      }
    }
  }
}
```

The model can then use the Jira tools (search issues, create tickets, add comments) alongside its built-in file and terminal tools. Both Claude Code and Cursor support MCP.

## How popular tools implement this

Different coding tools take different approaches to tool use and agentic behavior:

- **Claude Code** - fully agentic by default. It has access to file operations, terminal commands, and search tools, and uses them autonomously in a loop. You give it a task and it works through it step by step, asking for permission at trust boundaries
- **Cursor** - offers both a normal chat mode (where the model suggests changes that you apply) and an agent mode (where the model can read, write, and run commands autonomously, similar to Claude Code)
- **GitHub Copilot** - primarily focused on inline code completion with limited tool use. Copilot Chat supports some tool-like features (referencing files, workspace context), but it's less agentic than Claude Code or Cursor's agent mode

## Practical tips

- **Write clear task descriptions** - agentic tools perform better when you describe the desired outcome clearly. "Fix the login bug where users get a 500 error when submitting empty passwords" is better than "fix the login"
- **Commit before agentic sessions** - since the model will be editing files, make sure your work is committed so you can easily review or revert changes
- **Watch context usage** - agentic sessions fill the context window faster than normal conversations. If you see the model losing track of earlier context, start a new session
- **Review output rigorously** - autonomous doesn't mean infallible. Review diffs, run tests, and verify that changes make sense before committing them
- **Start small, expand scope** - begin with focused, well-defined tasks before asking for large refactors. This helps you calibrate how well the tool handles your specific codebase
