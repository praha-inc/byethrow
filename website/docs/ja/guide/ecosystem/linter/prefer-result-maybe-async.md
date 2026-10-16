---
description: Result と ResultAsync のユニオン型の代わりに型エイリアス ResultMaybeAsync を使うことを強制する Oxlint ルール。自動修正に対応しています。
---

# prefer-result-maybe-async

ユニオン型 `Result<T, E> | ResultAsync<T, E>` の代わりに `ResultMaybeAsync<T, E>` を使うことを強制します。

このルールは自動修正に対応しています。

## ルールの詳細

`ResultMaybeAsync<T, E>` は `Result<T, E> | ResultAsync<T, E>` のエイリアスです。
エイリアスのほうが短く、値が同期と非同期のどちらにもなり得ることを明確に表現できます。

### 誤った例

```ts
import { Result } from '@praha/byethrow';

class UserNotFoundError extends Error {}
type User = { id: string; name: string };

// ❌ ユニオン型を明示的に書いている
type FindUser = (id: string) => Result.Result<User, UserNotFoundError> | Result.ResultAsync<User, UserNotFoundError>;
```

### 正しい例

```ts
import { Result } from '@praha/byethrow';

class UserNotFoundError extends Error {}
type User = { id: string; name: string };

// ✅ ResultMaybeAsync
type FindUser = (id: string) => Result.ResultMaybeAsync<User, UserNotFoundError>;
```

## オプション

このルールにオプションはありません。
