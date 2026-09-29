---
description: 'isSuccess・isFailure・isResultの型ガードでResultの状態を確認し、型を絞り込んで値やエラーに安全にアクセスする方法。'
---

# Result を確認する

`Result` の中身を読み取る前に、それが成功なのか失敗なのかを知る必要があります。
このページでは、`Result` の状態を確認して型を絞り込む型ガード関数を紹介します。

## `isSuccess` で成功を確認する

`isSuccess` は、`Result` が `Success` の場合に `true` を返します。
`if` ブロックの中では TypeScript が型を絞り込むため、`value` に安全にアクセスできます。

```ts
import { Result } from '@praha/byethrow';

const result: Result.Result<number, string> = Result.succeed(42);

if (Result.isSuccess(result)) {
  // result は Success<number> に絞り込まれる
  console.log(result.value); // 42
}
```

型の絞り込みはもう一方の分岐でも働きます。
`Success` でなければ `Failure` のはずなので、そこでは `error` が使えます。

```ts
import { Result } from '@praha/byethrow';

const describe = (result: Result.Result<string, Error>) => {
  if (Result.isSuccess(result)) {
    // ✅ ここでは `value` が使える
    return result.value.toUpperCase();
  }
  // ✅ ここでは `error` が使える
  return `Error: ${result.error.message}`;
};
```

## `isFailure` で失敗を確認する

`isFailure` は `isSuccess` の対になる関数で、`Result` が `Failure` の場合に `true` を返します。

```ts
import { Result } from '@praha/byethrow';

const result: Result.Result<number, string> = Result.fail('Something went wrong');

if (Result.isFailure(result)) {
  // result は Failure<string> に絞り込まれる
  console.log(result.error); // "Something went wrong"
}
```

### 早期リターン

よく使われるパターンは、先に失敗を処理して早期リターンすることです。
`if` ブロックの後では、結果が `Success` であることがわかっています。

```ts
type User = { id: number; name: string };
// ---cut-before---
import { Result } from '@praha/byethrow';

const getUserName = (result: Result.Result<User, string>) => {
  if (Result.isFailure(result)) {
    console.error('Failed to find user:', result.error);
    return null;
  }

  // result は Success<User> に絞り込まれる
  return result.value.name;
};
```

:::tip
`!Result.isSuccess(result)` よりも `Result.isFailure(result)` を使いましょう（逆も同様です）。
[no-negated-type-guards](../../ecosystem/linter/no-negated-type-guards) Lint ルールを使うと、これを自動的に強制できます。
:::

## `isResult` で値が Result かどうかを確認する

`isResult` は、任意の値がそもそも `Result` かどうかを確認します。
型のわからない値を受け取るときに便利です。

```ts
import { Result } from '@praha/byethrow';

const stringify = (value: unknown): string => {
  if (Result.isResult(value)) {
    // value は Result<unknown, unknown> に絞り込まれる
    if (Result.isSuccess(value)) {
      return `Success: ${JSON.stringify(value.value)}`;
    }
    return `Failure: ${JSON.stringify(value.error)}`;
  }
  return JSON.stringify(value);
};
```

## リファレンス

| API                                                             | 用途                                 |
|-----------------------------------------------------------------|--------------------------------------|
| [isSuccess(result)](../../../../api/functions/Result.isSuccess) | Result が Success かどうかを確認する |
| [isFailure(result)](../../../../api/functions/Result.isFailure) | Result が Failure かどうかを確認する |
| [isResult(value)](../../../../api/functions/Result.isResult)    | 値が Result かどうかを確認する       |
