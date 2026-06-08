---
description: Oxlint rule that enforces ResultAsync over Promise-wrapped Result for async byethrow values, with auto-fix support
---

# prefer-result-async

Enforces use of `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.

## Rule details

`ResultAsync<T, E>` is an alias for `Promise<Result<T, E>>`. Using the dedicated type alias is shorter, more expressive, and signals clearly that the function returns a `Result`-wrapped async value. This rule auto-fixes violations.

### Incorrect

```ts
import { Result } from '@praha/byethrow';

// ❌ using Promise<Result<...>>
type Result = Promise<Result.Result<string, Error>>;
```

### Correct

```ts
import { Result } from '@praha/byethrow';

// ✅ using ResultAsync
type Result = Result.ResultAsync<string, Error>;
```
