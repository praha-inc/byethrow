---
description: Learn how to aggregate multiple Results using sequence and collect functions in @praha/byethrow with different failure handling strategies.
---

# Aggregating Results

When you have multiple Results that need to be combined, `sequence` and `collect` are your go-to functions. They both aggregate Results, but differ in how they handle failures.

## `sequence` - Stop at First Failure

`sequence` processes Results and stops at the first failure:

```ts
import { Result } from '@praha/byethrow';

// All succeed
const success = Result.sequence([
  Result.succeed(1),
  Result.succeed(2),
  Result.succeed(3),
]);
// { type: 'Success', value: [1, 2, 3] }

// One fails - stops immediately
const failure = Result.sequence([
  Result.succeed(1),
  Result.fail('error'),
  Result.succeed(3), // Never evaluated in lazy mode
]);
// { type: 'Failure', error: 'error' }
```

### With Objects

```ts
import { Result } from '@praha/byethrow';

// All succeed
const success = Result.sequence({
  name: Result.succeed('Alice'),
  age: Result.succeed(30),
  email: Result.succeed('alice@example.com'),
});
// { type: 'Success', value: { name: 'Alice', age: 30, email: 'alice@example.com' } }

// One fails - stops immediately
const result = Result.sequence({
  name: Result.succeed('Alice'),
  age: Result.fail('error'),
  email: Result.succeed('alice@example.com'), // Never evaluated in lazy mode
});
// { type: 'Failure', error: 'error' }
```

### Example: Purchase Processing Pipeline

A common use case is a purchase flow where multiple independent operations must all succeed. With `sequence`, if any step fails, the remaining operations are skipped:

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

// All succeed:
await processPurchase(user, book);
// { type: 'Success', value: { stock: {...}, order: {...}, confirmation: {...} } }

// If reserveStock fails → stops immediately, order and email are not processed
await processPurchase(user, gadget);
// { type: 'Failure', error: 'OutOfStock' }
```

## `collect` - Gather All Errors

`collect` processes **all** Results and gathers all errors:

```ts
import { Result } from '@praha/byethrow';

// All succeed
const success = Result.collect([
  Result.succeed(1),
  Result.succeed(2),
  Result.succeed(3),
]);
// { type: 'Success', value: [1, 2, 3] }

// Multiple failures - collects all errors
const failure = Result.collect([
  Result.succeed(1),
  Result.fail('error1'),
  Result.fail('error2'),
]);
// { type: 'Failure', error: ['error1', 'error2'] }
```

### With Objects

```ts
import { Result } from '@praha/byethrow';

// All succeed
const success = Result.collect({
  name: Result.succeed('Alice'),
  age: Result.succeed(30),
  email: Result.succeed('alice@example.com'),
});
// { type: 'Success', value: { name: 'Alice', age: 30, email: 'alice@example.com' } }

// Multiple failures - collects all errors
const result = Result.collect({
  name: Result.fail('Name is required'),
  age: Result.fail('Invalid age'),
  email: Result.succeed('alice@example.com'),
});
// { type: 'Failure', error: ['Name is required', 'Invalid age'] }
```

### Example: Parallel API Data Aggregation

A common use case is fetching data from multiple independent APIs. With `collect`, all API calls are made in parallel, and if multiple services fail, all errors are reported together:

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
  // All three API calls execute in parallel
  return Result.collect({
    user: fetchUser(userId),
    orders: fetchOrders(userId),
    reviews: fetchReviews(userId),
  });
};

// All APIs succeed:
await fetchUserDashboard('user-123');
// {
//   type: 'Success',
//   value: {
//     user: { id: 'user-123', name: 'Alice' },
//     orders: [{ id: 'order-123', name: 'Product A' }],
//     reviews: [{ id: 'review-123', comment: 'Great!' }]
//   },
// }

// Multiple APIs fail - all errors are collected:
await fetchUserDashboard('invalid-user');
// {
//   type: 'Failure',
//   error: [
//     'User not found',
//     'Orders fetch failed',
//   ],
// }
```

