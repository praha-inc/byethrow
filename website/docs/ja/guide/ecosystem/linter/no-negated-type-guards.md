---
description: Result.isSuccess() や Result.isFailure() を ! 演算子で否定することを禁止し、反対の型ガードに自動修正する Oxlint ルール。
---

# no-negated-type-guards

`Result.isSuccess()` や `Result.isFailure()` に否定演算子（`!`）を使うことを禁止します。

このルールは自動修正に対応しています。修正時には、否定された呼び出しが反対の型ガードに置き換えられます。

## ルールの詳細

`!Result.isSuccess(result)` は `Result.isFailure(result)` と同じ意味ですが、否定形は読むときに一手間余計にかかります。
`Result` は常に成功か失敗のどちらかなので、否定の代わりに使える型ガードが必ず存在します。

### 誤った例

```ts
import { Result } from '@praha/byethrow';

declare const result: Result.Result<string, Error>;

// ❌ isSuccess を否定している
if (!Result.isSuccess(result)) {
  // 失敗時の処理
}

// ❌ isFailure を否定している
if (!Result.isFailure(result)) {
  // 成功時の処理
}
```

### 正しい例

```ts
import { Result } from '@praha/byethrow';

declare const result: Result.Result<string, Error>;

// ✅ 型ガードを直接使っている
if (Result.isFailure(result)) {
  // 失敗時の処理
}

if (Result.isSuccess(result)) {
  // 成功時の処理
}
```

## オプション

このルールにオプションはありません。
