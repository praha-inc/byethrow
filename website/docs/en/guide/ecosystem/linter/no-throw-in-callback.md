# no-throw-in-callback

Disallows `throw` statements inside callbacks passed to `@praha/byethrow` functions such as `Result.andThen`, `Result.map`, etc.

## Rule details

Throwing inside a `@praha/byethrow` callback breaks the `Result` contract, not an exception. Use `Result.fail()` to represent errors instead, keeping error handling explicit and composable.

### Incorrect

```ts
import { Result } from '@praha/byethrow';

// ❌ throwing inside a callback
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

// ✅ returning a failure Result
const result = Result.pipe(
  Result.succeed(32),
  Result.andThen((value) => {
    if (value < 0) return Result.fail(new NegativeValueError());
    return Result.succeed(value * 2);
  }),
);
```
