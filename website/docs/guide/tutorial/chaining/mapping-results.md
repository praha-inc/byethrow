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

### Example: Formatting Data for Display

A common use case is transforming raw data into a display-friendly format:

```ts
declare const fetchProduct: (id: number) => Result.ResultAsync<ProductRow, 'NotFound'>;
// ---cut-before---
import { Result } from '@praha/byethrow';

type ProductRow = {
  id: number;
  name: string;
  priceInCents: number;
};

type ProductView = {
  id: string;
  name: string;
  price: string;
};

const formatPrice = (cents: number): string => `$${(cents / 100).toFixed(2)}`;

const toProductView = (product: ProductRow): ProductView => ({
  id: String(product.id),
  name: product.name,
  price: formatPrice(product.priceInCents),
});

const getProductForDisplay = (id: number): Result.ResultAsync<ProductView, 'NotFound'> => {
  return Result.pipe(
    fetchProduct(id),
    Result.map(toProductView),
  );
};
// Transforms the raw product data into a UI-friendly format
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

### Example: Converting Internal Errors to HTTP Responses

A common use case is converting domain-specific errors into standardized HTTP error responses:

```ts
declare const processRequest: () => Result.ResultAsync<{ data: string }, DomainError>;
// ---cut-before---
import { Result } from '@praha/byethrow';

type DomainError = 
  | { type: 'NotFound'; resource: string }
  | { type: 'ValidationError'; field: string; message: string }
  | { type: 'Unauthorized' };

type HttpError = {
  status: number;
  body: { error: string; details?: string };
};

const toHttpError = (error: DomainError): HttpError => {
  switch (error.type) {
    case 'NotFound':
      return {
        status: 404,
        body: { error: 'Not Found', details: `${error.resource} was not found` },
      };
    case 'ValidationError':
      return {
        status: 400,
        body: { error: 'Bad Request', details: `${error.field}: ${error.message}` },
      };
    case 'Unauthorized':
      return {
        status: 401,
        body: { error: 'Unauthorized' },
      };
  }
};

const handleRequest = (): Result.ResultAsync<{ data: string }, HttpError> => {
  return Result.pipe(
    processRequest(),
    Result.mapError(toHttpError),
  );
};
// Converts domain errors into HTTP-appropriate error responses
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

type UserView = {
  id: string;
  fullName: string;
  memberSince: string;
};

type DatabaseError = 'RECORD_NOT_FOUND' | 'CONNECTION_FAILED' | 'TIMEOUT';

type HttpError = {
  status: number;
  body: { error: string; details?: string };
};

declare const fetchUser: (id: number) => Result.ResultAsync<UserRow, DatabaseError>;
// ---cut-before---
import { Result } from '@praha/byethrow';

const toView = (row: UserRow): UserView => ({
  id: String(row.id),
  fullName: `${row.first_name} ${row.last_name}`,
  memberSince: new Date(row.created_at).toLocaleDateString(),
});

const toHttpError = (error: DatabaseError): HttpError => {
  switch (error) {
    case 'RECORD_NOT_FOUND':
      return {
        status: 404,
        body: {
          error: 'User Not Found',
          details: 'The requested user does not exist.',
        },
      };
    case 'CONNECTION_FAILED':
    case 'TIMEOUT':
      return {
        status: 503,
        body: {
          error: 'Service Unavailable',
          details: 'Please try again later.',
        },
      };
  }
};

const getUserForView = (id: number): Result.ResultAsync<UserView, HttpError> => {
  return Result.pipe(
    fetchUser(id),
    Result.map(toView),
    Result.mapError(toHttpError),
  );
}
```

## References

| Function                                               | Purpose                                   |
|--------------------------------------------------------|-------------------------------------------|
| [map(fn)](../../../api/functions/Result.map)           | Transform the success value of a Result   |
| [mapError(fn)](../../../api/functions/Result.mapError) | Transform the error value of a Result     |
