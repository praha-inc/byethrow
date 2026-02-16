---
description: '@praha/byethrowのandThroughとorThrough関数を使って、元の結果を保持しながら検証と回復を行う方法を学びましょう。'
---

# 検証とエラーからの回復

`andThrough` と `orThrough` 関数を使うと、元の結果値を保持しながら、検証や回復のための追加計算を実行できます。

## `andThrough` - 変換なしの検証

`andThrough` 関数は成功値を使って追加の計算を実行しますが、追加の計算が成功した場合は**元の結果を返します**。
元の結果または副作用の結果のいずれかが `Failure` の場合、その失敗が返されます。

これは、成功時にメインの結果を変更せずに、バリデーションや副作用を実行する場合に便利です。

### 基本的な使い方

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.succeed(5),
  Result.andThrough((value) => {
    return 0 < value ? Result.succeed() : Result.fail('Must be > 0');
  }),
);
// { type: 'Success', value: 5 } - 元の値が保持される
```

### 入力が `Failure` の場合

入力が `Failure` の場合、`andThrough` は何もせず、`Failure` をそのまま返します。

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.fail('error'),
  Result.andThrough((value) => {
    return 0 < value ? Result.succeed() : Result.fail('Must be > 0');
  }),
);
// { type: 'Failure', error: 'error' }
```

### 関数が `Failure` を返す場合

副作用が `Failure` を返すと、その失敗が代わりに返されます。

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.succeed(-10),
  Result.andThrough((value) => {
    return 0 < value ? Result.succeed() : Result.fail('Must be > 0');
  }),
);
// { type: 'Failure', error: 'Must be > 0' }
```

### 例：複数のバリデーション

よくある使い方として、値に対して複数のバリデーションを実行する例があります。

```ts
import { Result } from '@praha/byethrow';

type User = { name: string; age: number; email: string };

declare const validateName: (user: User) => Result.Result<void, 'Invalid name'>;
declare const validateAge: (user: User) => Result.Result<void, 'Invalid age'>;
declare const validateEmail: (user: User) => Result.Result<void, 'Invalid email'>;

const validateUser = (user: User) => Result.pipe(
  Result.succeed(user),
  Result.andThrough(validateName),
  Result.andThrough(validateAge),
  Result.andThrough(validateEmail),
);
// すべてのバリデーションが通れば元のユーザーを返し、そうでなければ最初のエラーを返す
```

## `orThrough` - 元の失敗を保持した回復

`orThrough` 関数は失敗からの回復を試みる追加の計算を実行しますが、回復が成功した場合は**元の失敗を返します**。

元の結果が `Success` の場合、関数を実行せずに即座に返されます。
元の結果が `Failure` の場合、エラー値で関数が実行されます。関数が `Success` を返すと、元の失敗が返されます。
関数が `Failure` を返すと、その新しい失敗が返されます。

これは、失敗した操作からの回復（例：クリーンアップ、ロールバック）を試みながら、元のエラーを保持する場合に便利です。

### 基本的な使い方

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.succeed(5),
  Result.orThrough((error) => {
    // 失敗回復ロジックをここに
    return Result.succeed();
  }),
);
// { type: 'Success', value: 5 } - 成功はそのまま通過
```

### 入力が `Failure` の場合

入力が `Failure` の場合、`orThrough` は関数を実行しますが、元のエラーを保持します。

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.fail('error'),
  Result.orThrough((error) => {
    // 失敗回復ロジックをここに
    return Result.succeed();
  }),
);
// 'Logging error: error' をログに出力し、{ type: 'Failure', error: 'error' } を返す
```

### 関数が `Failure` を返す場合

関数が `Failure` を返すと、その新しい失敗が元の失敗を置き換えます。

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.fail('original error'),
  Result.orThrough((error) => {
    return Result.fail('new error');
  }),
);
// { type: 'Failure', error: 'new error' }
```

### 例：クリーンアップを伴う回復

よくある使い方として、クリーンアップを行いながら失敗した操作からの回復を試みる例があります。

```ts
import { Result } from '@praha/byethrow';

declare const uploadFile: (path: string, content: string) => Result.Result<void, 'UploadFileFailed'>;
declare const savePost: (id: string) => Result.Result<void, 'PostCreateFailed'>;
declare const deleteFile: (path: string) => Result.Result<void, 'DeleteFileFailed'>;

const createPost = (id: string, path: string, content: string) => Result.pipe(
  uploadFile(`/posts/${id}`, content),
  Result.andThen(() => savePost(id)),
  Result.orThrough(() => deleteFile(`/posts/${id}`)),
);
// createPost が失敗すると、クリーンアップのために deleteFile が呼ばれる
// しかし元の PostCreateFailed が返される
```

## リファレンス

| 関数                                                            | 目的                     |
|---------------------------------------------------------------|------------------------|
| [andThrough(fn)](../../../../api/functions/Result.andThrough) | 元の値を保持しながらバリデーションを実行する |
| [orThrough(fn)](../../../../api/functions/Result.orThrough)   | 元のエラーを保持しながら回復を試みる     |
