# Chaining Results

The `andThen` and `orElse` functions allow you to chain computations that may themselves return a `Result`. Unlike `map` and `mapError` which only transform values, these functions enable sequential operations where each step can succeed or fail.

## `andThen` - Chaining Success Computations

The `andThen` function chains the next computation using the success value. If the original `Result` is a `Failure`, it is returned unchanged. Otherwise, the provided function is called, and its result is returned as-is.

### Basic Usage

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.succeed(3),
  Result.andThen((value) => Result.succeed(value * 2)),
);
// { type: 'Success', value: 6 }
```

### When the Input is a Failure

If the input is a `Failure`, `andThen` does nothing and returns the `Failure` as-is:

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.fail('error'),
  Result.andThen((value) => Result.succeed(value * 2)),
);
// { type: 'Failure', error: 'error' }
```

### When the Function Returns a Failure

The chained function can return a `Failure`, which propagates through the pipeline:

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.succeed(3),
  Result.andThen((value) => Result.fail('error: ' + value)),
);
// { type: 'Failure', error: 'error: 3' }
```

### Example: Sequential Validation

A common use case is chaining multiple validation or processing steps:

```ts
import { Result } from '@praha/byethrow';

type User = { id: string; name: string; email: string };

declare const findUserById: (id: string) => Result.ResultAsync<User, 'NotFound'>;
declare const validateEmail: (user: User) => Result.Result<User, 'InvalidEmail'>;
declare const saveUser: (user: User) => Result.ResultAsync<User, 'SaveFailed'>;

const result = await Result.pipe(
  Result.succeed('user-123'),
  Result.andThen(findUserById),
  Result.andThen(validateEmail),
  Result.andThen(saveUser),
);
// If any step fails, the pipeline short-circuits with that error
```

## `orElse` - Recovering from Failures

The `orElse` function chains the next computation using the error value. If the original `Result` is a `Success`, it is returned unchanged. Otherwise, the provided function is called, and its result is returned as-is.

This is useful for error recovery - providing fallback values or retrying with different strategies.

### Basic Usage

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.succeed(42),
  Result.orElse((error) => Result.succeed(0)),
);
// { type: 'Success', value: 42 }
```

### When the Input is a Failure

If the input is a `Failure`, `orElse` runs the recovery function:

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.fail('original error'),
  Result.orElse((error) => Result.succeed('default value')),
);
// { type: 'Success', value: 'default value' }
```

### When the Recovery Function Returns a Failure

The recovery function can also return a `Failure`:

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.fail('original error'),
  Result.orElse((error) => Result.fail('new error: ' + error)),
);
// { type: 'Failure', error: 'new error: original error' }
```

### Example: Fallback Strategy

A common pattern is implementing fallback strategies:

```ts
import { Result } from '@praha/byethrow';

type Config = { apiUrl: string; timeout: number };

declare const loadConfigFromFile: () => Result.ResultAsync<Config, 'FileNotFound'>;
declare const loadConfigFromEnv: () => Result.ResultAsync<Config, 'EnvNotSet'>;

const config = await Result.pipe(
  loadConfigFromFile(),
  Result.orElse(() => loadConfigFromEnv()),
);
// Try file first, then environment variables, else fail
```

## Combining `andThen` and `orElse`

You can use both functions together to create complex flows with both success chaining and error recovery:

```ts
import { Result } from '@praha/byethrow';

type User = { id: string; name: string };

declare const fetchUserFromCache: (id: string) => Result.ResultAsync<User, 'CacheMiss'>;
declare const fetchUserFromDb: (id: string) => Result.ResultAsync<User, 'NotFound'>;
declare const validateUser: (user: User) => Result.Result<User, 'Invalid'>;

const getValidatedUser = (id: string) => Result.pipe(
  fetchUserFromCache(id),
  Result.orElse(() => fetchUserFromDb(id)),
  Result.andThen(validateUser),
);
// Try cache first, fall back to DB, then validate the result
```

## References

| Function                                             | Purpose                                        |
|------------------------------------------------------|------------------------------------------------|
| [andThen(fn)](../../../api/functions/Result.andThen) | Chain a computation using the success value    |
| [orElse(fn)](../../../api/functions/Result.orElse)   | Recover from a failure with a new computation  |
