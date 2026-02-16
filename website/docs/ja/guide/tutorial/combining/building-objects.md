---
description: '@praha/byethrowのdo/bindパターンを使用して、成功したResultを蓄積しながら複雑なオブジェクトを構築する方法を学びましょう。'
---

# オブジェクトを構築する

各フィールドが成功した計算に依存する複雑なオブジェクトを構築する場合、`do`/`bind` パターンが非常に便利です。
これにより、成功した結果を蓄積しながらオブジェクトを構築できます。

## `do` とは？

`do` は空のオブジェクトを持つ `Success` という特別な `Result` を作成します。

```ts
import { Result } from '@praha/byethrow';

const start = Result.do();
// { type: 'Success', value: {} }
```

## `bind` とは？

`bind` は蓄積されたオブジェクトに新しいフィールドを追加し、以下の処理を行います。
1. 現在の蓄積されたオブジェクトを受け取る
2. `Result` を返す計算を実行する
3. 成功した場合、指定されたキーでオブジェクトに結果をマージする
4. 失敗した場合、ショートサーキットして失敗を返す

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.do(),
  Result.bind('name', () => Result.succeed('Alice')),
  Result.bind('age', () => Result.succeed(30)),
);
// { type: 'Success', value: { name: 'Alice', age: 30 } }
```

### 以前の値の使用

`bind` の強力な点は、各ステップで以前の値にアクセスできることです。

```ts
declare const fetchUser: (userId: string) => Result.ResultAsync<{ id: string; profileId: string }, 'UserNotFound'>;
declare const fetchProfile: (profileId: string) => Result.ResultAsync<{ bio: string }, 'ProfileNotFound'>;
// ---cut-before---
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.do(),
  Result.bind('user', () => fetchUser('user-123')),
  Result.bind('profile', ({ user }) => fetchProfile(user.profileId)), // userを使用！
);
```

### 失敗時のショートサーキット

いずれかの `bind` が失敗すると、後続の `bind` はスキップされます。

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.do(),
  Result.bind('a', () => Result.succeed(1)),
  Result.bind('b', () => Result.fail('Error!')),  // ここで失敗
  Result.bind('c', () => Result.succeed(3)),      // スキップ
  Result.bind('d', () => Result.succeed(4)),      // スキップ
);
// { type: 'Failure', error: 'Error!' }
```

### 例：関連データの取得

複数の関連リソースを取得して組み合わせる必要がある場合の例。

```ts
declare const fetchOrder: (orderId: string) => Result.ResultAsync<{ id: string; userId: string; productIds: string[] }, 'OrderNotFound'>;
declare const fetchUser: (userId: string) => Result.ResultAsync<{ id: string; name: string }, 'UserNotFound'>;
declare const fetchProducts: (productIds: string[]) => Result.ResultAsync<{ id: string; name: string; price: number }[], 'ProductNotFound'>;
// ---cut-before---
import { Result } from '@praha/byethrow';

type OrderDetails = {
  orderId: string;
  customerName: string;
  products: { id: string; name: string; price: number }[];
  totalPrice: number;
};

const getOrderDetails = (orderId: string): Result.ResultAsync<OrderDetails, 'OrderNotFound' | 'UserNotFound' | 'ProductNotFound'> => {
  return Result.pipe(
    Result.do(),
    Result.bind('order', () => fetchOrder(orderId)),
    Result.bind('user', ({ order }) => fetchUser(order.userId)),
    Result.bind('products', ({ order }) => fetchProducts(order.productIds)),
    Result.map(({ order, user, products }) => ({
      orderId: order.id,
      customerName: user.name,
      products,
      totalPrice: products.reduce((sum, p) => sum + p.price, 0),
    })),
  );
};
// 注文データを使用してユーザーと製品を取得し、すべてを組み合わせます
```

## リファレンス

| 関数                                                      | 目的                   |
|---------------------------------------------------------|----------------------|
| [do()](../../../../api/functions/Result.do)             | `Success<{}>`で開始     |
| [bind(name, fn)](../../../../api/functions/Result.bind) | 蓄積されたオブジェクトにフィールドを追加 |
