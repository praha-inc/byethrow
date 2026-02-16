---
description: '@praha/byethrowのpipe関数を使って、読みやすい左から右への方式で操作を連結する方法を学びましょう。'
---

# pipe 関数の扱い方

`pipe` 関数は `@praha/byethrow` の中核をなす機能の一つです。
複数の操作を読みやすい左から右への方式で連結できます。

## `pipe` とは？

`pipe` は初期値を受け取り、一連の関数に順番に渡していきます。
各関数は前の関数の出力を受け取ります。

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  5,                    // 5 から開始
  (x) => x + 1,         // 5 + 1 = 6
  (x) => x * 2,         // 6 * 2 = 12
  (x) => `Result: ${x}` // 'Result: 12'
);
// 'Result: 12&
```

## なぜ `pipe` を使うのか？

### `pipe` を使わない場合

ネストした関数呼び出しは読みにくいです。

```ts
declare const add: (a: number, b: number) => number;
declare const multiply: (a: number, b: number) => number;
declare const format: (x: number) => string;
// ---cut-before---
// ❌ 読みにくい - 内側から外側へ読む必要がある
const result = format(multiply(add(5, 1), 2));
```

中間変数を使うと冗長になります。

```ts
declare const add: (a: number, b: number) => number;
declare const multiply: (a: number, b: number) => number;
declare const format: (x: number) => string;
// ---cut-before---
// ❌ 変数が多すぎる
const step1 = add(5, 1);
const step2 = multiply(step1, 2);
const result = format(step2);
```

### `pipe` を使う場合

```ts
declare const add: (a: number, b: number) => number;
declare const multiply: (a: number, b: number) => number;
declare const format: (x: number) => string;
// ---cut-before---
import { Result } from '@praha/byethrow';

// ✅ 明確で、左から右への流れ
const result = Result.pipe(
  5,
  (x) => add(x, 1),
  (x) => multiply(x, 2),
  format
);
```

## `Result` と `pipe` を組み合わせる

`pipe` の真価は `Result` と一緒に使うときに発揮されます。
`@praha/byethrow` のすべての変換関数は `pipe` と連携して動作するように設計されています。

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.succeed(10),
  Result.map((x) => x * 2),
  Result.map((x) => x + 5),
);
// { type: 'Success', value: 25 }
```

## `pipe` の非同期処理

パイプ内のいずれかの関数が `Promise` を返すと、結果は `Promise` になります。

```ts
import { Result } from '@praha/byethrow';

type User = { id: string; name: string; };

const fetchUser = async (id: string): Result.ResultAsync<User, string> => {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    return Result.fail('User not found');
  }
  const user = await response.json();
  return Result.succeed(user);
};

const result = await Result.pipe(
  Result.succeed('user-123'),
  Result.andThen(fetchUser),
  Result.map((user) => user.name),
);
```
