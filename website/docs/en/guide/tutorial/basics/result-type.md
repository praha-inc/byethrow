---
description: The structure of Result<T, E> — the Success and Failure union, ResultAsync for async operations, and utility types such as ResultMaybeAsync, InferSuccess, and InferFailure.
---

# Result Type

Before diving into the functions, let's look at what the `Result` type is and why it is useful.

## What Is a Result?

A `Result` represents the outcome of an operation that might fail.
It is always one of two variants:

- **Success**: The operation succeeded and holds a `value`.
- **Failure**: The operation failed and holds an `error`.

Unlike throwing an exception, returning a `Result` encodes the possibility of failure in the type system itself.

## The Structure

A `Result` is a plain object with a `type` property that tells the two variants apart:

```ts
import { Result } from '@praha/byethrow';

// A Success holds a value
const success: Result.Success<number> = {
  type: 'Success',
  value: 42,
};

// A Failure holds an error
const failure: Result.Failure<string> = {
  type: 'Failure',
  error: 'Something went wrong',
};
```

Because it is just an object, a `Result` can be logged, serialized to JSON, or compared in tests as it is.
In practice, you rarely write these objects by hand. The next page shows the helper functions that create them.

## The Union Type

`Result.Result<T, E>` is the union of `Success<T>` and `Failure<E>`.
`T` is the type of the success value, and `E` is the type of the error:

```ts
import { Result } from '@praha/byethrow';

// Returns either a Success<number> or a Failure<string>
const divide = (a: number, b: number): Result.Result<number, string> => {
  if (b === 0) {
    return { type: 'Failure', error: 'Cannot divide by zero' };
  }
  return { type: 'Success', value: a / b };
};

const result = divide(10, 2);
// Type: Result.Result<number, string>
```

## Why Use Result Instead of Exceptions?

### 1. Failures Are Visible in the Signature

With exceptions, you can't tell from the signature whether a function might throw:

```ts
// @noErrors
type Config = { host: string; port: number };
// ---cut-before---
// ❌ Does this throw? We can't tell from the signature
const parseConfig = (path: string): Config => {
  // ...
}
```

With `Result`, the return type makes it clear:

```ts
// @noErrors
import { Result } from '@praha/byethrow';
type Config = { host: string; port: number };
class ParseError extends Error {}
// ---cut-before---
// ✅ The return type tells us this might fail, and how
const parseConfig = (path: string): Result.Result<Config, ParseError> => {
  // ...
}
```

### 2. Errors Keep Their Types

A caught exception is always `unknown`. A `Result` preserves the exact error type:

```ts
import { Result } from '@praha/byethrow';

type ValidationError = { field: string; message: string };

const validateEmail = (email: string): Result.Result<string, ValidationError> => {
  if (!email.includes('@')) {
    return Result.fail({ field: 'email', message: 'Invalid email format' });
  }
  return Result.succeed(email);
};

const result = validateEmail('test');
if (Result.isFailure(result)) {
  // TypeScript knows result.error is ValidationError
  console.log(`Error in ${result.error.field}: ${result.error.message}`);
}
```

### 3. Results Compose

Results can be chained, and the error types of every step are collected into a union automatically.
You will learn how this works in the [Chaining Operations](../chaining/pipe-basics) chapter:

```ts
// @filename: type.ts
export type User = {
  id: string;
  name: string;
};

// @filename: functions.ts
import { Result } from '@praha/byethrow';
import type { User } from './type';

class ValidationError extends Error {}
export declare const validate: (value: User) => Result.Result<User, ValidationError>;

class TransformError extends Error {}
export declare const transform: (value: User) => Result.Result<User, TransformError>;

class SaveError extends Error {}
export declare const save: (value: User) => Result.ResultAsync<User, SaveError>;

// @filename: index.ts
import { validate, transform, save } from './functions';
const input = { id: '', name: '' };
// ---cut-before---
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.succeed(input),
  Result.andThen(validate),
  Result.andThen(transform),
  Result.andThen(save),
);
// Type: Result.ResultAsync<User, ValidationError | TransformError | SaveError>
```

## Async Results

An asynchronous `Result` is represented by `ResultAsync<T, E>`, which is simply an alias for `Promise<Result<T, E>>`:

```ts
import { Result } from '@praha/byethrow';

const asyncResult: Result.ResultAsync<number, never> = Promise.resolve(Result.succeed(42));
// Type: Result.ResultAsync<number, never>

// Since ResultAsync is just a Promise, you can await it
const resolved = await asyncResult;
// Type: Result.Result<number, never>
```

### Mixing Sync and Async

Every function in `@praha/byethrow` accepts both `Result` and `ResultAsync`.
When you mix synchronous and asynchronous steps in a pipeline, the result automatically becomes a `ResultAsync` from the first async step onward:

```ts
import { Result } from '@praha/byethrow';

// Sync function
const validate = (input: string): Result.Result<string, Error> => {
  if (input.length === 0) {
    return Result.fail(new Error('Input is empty'));
  }
  return Result.succeed(input);
};

// Async function
const fetchData = async (input: string): Result.ResultAsync<number, Error> => {
  // Simulating an API call
  return Result.succeed(input.length);
};

const result = Result.pipe(
  Result.succeed('hello'),
  Result.andThen(validate),  // sync
  Result.andThen(fetchData), // async: the pipeline becomes async from here
  Result.andThen((n) => Result.succeed(n * 2)), // sync, but runs in the async pipeline
);
// Type: Result.ResultAsync<number, Error>
```

## Utility Types

The library also provides a few types that help when writing your own functions around `Result`.

### `ResultMaybeAsync`

`ResultMaybeAsync<T, E>` is either a `Result<T, E>` or a `ResultAsync<T, E>`.
It is useful when an implementation may be either synchronous or asynchronous:

```ts
import { Result } from '@praha/byethrow';

type User = { id: string; name: string };

type UserRepository = {
  // Both sync (e.g. in-memory) and async (e.g. database) implementations are allowed
  findById: (id: string) => Result.ResultMaybeAsync<User, 'NotFound'>;
};
```

### `InferSuccess` and `InferFailure`

`InferSuccess` and `InferFailure` extract the success and error types from a `Result` type, or from a function that returns one:

```ts
import { Result } from '@praha/byethrow';

declare const findUser: (id: string) => Result.ResultAsync<{ id: string; name: string }, 'NotFound'>;

type User = Result.InferSuccess<typeof findUser>;
// Type: { id: string; name: string }

type FindUserError = Result.InferFailure<typeof findUser>;
// Type: 'NotFound'
```

## References

| API                                                                      | Purpose                                                      |
|--------------------------------------------------------------------------|--------------------------------------------------------------|
| [Success\<T>](../../../../api/types/Result.Success)                      | Represents a successful result                               |
| [Failure\<E>](../../../../api/types/Result.Failure)                      | Represents a failed result                                   |
| [Result\<T, E>](../../../../api/types/Result.Result)                     | A union of `Success` and `Failure`                           |
| [ResultAsync\<T, E>](../../../../api/types/Result.ResultAsync)           | An alias for `Promise<Result<T, E>>`                         |
| [ResultMaybeAsync\<T, E>](../../../../api/types/Result.ResultMaybeAsync) | Either a `Result` or a `ResultAsync`                         |
| [ResultFor\<R, T, E>](../../../../api/types/Result.ResultFor)            | `Result` or `ResultAsync`, depending on whether `R` is async |
| [InferSuccess\<T>](../../../../api/types/Result.InferSuccess)            | Extracts the success type                                    |
| [InferFailure\<T>](../../../../api/types/Result.InferFailure)            | Extracts the error type                                      |
