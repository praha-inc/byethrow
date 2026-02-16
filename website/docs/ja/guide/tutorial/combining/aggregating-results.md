---
description: "@praha/byethrowのsequenceとcollect関数を使用して、複数のResultを集約する方法を学びましょう。"
---

# Result を集約する

組み合わせる必要がある複数の `Result` がある場合、`sequence` と `collect` が役立ちます。
どちらも `Result` を集約しますが、失敗の処理方法が異なります。

## `sequence` - 最初の失敗で停止

`sequence` はResultを処理し、最初の失敗で停止します。

```ts
import { Result } from '@praha/byethrow';

// すべて成功
const success = Result.sequence([
  Result.succeed(1),
  Result.succeed(2),
  Result.succeed(3),
]);
// { type: 'Success', value: [1, 2, 3] }

// 1つが失敗 - 即座に停止
const failure = Result.sequence([
  Result.succeed(1),
  Result.fail('error'),
  Result.succeed(3), // 遅延モードでは評価されない
]);
// { type: 'Failure', error: 'error' }
```

### オブジェクトでの使用

```ts
import { Result } from '@praha/byethrow';

// すべて成功
const success = Result.sequence({
  name: Result.succeed('Alice'),
  age: Result.succeed(30),
  email: Result.succeed('alice@example.com'),
});
// { type: 'Success', value: { name: 'Alice', age: 30, email: 'alice@example.com' } }

// 1つが失敗 - 即座に停止
const result = Result.sequence({
  name: Result.succeed('Alice'),
  age: Result.fail('error'),
  email: Result.succeed('alice@example.com'), // 遅延モードでは評価されない
});
// { type: 'Failure', error: 'error' }
```

### 例：購入処理パイプライン

一般的なユースケースは、複数の独立した操作がすべて成功する必要がある購入フローです。
`sequence` では、いずれかのステップが失敗すると、残りの操作はスキップされます。

```ts
type User = { id: string; email: string };
type Product = { id: string; name: string };
type Stock = { productId: string; reservedAt: Date };
type Order = { id: string; orderedAt: Date };
type Confirmation = { id: string; sentAt: Date };
declare const reserveStock: (product: Product) => Result.ResultAsync<Stock, 'OutOfStock'>;
declare const createOrder: (user: User, product: Product) => Result.ResultAsync<Order, 'OrderFailed'>;
declare const sendConfirmationEmail: (user: User, product: Product) => Result.ResultAsync<Confirmation, 'EmailFailed'>;
const user: User = { id: 'user-1', email: 'user-1@example.com' };
const book: Product = { id: 'product-2', name: 'Book' };
const gadget: Product = { id: 'product-1', name: 'Gadget' };
// ---cut-before---
import { Result } from '@praha/byethrow';

const processPurchase = (user: User, product: Product) => {
  return Result.sequence({
    stock: reserveStock(product),
    order: createOrder(user, product),
    confirmation: sendConfirmationEmail(user, product)
  });
};

// すべて成功
await processPurchase(user, book);
// { type: 'Success', value: { stock: {...}, order: {...}, confirmation: {...} } }

// reserveStockが失敗した場合 → 即座に停止、注文とメールは処理されない
await processPurchase(user, gadget);
// { type: 'Failure', error: 'OutOfStock' }
```

## `collect` - すべてのエラーを収集

`collect` は**すべての**Resultを処理し、すべてのエラーを収集します。

```ts
import { Result } from '@praha/byethrow';

// すべて成功
const success = Result.collect([
  Result.succeed(1),
  Result.succeed(2),
  Result.succeed(3),
]);
// { type: 'Success', value: [1, 2, 3] }

// 複数の失敗 - すべてのエラーを収集
const failure = Result.collect([
  Result.succeed(1),
  Result.fail('error1'),
  Result.fail('error2'),
]);
// { type: 'Failure', error: ['error1', 'error2'] }
```

### オブジェクトでの使用

```ts
import { Result } from '@praha/byethrow';

// すべて成功
const success = Result.collect({
  name: Result.succeed('Alice'),
  age: Result.succeed(30),
  email: Result.succeed('alice@example.com'),
});
// { type: 'Success', value: { name: 'Alice', age: 30, email: 'alice@example.com' } }

// 複数の失敗 - すべてのエラーを収集
const result = Result.collect({
  name: Result.fail('名前は必須です'),
  age: Result.fail('無効な年齢'),
  email: Result.succeed('alice@example.com'),
});
// { type: 'Failure', error: ['名前は必須です', '無効な年齢'] }
```

### 例：並列APIデータ集約

一般的なユースケースは、複数の独立したAPIからデータを取得することです。
`collect` では、すべてのAPI呼び出しが並列で行われ、複数のサービスが失敗した場合、すべてのエラーがまとめて報告されます。

