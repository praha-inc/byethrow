---
description: '@praha/byethrowのisSuccessとisFailure型ガードを使用して、Result型を安全にチェックして絞り込む方法を学びましょう。'
---

# Result を確認する

`Result` を作成または受け取った後、その内容にアクセスする前に、それが成功か失敗かを判定する必要があります。
このセクションでは、これを安全に行うための型ガード関数について説明します。

## `isSuccess` で成功をチェックする

`isSuccess` 関数は、`Result` が `Success` かどうかをチェックする型ガード関数です。

```ts
import { Result } from '@praha/byethrow';

const result: Result.Result<number, string> = Result.succeed(42);

if (Result.isSuccess(result)) {
  // TypeScript はここで result が Success<number> であることを知っている
  console.log(result.value); // 42
}
```

### 型の絞り込み

`isSuccess` 関数を使用することで、型を絞り込み `value` プロパティへ安全にアクセス出来るようになります。

```ts
import { Result } from '@praha/byethrow';

const processResult = (result: Result.Result<string, Error>) => {
  if (Result.isSuccess(result)) {
    // ✅ TypeScript は `value` が存在することを知っている
    return result.value.toUpperCase();
  }
  // ✅ TypeScript はここで `error` が存在することを知っている
  return `Error: ${result.error.message}`;
};
```

## `isFailure` で失敗をチェックする

`isFailure` 関数は、`Result` が `Failure` かどうかをチェックする型ガード関数です。

```ts
import { Result } from '@praha/byethrow';

const result: Result.Result<number, string> = Result.fail('Something went wrong');

if (Result.isFailure(result)) {
  // TypeScript はここで result が Failure<string> であることを知っている
  console.log(result.error); // "Something went wrong"
}
```

### 早期リターン

よくあるパターンは、最初に失敗をチェックして早期リターンすることです。

```ts
type User = { id: number; name: string };
// ---cut-before---
import { Result } from '@praha/byethrow';

const handleUserLookup = (result: Result.Result<User, string>) => {
  if (Result.isFailure(result)) {
    console.error('Failed to find user:', result.error);
    return null;
  }

  // 早期リターン後、TypeScript は result が Success であることを知っている
  return result.value;
};
```

## `isResult` で値が `Result` かどうかをチェックする

`isResult` 関数は、値が `Result` であるかどうかをチェックする型ガード関数です。
任意の値が `Result` かどうかをチェックする必要がある場合に便利です。

```ts
import { Result } from '@praha/byethrow';

const maybeResult: unknown = Result.succeed(42);

if (Result.isResult(maybeResult)) {
  // TypeScript は maybeResult が Result<unknown, unknown> であることを知っている
  if (Result.isSuccess(maybeResult)) {
    console.log(maybeResult.value);
  }
}
```

### 汎用ユーティリティ

よくあるパターンは、様々な型を受け入れて `Result` を特別に扱う関数を書くことです。

```ts
import { Result } from '@praha/byethrow';

const stringify = (value: unknown): string => {
  if (Result.isResult(value)) {
    if (Result.isSuccess(value)) {
      return `Success: ${JSON.stringify(value.value)}`;
    }
    return `Failure: ${JSON.stringify(value.error)}`;
  }
  return JSON.stringify(value);
};
```

## リファレンス

| 関数                                                              | 目的                     |
|-----------------------------------------------------------------|------------------------|
| [isSuccess(result)](../../../../api/functions/Result.isSuccess) | Result が Success かチェック |
| [isFailure(result)](../../../../api/functions/Result.isFailure) | Result が Failure かチェック |
| [isResult(value)](../../../../api/functions/Result.isResult)    | 値が Result かどうかをチェック    |
