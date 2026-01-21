# Pipe Basics

The `pipe` function is the heart of `@praha/byethrow`. It allows you to chain multiple operations together in a readable, left-to-right manner.

## What is `pipe`?

`pipe` takes an initial value and passes it through a series of functions, where each function receives the output of the previous one:

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  5,                    // Start with 5
  (x) => x + 1,         // 5 + 1 = 6
  (x) => x * 2,         // 6 * 2 = 12
  (x) => `Result: ${x}` // 'Result: 12'
);
// 'Result: 12&
```

## Why Use `pipe`?

### Without `pipe`

Nested function calls are hard to read:

```ts
declare const add: (a: number, b: number) => number;
declare const multiply: (a: number, b: number) => number;
declare const format: (x: number) => string;
// ---cut-before---
// ❌ Hard to read - inside out
const result = format(multiply(add(5, 1), 2));
```

Or intermediate variables are verbose:

```ts
declare const add: (a: number, b: number) => number;
declare const multiply: (a: number, b: number) => number;
declare const format: (x: number) => string;
// ---cut-before---
// ❌ Too many variables
const step1 = add(5, 1);
const step2 = multiply(step1, 2);
const result = format(step2);
```

### With `pipe`

```ts
declare const add: (a: number, b: number) => number;
declare const multiply: (a: number, b: number) => number;
declare const format: (x: number) => string;
// ---cut-before---
import { Result } from '@praha/byethrow';

// ✅ Clear, left-to-right flow
const result = Result.pipe(
  5,
  (x) => add(x, 1),
  (x) => multiply(x, 2),
  format
);
```

## Using `pipe` with Results

The real power of `pipe` comes when working with Results. All the transformation functions in `@praha/byethrow` are designed to work with `pipe`:

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.succeed(10),
  Result.map((x) => x * 2),
  Result.map((x) => x + 5),
);
// { type: 'Success', value: 25 }
```

## How `pipe` Handles Async

When any function in the pipe returns a `Promise`, the result becomes a `Promise`:

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
