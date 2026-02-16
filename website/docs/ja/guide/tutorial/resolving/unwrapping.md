---
description: '@praha/byethrowのunwrapおよびunwrapError関数を使用して、オプションのデフォルト値を指定しながらResultから値を取り出す方法を学びましょう。'
---

# Result の値を取り出す

`Result` から実際の値を取り出し、`Result` から通常の値に戻す必要がある場合、`unwrap` および `unwrapError` 関数が役立ちます。
これらの関数は、成功値とエラー値をそれぞれ取り出すための便利な方法を提供します。

## `unwrap` - 成功値を取り出す

`unwrap` 関数は `Result` から成功値を取り出します。

```ts
import { Result } from '@praha/byethrow';

const result = Result.succeed(42);
const value = Result.unwrap(result);
// value: 42
```

### 失敗時の動作

`Result` が `Failure` でデフォルト値が指定されていない場合、`unwrap` はエラーを投げます。

```ts
import { Result } from '@praha/byethrow';

const result = Result.fail(new Error('Something went wrong'));
const value = Result.unwrap(result);
// Throws: Error('Something went wrong')
```

### デフォルト値の指定

デフォルト値を指定することで、エラーが投げられるのを避けられます。

```ts
import { Result } from '@praha/byethrow';

const result = Result.fail('error');
const value = Result.unwrap(result, 0);
// value: 0 (デフォルト値)
```

```ts
import { Result } from '@praha/byethrow';

const success = Result.succeed(42);
const value = Result.unwrap(success, 0);
// value: 42 (成功値、デフォルトは無視される)
```

## `unwrapError` - 失敗値を取り出す

`unwrapError` 関数は逆の動作で失敗値を取り出します。

```ts
import { Result } from '@praha/byethrow';

const result = Result.fail('Something went wrong');
const error = Result.unwrapError(result);
// error: 'Something went wrong'
```

### 成功時の動作

`Result` が `Success` でデフォルト値が指定されていない場合、`unwrapError` はエラーではなく成功値を投げます。

```ts
import { Result } from '@praha/byethrow';

const result = Result.succeed(42);
const error = Result.unwrapError(result);
// Throws: 42
```

### デフォルトエラーの指定

デフォルト値を指定することで、成功値が投げられるのを避けられます。

```ts
import { Result } from '@praha/byethrow';

const result = Result.succeed(42);
const error = Result.unwrapError(result, 'No error');
// error: 'No error' (デフォルト値)
```

```ts
import { Result } from '@praha/byethrow';

const failure = Result.fail('Something went wrong');
const error = Result.unwrapError(failure, 'No error');
// error: 'Something went wrong' (失敗値、デフォルトは無視される)
```

## 非同期 `Result`

`unwrap` と `unwrapError` は `ResultAsync` でも動作します。


```ts
import { Result } from '@praha/byethrow';

const asyncResult = Result.succeed(Promise.resolve(42));

// Promise を返す
const value = await Result.unwrap(asyncResult);
// value: 42
```

デフォルト値を指定する場合。

```ts
import { Result } from '@praha/byethrow';

const asyncResult = Result.fail(Promise.resolve('error'));
const value = await Result.unwrap(asyncResult, 0);
// value: 0
```

## `unwrap` を使うべき場面

### 適切なユースケース

`unwrap` はアプリケーションの境界（HTTP ハンドラや CLI のエントリーポイントなど）で使用します。
`Result` の世界を抜けて、外部の世界に通常の値を返す必要がある場所です。

```ts
declare const processRequest: (req: Request) => Result.ResultAsync<number, 'NotFound' | 'Unexpected'>;
// ---cut-before---
import { Result } from '@praha/byethrow';

const handleRequest = async (req: Request): Promise<Response> => {
  return await Result.pipe(
    processRequest(req),
    Result.map((result) => {
      return new Response(JSON.stringify(result), { status: 200 });
    }),
    Result.orElse((error) => {
      switch (error) {
        case 'NotFound':
          return Result.succeed(new Response('Not Found', { status: 404 }));
        default:
          return Result.fail(error);
      }
    }),
    // 予期しないエラーはここで投げられ、Sentry や CloudWatch などの
    // インフラレベルのエラー監視ツールで検出できます。
    Result.unwrap(),
  );
};
```

### `unwrap` を避けるべき場面

ロジックの途中で `unwrap` を呼び出すことは避けてください。
そうすると `Result` の「世界」を早期に抜けてしまい、型安全なエラー処理の利点が失われます。
代わりに、値を `Result` でラップしたまま保持し、`map`、`flatMap`、`orElse` などの関数を組み合わせて変換してください。

```ts
import { Result } from '@praha/byethrow';

// ❌ これはやめましょう
const bad = Result.unwrap(Result.succeed(42)) * 2;

// ✅ 代わりにこうしましょう
const good = Result.pipe(
  Result.succeed(42),
  Result.map((x) => x * 2),
);
```

## リファレンス

| 関数                                                                  | 目的                                        |
|---------------------------------------------------------------------|-------------------------------------------|
| [unwrap(result)](../../../../api/functions/Result.unwrap)           | Result から成功値を取り出す。失敗時はエラーを投げるまたはデフォルト値を返す |
| [unwrapError(result)](../../../../api/functions/Result.unwrapError) | Result からエラー値を取り出す。成功時は値を投げるまたはデフォルト値を返す  |
