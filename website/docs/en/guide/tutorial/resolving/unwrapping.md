---
description: Learn how to extract values from Results using unwrap and unwrapError functions in @praha/byethrow with optional default values.
---

# Unwrapping Results

Sometimes you need to extract the actual value from a `Result`, exiting the Result "world" back into plain values. The `unwrap` and `unwrapError` functions help with this.

## Extracting Success Values with `unwrap`

The `unwrap` function extracts the success value from a Result:

```ts
import { Result } from '@praha/byethrow';

const result = Result.succeed(42);
const value = Result.unwrap(result);
// value: 42
```

### What Happens on Failure?

If the Result is a `Failure` and no default is provided, `unwrap` throws the error:

```ts
import { Result } from '@praha/byethrow';

const result = Result.fail(new Error('Something went wrong'));
const value = Result.unwrap(result);
// Throws: Error('Something went wrong')
```

### Providing a Default Value

You can provide a default value to avoid throwing:

```ts
import { Result } from '@praha/byethrow';

const result = Result.fail('error');
const value = Result.unwrap(result, 0);
// value: 0 (default value)
```

```ts
import { Result } from '@praha/byethrow';

const success = Result.succeed(42);
const value = Result.unwrap(success, 0);
// value: 42 (success value, default ignored)
```

## Extracting Error Values with `unwrapError`

The `unwrapError` function is the opposite—it extracts the error value:

```ts
import { Result } from '@praha/byethrow';

const result = Result.fail('Something went wrong');
const error = Result.unwrapError(result);
// error: 'Something went wrong'
```

### What Happens on Success?

If the Result is a `Success` and no default is provided, `unwrapError` throws the value:

```ts
import { Result } from '@praha/byethrow';

const result = Result.succeed(42);
const error = Result.unwrapError(result);
// Throws: 42
```

### Providing a Default Error

You can provide a default value to avoid throwing:

```ts
import { Result } from '@praha/byethrow';

const result = Result.succeed(42);
const error = Result.unwrapError(result, 'No error');
// error: 'No error' (default value)
```

```ts
import { Result } from '@praha/byethrow';

const failure = Result.fail('Something went wrong');
const error = Result.unwrapError(failure, 'No error');
// error: 'Something went wrong' (failure value, default ignored)
```

## Working with Async Results

Both `unwrap` and `unwrapError` work with `ResultAsync`:

```ts
import { Result } from '@praha/byethrow';

const asyncResult = Result.succeed(Promise.resolve(42));

// Returns a Promise
const value = await Result.unwrap(asyncResult);
// value: 42
```

With default:

```ts
import { Result } from '@praha/byethrow';

const asyncResult = Result.fail(Promise.resolve('error'));
const value = await Result.unwrap(asyncResult, 0);
// value: 0
```

## When to Use `unwrap`

### Good Use Cases

Use `unwrap` at the boundaries of your application—such as HTTP handlers, CLI entry points-where you need to exit the Result world and return plain values to the outside world.

```ts
declare const processRequest: (req: Request) => Result.ResultAsync<number, 'NotFound' | 'Unexpected'>;
// ---cut-before---
import { Result } from '@praha/byethrow';

const handleRequest = async (req: Request): Promise<Response> => {
  return await Result.pipe(
    processRequest(req),
    Result.map((result) => {
      return new Response(JSON.stringify(result), { status: 200 });
    }),
    Result.orElse((error) => {
      switch (error) {
        case 'NotFound':
          return Result.succeed(new Response('Not Found', { status: 404 }));
        default:
          return Result.fail(error);
      }
    }),
    // Unexpected errors are thrown here and can be detected
    // by infrastructure-level error monitoring tools like Sentry or CloudWatch.
    Result.unwrap(),
  );
};
```

### Avoid Using `unwrap`

Avoid calling `unwrap` in the middle of your logic. Doing so exits the Result "world" prematurely, losing the benefits of type-safe error handling. Instead, keep values wrapped in Results and use combinators like `map`, `flatMap`, or `orElse` to transform them.

```ts
import { Result } from '@praha/byethrow';

// ❌ Don't do this
const bad = Result.unwrap(Result.succeed(42)) * 2;

// ✅ Do this instead
const good = Result.pipe(
  Result.succeed(42),
  Result.map((x) => x * 2),
);
```

## References

| Function                                                            | Purpose                                                                        |
|---------------------------------------------------------------------|--------------------------------------------------------------------------------|
| [unwrap(result)](../../../../api/functions/Result.unwrap)           | Extracts the success value from a Result, or throws/returns default on failure |
| [unwrapError(result)](../../../../api/functions/Result.unwrapError) | Extracts the error value from a Result, or throws/returns default on success   |
