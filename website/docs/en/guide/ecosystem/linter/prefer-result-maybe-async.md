---
description: Oxlint rule that enforces the ResultMaybeAsync type alias over the union of Result and ResultAsync, with auto-fix support.
---

# prefer-result-maybe-async

Enforces the use of `ResultMaybeAsync<T, E>` instead of the union `Result<T, E> | ResultAsync<T, E>`.

This rule is auto-fixable.

## Rule Details

`ResultMaybeAsync<T, E>` is an alias for `Result<T, E> | ResultAsync<T, E>`.
The alias is shorter and clearly expresses that the value may be either synchronous or asynchronous.

### Incorrect

```ts
import { Result } from '@praha/byethrow';

class UserNotFoundError extends Error {}
type User = { id: string; name: string };

// ❌ The explicit union
type FindUser = (id: string) => Result.Result<User, UserNotFoundError> | Result.ResultAsync<User, UserNotFoundError>;
```

### Correct

```ts
import { Result } from '@praha/byethrow';

class UserNotFoundError extends Error {}
type User = { id: string; name: string };

// ✅ ResultMaybeAsync
type FindUser = (id: string) => Result.ResultMaybeAsync<User, UserNotFoundError>;
```

## Options

This rule has no options.
