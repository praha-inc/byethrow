---
description: Result/ResultAsync/ResultMaybeAsync のエラー型に unknown・any・Error などの曖昧な型を禁止するOxlintルール
---

# no-ambiguous-error-type

`Result` / `ResultAsync` / `ResultMaybeAsync` のエラー型に曖昧な型を使用することを禁止します。

## ルールの詳細

`unknown`・`any`・`Error`・プリミティブ型などの曖昧な型をエラー型に使用すると、呼び出し元がエラーの種類を区別できなくなります。具体的なドメイン固有のエラークラスを使用することで、エラーハンドリングを網羅的かつ自己文書化した形にできます。

### 誤り

```ts
import { Result } from '@praha/byethrow';

// ❌ unknownを使用
type Result1 = Result.Result<string, unknown>;

// ❌ プリミティブを使用
type Result2 = Result.Result<string, string>;

// ❌ 基底クラスのErrorを使用
type Result3 = Result.Result<string, Error>;
```

### 正しい

```ts
import { Result } from '@praha/byethrow';

// ✅ 具体的なエラークラスを使用
class NotFoundError extends Error {}
type Result = Result.Result<string, NotFoundError>;
```
