# MCP Server

The `@praha/byethrow-mcp` package provides a Model Context Protocol (MCP) server that gives AI assistants direct access to up-to-date documentation and code examples for the byethrow library. This integration allows AI tools to provide more accurate and current assistance when working with byethrow.

## What is MCP?

The Model Context Protocol (MCP) is a standardized way for AI assistants to access external data sources and tools. By using the byethrow MCP server, your AI assistant can:

- Retrieve the latest documentation for byethrow functions
- Access current code examples and usage patterns
- Provide accurate type information and API details
- Stay synchronized with the latest version of the library

## Installation

### VS Code with GitHub Copilot

Add the following configuration to your VS Code MCP config file. See the [VS Code MCP documentation](https://code.visualstudio.com/docs/copilot/chat/mcp-servers) for more details.

```json
{
  "mcp": {
    "servers": {
      "@praha/byethrow": {
        "type": "stdio",
        "command": "npx",
        "args": ["-y", "@praha/byethrow-mcp"]
      }
    }
  }
}
```

### Cursor

Go to: `Settings` → `Cursor Settings` → `MCP` → `Add new global MCP server`

Alternatively, you can paste the following configuration into your Cursor `~/.cursor/mcp.json` file. For project-specific installation, create `.cursor/mcp.json` in your project folder. See the [Cursor MCP documentation](https://docs.cursor.com/context/model-context-protocol) for more information.

```json
{
  "mcpServers": {
    "@praha/byethrow": {
      "command": "npx",
      "args": ["-y", "@praha/byethrow-mcp"]
    }
  }
}
```

### Claude Desktop

Add the following to your Claude Desktop MCP configuration:

```json
{
  "mcpServers": {
    "@praha/byethrow": {
      "command": "npx",
      "args": ["-y", "@praha/byethrow-mcp"]
    }
  }
}
```

## Usage

Once installed, simply mention that you want to use `@praha/byethrow` in your conversations with the AI assistant. The MCP server will automatically provide the assistant with:

- Current function signatures and type definitions
- Usage examples and best practices
- Documentation for all available functions
- Migration guides and changelog information

### Example Conversation

```
You: "How do I use the map function from @praha/byethrow?"

AI Assistant: [With MCP server active, the assistant will have access to current documentation and can provide accurate, up-to-date examples]
```
