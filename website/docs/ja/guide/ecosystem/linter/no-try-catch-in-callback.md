---
description: '@praha/byethrow の関数に渡すコールバック内での try-catch を禁止する Oxlint ルール。例外を投げるコードは Result.fn() でラップします。'
---

# no-try-catch-in-callback

`Result.andThen` や `Result.map` など、`@praha/byethrow` の関数に渡すコールバック内で `try-catch` ブロックを使うことを禁止します。

## ルールの詳細

コールバック内の `try-catch` は、エラーハンドリングが `Result` のモデルから外れてしまっているサインです。
代わりに例外を投げるコードを [`Result.fn()` または `Result.try()`](../../tutorial/basics/wrapping-functions) でラップし、パイプライン自体には `try-catch` を書かないようにしてください。

### 誤った例

```ts
class ParseError extends Error {}
// ---cut-before---
import { Result } from '@praha/byethrow';

// ❌ コールバック内で try-catch を使っている
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

### 正しい例

```ts
class ParseError extends Error {}
// ---cut-before---
import { Result } from '@praha/byethrow';

const parseJson = Result.fn({
  try: (value: string) => JSON.parse(value) as unknown,
  catch: (error) => new ParseError('Invalid JSON', { cause: error }),
});

// ✅ 例外を投げるコードを Result.fn() でラップしている
const result = Result.pipe(
  Result.succeed('{"key": "value"}'),
  Result.andThen(parseJson),
);
```

## オプション

このルールにオプションはありません。
