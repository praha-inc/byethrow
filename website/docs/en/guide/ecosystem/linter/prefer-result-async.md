---
description: Oxlint rule that enforces the ResultAsync type alias over Promise<Result>, with auto-fix support.
---

# prefer-result-async

Enforces the use of `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.

This rule is auto-fixable.

## Rule Details

`ResultAsync<T, E>` is an alias for `Promise<Result<T, E>>`.
The alias is shorter and makes it immediately clear that a function returns an asynchronous `Result`.

### Incorrect

```ts
import { Result } from '@praha/byethrow';

class UserNotFoundError extends Error {}
type User = { id: string; name: string };

// ❌ Promise<Result<...>>
declare const findUser: (id: string) => Promise<Result.Result<User, UserNotFoundError>>;
```

### Correct

```ts
import { Result } from '@praha/byethrow';

class UserNotFoundError extends Error {}
type User = { id: string; name: string };

// ✅ ResultAsync
declare const findUser: (id: string) => Result.ResultAsync<User, UserNotFoundError>;
```

## Options

This rule has no options.
