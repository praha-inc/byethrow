---
description: "@praha/byethrow-oxlint は byethrow のベストプラクティスを強制するOxlintプラグイン — インストール、セットアップ、設定、全ルール一覧"
---

# Linter プラグイン

`@praha/byethrow-oxlint` は、`@praha/byethrow` 使用時のベストプラクティスを強制する [Oxlint](https://oxc.rs/docs/guide/usage/linter) プラグインです。

## インストール

```bash
npm install -D @praha/byethrow-oxlint
```

## セットアップ

### 推奨プリセットを使用する

最も簡単な方法は、推奨プリセットを拡張することです。すべてのルールがデフォルト設定で有効になります。

```ts title="oxlint.config.ts"
import oxlintByethrowPlugin from '@praha/byethrow-oxlint';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [
    oxlintByethrowPlugin.recommended,
  ],
});
```

### ルールを手動で設定する

より細かく制御したい場合は、プラグインを読み込んで個別のルールを有効にできます。

```ts title="oxlint.config.ts"
import { defineConfig } from 'oxlint';

export default defineConfig({
  jsPlugins: [
    {
      name: 'byethrow',
      specifier: '@praha/byethrow-oxlint',
    },
  ],
  rules: {
    'byethrow/consistent-namespace': 'error',
    'byethrow/no-ambiguous-error-type': 'error',
    // ...
  },
});
```

## 設定

`settings` に `byethrow` キーを追加することで、プラグインがbyethrowのインポートを検出する方法をカスタマイズできます。独自パッケージから `@praha/byethrow` を再エクスポートしている場合などに便利です。

| オプション       | 型                    | デフォルト               | 説明                      |
|-------------|----------------------|---------------------|-------------------------|
| `module`    | `string \| string[]` | `"@praha/byethrow"` | byethrowとして扱うモジュールの指定子  |
| `namespace` | `string \| string[]` | `["Result", "R"]`   | byethrow名前空間として扱うインポート名 |

```ts title="oxlint.config.ts"
import { defineConfig } from 'oxlint';

export default defineConfig({
  settings: {
    byethrow: {
      module: ['@praha/byethrow', '@my-org/result'],
      namespace: ['Result', 'R'],
    },
  },
});
```

## ルール

| ルール                                                      | 説明                                                | 自動修正 |
|----------------------------------------------------------|---------------------------------------------------|------|
| [consistent-namespace](./consistent-namespace)           | 一貫した名前空間エイリアスを強制                                  | ✅    |
| [no-ambiguous-error-type](./no-ambiguous-error-type)     | 非具体的なエラー型を禁止                                      |      |
| [no-ambiguous-success-type](./no-ambiguous-success-type) | 非具体的な成功型を禁止                                       |      |
| [no-negated-type-guards](./no-negated-type-guards)       | `isSuccess`/`isFailure` の否定を禁止                    | ✅    |
| [no-throw-in-callback](./no-throw-in-callback)           | byethrowコールバック内の `throw` を禁止                      |      |
| [no-try-catch-in-callback](./no-try-catch-in-callback)   | byethrowコールバック内の `try-catch` を禁止                  |      |
| [prefer-result-async](./prefer-result-async)             | `Promise<Result>` より `ResultAsync` を優先            | ✅    |
| [prefer-result-matchers](./prefer-result-matchers)       | `toBeSuccess`/`toBeFailure` マッチャーを優先              | ✅    |
| [prefer-result-maybe-async](./prefer-result-maybe-async) | `Result \| ResultAsync` より `ResultMaybeAsync` を優先 | ✅    |
