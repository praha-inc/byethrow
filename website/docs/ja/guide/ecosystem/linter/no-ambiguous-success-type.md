---
description: Result・ResultAsync・ResultMaybeAsync の型注釈で、unknown・any・object・{} などの曖昧な成功型を禁止する Oxlint ルール。
---

# no-ambiguous-success-type

`Result`、`ResultAsync`、`ResultMaybeAsync` の成功型の位置に、具体的でない型を使うことを禁止します。

## ルールの詳細

`Result` の成功型が曖昧だと、呼び出し側は成功時に何を受け取るのかわからず、自分で値をチェックしたりキャストしたりする必要があります。
代わりに具体的な型を使ってください。

成功型の位置で `unknown`、`any`、`object`、`{}` が使われていると報告されます。
値を返さない処理のための `void` は許可されています。

このルールは `Result.Result<T, E>` のような明示的な型注釈をチェックします。TypeScript が推論した型はチェックされません。

### 誤った例

```ts
import { Result } from '@praha/byethrow';

class FetchError extends Error {}

// ❌ unknown
type FetchResult1 = Result.Result<unknown, FetchError>;

// ❌ any
type FetchResult2 = Result.Result<any, FetchError>;

// ❌ object
type FetchResult3 = Result.Result<object, FetchError>;
```

### 正しい例

```ts
import { Result } from '@praha/byethrow';

class FetchError extends Error {}

// ✅ 具体的な型
type FetchResult = Result.Result<{ id: string }, FetchError>;

// ✅ 値を返さない処理には void
type DeleteResult = Result.Result<void, FetchError>;
```

:::tip
パースした JSON のボディのように値が本当に不明な場合は、[`Result.parse`](../../tutorial/basics/parsing-values) で検証して具体的な型を得てください。
:::

## オプション

このルールにオプションはありません。
