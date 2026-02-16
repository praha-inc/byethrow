---
description: Learn what the Result type is in @praha/byethrow and understand how it represents success and failure outcomes in TypeScript.
---

# Result Type

Before diving into the API, let's understand what the `Result` type is and why it's useful.

## What is a Result?

A `Result` is a type that represents the outcome of an operation that might fail.
It can be one of two variants:

- **Success**: The operation succeeded and contains a value
- **Failure**: The operation failed and contains an error

This is fundamentally different from throwing exceptions. With `Result`, the possibility of failure is encoded in the type system itself.

## The Structure

A `Result` is a simple object with a `type` discriminator:

```ts
import { Result } from '@praha/byethrow';

// A Success result
const success: Result.Success<number> = {
  type: 'Success',
  value: 42,
};

// A Failure result
const failure: Result.Failure<string> = {
  type: 'Failure',
  error: 'Something went wrong',
};
```

## The Union Type

The `Result.Result<T, E>` type is a union of `Success<T>` and `Failure<E>`:

```ts
import { Result } from '@praha/byethrow';

// This function returns either a Success<number> or a Failure<string>
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

### 1. Explicit Error Handling

With exceptions, you never know if a function might throw:

```ts
// @noErrors
type Config = { host: string; port: number };
// ---cut-before---
// ❌ Does this throw? We can't tell from the signature
const parseConfig = (path: string): Config => {
  // ...
}
```

With `Result`, it's clear:

```ts
// @noErrors
import { Result } from '@praha/byethrow';
type Config = { host: string; port: number };
class ParseError extends Error {}
// ---cut-before---
// ✅ The return type tells us this might fail
const parseConfig = (path: string): Result.Result<Config, ParseError> => {
  // ...
}
```

### 2. Type-Safe Errors

Exceptions lose type information. `Result` preserves it:

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

### 3. Composable

Results can be easily chained and composed (we'll cover this in later sections):

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

`@praha/byethrow` also supports asynchronous operations.
Asynchronous `Result` is a type alias `ResultAsync<T, E>`, representing `Promise<Result<T, E>>`:

```ts
import { Result } from '@praha/byethrow';

// ResultAsync is just Promise<Result<T, E>>
type ResultAsync<T, E> = Promise<Result.Result<T, E>>;

// The library handles both sync and async seamlessly
const asyncResult = Result.succeed(Promise.resolve(42));
// Type: Result.ResultAsync<number, never>

const resolved = await asyncResult;
// Type: Result.Result<number, never>
```

### Seamless Sync/Async Chaining

One of the powerful features of `@praha/byethrow` is that you can seamlessly chain synchronous and asynchronous Results together. When you mix sync and async operations in a pipeline, the result automatically becomes a `ResultAsync`:

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

// Sync and async can be chained together seamlessly
const result = Result.pipe(
  Result.succeed('hello'),
  Result.andThen(validate),  // sync
  Result.andThen(fetchData), // async - from here, the pipeline becomes async
  Result.andThen((n) => Result.succeed(n * 2)), // sync, but still in async context
);
// Type: Result.ResultAsync<number, Error>
```

## References

| Function                                                      | Purpose                            |
|---------------------------------------------------------------|------------------------------------|
| [Success\<T>](../../../../api/types/Result.Success)           | Represents a successful result     |
| [Failure\<T>](../../../../api/types/Result.Failure)           | Represents a failed result         |
| [Result<T, E>](../../../../api/types/Result.Result)           | A union type of Success or Failure |
| [ResultAsync<T, E>](../../../../api/types/Result.ResultAsync) | An asynchronous variant of Result  |
