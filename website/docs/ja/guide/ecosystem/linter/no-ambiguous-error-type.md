---
description: Result・ResultAsync・ResultMaybeAsync の型注釈で、unknown・any・string・Error などの曖昧なエラー型を禁止する Oxlint ルール。
---

# no-ambiguous-error-type

`Result`、`ResultAsync`、`ResultMaybeAsync` のエラー型の位置に、具体的でない型を使うことを禁止します。

## ルールの詳細

`Result` のエラー型が曖昧だと、呼び出し側は失敗の種類を区別できず、すべてのケースを漏れなく処理することもできません。
[カスタムエラー](../../best-practices/custom-error)で説明しているように、代わりにドメイン固有の具体的なエラー型を使ってください。

エラー型の位置で次の型が使われていると報告されます。

- `unknown` と `any`
- プリミティブ型：`string`、`number`、`boolean`、`bigint`、`symbol`、`null`、`undefined`
- `object` と `{}`
- 基底クラスの `Error`

このルールは `Result.Result<T, E>` のような明示的な型注釈をチェックします。TypeScript が推論した型はチェックされません。

### 誤った例

```ts
import { Result } from '@praha/byethrow';

// ❌ unknown
type FindUserResult = Result.Result<string, unknown>;

// ❌ プリミティブ型
type ParseResult = Result.Result<number, string>;

// ❌ 基底クラスの Error
type SaveResult = Result.ResultAsync<void, Error>;
```

### 正しい例

```ts
import { Result } from '@praha/byethrow';

class UserNotFoundError extends Error {
  override readonly name = 'UserNotFoundError';
}

// ✅ 具体的なエラークラス
type FindUserResult = Result.Result<string, UserNotFoundError>;
```

## オプション

このルールにオプションはありません。
