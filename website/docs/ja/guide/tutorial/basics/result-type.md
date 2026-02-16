---
description: '@praha/byethrowにおけるResult型とは何か、TypeScriptで成功と失敗の結果をどのように表現するかを学びましょう。'
---

# Result 型について

API の詳細に入る前に、`Result` 型とは何か、なぜ便利なのかを理解しましょう。

## `Result` とは？

`Result` は、失敗する可能性のある操作の結果を表す型です。
以下の2つの状態のいずれかになります。

- **Success**：操作が成功し、値を含んでいます
- **Failure**：操作が失敗し、エラーを含んでいます

これは例外を投げる方法とは根本的に異なります。
`Result` では、失敗の可能性が型システム自体に含まれています。

## 構造

`Result` は識別可能な `type` プロパティを持つシンプルなオブジェクトです。

```ts
import { Result } from '@praha/byethrow';

// Success の結果
const success: Result.Success<number> = {
  type: 'Success',
  value: 42,
};

// Failure の結果
const failure: Result.Failure<string> = {
  type: 'Failure',
  error: 'Something went wrong',
};
```

## ユニオン型

`Result.Result<T, E>` 型は `Success<T>` と `Failure<E>` のユニオン型です。

```ts
import { Result } from '@praha/byethrow';

// この関数は Success<number> または Failure<string> のいずれかを返します
const divide = (a: number, b: number): Result.Result<number, string> => {
  if (b === 0) {
    return { type: 'Failure', error: 'Cannot divide by zero' };
  }
  return { type: 'Success', value: a / b };
};

const result = divide(10, 2);
// 型: Result.Result<number, string>
```

## なぜ例外の代わりに `Result` を使うのか？

### 1. 明示的なエラーハンドリング

例外の場合、関数がエラーを投げるかどうかはわかりません。

```ts
// @noErrors
type Config = { host: string; port: number };
// ---cut-before---
// ❌ エラーを投げるかどうか、シグネチャからはわからない
const parseConfig = (path: string): Config => {
  // ...
}
```

`Result` を使えば、関数がエラーを返す可能性があることが明確になります。

```ts
// @noErrors
import { Result } from '@praha/byethrow';
type Config = { host: string; port: number };
class ParseError extends Error {}
// ---cut-before---
// ✅ 戻り値の型から失敗する可能性があることがわかる
const parseConfig = (path: string): Result.Result<Config, ParseError> => {
  // ...
}
```

### 2. 型安全なエラー

例外は型情報を失います。`Result` は型情報を保持します。

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

### 3. 合成可能

`Result` は簡単にチェーンして合成できます（これは後のセクションで詳しく解説します）。

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

## 非同期 `Result`

`@praha/byethrow` 非同期操作もサポートしています。
非同期の `Result` は `ResultAsync<T, E>` という型エイリアスで、`Promise<Result<T, E>>` を表します。

```ts
import { Result } from '@praha/byethrow';

// ResultAsync は単に Promise<Result<T, E>> です
type ResultAsync<T, E> = Promise<Result.Result<T, E>>;

// ライブラリは同期と非同期の両方をシームレスに扱います
const asyncResult = Result.succeed(Promise.resolve(42));
// 型: Result.ResultAsync<number, never>

const resolved = await asyncResult;
// 型: Result.Result<number, never>
```

### シームレスな同期/非同期チェーン

`@praha/byethrow` の強力な機能の1つは、同期と非同期の `Result` をシームレスにチェーンできることです。
パイプライン内で同期と非同期の操作を混在させると、結果は自動的に `ResultAsync` になります。

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

// 同期と非同期はシームレスにチェーンできます
const result = Result.pipe(
  Result.succeed('hello'),
  Result.andThen(validate),  // 同期
  Result.andThen(fetchData), // 非同期 - ここからパイプラインは非同期になります
  Result.andThen((n) => Result.succeed(n * 2)), // 同期だが、非同期コンテキスト内
);
// 型: Result.ResultAsync<number, Error>
```

## リファレンス

| 関数                                                            | 目的                         |
|---------------------------------------------------------------|----------------------------|
| [Success\<T>](../../../../api/types/Result.Success)           | 成功した結果を表す                  |
| [Failure\<T>](../../../../api/types/Result.Failure)           | 失敗した結果を表す                  |
| [Result<T, E>](../../../../api/types/Result.Result)           | Success または Failure のユニオン型 |
| [ResultAsync<T, E>](../../../../api/types/Result.ResultAsync) | Result の非同期バリアント           |
