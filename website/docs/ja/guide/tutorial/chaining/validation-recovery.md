---
description: '元の Result を保ったまま失敗しうる追加のステップを実行する方法。検証や副作用のための Result.andThrough と、失敗後の後処理やロールバックのための Result.orThrough を解説します。'
---

# 検証と後処理

すでに持っている値を置き換えずに、失敗しうる追加のステップを実行したいことがあります。
`andThrough` と `orThrough` はそのようなステップを実行し、ステップが成功した場合は元の `Result` を保持します。

## `andThrough` でチェックを実行する

`andThrough` は `andThen` と同じように、成功値を引数に渡された関数を呼び出します。
違いは、関数が成功したときの挙動です。

- 関数が `Success` を返した場合、その値は破棄され、**元の** `Success` が返されます。
- 関数が `Failure` を返した場合、その `Failure` が返されます。
- 入力が `Failure` の場合、関数は呼び出されません。

```ts
import { Result } from '@praha/byethrow';

const checkPositive = (value: number) => {
  return 0 < value ? Result.succeed() : Result.fail('Must be positive');
};

const passed = Result.pipe(
  Result.succeed(5),
  Result.andThrough(checkPositive),
);
// { type: 'Success', value: 5 } - 元の値が保持される

const rejected = Result.pipe(
  Result.succeed(-10),
  Result.andThrough(checkPositive),
);
// { type: 'Failure', error: 'Must be positive' }

const skipped = Result.pipe(
  Result.fail('error'),
  Result.andThrough(checkPositive), // 呼び出されない
);
// { type: 'Failure', error: 'error' }
```

このため `andThrough` は、バリデーションや、監査ログの書き込みのような失敗しうる副作用に適しています。どちらの場合も、次のステップでは元の値が必要です。

### 例：複数のバリデーション

各バリデーションは値が受け入れ可能かどうかを伝えるだけなので、単に `Result.Result<void, E>` を返せば十分です。

```ts
import { Result } from '@praha/byethrow';

type User = { name: string; age: number; email: string };

declare const validateName: (user: User) => Result.Result<void, 'InvalidName'>;
declare const validateAge: (user: User) => Result.Result<void, 'InvalidAge'>;
declare const validateEmail: (user: User) => Result.Result<void, 'InvalidEmail'>;

const validateUser = (user: User) => Result.pipe(
  Result.succeed(user),
  Result.andThrough(validateName),
  Result.andThrough(validateAge),
  Result.andThrough(validateEmail),
);
// 型: Result.Result<User, 'InvalidName' | 'InvalidAge' | 'InvalidEmail'>
// すべてのバリデーションを通過すれば元の user を、そうでなければ最初のエラーを返す
```

:::tip
`andThrough` は最初に失敗したバリデーションで停止します。
すべてのバリデーションエラーを一度に報告したい場合は、代わりに [`collect`](../combining/aggregating-results) を使ってください。
:::

## `orThrough` で後処理を行う

`orThrough` は、失敗に対する `andThrough` の対になる関数です。
エラー値を引数に渡された関数を呼び出します。典型的には、失敗した処理の後処理に使います。

- 関数が `Success` を返した場合、**元の** `Failure` が返されます。
- 関数が `Failure` を返した場合、その新しい `Failure` が返されます。
- 入力が `Success` の場合、関数は呼び出されません。

```ts
import { Result } from '@praha/byethrow';

const cleanedUp = Result.pipe(
  Result.fail('original error'),
  Result.orThrough(() => Result.succeed()),
);
// { type: 'Failure', error: 'original error' } - 元のエラーが保持される

const cleanupFailed = Result.pipe(
  Result.fail('original error'),
  Result.orThrough(() => Result.fail('cleanup error')),
);
// { type: 'Failure', error: 'cleanup error' }

const skipped = Result.pipe(
  Result.succeed(5),
  Result.orThrough(() => Result.succeed()), // 呼び出されない
);
// { type: 'Success', value: 5 }
```

`orElse` とは異なり、`orThrough` が失敗を成功に変えることはありません。
失敗が起きた*からこそ*必要になる処理を行いつつ、失敗そのものは呼び出し元に報告するためのものです。

### 例：失敗時にロールバックする

投稿を 2 つのステップで作成する場合を考えます。まずコンテンツをアップロードし、次にデータベースにレコードを保存します。
レコードの保存に失敗した場合はアップロードしたファイルを削除すべきですが、呼び出し元には `SavePostFailed` エラーを返す必要があります。

```ts
import { Result } from '@praha/byethrow';

declare const uploadFile: (path: string, content: string) => Result.ResultAsync<void, 'UploadFailed'>;
declare const savePost: (id: string, path: string) => Result.ResultAsync<void, 'SavePostFailed'>;
declare const deleteFile: (path: string) => Result.ResultAsync<void, 'DeleteFileFailed'>;

const createPost = (id: string, content: string) => {
  const path = `/posts/${id}`;
  return Result.pipe(
    uploadFile(path, content),
    Result.andThen(() => Result.pipe(
      savePost(id, path),
      // savePost が失敗したときだけ実行される
      Result.orThrough(() => deleteFile(path)),
    )),
  );
};
// 型: Result.ResultAsync<void, 'UploadFailed' | 'SavePostFailed' | 'DeleteFileFailed'>
```

`orThrough` を `savePost` の直後に置いているため、後処理は保存に失敗したときだけ実行され、アップロード自体が失敗したときには実行されません。

## リファレンス

| API                                                           | 用途                                           |
|---------------------------------------------------------------|------------------------------------------------|
| [andThrough(fn)](../../../../api/functions/Result.andThrough) | 成功時にステップを実行し、元の値を保持する     |
| [orThrough(fn)](../../../../api/functions/Result.orThrough)   | 失敗時にステップを実行し、元のエラーを保持する |
