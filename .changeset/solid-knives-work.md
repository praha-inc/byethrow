---
"@praha/byethrow-website": minor
---

Remove @praha/byethrow-mcp package

**BREAKING CHANGES:**

The `@praha/byethrow-mcp` package has been removed. Please use the `init` command from `@praha/byethrow-docs` to configure Agent Skills instead.

```bash
# Initialize Claude AI configuration
npx @praha/byethrow-docs init claude

# Initialize GitHub Copilot configuration
npx @praha/byethrow-docs init copilot

# Initialize Cursor AI configuration
npx @praha/byethrow-docs init cursor
```
