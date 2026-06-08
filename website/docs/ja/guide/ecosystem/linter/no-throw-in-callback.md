---
description: "@praha/byethrow のコールバック内での throw 文を禁止し、Result.fail() の使用を促すOxlintルール"
---

# no-throw-in-callback

`Result.andThen` / `Result.map` などの `@praha/byethrow` の関数に渡すコールバック内での `throw` 文を禁止します。

## ルールの詳細

`@praha/byethrow` のコールバック内でthrowすると `Result` の制約が破られます。エラーを表すには `Result.fail()` を使用し、エラーハンドリングを明示的かつ合成可能に保ってください。

### 誤り

```ts
import { Result } from '@praha/byethrow';

// ❌ コールバック内でthrow
const result = Result.pipe(
  Result.succeed(32),
  Result.andThen((value) => {
    if (value < 0) throw new RangeError('negative value');
    return Result.succeed(value * 2);
  }),
);
```

### 正しい

```ts
class NegativeValueError extends Error {}
// ---cut-before---
import { Result } from '@praha/byethrow';

// ✅ 失敗Resultを返す
const result = Result.pipe(
  Result.succeed(32),
  Result.andThen((value) => {
    if (value < 0) return Result.fail(new NegativeValueError());
    return Result.succeed(value * 2);
  }),
);
```
