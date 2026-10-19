---
description: Building an object step by step from multiple Results with Result.do and Result.bind, where each step can use the values computed before it.
---

# Building Objects

Sometimes you need several values, each produced by an operation that can fail, and later steps depend on earlier ones.
The `do` / `bind` pattern collects these values into a single object, one field at a time.

## Starting with `do`

`do` creates a `Success` holding an empty object. It is the starting point of the pattern:

```ts
import { Result } from '@praha/byethrow';

const start = Result.do();
// { type: 'Success', value: {} }
```

## Adding Fields with `bind`

`bind(name, fn)` adds a field to the accumulated object:

1. It calls `fn` with the object accumulated so far.
2. If `fn` returns a `Success`, its value is added to the object under `name`.
3. If `fn` returns a `Failure`, the pipeline stops and that `Failure` is returned.

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.do(),
  Result.bind('name', () => Result.succeed('Alice')),
  Result.bind('age', () => Result.succeed(30)),
);
// { type: 'Success', value: { name: 'Alice', age: 30 } }
```

### Using Previous Values

The key feature of `bind` is that each step can use the fields added before it:

```ts
declare const fetchUser: (userId: string) => Result.ResultAsync<{ id: string; profileId: string }, 'UserNotFound'>;
declare const fetchProfile: (profileId: string) => Result.ResultAsync<{ bio: string }, 'ProfileNotFound'>;
// ---cut-before---
import { Result } from '@praha/byethrow';

const result = await Result.pipe(
  Result.do(),
  Result.bind('user', () => fetchUser('u123')),
  Result.bind('profile', ({ user }) => fetchProfile(user.profileId)), // Uses `user`
);
// Type: Result.Result<{ user: { id: string; profileId: string }; profile: { bio: string } }, 'UserNotFound' | 'ProfileNotFound'>
```

### Failures Short-Circuit

If any `bind` fails, the remaining steps are skipped:

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.do(),
  Result.bind('a', () => Result.succeed(1)),
  Result.bind('b', () => Result.fail('Error!')), // Fails here
  Result.bind('c', () => Result.succeed(3)),     // Skipped
);
// { type: 'Failure', error: 'Error!' }
```

## Example: Fetching Related Data

When one piece of data is needed to fetch another, `bind` keeps every intermediate value available until the end:

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
      totalPrice: products.reduce((sum, product) => sum + product.price, 0),
    })),
  );
};
```

:::tip
`bind` runs its steps one after another, which is necessary when a step depends on a previous one.
If the operations are independent of each other, `sequence` or `collect` on the [next page](./aggregating-results) is a better fit, since `collect` can also run async operations in parallel.
:::

## References

| API                                                     | Purpose                                          |
|---------------------------------------------------------|--------------------------------------------------|
| [do()](../../../../api/functions/Result.do)             | Create a success result holding an empty object  |
| [bind(name, fn)](../../../../api/functions/Result.bind) | Add a field computed from the accumulated object |
