# prefer-result-maybe-async

`Result<T, E> | ResultAsync<T, E>` というユニオン型の代わりに `ResultMaybeAsync<T, E>` の使用を強制します。

## ルールの詳細

`ResultMaybeAsync<T, E>` は `Result<T, E> | ResultAsync<T, E>` のエイリアスです。専用のエイリアスはより短く表現力があります。このルールは自動修正に対応しています。

### 誤り

```ts
import { Result } from '@praha/byethrow';

// ❌ 明示的なユニオン型を使用
type Result = Result.Result<string, Error> | Result.ResultAsync<string, Error>;
```

### 正しい

```ts
import { Result } from '@praha/byethrow';

// ✅ ResultMaybeAsyncを使用
type Result = Result.ResultMaybeAsync<string, Error>;
```
