---
description: Promise でラップした Result の代わりに ResultAsync の使用を強制するOxlintルール（自動修正対応）
---

# prefer-result-async

`Promise<Result<T, E>>` の代わりに `ResultAsync<T, E>` の使用を強制します。

## ルールの詳細

`ResultAsync<T, E>` は `Promise<Result<T, E>>` のエイリアスです。専用のエイリアスはより短く、関数が `Result` でラップされた非同期値を返すことを明確に示します。このルールは自動修正に対応しています。

### 誤り

```ts
import { Result } from '@praha/byethrow';

// ❌ Promise<Result<...>>を使用
type Result = Promise<Result.Result<string, Error>>;
```

### 正しい

```ts
import { Result } from '@praha/byethrow';

// ✅ ResultAsyncを使用
type Result = Result.ResultAsync<string, Error>;
```
