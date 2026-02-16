---
description: SkillsまたはMCPサーバーを使用して、AIアシスタントに@praha/byethrowを理解させる設定を行います。
---

# LLM 連携

byethrow は AI アシスタントと連携するための2つの方法を提供しており、byethrow に対して正確なガイダンスを受けられます。

| 方法                 | 説明                          | 推奨用途                            |
|--------------------|-----------------------------|---------------------------------|
| **Skills（推奨）**     | プロジェクトローカルの設定ファイル           | Claude、GitHub Copilot、Cursor など |
| **MCP サーバー（代替手段）** | Model Context Protocol サーバー | Skills が利用できない環境                |

## Skills（推奨）

`@praha/byethrow-docs` パッケージには、プロジェクト用の AI エージェント設定ファイルを生成する CLI ツールが含まれています。
これが**推奨されるアプローチ**である理由は以下の通りです。

- 外部サーバーのセットアップが不要
- オフラインで動作
- プロジェクトと直接統合
- ドキュメントへの即時アクセス

### インストール

```bash
npm install -D @praha/byethrow-docs
```

### セットアップ

`init` コマンドを使用して、AI アシスタント用の設定ファイルを生成します。

```bash
# Claude 用（.claude/skills/byethrow/SKILL.md を作成）
npx @praha/byethrow-docs init claude

# GitHub Copilot 用（.github/skills/byethrow/SKILL.md を作成）
npx @praha/byethrow-docs init copilot

# Cursor 用（.cursor/rules/byethrow/RULE.md を作成）
npx @praha/byethrow-docs init cursor
```

初期化が完了すると、AI アシスタントはコード支援時に自動的に byethrow のドキュメントを参照するようになります。

### CLI コマンド

`@praha/byethrow-docs` パッケージは、ドキュメントを探索するための追加コマンドも提供しています。

```bash
# 利用可能な全ドキュメントを一覧表示
npx @praha/byethrow-docs list

# ドキュメントを検索
npx @praha/byethrow-docs search "検索クエリ"

# ドキュメントの目次を表示
npx @praha/byethrow-docs toc path/to/document.md
```

---

## MCP サーバー（代替手段）

お使いの環境が Skills をサポートしていない場合は、Model Context Protocol（MCP）サーバーを提供する `@praha/byethrow-mcp` パッケージを使用できます。

### MCP とは？

Model Context Protocol（MCP）は、AI アシスタントが外部のデータソースやツールにアクセスするための標準化された方法です。
byethrow MCP サーバーは以下を提供します。

- 最新の関数シグネチャと型定義
- 使用例とベストプラクティス
- 利用可能な全関数のドキュメント

### インストール

お使いの AI アシスタントを選択し、以下の対応するセットアップ手順に従ってください。

#### VS Code と GitHub Copilot

VS Code の MCP 設定ファイルに以下の設定を追加してください。
詳細は [VS Code MCP ドキュメント](https://code.visualstudio.com/docs/copilot/customization/mcp-servers) を参照してください。

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

`Settings` → `Cursor Settings` → `MCP` → `Add new global MCP server` から設定してください。

または、`~/.cursor/mcp.json` ファイルに以下の設定を貼り付けてください。
プロジェクト固有のインストールの場合は、プロジェクトフォルダに `.cursor/mcp.json` を作成してください。
詳細は [Cursor MCP ドキュメント](https://docs.cursor.com/context/model-context-protocol) を参照してください。

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

Roo Code の MCP 設定ファイルに以下を追加してください。
詳細は [Roo Code MCP ドキュメント](https://docs.roocode.com/features/mcp/using-mcp-in-roo) を参照してください。

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

Windsurf の MCP 設定ファイルに以下を追加してください。
詳細は [Windsurf MCP ドキュメント](https://docs.windsurf.com/windsurf/cascade/mcp#mcp_config-json) を参照してください。

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

以下のコマンドを実行してください。
詳細は [Claude Code MCP ドキュメント](https://code.claude.com/docs/en/mcp#option-3-add-a-local-stdio-server) を参照してください。

```sh
claude mcp add byethrow -- npx -y @praha/byethrow-mcp
```

#### Claude Desktop

Claude Desktop の MCP 設定に以下を追加してください。

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
