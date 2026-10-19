---
description: Using Result.assertSuccess and Result.assertFailure to guarantee at compile time that every error (or success) has been handled, and combining them with unwrap for extraction that cannot throw.
---

# Asserting Results

After you have handled every possible error, for example with `orElse`, the error type of a `Result` becomes `never`.
`assertSuccess` and `assertFailure` let you state this in your code, and TypeScript verifies it at compile time.

## Asserting Success with `assertSuccess`

`assertSuccess` takes a `Result` whose error type is `never` and returns it as a `Success`:

```ts
import { Result } from '@praha/byethrow';

const result: Result.Result<number, never> = Result.succeed(42);
const success = Result.assertSuccess(result);
// success: { type: 'Success', value: 42 }
```

### When Errors Remain

If the error type is not `never`, meaning some errors might still occur, TypeScript reports a compile error:

```ts
// @errors: 2345
import { Result } from '@praha/byethrow';

const result: Result.Result<number, string> = Result.succeed(42);

// ❌ The error type is string, not never
const success = Result.assertSuccess(result);
```

### Handling Every Error with `orElse`

Use `orElse` to handle the errors so that the error type becomes `never`:

```ts
import { Result } from '@praha/byethrow';

declare const getResult: () => Result.Result<number, 'NotFound' | 'NetworkError'>;

const result = Result.pipe(
  getResult(),
  Result.orElse(() => Result.succeed(0)), // The error type is now never
  Result.assertSuccess,
);
// result: { type: 'Success', value: number }
```

If you later add a new error to `getResult` and forget to handle it, `assertSuccess` fails to compile, pointing you to the place that needs updating.

## Asserting Failure with `assertFailure`

`assertFailure` is the counterpart of `assertSuccess`.
It takes a `Result` whose success type is `never` and returns it as a `Failure`:

```ts
import { Result } from '@praha/byethrow';

const result: Result.Result<never, string> = Result.fail('error');
const failure = Result.assertFailure(result);
// failure: { type: 'Failure', error: 'error' }
```

If the success type is not `never`, TypeScript reports a compile error:

```ts
// @errors: 2345
import { Result } from '@praha/byethrow';

const result: Result.Result<number, string> = Result.fail('error');

// ❌ The success type is number, not never
const failure = Result.assertFailure(result);
```

## Unwrapping Safely with `assertSuccess` and `unwrap`

`unwrap` throws when it receives a `Failure`.
By calling `assertSuccess` first, you guarantee at compile time that there is no `Failure` left, so `unwrap` cannot throw:

```ts
import { Result } from '@praha/byethrow';

declare const getResult: () => Result.Result<number, 'NotFound' | 'NetworkError'>;

const value = Result.pipe(
  getResult(),
  Result.orElse(() => Result.succeed(0)), // Handle every error
  Result.assertSuccess,                   // Verify that no error remains
  Result.unwrap(),                        // Cannot throw
);
// value: number
```

This pattern is especially useful at the boundaries of your application, where you want to extract the final value safely.

## Compared to Type Guards

`assertSuccess` / `assertFailure` and `isSuccess` / `isFailure` serve different purposes:

| Function                          | When the check happens | Purpose                                              |
|-----------------------------------|------------------------|------------------------------------------------------|
| `isSuccess` / `isFailure`         | Runtime                | Branch on whether a `Result` is a success or failure |
| `assertSuccess` / `assertFailure` | Compile time           | Declare that only one variant is possible            |

As a safeguard, `assertSuccess` and `assertFailure` also throw an error at runtime if they receive the unexpected variant, for example because of an incorrect type assertion elsewhere.

## References

| API                                                                     | Purpose                                                              |
|-------------------------------------------------------------------------|----------------------------------------------------------------------|
| [assertSuccess(result)](../../../../api/functions/Result.assertSuccess) | Assert that a Result is a Success (the error type must be `never`)   |
| [assertFailure(result)](../../../../api/functions/Result.assertFailure) | Assert that a Result is a Failure (the success type must be `never`) |