Since `collect` executes async operations in parallel, all API calls start simultaneously—improving performance compared to sequential execution. Additionally, if multiple services fail, all errors are reported together, making debugging easier.

## Using with Mapper Functions

Both functions accept a mapper function to transform values into Results:

### `sequence` with Mapper

```ts
import { Result } from '@praha/byethrow';

const parseNumbers = (strings: string[]) => {
  return Result.sequence(strings, (str) => {
    const num = parseInt(str, 10);
    if (Number.isNaN(num)) {
      return Result.fail(`Invalid number: ${str}`);
    }
    return Result.succeed(num);
  });
};

parseNumbers(['1', '2', '3']);
// { type: 'Success', value: [1, 2, 3] }

parseNumbers(['1', 'abc', 'xyz']);
// { type: 'Failure', error: 'Invalid number: abc' }
```

### `collect` with Mapper

```ts
import { Result } from '@praha/byethrow';

const parseNumbers = (strings: string[]) => {
  return Result.collect(strings, (str) => {
    const num = parseInt(str, 10);
    if (Number.isNaN(num)) {
      return Result.fail(`Invalid number: ${str}`);
    }
    return Result.succeed(num);
  });
};

parseNumbers(['1', '2', '3']);
// { type: 'Success', value: [1, 2, 3] }

parseNumbers(['1', 'abc', 'xyz']);
// { type: 'Failure', error: ['Invalid number: abc', 'Invalid number: xyz'] }
```

## Async Behavior

When working with `ResultAsync` (asynchronous Results), `sequence` and `collect` behave differently:

### `sequence` - Sequential Execution

`sequence` executes async operations **sequentially** (one after another). Each Result is awaited before processing the next one, and execution stops immediately upon encountering a failure:

```ts
import { Result } from '@praha/byethrow';

const fetchUser = (id: string): Result.ResultAsync<string, string> =>
  Result.succeed(Promise.resolve(`User ${id}`));

const fetchOrder = (id: string): Result.ResultAsync<string, string> =>
  Result.succeed(Promise.resolve(`Order ${id}`));

// Operations are executed sequentially: fetchUser completes, then fetchOrder starts
const result = await Result.sequence({
  user: fetchUser('1'),
  order: fetchOrder('100'),
});
// { type: 'Success', value: { user: 'User 1', order: 'Order 100' } }
```

### `collect` - Parallel Execution

`collect` executes async operations **in parallel** using `Promise.all()`. All operations start simultaneously and all results are awaited together:

```ts
import { Result } from '@praha/byethrow';

const fetchUser = (id: string): Result.ResultAsync<string, string> =>
  Result.succeed(Promise.resolve(`User ${id}`));

const fetchOrder = (id: string): Result.ResultAsync<string, string> =>
  Result.succeed(Promise.resolve(`Order ${id}`));

// Operations are executed in parallel: both start at the same time
const result = await Result.collect({
  user: fetchUser('1'),
  order: fetchOrder('100'),
});
// { type: 'Success', value: { user: 'User 1', order: 'Order 100' } }
```

### Choosing Between `sequence` and `collect`

| Scenario                                                        | Recommended |
|-----------------------------------------------------------------|-------------|
| Need all errors for validation                                  | `collect`   |
| Want parallel execution for better performance                  | `collect`   |
| Operations depend on order (e.g., must stop on first failure)   | `sequence`  |
| Want to minimize unnecessary work when failure is likely        | `sequence`  |

## References

| Function                                                     | Purpose                                   |
|--------------------------------------------------------------|-------------------------------------------|
| [sequence(array)](../../../../api/functions/Result.sequence) | Stop at the first failure and return it   |
| [collect(array)](../../../../api/functions/Result.collect)   | Process all results and gather all errors |
