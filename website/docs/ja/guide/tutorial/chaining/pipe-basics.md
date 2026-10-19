---
description: 'Result.pipe で処理を上から下へ順につなげる方法。ネストした呼び出しや中間変数を使わずに書けること、失敗時にパイプラインが短絡する仕組み、非同期ステップの扱いを解説します。'
---

# pipe の基本

`pipe` は `@praha/byethrow` の中心となる関数です。
複数の処理を、上から下へ流れる読みやすいひとつのフローとしてつなげます。

## `pipe` とは？

`pipe` は初期値を受け取り、一連の関数に順番に渡していきます。
各関数は、ひとつ前の関数の出力を受け取ります。

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  5,                    // 5 から始める
  (x) => x + 1,         // 5 + 1 = 6
  (x) => x * 2,         // 6 * 2 = 12
  (x) => `Result: ${x}`, // 'Result: 12'
);
// 'Result: 12'
```

## なぜ `pipe` を使うのか？

`pipe` を使わない場合、関数呼び出しをネストすることになり、内側から外側へ読まなければなりません。

```ts
declare const add: (a: number, b: number) => number;
declare const multiply: (a: number, b: number) => number;
declare const format: (x: number) => string;
// ---cut-before---
// ❌ 読みにくい: 内側から外側へ読む必要がある
const result = format(multiply(add(5, 1), 2));
```

あるいは中間変数を導入することになり、冗長になります。

```ts
declare const add: (a: number, b: number) => number;
declare const multiply: (a: number, b: number) => number;
declare const format: (x: number) => string;
// ---cut-before---
// ❌ 冗長: 変数が多すぎる
const step1 = add(5, 1);
const step2 = multiply(step1, 2);
const result = format(step2);
```

`pipe` を使えば、各ステップを実行される順番に並べて書けます。

```ts
declare const add: (a: number, b: number) => number;
declare const multiply: (a: number, b: number) => number;
declare const format: (x: number) => string;
// ---cut-before---
import { Result } from '@praha/byethrow';

// ✅ 明快: 上から下へ読める
const result = Result.pipe(
  5,
  (x) => add(x, 1),
  (x) => multiply(x, 2),
  format,
);
```

## `Result` と組み合わせる

`pipe` の真価は `Result` と組み合わせたときに発揮されます。
`Result.map` などの関数はカリー化されており、コールバックを渡して呼び出すと `Result` を受け取る関数を返します。これはまさに `pipe` が期待する形です。

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.succeed(10),
  Result.map((x) => x * 2),
  Result.map((x) => x + 5),
);
// { type: 'Success', value: 25 }
```

### 失敗するとパイプラインは短絡する

各関数は、`Result` が自分の扱う状態のときだけコールバックを実行します。
たとえば `map` は `Success` のときだけ値を変換します。あるステップが失敗すると、後続の成功側のステップはスキップされ、`Failure` がそのまま末尾まで流れていきます。

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.succeed(10),
  Result.andThen((x) => x > 5 ? Result.fail('Too large') : Result.succeed(x)),
  Result.map((x) => x * 2), // スキップされる
  Result.map((x) => x + 5), // スキップされる
);
// { type: 'Failure', error: 'Too large' }
```

そのため、ステップごとにエラーを確認する必要はありません。

## 非同期のステップ

いずれかのステップが `Promise` を返すと、それ以降のパイプラインは非同期に実行され、`pipe` は `Promise` を返します。
`await` が必要なのは最終結果だけです。

```ts
import { Result } from '@praha/byethrow';

type User = { id: string; name: string };

declare const fetchUser: (id: string) => Result.ResultAsync<User, 'NotFound'>;
// ---cut-before---
const result = await Result.pipe(
  Result.succeed('u123'),
  Result.andThen(fetchUser),        // 非同期
  Result.map((user) => user.name),  // 解決済みの user を受け取る
);
// 型: Result.Result<string, 'NotFound'>
```

## この章で扱う関数

以降のページでは、パイプラインの中で使える関数を紹介します。
これらは成功側と失敗側の対になっています。

| コールバックの役割                    | 成功時                              | 失敗時                             |
|---------------------------------------|-------------------------------------|------------------------------------|
| 値を変換する                          | [map](./mapping-results)            | [mapError](./mapping-results)      |
| 次の `Result` を返す                  | [andThen](./chaining-results)       | [orElse](./chaining-results)       |
| `Result` を返すが、元の値は保持される | [andThrough](./validation-recovery) | [orThrough](./validation-recovery) |
| 副作用を実行し、戻り値は無視される    | [inspect](./debugging)              | [inspectError](./debugging)        |

## リファレンス

| API                                                          | 用途                       |
|--------------------------------------------------------------|----------------------------|
| [pipe(value, ...fns)](../../../../api/functions/Result.pipe) | 値を一連の関数に順番に渡す |
