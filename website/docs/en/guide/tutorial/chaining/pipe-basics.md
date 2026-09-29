---
description: How Result.pipe chains operations from top to bottom instead of nested calls or intermediate variables, how failures short-circuit a pipeline, and how async steps are handled.
---

# Pipe Basics

`pipe` is the heart of `@praha/byethrow`.
It connects multiple operations into a single, readable flow that runs from top to bottom.

## What Is `pipe`?

`pipe` takes an initial value and passes it through a series of functions.
Each function receives the output of the previous one:

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  5,                    // Start with 5
  (x) => x + 1,         // 5 + 1 = 6
  (x) => x * 2,         // 6 * 2 = 12
  (x) => `Result: ${x}`, // 'Result: 12'
);
// 'Result: 12'
```

## Why Use `pipe`?

Without `pipe`, you either nest function calls, which must be read from the inside out:

```ts
declare const add: (a: number, b: number) => number;
declare const multiply: (a: number, b: number) => number;
declare const format: (x: number) => string;
// ---cut-before---
// ❌ Hard to read: inside out
const result = format(multiply(add(5, 1), 2));
```

Or you introduce intermediate variables, which is verbose:

```ts
declare const add: (a: number, b: number) => number;
declare const multiply: (a: number, b: number) => number;
declare const format: (x: number) => string;
// ---cut-before---
// ❌ Verbose: too many variables
const step1 = add(5, 1);
const step2 = multiply(step1, 2);
const result = format(step2);
```

With `pipe`, the steps are listed in the order they run:

```ts
declare const add: (a: number, b: number) => number;
declare const multiply: (a: number, b: number) => number;
declare const format: (x: number) => string;
// ---cut-before---
import { Result } from '@praha/byethrow';

// ✅ Clear: top to bottom
const result = Result.pipe(
  5,
  (x) => add(x, 1),
  (x) => multiply(x, 2),
  format,
);
```

## Using `pipe` with Results

The real power of `pipe` shows when working with Results.
Functions such as `Result.map` are curried: calling them with a callback returns a function that takes a `Result`, which is exactly what `pipe` expects:

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.succeed(10),
  Result.map((x) => x * 2),
  Result.map((x) => x + 5),
);
// { type: 'Success', value: 25 }
```

### Failures Short-Circuit the Pipeline

Each function only runs its callback when the `Result` is in the state it cares about.
For example, `map` only transforms a `Success`. Once a step fails, the following success-side steps are skipped and the `Failure` flows straight to the end:

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.succeed(10),
  Result.andThen((x) => x > 5 ? Result.fail('Too large') : Result.succeed(x)),
  Result.map((x) => x * 2), // Skipped
  Result.map((x) => x + 5), // Skipped
);
// { type: 'Failure', error: 'Too large' }
```

This is why you don't need to check for errors after every step.

## Async Steps

If any step returns a `Promise`, the rest of the pipeline runs asynchronously and `pipe` returns a `Promise`.
You only need to `await` the final result:

```ts
import { Result } from '@praha/byethrow';

type User = { id: string; name: string };

declare const fetchUser: (id: string) => Result.ResultAsync<User, 'NotFound'>;
// ---cut-before---
const result = await Result.pipe(
  Result.succeed('u123'),
  Result.andThen(fetchUser),        // async
  Result.map((user) => user.name),  // receives the resolved user
);
// Type: Result.Result<string, 'NotFound'>
```

## Functions in This Chapter

The following pages cover the functions you can use inside a pipeline.
They come in pairs: one for the success side and one for the failure side.

| What the callback does                             | On success                          | On failure                         |
|----------------------------------------------------|-------------------------------------|------------------------------------|
| Transforms the value                               | [map](./mapping-results)            | [mapError](./mapping-results)      |
| Returns the next `Result`                          | [andThen](./chaining-results)       | [orElse](./chaining-results)       |
| Returns a `Result`, but the original value is kept | [andThrough](./validation-recovery) | [orThrough](./validation-recovery) |
| Runs a side effect and its return value is ignored | [inspect](./debugging)              | [inspectError](./debugging)        |

## References

| API                                                          | Purpose                                    |
|--------------------------------------------------------------|--------------------------------------------|
| [pipe(value, ...fns)](../../../../api/functions/Result.pipe) | Pass a value through a series of functions |
