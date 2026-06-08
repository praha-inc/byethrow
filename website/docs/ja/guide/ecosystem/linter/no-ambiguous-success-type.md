# no-ambiguous-success-type

`Result`/`ResultAsync`/`ResultMaybeAsync` の成功型に曖昧な型を使用することを禁止します。

## ルールの詳細

`unknown`・`any`・`object`・`{}` などの曖昧な型を成功型に使用すると、呼び出し元が受け取る値の情報が隠されます。具体的な型を使用することで、成功時に何を受け取るかを明確にできます。

### 誤り

```ts
import { Result } from '@praha/byethrow';

// ❌ unknownを使用
type Result1 = Result.Result<unknown, Error>;

// ❌ anyを使用
type Result2 = Result.Result<any, Error>;

// ❌ objectを使用
type Result3 = Result.Result<object, Error>;
```

### 正しい

```ts
import { Result } from '@praha/byethrow';

// ✅ 具体的な型を使用
type Result1 = Result.Result<{ id: string }, Error>;

// ✅ 値を返さない処理ではvoidを使用
type Result2 = Result.Result<void, Error>;
```
