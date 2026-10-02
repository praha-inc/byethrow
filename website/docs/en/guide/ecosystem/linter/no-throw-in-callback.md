---
description: Oxlint rule that disallows throw statements inside callbacks passed to @praha/byethrow functions — return Result.fail() to represent errors instead.
---

# no-throw-in-callback

Disallows `throw` statements inside callbacks passed to `@praha/byethrow` functions, such as `Result.andThen`, `Result.map`, and `Result.fn`.

## Rule Details

Throwing inside a callback turns an expected failure back into an exception.
The error disappears from the `Result` type, and callers can no longer see or handle it.
Return `Result.fail()` instead, so that the error stays explicit and composable.

This also applies to the `try` callback of `Result.fn` and `Result.try`.
Those callbacks are meant to wrap code that throws on its own, not to signal failures with your own `throw`.

### Incorrect

```ts
import { Result } from '@praha/byethrow';

// ❌ Throwing inside a callback
const result = Result.pipe(
  Result.succeed(32),
  Result.andThen((value) => {
    if (value < 0) throw new RangeError('negative value');
    return Result.succeed(value * 2);
  }),
);
```

### Correct

```ts
class NegativeValueError extends Error {}
// ---cut-before---
import { Result } from '@praha/byethrow';

// ✅ Returning a Failure
const result = Result.pipe(
  Result.succeed(32),
  Result.andThen((value) => {
    if (value < 0) return Result.fail(new NegativeValueError());
    return Result.succeed(value * 2);
  }),
);
```

## Options

This rule has no options.