```ts
type User = { id: string; name: string };
type Orders = { userId: string; items: string[] };
type Reviews = { userId: string; count: number };
type FetchError = { source: string; message: string };
declare const fetchUser: (id: string) => Result.ResultAsync<User, FetchError>;
declare const fetchOrders: (userId: string) => Result.ResultAsync<Orders, FetchError>;
declare const fetchReviews: (userId: string) => Result.ResultAsync<Reviews, FetchError>;
// ---cut-before---
import { Result } from '@praha/byethrow';

const fetchUserDashboard = async (userId: string) => {
  // 3つのAPI呼び出しはすべて並列で実行
  return Result.collect({
    user: fetchUser(userId),
    orders: fetchOrders(userId),
    reviews: fetchReviews(userId),
  });
};

// すべてのAPIが成功
await fetchUserDashboard('user-123');
// {
//   type: 'Success',
//   value: {
//     user: { id: 'user-123', name: 'Alice' },
//     orders: [{ id: 'order-123', name: 'Product A' }],
//     reviews: [{ id: 'review-123', comment: 'Great!' }]
//   },
// }

// 複数のAPIが失敗 - すべてのエラーが収集される
await fetchUserDashboard('invalid-user');
// {
//   type: 'Failure',
//   error: [
//     'User not found',
//     'Orders fetch failed',
//   ],
// }
```

`collect` は非同期操作を並列で実行するため、すべてのAPI呼び出しが同時に開始され、順次実行と比較してパフォーマンスが向上します。
さらに、複数のサービスが失敗した場合、すべてのエラーがまとめて報告されるため、デバッグが容易になります。

## 変換関数の使用方法

両方の関数は、値をResultに変換するマッパー関数を受け入れます。

### `sequence`

```ts
import { Result } from '@praha/byethrow';

const parseNumbers = (strings: string[]) => {
  return Result.sequence(strings, (str) => {
    const num = parseInt(str, 10);
    if (Number.isNaN(num)) {
      return Result.fail(`無効な数値: ${str}`);
    }
    return Result.succeed(num);
  });
};

parseNumbers(['1', '2', '3']);
// { type: 'Success', value: [1, 2, 3] }

parseNumbers(['1', 'abc', 'xyz']);
// { type: 'Failure', error: '無効な数値: abc' }
```

### `collect`

```ts
import { Result } from '@praha/byethrow';

const parseNumbers = (strings: string[]) => {
  return Result.collect(strings, (str) => {
    const num = parseInt(str, 10);
    if (Number.isNaN(num)) {
      return Result.fail(`無効な数値: ${str}`);
    }
    return Result.succeed(num);
  });
};

parseNumbers(['1', '2', '3']);
// { type: 'Success', value: [1, 2, 3] }

parseNumbers(['1', 'abc', 'xyz']);
// { type: 'Failure', error: ['無効な数値: abc', '無効な数値: xyz'] }
```

## 非同期の動作

`ResultAsync`（非同期Result）を使用する場合、`sequence` と `collect` は異なる動作をします。

### `sequence` - 順次実行

`sequence` は非同期操作を**順次**（次々と）実行します。
各 `Result` は次の処理の前に待機され、失敗が発生すると即座に実行が停止します。

```ts
import { Result } from '@praha/byethrow';

const fetchUser = (id: string): Result.ResultAsync<string, string> =>
  Result.succeed(Promise.resolve(`User ${id}`));

const fetchOrder = (id: string): Result.ResultAsync<string, string> =>
  Result.succeed(Promise.resolve(`Order ${id}`));

// 操作は順次実行される：fetchUserが完了してからfetchOrderが開始
const result = await Result.sequence({
  user: fetchUser('1'),
  order: fetchOrder('100'),
});
// { type: 'Success', value: { user: 'User 1', order: 'Order 100' } }
```

### `collect` - 並列実行

`collect` は `Promise.all()` を使用して非同期操作を**並列**で実行します。
すべての操作が同時に開始され、すべての結果がまとめて待機されます。

```ts
import { Result } from '@praha/byethrow';

const fetchUser = (id: string): Result.ResultAsync<string, string> =>
  Result.succeed(Promise.resolve(`User ${id}`));

const fetchOrder = (id: string): Result.ResultAsync<string, string> =>
  Result.succeed(Promise.resolve(`Order ${id}`));

// 操作は並列で実行される：両方が同時に開始
const result = await Result.collect({
  user: fetchUser('1'),
  order: fetchOrder('100'),
});
// { type: 'Success', value: { user: 'User 1', order: 'Order 100' } }
```

### `sequence` と `collect` 関数の使い分け

| シナリオ                          | 推奨         |
|-------------------------------|------------|
| バリデーションですべてのエラーが必要            | `collect`  |
| パフォーマンス向上のために並列実行が必要          | `collect`  |
| 操作が順序に依存する（例：最初の失敗で停止する必要がある） | `sequence` |
| 失敗の可能性が高い場合に不要な処理を最小化したい      | `sequence` |

## リファレンス

| 関数                                                           | 目的                    |
|--------------------------------------------------------------|-----------------------|
| [sequence(array)](../../../../api/functions/Result.sequence) | 最初の失敗で停止してそれを返す       |
| [collect(array)](../../../../api/functions/Result.collect)   | すべての結果を処理してすべてのエラーを収集 |
