# Mapping Results

The `map` and `mapError` functions allow you to transform the values inside a `Result` without changing its type (`Success` or `Failure`).

## `map` - Transforming Success Values

The `map` function transforms the success value of a `Result`. If the `Result` is a `Failure`, it passes through unchanged.

### Basic Usage

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.succeed(2),
  Result.map((value) => value * 10),
);
// { type: 'Success', value: 20 }
```

### When the Result is a Failure

If the input is a `Failure`, `map` does nothing and returns the `Failure` as-is:

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.fail('error'),
  Result.map((value) => value * 10),
);
// { type: 'Failure', error: 'error' }
```

## `mapError` - Transforming Error Values

The `mapError` function transforms the error value of a `Result`. If the `Result` is a `Success`, it passes through unchanged.

### Basic Usage

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.fail('NotFound'),
  Result.mapError((error) => new Error(error)),
);
// { type: 'Failure', error: Error('NotFound') }
```

### When the Result is a Success

If the input is a `Success`, `mapError` does nothing and returns the `Success` as-is:

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.succeed(123),
  Result.mapError((error) => new Error(error)),
);
// { type: 'Success', value: 123 }
```

## Combining `map` and `mapError`

You can use both `map` and `mapError` in the same pipeline to transform both success and error values.

Suppose you have a function that fetches a user from the database. The raw data may need formatting for the UI, and internal error codes need to be converted into user-friendly messages:

```ts
type UserRow = {
  id: number;
  first_name: string;
  last_name: string;
  created_at: string;
};

type UserViewModel = {
  id: string;
  fullName: string;
  memberSince: string;
};

type DatabaseError = 'RECORD_NOT_FOUND' | 'CONNECTION_FAILED' | 'TIMEOUT';

type UserFacingError = {
  title: string;
  message: string;
};

declare const fetchUser: (id: number) => Result.ResultAsync<UserRow, DatabaseError>;
// ---cut-before---
import { Result } from '@praha/byethrow';

const toViewModel = (row: UserRow): UserViewModel => ({
  id: String(row.id),
  fullName: `${row.first_name} ${row.last_name}`,
  memberSince: new Date(row.created_at).toLocaleDateString(),
});

const toUserFacingError = (error: DatabaseError): UserFacingError => {
  switch (error) {
    case 'RECORD_NOT_FOUND':
      return {
        title: 'User Not Found',
        message: 'The requested user does not exist.',
      };
    case 'CONNECTION_FAILED':
    case 'TIMEOUT':
      return {
        title: 'Service Unavailable',
        message: 'Please try again later.',
      };
  }
};

const getUserForDisplay = (id: number): Result.ResultAsync<UserViewModel, UserFacingError> => {
  return Result.pipe(
    fetchUser(id),
    Result.map(toViewModel),
    Result.mapError(toUserFacingError),
  );
}
```

In this example:
- `map` transforms the raw database row into a UI-friendly view model
- `mapError` converts internal error codes into user-facing error messages

## References

| Function                                               | Purpose                                   |
|--------------------------------------------------------|-------------------------------------------|
| [map(fn)](../../../api/functions/Result.map)           | Transform the success value of a Result   |
| [mapError(fn)](../../../api/functions/Result.mapError) | Transform the error value of a Result     |
