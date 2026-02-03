---
description: Learn how to use andThrough and orThrough functions in @praha/byethrow for validation and recovery while preserving the original result.
---

# Validation and Recovery

The `andThrough` and `orThrough` functions allow you to run additional computations for validation or recovery while preserving the original result value.

## `andThrough` - Validation Without Transformation

The `andThrough` function runs an additional computation using the success value, but **returns the original result** if the additional computation is successful. If either the original result or the side effect result is a `Failure`, that failure is returned.

This is useful for running validations or side effects without altering the main result on success.

### Basic Usage

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.succeed(5),
  Result.andThrough((value) => {
    return 0 < value ? Result.succeed() : Result.fail('Must be > 0');
  }),
);
// { type: 'Success', value: 5 } - original value is preserved
```

### When the Input is a Failure

If the input is a `Failure`, `andThrough` does nothing and returns the `Failure` as-is:

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.fail('error'),
  Result.andThrough((value) => {
    return 0 < value ? Result.succeed() : Result.fail('Must be > 0');
  }),
);
// { type: 'Failure', error: 'error' }
```

### When the Function Returns a Failure

If the side effect returns a `Failure`, that failure is returned instead:

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.succeed(-10),
  Result.andThrough((value) => {
    return 0 < value ? Result.succeed() : Result.fail('Must be > 0');
  }),
);
// { type: 'Failure', error: 'Must be > 0' }
```

### Example: Multiple Validations

A common use case is running multiple validations on a value:

```ts
import { Result } from '@praha/byethrow';

type User = { name: string; age: number; email: string };

declare const validateName: (user: User) => Result.Result<void, 'Invalid name'>;
declare const validateAge: (user: User) => Result.Result<void, 'Invalid age'>;
declare const validateEmail: (user: User) => Result.Result<void, 'Invalid email'>;

const validateUser = (user: User) => Result.pipe(
  Result.succeed(user),
  Result.andThrough(validateName),
  Result.andThrough(validateAge),
  Result.andThrough(validateEmail),
);
// Returns the original user if all validations pass, otherwise the first error
```

## `orThrough` - Recovery with Original Failure

The `orThrough` function runs an additional computation to attempt recovery from a failure, but **returns the original failure** if the recovery is successful.

If the original result is a `Success`, it is returned immediately without running the function. If the original result is a `Failure`, the function is executed with the error value. If the function returns a `Success`, the original failure is returned. If the function returns a `Failure`, that new failure is returned.

This is useful for attempting to recover from a failed operation (e.g., cleanup, rollback) while still preserving the original error.

### Basic Usage

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.succeed(5),
  Result.orThrough((error) => {
    // failure recovery logic here
    return Result.succeed();
  }),
);
// { type: 'Success', value: 5 } - success passes through unchanged
```

### When the Input is a Failure

If the input is a `Failure`, `orThrough` runs the function but preserves the original error:

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.fail('error'),
  Result.orThrough((error) => {
    // failure recovery logic here
    return Result.succeed();
  }),
);
// Logs 'Logging error: error' and returns { type: 'Failure', error: 'error' }
```

### When the Function Returns a Failure

If the function returns a `Failure`, that new failure replaces the original:

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.fail('original error'),
  Result.orThrough((error) => {
    return Result.fail('new error');
  }),
);
// { type: 'Failure', error: 'new error' }
```

### Example: Recovery with Cleanup

A common use case is attempting to recover from a failed operation while performing cleanup:

```ts
import { Result } from '@praha/byethrow';

declare const uploadFile: (path: string, content: string) => Result.Result<void, 'UploadFileFailed'>;
declare const savePost: (id: string) => Result.Result<void, 'PostCreateFailed'>;
declare const deleteFile: (path: string) => Result.Result<void, 'DeleteFileFailed'>;

const createPost = (id: string, path: string, content: string) => Result.pipe(
  uploadFile(`/posts/${id}`, content),
  Result.andThen(() => savePost(id)),
  Result.orThrough(() => deleteFile(`/posts/${id}`)),
);
// If createPost fails, deleteFile is called to clean up
// but the original PostCreateFailed is returned
```

## References

| Function                                                   | Purpose                                                |
|------------------------------------------------------------|--------------------------------------------------------|
| [andThrough(fn)](../../../api/functions/Result.andThrough) | Run validation while preserving the original value     |
| [orThrough(fn)](../../../api/functions/Result.orThrough)   | Attempt recovery while preserving the original error   |
