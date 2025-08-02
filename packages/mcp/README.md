# @praha/byethrow-mcp 👋

[![npm version](https://badge.fury.io/js/@praha%2Fbyethrow-mcp.svg)](https://www.npmjs.com/package/@praha/byethrow-mcp)
[![npm download](https://img.shields.io/npm/dm/@praha/byethrow-mcp.svg)](https://www.npmjs.com/package/@praha/byethrow-mcp)
[![license](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/praha-inc/byethrow/blob/main/packages/mcp/LICENSE)
[![Github](https://img.shields.io/github/followers/praha-inc?label=Follow&logo=github&style=social)](https://github.com/orgs/praha-inc/followers)

@praha/byethrow-mcp retrieves the up-to-date documentation and code examples and places them directly in your prompts.

Just add this server and tell them to use @praha/byethrow.

## 📦 Installation

<details>
<summary><b>Install in VS Code</b></summary>

Add this to your VS Code MCP config file. See [VS Code MCP docs](https://code.visualstudio.com/docs/copilot/chat/mcp-servers) for more info.

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

</details>

<details>
<summary><b>Install in Cursor</b></summary>

Go to: `Settings` -> `Cursor Settings` -> `MCP` -> `Add new global MCP server`

Pasting the following configuration into your Cursor `~/.cursor/mcp.json` file is the recommended approach. You may also install in a specific project by creating `.cursor/mcp.json` in your project folder. See [Cursor MCP docs](https://docs.cursor.com/context/model-context-protocol) for more info.

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

</details>

<details>
<summary><b>Install in Roo Code</b></summary>

Add this to your Roo Code MCP configuration file. See [Roo Code MCP docs](https://docs.roocode.com/features/mcp/using-mcp-in-roo) for more info.

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

</details>

<details>
<summary><b>Install in Windsurf</b></summary>

Add this to your Windsurf MCP config file. See [Windsurf MCP docs](https://docs.windsurf.com/windsurf/mcp) for more info.

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

</details>

<details>
<summary><b>Install in Claude Code</b></summary>

Run this command. See [Claude Code MCP docs](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/tutorials#set-up-model-context-protocol-mcp) for more info.

```sh
claude mcp add @praha/byethrow -- npx -y @praha/byethrow-mcp
```

</details>

<details>
<summary><b>Install in Claude Desktop</b></summary>

Add this to your Claude Desktop `claude_desktop_config.json` file. See [Claude Desktop MCP docs](https://modelcontextprotocol.io/quickstart/user) for more info.

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

</details>

## 🤝 Contributing

Contributions, issues and feature requests are welcome.

Feel free to check [issues page](https://github.com/praha-inc/byethrow/issues) if you want to contribute.

## 📝 License

Copyright © [PrAha, Inc.](https://www.praha-inc.com/)

This project is [```MIT```](https://github.com/praha-inc/byethrow/blob/main/packages/mcp/LICENSE) licensed.
