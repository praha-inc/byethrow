---
description: '@praha/byethrow の関数に渡すコールバック内での throw 文を禁止する Oxlint ルール。エラーは Result.fail() で表現します。'
---

# no-throw-in-callback

`Result.andThen`、`Result.map`、`Result.fn` など、`@praha/byethrow` の関数に渡すコールバック内で `throw` 文を使うことを禁止します。

## ルールの詳細

コールバック内で throw すると、想定内の失敗が例外に戻ってしまいます。
エラーは `Result` の型から消え、呼び出し側からは見えなくなり、処理することもできなくなります。
代わりに `Result.fail()` を返して、エラーを明示的かつ合成可能な状態に保ってください。

これは `Result.fn` や `Result.try` の `try` コールバックにも当てはまります。
これらのコールバックは、それ自体が例外を投げるコードをラップするためのものであり、自分で `throw` して失敗を伝えるためのものではありません。

### 誤った例

```ts
import { Result } from '@praha/byethrow';

// ❌ コールバック内で throw している
const result = Result.pipe(
  Result.succeed(32),
  Result.andThen((value) => {
    if (value < 0) throw new RangeError('negative value');
    return Result.succeed(value * 2);
  }),
);
```

### 正しい例

```ts
class NegativeValueError extends Error {}
// ---cut-before---
import { Result } from '@praha/byethrow';

// ✅ Failure を返している
const result = Result.pipe(
  Result.succeed(32),
  Result.andThen((value) => {
    if (value < 0) return Result.fail(new NegativeValueError());
    return Result.succeed(value * 2);
  }),
);
```

## オプション

このルールにオプションはありません。
