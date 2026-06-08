---
description: "@praha/byethrow のコールバック内での try-catch を禁止し、Result.fn() でのラップを促すOxlintルール"
---

# no-try-catch-in-callback

`Result.andThen` / `Result.map` などの `@praha/byethrow` の関数に渡すコールバック内での `try-catch` ブロックを禁止します。

## ルールの詳細

`@praha/byethrow` のコールバック内に `try-catch` があるということは、エラーハンドリングが `Result` から外れているサインです。例外をスローする可能性があるコードは `Result.fn()` でラップし、パイプラインをクリーンに保ってください。

### 誤り

```ts
class ParseError extends Error {}
// ---cut-before---
import { Result } from '@praha/byethrow';

// ❌ コールバック内にtry-catch
const result = Result.pipe(
  Result.succeed('{"key": "value"}'),
  Result.andThen((value) => {
    try {
      return Result.succeed(JSON.parse(value));
    } catch {
      return Result.fail(new ParseError());
    }
  }),
);
```

### 正しい

```ts
class ParseError extends Error {}
// ---cut-before---
import { Result } from '@praha/byethrow';

const parser = Result.fn({
  try: (value: string) => JSON.parse(value),
  catch: (error: unknown) => new ParseError(),
});

// ✅ Result.fn()でラップ
const result = Result.pipe(
  Result.succeed('{"key": "value"}'),
  Result.andThen(parser),
);
```
