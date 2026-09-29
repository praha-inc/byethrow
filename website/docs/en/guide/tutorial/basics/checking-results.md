---
description: Using the isSuccess, isFailure, and isResult type guards to check a Result and safely narrow it to access its value or error.
---

# Checking Results

Before you can read the contents of a `Result`, you need to know whether it is a success or a failure.
This page covers the type guard functions that check a `Result` and narrow its type.

## Checking for Success with `isSuccess`

`isSuccess` returns `true` if the `Result` is a `Success`.
Inside the `if` block, TypeScript narrows the type so that you can safely access `value`:

```ts
import { Result } from '@praha/byethrow';

const result: Result.Result<number, string> = Result.succeed(42);

if (Result.isSuccess(result)) {
  // result is narrowed to Success<number>
  console.log(result.value); // 42
}
```

Narrowing also works for the other branch.
If the result is not a `Success`, it must be a `Failure`, so `error` is available there:

```ts
import { Result } from '@praha/byethrow';

const describe = (result: Result.Result<string, Error>) => {
  if (Result.isSuccess(result)) {
    // ✅ `value` is available here
    return result.value.toUpperCase();
  }
  // ✅ `error` is available here
  return `Error: ${result.error.message}`;
};
```

## Checking for Failure with `isFailure`

`isFailure` is the counterpart of `isSuccess`. It returns `true` if the `Result` is a `Failure`:

```ts
import { Result } from '@praha/byethrow';

const result: Result.Result<number, string> = Result.fail('Something went wrong');

if (Result.isFailure(result)) {
  // result is narrowed to Failure<string>
  console.log(result.error); // "Something went wrong"
}
```

### Early Return

A common pattern is to handle the failure first and return early.
After the `if` block, the result is known to be a `Success`:

```ts
type User = { id: number; name: string };
// ---cut-before---
import { Result } from '@praha/byethrow';

const getUserName = (result: Result.Result<User, string>) => {
  if (Result.isFailure(result)) {
    console.error('Failed to find user:', result.error);
    return null;
  }

  // result is narrowed to Success<User>
  return result.value.name;
};
```

:::tip
Prefer `Result.isFailure(result)` over `!Result.isSuccess(result)`, and vice versa.
The [no-negated-type-guards](../../ecosystem/linter/no-negated-type-guards) lint rule enforces this automatically.
:::

## Checking Whether a Value Is a Result with `isResult`

`isResult` checks whether an arbitrary value is a `Result` at all.
This is useful when you receive a value of an unknown type:

```ts
import { Result } from '@praha/byethrow';

const stringify = (value: unknown): string => {
  if (Result.isResult(value)) {
    // value is narrowed to Result<unknown, unknown>
    if (Result.isSuccess(value)) {
      return `Success: ${JSON.stringify(value.value)}`;
    }
    return `Failure: ${JSON.stringify(value.error)}`;
  }
  return JSON.stringify(value);
};
```

## References

| API                                                             | Purpose                             |
|-----------------------------------------------------------------|-------------------------------------|
| [isSuccess(result)](../../../../api/functions/Result.isSuccess) | Check whether a Result is a Success |
| [isFailure(result)](../../../../api/functions/Result.isFailure) | Check whether a Result is a Failure |
| [isResult(value)](../../../../api/functions/Result.isResult)    | Check whether a value is a Result   |
