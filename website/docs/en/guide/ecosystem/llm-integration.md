---
description: Configure AI assistants to understand @praha/byethrow using Skills or MCP Server.
---

# LLM Integration

byethrow provides two methods to integrate with AI assistants, enabling them to provide accurate and up-to-date guidance for your byethrow code.

| Method                       | Description                       | Recommended For                           |
|------------------------------|-----------------------------------|-------------------------------------------|
| **Skills (Recommended)**     | Project-local configuration files | Claude, GitHub Copilot, Cursor, etc...    |
| **MCP Server (Alternative)** | Model Context Protocol server     | Environments where Skills are unavailable |

## Skills (Recommended)

The `@praha/byethrow-docs` package includes a CLI tool that generates AI agent configuration files for your project.
This is the **recommended approach** as it:

- Requires no external server setup
- Works offline
- Integrates directly with your project
- Provides instant access to documentation

### Installation

```bash
npm install -D @praha/byethrow-docs
```

### Setup

Use the `init` command to generate the configuration file for your AI assistant:

```bash
# For Claude (creates .claude/skills/byethrow/SKILL.md)
npx @praha/byethrow-docs init claude

# For GitHub Copilot (creates .github/skills/byethrow/SKILL.md)
npx @praha/byethrow-docs init copilot

# For Cursor (creates .cursor/rules/byethrow/RULE.md)
npx @praha/byethrow-docs init cursor
```

Once initialized, your AI assistant will automatically reference byethrow documentation when helping you with your code.

### CLI Commands

The `@praha/byethrow-docs` package also provides additional commands for exploring documentation:

```bash
# List all available documentation
npx @praha/byethrow-docs list

# Search documentation
npx @praha/byethrow-docs search "your query"

# Display table of contents from a document
npx @praha/byethrow-docs toc path/to/document.md
```

---

## MCP Server (Alternative)

If your environment does not support Skills, you can use the `@praha/byethrow-mcp` package which provides a Model Context Protocol (MCP) server.

### What is MCP?

The Model Context Protocol (MCP) is a standardized way for AI assistants to access external data sources and tools. The byethrow MCP server provides:

- Current function signatures and type definitions
- Usage examples and best practices
- Documentation for all available functions

### Installation

Choose your AI assistant and follow the corresponding setup instructions below.

#### VS Code with GitHub Copilot

Add the following configuration to your VS Code MCP config file.
See the [VS Code MCP documentation](https://code.visualstudio.com/docs/copilot/customization/mcp-servers) for more details.

```json
{
  "mcp": {
    "servers": {
      "byethrow": {
        "type": "stdio",
        "command": "npx",
        "args": ["-y", "@praha/byethrow-mcp"]
      }
    }
  }
}
```

#### Cursor

Go to: `Settings` → `Cursor Settings` → `MCP` → `Add new global MCP server`

Alternatively, paste the following configuration into your `~/.cursor/mcp.json` file.
For project-specific installation, create `.cursor/mcp.json` in your project folder.
See the [Cursor MCP documentation](https://docs.cursor.com/context/model-context-protocol) for more information.

```json
{
  "mcpServers": {
    "byethrow": {
      "command": "npx",
      "args": ["-y", "@praha/byethrow-mcp"]
    }
  }
}
```

#### Roo Code

Add this to your Roo Code MCP configuration file.
See [Roo Code MCP docs](https://docs.roocode.com/features/mcp/using-mcp-in-roo) for more info.

```json
{
  "mcpServers": {
    "byethrow": {
      "command": "npx",
      "args": ["-y", "@praha/byethrow-mcp"]
    }
  }
}
```

#### Windsurf

Add this to your Windsurf MCP config file.
See [Windsurf MCP docs](https://docs.windsurf.com/windsurf/cascade/mcp#mcp_config-json) for more info.

```json
{
  "mcpServers": {
    "byethrow": {
      "command": "npx",
      "args": ["-y", "@praha/byethrow-mcp"]
    }
  }
}
```

#### Claude Code

Run this command. See [Claude Code MCP docs](https://code.claude.com/docs/en/mcp#option-3-add-a-local-stdio-server) for more info.

```sh
claude mcp add byethrow -- npx -y @praha/byethrow-mcp
```

#### Claude Desktop

Add the following to your Claude Desktop MCP configuration:

```json
{
  "mcpServers": {
    "byethrow": {
      "command": "npx",
      "args": ["-y", "@praha/byethrow-mcp"]
    }
  }
}
```
