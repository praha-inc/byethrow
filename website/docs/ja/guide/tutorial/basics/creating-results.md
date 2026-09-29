---
description: 'Result.succeedとResult.failによるSuccess・Failureの作成、関数からResultを返す方法、Result.doによるオブジェクト構築パイプラインの開始方法。'
---

# Result を作成する

`Result` の形がわかったところで、ライブラリのヘルパー関数を使って作成してみましょう。

## `succeed` で成功を作成する

`succeed` は `Success` を作成します。

```ts
import { Result } from '@praha/byethrow';

// 値あり
const success = Result.succeed(42);
// 型: Result.Result<42, never>

// 値なし（void）
const voidSuccess = Result.succeed();
// 型: Result.Result<void, never>
```

この結果が失敗になることはないため、エラーの型は `never` になります。
`void` の成功は、保存や削除のように意味のある戻り値を持たない操作で便利です。

## `fail` で失敗を作成する

`fail` は `Failure` を作成します。

```ts
import { Result } from '@praha/byethrow';

// エラー値あり
const failure = Result.fail('NotFound');
// 型: Result.Result<never, 'NotFound'>

// 値なし（void）
const voidFailure = Result.fail();
// 型: Result.Result<never, void>
```

エラーにはどんな値でも使えます。実際のアプリケーションでは、「[カスタムエラー](../../best-practices/custom-error)」で説明しているように、専用のエラークラスを使うことをおすすめします。

:::info
上の例のとおり、`succeed` と `fail` は `42` や `'NotFound'` のようなリテラル型を `number` や `string` に広げずにそのまま保ちます。
そのため、`'NotFound'` のような文字列リテラルのエラーを互いに区別しやすくなります。
より広い型にしたい場合は、後述のように関数の戻り値の型を注釈してください。
:::

## 関数から Result を返す

`succeed` と `fail` の最も一般的な使い方は、`return` と `throw` の代わりに、自分で書いた関数から返すことです。

```ts
import { Result } from '@praha/byethrow';

const parseAge = (input: string) => {
  const age = Number(input);
  if (!Number.isInteger(age) || age < 0) {
    return Result.fail('InvalidAge');
  }
  return Result.succeed(age);
};

const result = parseAge('20');
// 型: Result.Result<number, 'InvalidAge'>
```

TypeScript は、`return` 文から成功値の型とエラーの型の両方を推論します。
戻り値の型を明示的に注釈することもでき、エクスポートする関数ではそれが良い習慣です。

```ts
import { Result } from '@praha/byethrow';

const parseAge = (input: string): Result.Result<number, string> => {
  const age = Number(input);
  if (!Number.isInteger(age) || age < 0) {
    return Result.fail(`Invalid age: ${input}`);
  }
  return Result.succeed(age);
};
```

:::info
`succeed` と `fail` は `Promise` を自動的に await しません。
非同期の値がある場合は先に await するか、戻り値の型が `ResultAsync` の `async` 関数を使ってください。

```ts
import { Result } from '@praha/byethrow';

declare const loadName: () => Promise<string>;
// ---cut-before---
const getName = async (): Result.ResultAsync<string, never> => {
  const name = await loadName();
  return Result.succeed(name);
};
```
:::

## `do` でパイプラインを開始する

`do` は空のオブジェクトを持つ `Success` を作成します。

```ts
import { Result } from '@praha/byethrow';

const start = Result.do();
// 型: Result.Result<{}, never>
```

これは、`bind` を使ってオブジェクトを一歩ずつ組み立てるときの出発点になります。詳しくは「[オブジェクトを構築する](../combining/building-objects)」で説明します。

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.do(),
  Result.bind('name', () => Result.succeed('Alice')),
  Result.bind('age', () => Result.succeed(30)),
);
// { type: 'Success', value: { name: 'Alice', age: 30 } }
```

## リファレンス

| API                                                        | 用途                                           |
|------------------------------------------------------------|------------------------------------------------|
| [succeed(value)](../../../../api/functions/Result.succeed) | 成功の Result を作成する                       |
| [fail(error)](../../../../api/functions/Result.fail)       | 失敗の Result を作成する                       |
| [do()](../../../../api/functions/Result.do)                | 空のオブジェクトを持つ成功の Result を作成する |
