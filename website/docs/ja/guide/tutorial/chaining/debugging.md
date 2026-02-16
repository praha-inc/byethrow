---
description: '@praha/byethrowのinspectとinspectError関数を使って、Resultパイプラインをデバッグし値を確認する方法を学びましょう。'
---

# Result をデバッグする

複雑なパイプラインをデバッグする際、各ステップで何が起こっているかを確認する必要があります。
`inspect` と `inspectError` 関数を使うと、フローに影響を与えずに値を確認できます。

## `inspect` - 成功値の確認

`inspect` は成功値に対して副作用関数を実行しますが、常に元の結果を変更せずに返します。

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.succeed(42),
  Result.inspect((value) => console.log('Value:', value)),
  Result.map((x) => x * 2),
);
// コンソール: "Value: 42"
// { type: 'Success', value: 84 }
```

失敗時、`inspect` は何もしません。

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.fail('error'),
  Result.inspect((value) => console.log('Value:', value)), // 呼ばれない
);
// { type: 'Failure', error: 'error' }
```

## `inspectError` - 失敗値の確認

`inspectError` は失敗値に対して副作用関数を実行しますが、常に元の結果を変更せずに返します。

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.fail('Something went wrong'),
  Result.inspectError((error) => console.error('Error:', error)),
);
// コンソール: "Error: Something went wrong"
// { type: 'Failure', error: 'Something went wrong' }
```

成功時、`inspectError` は何もしません。

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.succeed(42),
  Result.inspectError((error) => console.error('Error:', error)), // 呼ばれない
);
// { type: 'Success', value: 42 }
```

## 例：パイプラインのトレース

```ts
type Input = { data: string };
type Transformed = { transformedData: string };
type Saved = { id: string };
declare const validate: (input: Input) => Result.Result<Input, 'ValidateFailed'>;
declare const transform: (input: Input) => Result.Result<Transformed, 'TransformFailed'>;
declare const save: (input: Transformed) => Result.Result<Saved, 'SaveFailed'>;
// ---cut-before---
import { Result } from '@praha/byethrow';

const processData = (input: Input) => {
  return Result.pipe(
    Result.succeed(input),
    Result.inspect((value) => console.log('Input:', value)),
    Result.andThrough(validate),
    Result.inspect((value) => console.log('After validation:', value)),
    Result.andThen(transform),
    Result.inspect((value) => console.log('After transform:', value)),
    Result.andThen(save),
    Result.inspect((value) => console.log('After save:', value)),
    Result.inspectError((error) => console.error('Pipeline failed:', error)),
  );
};
```

## リファレンス

| 関数                                                                | 目的               |
|-------------------------------------------------------------------|------------------|
| [inspect(fn)](../../../../api/functions/Result.inspect)           | 成功値に対して副作用を実行する  |
| [inspectError(fn)](../../../../api/functions/Result.inspectError) | エラー値に対して副作用を実行する |
