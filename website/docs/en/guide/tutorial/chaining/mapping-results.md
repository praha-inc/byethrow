---
description: Transforming the contents of a Result with Result.map for success values and Result.mapError for errors, with examples of formatting data for display and converting errors into HTTP responses.
---

# Mapping Results

`map` and `mapError` transform the contents of a `Result` without changing whether it is a `Success` or a `Failure`.

## Transforming Values with `map`

`map` transforms the success value with the given function.
If the `Result` is a `Failure`, the function is not called and the `Failure` is returned as-is:

```ts
import { Result } from '@praha/byethrow';

const success = Result.pipe(
  Result.succeed(2),
  Result.map((value) => value * 10),
);
// { type: 'Success', value: 20 }

const failure = Result.pipe(
  Result.fail('error'),
  Result.map((value) => value * 10), // Not called
);
// { type: 'Failure', error: 'error' }
```

### Example: Formatting Data for Display

A common use of `map` is converting raw data into the shape your UI needs:

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

const toProductView = (product: ProductRow): ProductView => ({
  id: String(product.id),
  name: product.name,
  price: `$${(product.priceInCents / 100).toFixed(2)}`,
});

const getProductForDisplay = (id: number): Result.ResultAsync<ProductView, 'NotFound'> => {
  return Result.pipe(
    fetchProduct(id),
    Result.map(toProductView),
  );
};
```

## Transforming Errors with `mapError`

`mapError` is the counterpart of `map` for errors.
It transforms the error value, and returns a `Success` as-is without calling the function:

```ts
import { Result } from '@praha/byethrow';

const failure = Result.pipe(
  Result.fail('NotFound'),
  Result.mapError((error) => new Error(error)),
);
// { type: 'Failure', error: Error('NotFound') }

const success = Result.pipe(
  Result.succeed(123),
  Result.mapError((error) => new Error(error)), // Not called
);
// { type: 'Success', value: 123 }
```

### Example: Converting Domain Errors into HTTP Errors

A common use of `mapError` is translating errors from one layer into the vocabulary of another, such as turning domain errors into HTTP responses:

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
```

## Using `map` and `mapError` Together

Both functions can be used in the same pipeline.
Only one of them actually runs, depending on whether the result is a success or a failure:

```ts
type UserRow = { id: number; first_name: string; last_name: string };
type UserView = { id: string; fullName: string };
type DatabaseError = 'RECORD_NOT_FOUND' | 'CONNECTION_FAILED';
type HttpError = { status: number; body: { error: string } };

declare const fetchUser: (id: number) => Result.ResultAsync<UserRow, DatabaseError>;
declare const toView: (row: UserRow) => UserView;
declare const toHttpError: (error: DatabaseError) => HttpError;
// ---cut-before---
import { Result } from '@praha/byethrow';

const getUserForView = (id: number): Result.ResultAsync<UserView, HttpError> => {
  return Result.pipe(
    fetchUser(id),
    Result.map(toView),           // Runs only on success
    Result.mapError(toHttpError), // Runs only on failure
  );
};
```

## `map` or `andThen`?

The function passed to `map` must return a plain value.
If your function returns a `Result`, because the transformation itself can fail, use `andThen` instead, which is covered on the next page:

```ts
declare const parseAge: (input: string) => Result.Result<number, string>;
// ---cut-before---
import { Result } from '@praha/byethrow';

// ❌ map wraps the returned Result in another Result
const nested = Result.pipe(
  Result.succeed('20'),
  Result.map(parseAge),
);
// Type: Result.Result<Result.Result<number, string>, never>

// ✅ andThen uses the returned Result as the next result
const flat = Result.pipe(
  Result.succeed('20'),
  Result.andThen(parseAge),
);
// Type: Result.Result<number, string>
```

## References

| API                                                       | Purpose                     |
|-----------------------------------------------------------|-----------------------------|
| [map(fn)](../../../../api/functions/Result.map)           | Transform the success value |
| [mapError(fn)](../../../../api/functions/Result.mapError) | Transform the error value   |
