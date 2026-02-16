---
description: '@praha/byethrowのfnとtry関数を使用して、例外を投げる関数をラップし、Result型に変換する方法を学びましょう。'
---

# 関数をラップする

例外を投げるコード（サードパーティライブラリ、組み込み API、レガシーコード）を扱う必要がある場合があります。
`fn` と `try` 関数は、これらの例外を投げる可能性のある操作をラップし、`Result` 型に変換します。

## `fn`で再利用可能な関数を作成する

`fn` 関数は、エラーを投げる可能性のある関数をラップし、`Result` 返す新しい関数を返します。
再利用可能な関数を作成したい場合に便利です。

```ts
import { Result } from '@praha/byethrow';

const parseJSON = Result.fn({
  try: (input: string) => JSON.parse(input) as unknown,
  catch: (error) => new Error('Invalid JSON', { cause: error }),
});

const result = parseJSON('{"name": "Alice"}');
// 型: Result.Result<unknown, Error>

if (Result.isSuccess(result)) {
  console.log(result.value); // { name: "Alice" }
}
```

### 動作の仕組み

- `try` プロパティには、エラーを投げる可能性のある関数を含めます（引数を受け取れます）
- `catch` プロパティは、投げられらたエラーを処理し、任意のエラー型に変換します
- エラーを投げる代わりに `Result` を返すラップされた関数を返します

### エラーを投げない関数

関数がエラーを投げない事が確実な場合は、`safe` オプションを使用します。

```ts
import { Result } from '@praha/byethrow';

const double = Result.fn({
  safe: true,
  try: (x: number) => x * 2,
});

const result = double(5);
// 型: Result.Result<number, never>
// エラー型は `never` です。例外が発生しないことを保証しているためです
```

### 非同期関数での使用

`fn` 関数は非同期関数をシームレスに処理し、`ResultAsync` を生成する関数を返します。

```ts
import { Result } from '@praha/byethrow';

const fetchUser = Result.fn({
  try: async (id: string) => {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) throw new Error('Not found');
    return await response.json() as { id: string; name: string };
  },
  catch: (error) => new Error('Failed to fetch user', { cause: error }),
});

const result = await fetchUser('123');
// 型: Result.Result<{ id: string; name: string }, Error>
```

## `try` で実行とラップを行う

`try` 関数は、エラーを投げる可能性のある関数を実行し、直接 `Result` を返します。

```ts
import { Result } from '@praha/byethrow';

const result = Result.try({
  try: () => JSON.parse('{"name": "Alice"}') as { name: string },
  catch: (error) => new Error('Invalid JSON', { cause: error }),
});
// 型: Result.Result<{ name: string }, Error>

if (Result.isSuccess(result)) {
  console.log(result.value.name); // "Alice"
}
```

### 動作の仕組み

- `try` プロパティには、エラーを投げる可能性のある引数なしの関数を含めます
- `catch` プロパティは、投げられたエラーを処理し、任意のエラー型に変換します
- 関数は即座に実行され、`Result` を返します

### エラーを投げない関数

関数がエラーを投げない事が確実な場合は、`safe` オプションを使用します。

```ts
import { Result } from '@praha/byethrow';

const result = Result.try({
  safe: true,
  try: () => Math.random() + 1,
});
// 型: Result.Result<number, never>
// エラー型は `never` です。例外が発生しないことを保証しているためです
```

### 非同期関数での使用

`try` 関数は非同期関数をシームレスに処理し、`ResultAsync` を返します。

```ts
import { Result } from '@praha/byethrow';

const result = await Result.try({
  try: () => fetch('/api/health'),
  catch: (error) => new Error('Health check failed', { cause: error }),
});
// 型: Result.Result<Response, Error>
```

## `fn` と `try` 関数の使い分け

| シナリオ                 | 使用する関数 |
|----------------------|--------|
| 一度実行してすぐに結果を取得する     | `try`  |
| 再利用可能なラップされた関数を作成する  | `fn`   |
| 関数が引数を受け取る必要がある      | `fn`   |
| インラインの一回限りのエラーハンドリング | `try`  |

### 例：それぞれを使うべき場面

一回限りの実行には `try` を使用します。

```ts
type Config = { name: string };
class ConfigError extends Error {}
// ---cut-before---
import { Result } from '@praha/byethrow';

// 起動時に一度だけ設定を読み込む
const config = Result.try({
  try: () => JSON.parse('{"name": "Alice"}') as Config,
  catch: (error) => new ConfigError('Invalid config', { cause: error }),
});
```

再利用可能なユーティリティには `fn` を使用します。

```ts
class ParseError extends Error {}
// ---cut-before---
import { Result } from '@praha/byethrow';

// 再利用可能な JSON パーサーを作成
const parseJSON = Result.fn({
  try: (input: string) => JSON.parse(input) as unknown,
  catch: (error) => new ParseError('Invalid JSON', { cause: error }),
});

// 複数回使用
const config = parseJSON('{"name": "Alice"}');
const data = parseJSON('{"name": "Bob"}');
```

## リファレンス

| 関数                                                   | 目的                            |
|------------------------------------------------------|-------------------------------|
| [try(options)](../../../../api/functions/Result.try) | エラーを投げる関数を実行し Result を返す      |
| [fn(options)](../../../../api/functions/Result.fn)   | エラーを投げる関数を Result を返す関数にラップする |
