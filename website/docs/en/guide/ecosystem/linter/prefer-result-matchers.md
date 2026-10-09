---
description: Oxlint rule for test files that enforces the toBeSuccess() and toBeFailure() matchers over boolean isSuccess/isFailure assertions and unwrap calls, with auto-fix support.
---

# prefer-result-matchers

Enforces the use of the `toBeSuccess()` / `toBeFailure()` matchers from [`@praha/byethrow-testing`](../testing) in tests.

This rule is auto-fixable. In the recommended preset, it is only enabled for test files.

## Rule Details

Asserting on the boolean returned by `Result.isSuccess()` is noisy, and a failed assertion only tells you that `false` was not `true`.
Calling `Result.unwrap()` in a test throws an unhelpful error when the result is a failure.
The dedicated matchers are shorter, print the received `Result` when they fail, and give you a typed value in their callback.

This rule reports the following patterns:

- `expect(Result.isSuccess(result))` / `expect(Result.isFailure(result))` followed by `.toBe()`, `.toBeTruthy()`, or `.toBeFalsy()`
- `assert(Result.isSuccess(result))` / `assert(Result.isFailure(result))`
- `Result.unwrap(result)` / `Result.unwrapError(result)`

### Incorrect

```ts
import { Result } from '@praha/byethrow';
import { assert, expect } from 'vitest';

declare const result: Result.Result<string, Error>;

// ❌ Asserting on the boolean returned by isSuccess / isFailure
expect(Result.isSuccess(result)).toBe(true);
expect(Result.isFailure(result)).toBeTruthy();
assert(Result.isSuccess(result));

// ❌ Unwrapping the result to assert on its value
expect(Result.unwrap(result)).toBe('hello');
```

### Correct

```ts
import type { ResultMatchers } from '@praha/byethrow-testing';

declare module 'vitest' {
  interface Matchers<R, T> extends ResultMatchers<R, T> {}
}
// ---cut-before---
import { Result } from '@praha/byethrow';
import { expect } from 'vitest';

declare const result: Result.Result<string, Error>;

// ✅ Using the dedicated matchers
expect(result).toBeSuccess();
expect(result).toBeFailure();

// ✅ Asserting on the value in the callback
expect(result).toBeSuccess((value) => {
  expect(value).toBe('hello');
});

expect(result).toBeFailure((error) => {
  expect(error).toBeInstanceOf(Error);
});
```

See [Testing](../testing) for how to set up `@praha/byethrow-testing`.

## Options

This rule has no options.
