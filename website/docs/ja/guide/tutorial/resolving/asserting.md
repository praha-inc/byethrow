---
description: '@praha/byethrowのassertSuccessとassertFailureを使用して、コンパイル時にResult型を検証し、安全に値を取り出す方法を学びましょう。'
---

# Result を検証する

`orElse` や `andThen` などの操作ですべてのエラーを処理し尽くした場合、`assertSuccess` と `assertFailure` を使用してコンパイル時に `Result` 型を検証できます。
`unwrap` や `unwrapError` と組み合わせることで、安全な値の取り出しが可能になります。

## `assertSuccess` で成功をアサートする

`assertSuccess` 関数は `Result` が `Success` であることを検証します。
この関数はエラー型が `never` であることを要求し、コンパイル時に `Result` が確実に `Success` であることを保証します。

```ts
import { Result } from '@praha/byethrow';

const result: Result.Result<number, never> = Result.succeed(42);
const success = Result.assertSuccess(result);
// success: { type: 'Success', value: 42 }
```

### エラー型が `never` でない場合

エラー型が `never` でない場合、TypeScript はコンパイルエラーを出します。

```ts
// @errors: 2345
import { Result } from '@praha/byethrow';

const result: Result.Result<number, string> = Result.succeed(42);

// ❌ TypeScript エラー: エラー型が string であり never ではない
const success = Result.assertSuccess(result);
```

### `orElse` でエラー型を `never` にする

`orElse` を使用してすべてのエラーを処理し、エラー型を `never` に絞り込みます。

```ts
import { Result } from '@praha/byethrow';

declare const getResult: () => Result.Result<number, 'NotFound' | 'NetworkError'>;

const result = Result.pipe(
  getResult(),
  Result.orElse((error) => {
    // すべてのエラーを処理してフォールバック値を返す
    return Result.succeed(0);
  }),
  // エラー型は never になった
  Result.assertSuccess,
);
// result: { type: 'Success', value: number }
```

## `assertFailure` で失敗を検証する

`assertFailure` 関数は逆の動作で `Result` が `Failure` であることを検証します。
この関数は成功型が `never` であることを要求します。

```ts
import { Result } from '@praha/byethrow';

const result: Result.Result<never, string> = Result.fail('error');
const failure = Result.assertFailure(result);
// failure: { type: 'Failure', error: 'error' }
```

### 成功型が `never` でない場合

成功型が `never` でない場合、TypeScript はコンパイルエラーを出します。

```ts
// @errors: 2345
import { Result } from '@praha/byethrow';

const result: Result.Result<number, string> = Result.fail('error');
// ❌ TypeScript エラー: 成功型が number であり never ではない
const failure = Result.assertFailure(result);
```

### `andThen` で成功型を `never` にする

`andThen` を使用してすべてのパスを失敗にし、成功型を `never` に絞り込みます。

```ts
import { Result } from '@praha/byethrow';

declare const getResult: () => Result.Result<number, string>;

const result = Result.pipe(
  getResult(),
  Result.andThen(() => {
    // すべてのパスが失敗に至る
    return Result.fail('converted error');
  }),
  // 成功型は never になった
  Result.assertFailure,
);
// result: { type: 'Failure', error: string }
```

## `assertSuccess` + `unwrap` で安全にアンラップする

`assertSuccess` と `unwrap` を組み合わせることで、`Result` から安全に値を取り出せます。
検証後はエラー型が `never` になるため、`unwrap` がエラーを投げないことが保証されます。

```ts
import { Result } from '@praha/byethrow';

declare const getResult: () => Result.Result<number, 'NotFound' | 'NetworkError'>;

const value = Result.pipe(
  getResult(),
  Result.orElse(() => Result.succeed(0)), // すべてのエラーを処理
  Result.assertSuccess, // エラー型は never になった
  Result.unwrap(), // 安全: エラーを投げないことが保証されている
);
// value: number
```

このパターンは、型安全性を確保しつつ最終的な値を取り出したいアプリケーションの境界で特に有用です。

## ランタイム型ガードとの違い

`assertSuccess`/`assertFailure` と `isSuccess`/`isFailure` の違いを理解することが重要です。

| 関数              | 目的                    | 不一致時にエラーを投げるか  |
|-----------------|-----------------------|----------------|
| `isSuccess`     | ランタイムチェック、boolean を返す | いいえ            |
| `isFailure`     | ランタイムチェック、boolean を返す | いいえ            |
| `assertSuccess` | コンパイル時検証（`never` を要求） | はい（型が間違っている場合） |
| `assertFailure` | コンパイル時検証（`never` を要求） | はい（型が間違っている場合） |

- **`isSuccess`/`isFailure`**: ランタイムで Result 型に基づいて分岐する必要がある場合に使用
- **`assertSuccess`/`assertFailure`**: コンパイル時に Result 型が確定している場合に検証するために使用

## リファレンス

| 関数                                                                      | 目的                                                 |
|-------------------------------------------------------------------------|----------------------------------------------------|
| [assertSuccess(result)](../../../../api/functions/Result.assertSuccess) | Result が Success であることを検証する（エラー型が `never` である必要あり） |
| [assertFailure(result)](../../../../api/functions/Result.assertFailure) | Result が Failure であることを検証する（成功型が `never` である必要あり）  |
