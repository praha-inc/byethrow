---
description: '@praha/byethrow-docsパッケージを使ってClaude・GitHub Copilot・CursorなどのAIアシスタントにbyethrowのドキュメントを連携する方法。'
---

# LLM 連携

byethrow は AI アシスタントと連携するための方法を提供しており、byethrow に対して正確なガイダンスを受けられます。

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

