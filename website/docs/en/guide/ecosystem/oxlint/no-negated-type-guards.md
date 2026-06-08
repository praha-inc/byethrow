# no-negated-type-guards

Disallows using the negation operator (`!`) on `Result.isSuccess()` or `Result.isFailure()`.

## Rule details

`!Result.isSuccess(result)` is equivalent to `Result.isFailure(result)`, but the negated form is less readable and requires an extra mental step to parse. This rule auto-fixes violations.

### Incorrect

```ts
import { Result } from '@praha/byethrow';

const result: Result.Result<string, Error> = Result.succeed('hello');

// ❌ negating isSuccess
if (!Result.isSuccess(result)) {
  // handle failure
}

// ❌ negating isFailure
if (!Result.isFailure(result)) {
  // handle success
}
```

### Correct

```ts
import { Result } from '@praha/byethrow';

const result: Result.Result<string, Error> = Result.succeed('hello');

// ✅ using the direct type guard
if (Result.isFailure(result)) {
  // handle failure
}

if (Result.isSuccess(result)) {
  // handle success
}
```
