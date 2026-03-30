---
description: Integrate byethrow documentation into Claude, GitHub Copilot, and Cursor using the @praha/byethrow-docs CLI init command.
---

# LLM Integration

byethrow provides a method to integrate with AI assistants, enabling them to provide accurate and up-to-date guidance for your byethrow code.

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

