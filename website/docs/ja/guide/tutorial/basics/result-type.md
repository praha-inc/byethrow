---
description: 'Result<T, E>型の構造。SuccessとFailureのユニオン型、非同期処理のためのResultAsync、ResultMaybeAsync・InferSuccess・InferFailureなどのユーティリティ型を解説。'
---

# Result 型について

関数を使い始める前に、`Result` 型とは何か、なぜ便利なのかを見ていきましょう。

## Result とは？

`Result` は、失敗する可能性のある操作の結果を表します。
常に次の 2 つの状態のどちらかになります。

- **Success**：操作が成功し、`value` を持ちます。
- **Failure**：操作が失敗し、`error` を持ちます。

例外を投げる方法とは異なり、`Result` を返すと失敗の可能性が型システムそのものに表現されます。

## 構造

`Result` は、2 つの状態を区別する `type` プロパティを持つプレーンオブジェクトです。

```ts
import { Result } from '@praha/byethrow';

// Success は値を持つ
const success: Result.Success<number> = {
  type: 'Success',
  value: 42,
};

// Failure はエラーを持つ
const failure: Result.Failure<string> = {
  type: 'Failure',
  error: 'Something went wrong',
};
```

ただのオブジェクトなので、`Result` はそのままログに出力したり、JSON にシリアライズしたり、テストで比較したりできます。
実際には、このオブジェクトを手で書くことはほとんどありません。次のページでは、これらを作成するヘルパー関数を紹介します。

## ユニオン型

`Result.Result<T, E>` は `Success<T>` と `Failure<E>` のユニオン型です。
`T` は成功値の型、`E` はエラーの型です。

```ts
import { Result } from '@praha/byethrow';

// Success<number> または Failure<string> を返す
const divide = (a: number, b: number): Result.Result<number, string> => {
  if (b === 0) {
    return { type: 'Failure', error: 'Cannot divide by zero' };
  }
  return { type: 'Success', value: a / b };
};

const result = divide(10, 2);
// 型: Result.Result<number, string>
```

## なぜ例外ではなく Result を使うのか？

### 1. 失敗がシグネチャに現れる

例外の場合、関数が例外を投げるかどうかはシグネチャからわかりません。

```ts
// @noErrors
type Config = { host: string; port: number };
// ---cut-before---
// ❌ 例外を投げる？シグネチャからはわからない
const parseConfig = (path: string): Config => {
  // ...
}
```

`Result` を使えば、戻り値の型から明らかになります。

```ts
// @noErrors
import { Result } from '@praha/byethrow';
type Config = { host: string; port: number };
class ParseError extends Error {}
// ---cut-before---
// ✅ 失敗する可能性とその内容が戻り値の型からわかる
const parseConfig = (path: string): Result.Result<Config, ParseError> => {
  // ...
}
```

### 2. エラーが型を保つ

catch した例外は常に `unknown` です。`Result` はエラーの正確な型を保ちます。

```ts
import { Result } from '@praha/byethrow';

type ValidationError = { field: string; message: string };

const validateEmail = (email: string): Result.Result<string, ValidationError> => {
  if (!email.includes('@')) {
    return Result.fail({ field: 'email', message: 'Invalid email format' });
  }
  return Result.succeed(email);
};

const result = validateEmail('test');
if (Result.isFailure(result)) {
  // TypeScript は result.error が ValidationError であることを知っている
  console.log(`Error in ${result.error.field}: ${result.error.message}`);
}
```

### 3. Result は合成できる

`Result` はつなげて使うことができ、各ステップのエラー型は自動的にユニオン型として集められます。
その仕組みは「[処理をつなげる](../chaining/pipe-basics)」章で学びます。

```ts
// @filename: type.ts
export type User = {
  id: string;
  name: string;
};

// @filename: functions.ts
import { Result } from '@praha/byethrow';
import type { User } from './type';

class ValidationError extends Error {}
export declare const validate: (value: User) => Result.Result<User, ValidationError>;

class TransformError extends Error {}
export declare const transform: (value: User) => Result.Result<User, TransformError>;

class SaveError extends Error {}
export declare const save: (value: User) => Result.ResultAsync<User, SaveError>;

// @filename: index.ts
import { validate, transform, save } from './functions';
const input = { id: '', name: '' };
// ---cut-before---
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.succeed(input),
  Result.andThen(validate),
  Result.andThen(transform),
  Result.andThen(save),
);
// 型: Result.ResultAsync<User, ValidationError | TransformError | SaveError>
```

