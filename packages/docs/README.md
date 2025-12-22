# @praha/byethrow-docs 👋

[![npm version](https://badge.fury.io/js/@praha%2Fbyethrow-docs.svg)](https://www.npmjs.com/package/@praha/byethrow-docs)
[![npm download](https://img.shields.io/npm/dm/@praha/byethrow-docs.svg)](https://www.npmjs.com/package/@praha/byethrow-docs)
[![license](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/praha-inc/byethrow/blob/main/packages/docs/LICENSE)
[![Github](https://img.shields.io/github/followers/praha-inc?label=Follow&logo=github&style=social)](https://github.com/orgs/praha-inc/followers)

Documentation package for [@praha/byethrow](https://www.npmjs.com/package/@praha/byethrow).

## 📖 About

This package contains comprehensive markdown documentation for the `@praha/byethrow` package.
The documentation is also available online at [Website](https://praha-inc.github.io/byethrow).

## 🚀 Installation

```bash
npm install @praha/byethrow-docs
```

## 📚 Usage

### CLI

This package includes a CLI tool for searching and listing documentation.

#### `init` command

Initialize AI agent configuration for byethrow documentation.

```bash
# Initialize Claude AI configuration
npx @praha/byethrow-docs init claude

# Initialize GitHub Copilot configuration
npx @praha/byethrow-docs init copilot

# Initialize Cursor AI configuration
npx @praha/byethrow-docs init cursor
```

**Arguments:**

- `agent`: AI agent to configure (claude, copilot, or cursor) (required)

**Description:**

This command creates an agent-specific configuration file that enables the AI to reference byethrow documentation automatically.
The configuration file will be created in the appropriate directory:

- Claude: `.claude/skills/byethrow/SKILL.md`
- GitHub Copilot: `.github/skills/byethrow/SKILL.md`
- Cursor: `.cursor/rules/byethrow/RULE.md`

#### `list` command

List all available documentation organized by sections.

```bash
# List all documentation
npx @praha/byethrow-docs list

# List documentation with filter query
npx @praha/byethrow-docs list --query "your query"
```

**Options:**

- `--query <string>`: Filter documentation by keywords (optional)

#### `search` command

Search documentation and get matching results with highlighted snippets.

```bash
# Search documentation
npx @praha/byethrow-docs search "your query"

# Limit number of results (default: 5)
npx @praha/byethrow-docs search "your query" --limit 10
```

**Arguments:**

- `query`: Search query string (required)

**Options:**

- `--limit <number>`: Maximum number of results to return (default: 5)

#### `toc` command

Display table of contents from a documentation file.

```bash
# Display table of contents from a markdown file
npx @praha/byethrow-docs toc path/to/document.md
```

**Arguments:**

- `path`: Path to the documentation file (required)

## 🤝 Contributing

Contributions, issues and feature requests are welcome.

Feel free to check [issues page](https://github.com/praha-inc/byethrow/issues) if you want to contribute.

## 📝 License

Copyright © [PrAha, Inc.](https://www.praha-inc.com/)

This project is [```MIT```](https://github.com/praha-inc/byethrow/blob/main/packages/docs/LICENSE) licensed.
