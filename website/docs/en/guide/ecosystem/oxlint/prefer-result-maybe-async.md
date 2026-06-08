# prefer-result-maybe-async

Enforces use of `ResultMaybeAsync<T, E>` instead of the union type `Result<T, E> | ResultAsync<T, E>`.

## Rule details

`ResultMaybeAsync<T, E>` is an alias for `Result<T, E> | ResultAsync<T, E>`. Using the dedicated alias is shorter and more expressive. This rule auto-fixes violations.

### Incorrect

```ts
import { Result } from '@praha/byethrow';

// ❌ using the explicit union
type Result = Result.Result<string, Error> | Result.ResultAsync<string, Error>;
```

### Correct

```ts
import { Result } from '@praha/byethrow';

// ✅ using ResultMaybeAsync
type Result = Result.ResultMaybeAsync<string, Error>;
```
