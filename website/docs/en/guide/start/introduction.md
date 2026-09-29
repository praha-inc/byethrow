---
description: Overview of @praha/byethrow, a lightweight, tree-shakable Result type library for explicit, type-safe error handling in TypeScript.
---

# Introduction

`@praha/byethrow` is a lightweight, tree-shakable library that brings the `Result` type to JavaScript and TypeScript.
Instead of throwing exceptions, functions return a value that is either a success or a failure.
The possibility of failure becomes part of the type, so the compiler can make sure it is handled.

## At a Glance

With `throw`, a function's signature tells you nothing about how it can fail:

```ts
// @noErrors
type User = { id: string; name: string };
// ---cut-before---
// Can this throw? Which errors? The signature doesn't say.
const findUser = async (id: string): Promise<User> => {
  // ...
};
```

With byethrow, every expected failure appears in the return type, and results can be composed step by step without `try/catch`:

```ts
type User = { id: string; name: string };
declare const db: { findUser: (id: string) => Promise<User | undefined> };
class InvalidIdError extends Error { override readonly name = 'InvalidIdError'; }
class UserNotFoundError extends Error { override readonly name = 'UserNotFoundError'; }
// ---cut-before---
import { Result } from '@praha/byethrow';

const validateId = (id: string) => {
  if (!id.startsWith('u')) {
    return Result.fail(new InvalidIdError());
  }
  return Result.succeed(id);
};

const findUser = async (id: string): Result.ResultAsync<User, UserNotFoundError> => {
  const user = await db.findUser(id);
  if (!user) {
    return Result.fail(new UserNotFoundError());
  }
  return Result.succeed(user);
};

const result = await Result.pipe(
  Result.succeed('u123'),
  Result.andThen(validateId),
  Result.andThen(findUser),
);
// Type: Result.Result<User, InvalidIdError | UserNotFoundError>
```

## Features

- **Tree-shakable**: Every function is an independent export, so your bundle only includes what you use.
- **Plain objects**: A `Result` is a plain object, not a class instance. It is easy to log, serialize, and debug.
- **One API for sync and async**: Every function accepts both `Result<T, E>` and `Promise<Result<T, E>>`.
- **Composable**: Build readable pipelines with `pipe` and combinators such as `map`, `andThen`, and `andThrough`.
- **Focused**: A small set of Result-centric functions, without aliases or confusing variants.
- **Fully type-safe**: Every function is covered by type tests, so success and error types are inferred precisely.

## When to Use byethrow

byethrow works best for failures that are part of your application's normal behavior, such as:

- **API calls** that can fail because of network or server errors
- **Input validation** where you want to report one or all problems to the user
- **File operations** that can fail because of missing files or permissions
- **Parsers** that must reject invalid input gracefully
- **Business rules** such as "the post has already been deleted" or "the user has no permission"

You don't need to wrap every possible error in a `Result`.
Truly unexpected errors, such as a lost database connection, can still be thrown and handled by your infrastructure.
See [Result vs throw](../best-practices/result-vs-throw) for how to draw that line.

## Next Steps

- [Why byethrow?](./why): The problems byethrow solves and how it compares to other approaches
- [Quick Start](./quick): Install the package and write your first `Result`-based code
- [Tutorial](../tutorial/basics/result-type): Learn every function step by step
