---
description: Oxlint rule that enforces toBeSuccess() and toBeFailure() matchers over boolean isSuccess/isFailure assertions in tests, with auto-fix
---

# prefer-result-matchers

Enforces use of `toBeSuccess()` / `toBeFailure()` from `@praha/byethrow-testing`.

## Rule details

Checking `Result.isSuccess(result)` and then asserting on the boolean is noisy. The dedicated matchers `toBeSuccess()` and `toBeFailure()` are shorter, produce better failure messages, and narrow the type inside an optional callback. This rule auto-fixes violations.

See [Testing](../testing) for setup instructions for `@praha/byethrow-testing`.

### Incorrect

```ts
import { Result } from '@praha/byethrow';
import { expect } from 'vitest';

const result: Result.Result<string, Error> = Result.succeed('hello');

// ❌ asserting on the boolean return of isSuccess / isFailure
expect(Result.isSuccess(result)).toBe(true);
expect(Result.isFailure(result)).toBeTruthy();
expect(Result.isSuccess(result)).not.toBe(false);
```

### Correct

```ts
import type { ResultMatchers } from '@praha/byethrow-testing';

declare module 'vitest' {
  interface Matchers<T> extends ResultMatchers<T> {}
}
// ---cut-before---
import { Result } from '@praha/byethrow';
import { expect } from 'vitest';

const result: Result.Result<string, Error> = Result.succeed('hello');

// ✅ using the dedicated matchers
expect(result).toBeSuccess();
expect(result).toBeFailure();
```

With a callback to assert on the inner value:

```ts
import type { ResultMatchers } from '@praha/byethrow-testing';

declare module 'vitest' {
  interface Matchers<T> extends ResultMatchers<T> {}
}
// ---cut-before---
import { Result } from '@praha/byethrow';
import { expect } from 'vitest';

const result: Result.Result<string, Error> = Result.succeed('hello');

expect(result).toBeSuccess((value) => {
  expect(value).toBe(42);
});

expect(result).toBeFailure((error) => {
  expect(error).toBeInstanceOf(Error);
});
```
