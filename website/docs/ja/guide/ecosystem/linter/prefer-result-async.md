---
description: Promise<Result> の代わりに型エイリアス ResultAsync を使うことを強制する Oxlint ルール。自動修正に対応しています。
---

# prefer-result-async

`Promise<Result<T, E>>` の代わりに `ResultAsync<T, E>` を使うことを強制します。

このルールは自動修正に対応しています。

## ルールの詳細

`ResultAsync<T, E>` は `Promise<Result<T, E>>` のエイリアスです。
エイリアスのほうが短く、関数が非同期の `Result` を返すことがひと目でわかります。

### 誤った例

```ts
import { Result } from '@praha/byethrow';

class UserNotFoundError extends Error {}
type User = { id: string; name: string };

// ❌ Promise<Result<...>>
declare const findUser: (id: string) => Promise<Result.Result<User, UserNotFoundError>>;
```

### 正しい例

```ts
import { Result } from '@praha/byethrow';

class UserNotFoundError extends Error {}
type User = { id: string; name: string };

// ✅ ResultAsync
declare const findUser: (id: string) => Result.ResultAsync<User, UserNotFoundError>;
```

## オプション

このルールにオプションはありません。
