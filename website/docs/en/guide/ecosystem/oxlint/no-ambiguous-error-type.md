# no-ambiguous-error-type

Disallows non-specific types in the error position of `Result`, `ResultAsync`, and `ResultMaybeAsync`.

## Rule details

Using vague types like `unknown`, `any`, `Error`, or primitive types as the error type of a `Result` means callers cannot distinguish between different error cases. Always use a concrete, domain-specific error class so that error handling is exhaustive and self-documenting.

### Incorrect

```ts
import { Result } from '@praha/byethrow';

// ❌ using unknown
type Result1 = Result.Result<string, unknown>;

// ❌ using a primitive
type Result2 = Result.Result<string, string>;

// ❌ using the base Error class
type Result3 = Result.Result<string, Error>;
```

### Correct

```ts
import { Result } from '@praha/byethrow';

// ✅ using a concrete error class
class NotFoundError extends Error {}
type Result = Result.Result<string, NotFoundError>;
```
