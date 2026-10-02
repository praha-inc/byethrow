---
description: Oxlint rule that disallows negating Result.isSuccess() or Result.isFailure() with the ! operator, and auto-fixes it to the opposite type guard.
---

# no-negated-type-guards

Disallows using the negation operator (`!`) on `Result.isSuccess()` or `Result.isFailure()`.

This rule is auto-fixable. The fix replaces the negated call with the opposite type guard.

## Rule Details

`!Result.isSuccess(result)` means the same as `Result.isFailure(result)`, but the negated form takes an extra mental step to read.
Since a `Result` is always either a success or a failure, there is always a direct type guard you can use instead.

### Incorrect

```ts
import { Result } from '@praha/byethrow';

declare const result: Result.Result<string, Error>;

// ❌ Negating isSuccess
if (!Result.isSuccess(result)) {
  // handle failure
}

// ❌ Negating isFailure
if (!Result.isFailure(result)) {
  // handle success
}
```

### Correct

```ts
import { Result } from '@praha/byethrow';

declare const result: Result.Result<string, Error>;

// ✅ Using the direct type guard
if (Result.isFailure(result)) {
  // handle failure
}

if (Result.isSuccess(result)) {
  // handle success
}
```

## Options

This rule has no options.
