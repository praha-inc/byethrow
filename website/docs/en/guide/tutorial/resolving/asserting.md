---
description: Learn how to assert Result types at compile time using assertSuccess and assertFailure in @praha/byethrow for safe value extraction.
---

# Asserting Results

When you've exhausted all possible errors through operations like `orElse` or `andThen`, you can use `assertSuccess` and `assertFailure` to assert the Result type at compile time. Combined with `unwrap` and `unwrapError`, this enables safe value extraction.

## Asserting Success with `assertSuccess`

The `assertSuccess` function asserts that a Result is a `Success`. This function requires the error type to be `never`, ensuring at compile time that the Result is guaranteed to be a `Success`:

```ts
import { Result } from '@praha/byethrow';

const result: Result.Result<number, never> = Result.succeed(42);
const success = Result.assertSuccess(result);
// success: { type: 'Success', value: 42 }
```

### When Error Type is Not `never`

If the error type is not `never`, TypeScript will raise a compilation error:

```ts
// @errors: 2345
import { Result } from '@praha/byethrow';

const result: Result.Result<number, string> = Result.succeed(42);

// ❌ TypeScript error: error type is string, not never
const success = Result.assertSuccess(result);
```

### Making Error Type `never` with `orElse`

Use `orElse` to handle all errors and narrow the error type to `never`:

```ts
import { Result } from '@praha/byethrow';

declare const getResult: () => Result.Result<number, 'NotFound' | 'NetworkError'>;

const result = Result.pipe(
  getResult(),
  Result.orElse((error) => {
    // Handle all errors and return a fallback value
    return Result.succeed(0);
  }),
  // Error type is now never
  Result.assertSuccess,
);
// result: { type: 'Success', value: number }
```

## Asserting Failure with `assertFailure`

The `assertFailure` function is the opposite—it asserts that a Result is a `Failure`. This function requires the success type to be `never`:

```ts
import { Result } from '@praha/byethrow';

const result: Result.Result<never, string> = Result.fail('error');
const failure = Result.assertFailure(result);
// failure: { type: 'Failure', error: 'error' }
```

### When Success Type is Not `never`

If the success type is not `never`, TypeScript will raise a compilation error:

```ts
// @errors: 2345
import { Result } from '@praha/byethrow';

const result: Result.Result<number, string> = Result.fail('error');
// ❌ TypeScript error: success type is number, not never
const failure = Result.assertFailure(result);
```

### Making Success Type `never` with `andThen`

Use `andThen` to make all paths fail and narrow the success type to `never`:

```ts
import { Result } from '@praha/byethrow';

declare const getResult: () => Result.Result<number, string>;

const result = Result.pipe(
  getResult(),
  Result.andThen(() => {
    // All paths lead to failure
    return Result.fail('converted error');
  }),
  // Success type is now never
  Result.assertFailure,
);
// result: { type: 'Failure', error: string }
```

## Safe Unwrapping with `assertSuccess` + `unwrap`

By combining `assertSuccess` with `unwrap`, you can safely extract values from a Result. Since the error type is `never` after the assertion, `unwrap` is guaranteed not to throw:

```ts
import { Result } from '@praha/byethrow';

declare const getResult: () => Result.Result<number, 'NotFound' | 'NetworkError'>;

const value = Result.pipe(
  getResult(),
  Result.orElse(() => Result.succeed(0)), // Handle all errors
  Result.assertSuccess, // Error type is now never
  Result.unwrap(), // Safe: guaranteed not to throw
);
// value: number
```

This pattern is particularly useful at application boundaries where you want to ensure type safety while extracting the final value.

## Difference from Runtime Type Guards

It's important to understand the difference between `assertSuccess`/`assertFailure` and `isSuccess`/`isFailure`:

| Function        | Purpose                                     | Throws on Mismatch?         |
|-----------------|---------------------------------------------|-----------------------------|
| `isSuccess`     | Runtime check, returns boolean              | No                          |
| `isFailure`     | Runtime check, returns boolean              | No                          |
| `assertSuccess` | Compile-time assertion (requires `never`)   | Yes (if type is wrong)      |
| `assertFailure` | Compile-time assertion (requires `never`)   | Yes (if type is wrong)      |

- **`isSuccess`/`isFailure`**: Use when you need to branch based on the Result type at runtime
- **`assertSuccess`/`assertFailure`**: Use when you've already ensured the Result type at compile time and want to assert it

## References

| Function                                                                | Purpose                                                               |
|-------------------------------------------------------------------------|-----------------------------------------------------------------------|
| [assertSuccess(result)](../../../../api/functions/Result.assertSuccess) | Assert that a Result is Success (requires error type to be `never`)   |
| [assertFailure(result)](../../../../api/functions/Result.assertFailure) | Assert that a Result is Failure (requires success type to be `never`) |
