---
description: 'Result.succeed・Result.fail・Result.doを使ってSuccessやFailureのResult値を作成する方法と非同期対応の解説。'
---

# Result を作成する

`Result` 型を理解したところで、ライブラリのヘルパー関数を使って Result を作成する方法を学びましょう。

## `succeed` で成功を表す `Result` を作成する

`succeed` 関数は成功を表す `Result` を作成します。

```ts
import { Result } from '@praha/byethrow';

// 値を持つ場合
const success = Result.succeed(42);
// 型: Result.Result<number, never>

// 値を持たない場合（void）
const voidSuccess = Result.succeed();
// 型: Result.Result<void, never>
```

### 非同期値の場合

`succeed` は `Promise` を自動的には await しません。渡す前に自分で await してください。

```ts
import { Result } from '@praha/byethrow';

const asyncSuccess = Result.succeed(await Promise.resolve('hello'));
// 型: Result.Result<string, never>
```

## `fail` で失敗を表す `Result` を作成する

`fail` 関数は失敗を表す `Result` を作成します。

```ts
import { Result } from '@praha/byethrow';

// エラー値を持つ場合
const failure = Result.fail('Something went wrong');
// 型: Result.Result<never, string>

// 値を持たない場合（void）
const voidFailure = Result.fail();
// 型: Result.Result<never, void>
```

### 非同期エラーの場合

`succeed` と同様に、`fail` も `Promise` を自動的には await しません。渡す前に自分で await してください。

```ts
import { Result } from '@praha/byethrow';

const asyncFailure = Result.fail(await Promise.resolve('async error'));
// 型: Result.Result<never, string>
```

## `do` でパイプラインを開始する

`do` 関数は空のオブジェクトでパイプラインを開始する便利な方法です。

```ts
import { Result } from '@praha/byethrow';

const start = Result.do();
// 型: Result.Result<{}, never>
```

これは、オブジェクトを段階的に構築する際に特に便利です（このパターンは後のセクションで詳しく解説します）。

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.do(),
  Result.bind('name', () => Result.succeed('Alice')),
  Result.bind('age', () => Result.succeed(30)),
);
// 型: Result.Result<{ name: string; age: number }, never>
```

## リファレンス

| 関数                                                         | 目的             |
|------------------------------------------------------------|----------------|
| [succeed(value)](../../../../api/functions/Result.succeed) | Success の結果を作成 |
| [fail(error)](../../../../api/functions/Result.fail)       | Failure の結果を作成 |
| [do()](../../../../api/functions/Result.do)                | 空のオブジェクトで開始    |