## 非同期の Result

非同期の `Result` は `ResultAsync<T, E>` で表します。これは単なる `Promise<Result<T, E>>` のエイリアスです。

```ts
import { Result } from '@praha/byethrow';

const asyncResult: Result.ResultAsync<number, never> = Promise.resolve(Result.succeed(42));
// 型: Result.ResultAsync<number, never>

// ResultAsync はただの Promise なので、await できる
const resolved = await asyncResult;
// 型: Result.Result<number, never>
```

### 同期と非同期を混在させる

`@praha/byethrow` のすべての関数は、`Result` と `ResultAsync` の両方を受け付けます。
パイプラインの中で同期と非同期のステップを混在させると、最初の非同期ステップ以降の結果は自動的に `ResultAsync` になります。

```ts
import { Result } from '@praha/byethrow';

// 同期関数
const validate = (input: string): Result.Result<string, Error> => {
  if (input.length === 0) {
    return Result.fail(new Error('Input is empty'));
  }
  return Result.succeed(input);
};

// 非同期関数
const fetchData = async (input: string): Result.ResultAsync<number, Error> => {
  // API 呼び出しをシミュレート
  return Result.succeed(input.length);
};

const result = Result.pipe(
  Result.succeed('hello'),
  Result.andThen(validate),  // 同期
  Result.andThen(fetchData), // 非同期: ここからパイプラインは非同期になる
  Result.andThen((n) => Result.succeed(n * 2)), // 同期だが、非同期のパイプライン内で実行される
);
// 型: Result.ResultAsync<number, Error>
```

## ユーティリティ型

`Result` を扱う独自の関数を書くときに役立つ型もいくつか用意されています。

### `ResultMaybeAsync`

`ResultMaybeAsync<T, E>` は、`Result<T, E>` または `ResultAsync<T, E>` のどちらかを表します。
実装が同期にも非同期にもなり得る場合に便利です。

```ts
import { Result } from '@praha/byethrow';

type User = { id: string; name: string };

type UserRepository = {
  // 同期（例: インメモリ）と非同期（例: データベース）のどちらの実装も許容する
  findById: (id: string) => Result.ResultMaybeAsync<User, 'NotFound'>;
};
```

### `InferSuccess` と `InferFailure`

`InferSuccess` と `InferFailure` は、`Result` 型、または `Result` を返す関数から、成功値の型とエラーの型を取り出します。

```ts
import { Result } from '@praha/byethrow';

declare const findUser: (id: string) => Result.ResultAsync<{ id: string; name: string }, 'NotFound'>;

type User = Result.InferSuccess<typeof findUser>;
// 型: { id: string; name: string }

type FindUserError = Result.InferFailure<typeof findUser>;
// 型: 'NotFound'
```

## リファレンス

| API                                                                      | 用途                                                          |
|--------------------------------------------------------------------------|---------------------------------------------------------------|
| [Success\<T>](../../../../api/types/Result.Success)                      | 成功した結果を表す                                            |
| [Failure\<E>](../../../../api/types/Result.Failure)                      | 失敗した結果を表す                                            |
| [Result\<T, E>](../../../../api/types/Result.Result)                     | `Success` と `Failure` のユニオン型                           |
| [ResultAsync\<T, E>](../../../../api/types/Result.ResultAsync)           | `Promise<Result<T, E>>` のエイリアス                          |
| [ResultMaybeAsync\<T, E>](../../../../api/types/Result.ResultMaybeAsync) | `Result` または `ResultAsync` のどちらか                      |
| [ResultFor\<R, T, E>](../../../../api/types/Result.ResultFor)            | `R` が非同期かどうかに応じて `Result` か `ResultAsync` になる |
| [InferSuccess\<T>](../../../../api/types/Result.InferSuccess)            | 成功値の型を取り出す                                          |
| [InferFailure\<T>](../../../../api/types/Result.InferFailure)            | エラーの型を取り出す                                          |
