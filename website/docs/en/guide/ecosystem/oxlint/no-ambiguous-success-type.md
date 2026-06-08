# no-ambiguous-success-type

Disallows non-specific types in the success position of `Result`, `ResultAsync`, and `ResultMaybeAsync`.

## Rule details

Using vague types like `unknown`, `any`, `object`, or `{}` as the success type of a `Result` hides information from callers. Always use a concrete type so that consumers know exactly what they receive on success.

The following types are disallowed in the success position: `unknown`, `any`, `object`, `{}`

### Incorrect

```ts
import { Result } from '@praha/byethrow';

// ❌ using unknown
type Result1 = Result.Result<unknown, Error>;

// ❌ using any
type Result2 = Result.Result<any, Error>;

// ❌ using object
type Result3 = Result.Result<object, Error>;
```

### Correct

```ts
import { Result } from '@praha/byethrow';

// ✅ using a concrete type
type Result1 = Result.Result<{ id: string }, Error>;

// ✅ void is allowed for operations that return no value
type Result2 = Result.Result<void, Error>;
```
