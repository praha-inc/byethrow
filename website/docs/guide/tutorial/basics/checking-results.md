# Checking Results

After creating or receiving a `Result`, you need to determine whether it's a success or failure before accessing its contents. This section covers the type guard functions that help you do this safely.

## Checking for Success with `isSuccess`

The `isSuccess` function is a type guard that checks if a Result is a `Success`:

```ts
import { Result } from '@praha/byethrow';

const result: Result.Result<number, string> = Result.succeed(42);

if (Result.isSuccess(result)) {
  // TypeScript knows result is Success<number> here
  console.log(result.value); // 42
}
```

### Type Narrowing

The power of `isSuccess` is that it narrows the type, giving you safe access to the `value` property:

```ts
import { Result } from '@praha/byethrow';

const processResult = (result: Result.Result<string, Error>) => {
  if (Result.isSuccess(result)) {
    // ✅ TypeScript knows `value` exists
    return result.value.toUpperCase();
  }
  // ✅ TypeScript knows `error` exists here
  return `Error: ${result.error.message}`;
};
```

## Checking for Failure with `isFailure`

The `isFailure` function is the opposite—it checks if a Result is a `Failure`:

```ts
import { Result } from '@praha/byethrow';

const result: Result.Result<number, string> = Result.fail('Something went wrong');

if (Result.isFailure(result)) {
  // TypeScript knows result is Failure<string> here
  console.log(result.error); // "Something went wrong"
}
```

### Early Return Pattern

A common pattern is to check for failure first and return early:

```ts
type User = { id: number; name: string };
// ---cut-before---
import { Result } from '@praha/byethrow';

const handleUserLookup = (result: Result.Result<User, string>) => {
  if (Result.isFailure(result)) {
    console.error('Failed to find user:', result.error);
    return null;
  }

  // After the early return, TypeScript knows result is Success
  return result.value;
};
```

## Checking if a Value is a Result with `isResult`

Sometimes you need to check if an arbitrary value is a `Result`. The `isResult` function helps with this:

```ts
import { Result } from '@praha/byethrow';

const maybeResult: unknown = Result.succeed(42);

if (Result.isResult(maybeResult)) {
  // TypeScript knows maybeResult is Result<unknown, unknown>
  if (Result.isSuccess(maybeResult)) {
    console.log(maybeResult.value);
  }
}
```

### Generic Utilities Pattern

A common pattern is to write functions that accept various types and handle Results specially:

```ts
import { Result } from '@praha/byethrow';

const stringify = (value: unknown): string => {
  if (Result.isResult(value)) {
    if (Result.isSuccess(value)) {
      return `Success: ${JSON.stringify(value.value)}`;
    }
    return `Failure: ${JSON.stringify(value.error)}`;
  }
  return JSON.stringify(value);
};
```

## References

| Function                                                     | Purpose                    |
|--------------------------------------------------------------|----------------------------|
| [isSuccess(result)](../../../api/functions/Result.isSuccess) | Check if result is Success |
| [isFailure(result)](../../../api/functions/Result.isFailure) | Check if result is Failure |
| [isResult(value)](../../../api/functions/Result.isResult)    | Check if value is a Result |
