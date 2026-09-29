---
description: 'Result.assertSuccess と Result.assertFailure で、すべてのエラー（または成功）が処理済みであることをコンパイル時に保証する方法と、unwrap と組み合わせて throw しない値の取り出しを実現する方法を解説します。'
---

# Result をアサートする

`orElse` などですべてのエラーを処理し終えると、`Result` のエラー型は `never` になります。
`assertSuccess` と `assertFailure` を使うと、このことをコードで明示でき、TypeScript がそれをコンパイル時に検証します。

## `assertSuccess` で成功をアサートする

`assertSuccess` は、エラー型が `never` の `Result` を受け取り、それを `Success` として返します。

```ts
import { Result } from '@praha/byethrow';

const result: Result.Result<number, never> = Result.succeed(42);
const success = Result.assertSuccess(result);
// success: { type: 'Success', value: 42 }
```

### エラーが残っている場合

エラー型が `never` でない、つまりまだエラーが起こりうる場合、TypeScript はコンパイルエラーを報告します。

```ts
// @errors: 2345
import { Result } from '@praha/byethrow';

const result: Result.Result<number, string> = Result.succeed(42);

// ❌ エラー型が never ではなく string になっている
const success = Result.assertSuccess(result);
```

### `orElse` ですべてのエラーを処理する

`orElse` でエラーを処理して、エラー型を `never` にしましょう。

```ts
import { Result } from '@praha/byethrow';

declare const getResult: () => Result.Result<number, 'NotFound' | 'NetworkError'>;

const result = Result.pipe(
  getResult(),
  Result.orElse(() => Result.succeed(0)), // エラー型は never になる
  Result.assertSuccess,
);
// result: { type: 'Success', value: number }
```

後から `getResult` に新しいエラーを追加して処理し忘れた場合、`assertSuccess` がコンパイルエラーになり、修正が必要な箇所を教えてくれます。

## `assertFailure` で失敗をアサートする

`assertFailure` は `assertSuccess` の対になる関数です。
成功型が `never` の `Result` を受け取り、それを `Failure` として返します。

```ts
import { Result } from '@praha/byethrow';

const result: Result.Result<never, string> = Result.fail('error');
const failure = Result.assertFailure(result);
// failure: { type: 'Failure', error: 'error' }
```

成功型が `never` でない場合、TypeScript はコンパイルエラーを報告します。

```ts
// @errors: 2345
import { Result } from '@praha/byethrow';

const result: Result.Result<number, string> = Result.fail('error');

// ❌ 成功型が never ではなく number になっている
const failure = Result.assertFailure(result);
```

## `assertSuccess` と `unwrap` で安全に値を取り出す

`unwrap` は `Failure` を受け取ると throw します。
先に `assertSuccess` を呼び出しておけば、`Failure` が残っていないことがコンパイル時に保証されるため、`unwrap` が throw することはありません。

```ts
import { Result } from '@praha/byethrow';

declare const getResult: () => Result.Result<number, 'NotFound' | 'NetworkError'>;

const value = Result.pipe(
  getResult(),
  Result.orElse(() => Result.succeed(0)), // すべてのエラーを処理する
  Result.assertSuccess,                   // エラーが残っていないことを検証する
  Result.unwrap(),                        // throw しない
);
// value: number
```

このパターンは、最終的な値を安全に取り出したいアプリケーションの境界で特に役立ちます。

## 型ガードとの比較

`assertSuccess` / `assertFailure` と `isSuccess` / `isFailure` は目的が異なります。

| 関数                              | チェックのタイミング | 用途                                         |
|-----------------------------------|----------------------|----------------------------------------------|
| `isSuccess` / `isFailure`         | 実行時               | `Result` が成功か失敗かで処理を分岐する      |
| `assertSuccess` / `assertFailure` | コンパイル時         | 一方のバリアントしかありえないことを宣言する |

安全策として、`assertSuccess` と `assertFailure` は、どこか別の場所での誤った型アサーションなどが原因で想定外のバリアントを受け取った場合、実行時にもエラーを throw します。

## リファレンス

| API                                                                     | 用途                                                                              |
|-------------------------------------------------------------------------|-----------------------------------------------------------------------------------|
| [assertSuccess(result)](../../../../api/functions/Result.assertSuccess) | Result が Success であることをアサートする（エラー型は `never` である必要がある） |
| [assertFailure(result)](../../../../api/functions/Result.assertFailure) | Result が Failure であることをアサートする（成功型は `never` である必要がある）   |
