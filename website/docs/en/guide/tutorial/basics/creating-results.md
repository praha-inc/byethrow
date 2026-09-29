---
description: Creating Success and Failure results with Result.succeed and Result.fail, returning them from functions, and starting an object-building pipeline with Result.do.
---

# Creating Results

Now that you know what a `Result` looks like, let's create them with the library's helper functions.

## Creating a Success with `succeed`

`succeed` creates a `Success` result:

```ts
import { Result } from '@praha/byethrow';

// With a value
const success = Result.succeed(42);
// Type: Result.Result<42, never>

// Without a value (void)
const voidSuccess = Result.succeed();
// Type: Result.Result<void, never>
```

The error type is `never` because this result can never be a failure.
A `void` success is handy for operations that have no meaningful return value, such as saving or deleting something.

## Creating a Failure with `fail`

`fail` creates a `Failure` result:

```ts
import { Result } from '@praha/byethrow';

// With an error value
const failure = Result.fail('NotFound');
// Type: Result.Result<never, 'NotFound'>

// Without a value (void)
const voidFailure = Result.fail();
// Type: Result.Result<never, void>
```

Any value can be used as an error. In real applications, we recommend using dedicated error classes, as described in [Custom Error](../../best-practices/custom-error).

:::info
As the examples above show, `succeed` and `fail` keep literal types such as `42` and `'NotFound'` instead of widening them to `number` and `string`.
This makes string literal errors like `'NotFound'` easy to distinguish from one another.
When you want a wider type, annotate the return type of your function, as shown below.
:::

## Returning Results from Functions

The most common way to use `succeed` and `fail` is to return them from your own functions, in place of `return` and `throw`:

```ts
import { Result } from '@praha/byethrow';

const parseAge = (input: string) => {
  const age = Number(input);
  if (!Number.isInteger(age) || age < 0) {
    return Result.fail('InvalidAge');
  }
  return Result.succeed(age);
};

const result = parseAge('20');
// Type: Result.Result<number, 'InvalidAge'>
```

TypeScript infers both the success type and the error type from the `return` statements.
You can also annotate the return type explicitly, which is a good practice for exported functions:

```ts
import { Result } from '@praha/byethrow';

const parseAge = (input: string): Result.Result<number, string> => {
  const age = Number(input);
  if (!Number.isInteger(age) || age < 0) {
    return Result.fail(`Invalid age: ${input}`);
  }
  return Result.succeed(age);
};
```

:::info
`succeed` and `fail` do not await a `Promise` for you.
If you have an async value, await it first, or use an `async` function whose return type is `ResultAsync`:

```ts
import { Result } from '@praha/byethrow';

declare const loadName: () => Promise<string>;
// ---cut-before---
const getName = async (): Result.ResultAsync<string, never> => {
  const name = await loadName();
  return Result.succeed(name);
};
```
:::

## Starting a Pipeline with `do`

`do` creates a `Success` that holds an empty object:

```ts
import { Result } from '@praha/byethrow';

const start = Result.do();
// Type: Result.Result<{}, never>
```

It is the starting point for building up an object step by step with `bind`, which is covered in [Building Objects](../combining/building-objects):

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.do(),
  Result.bind('name', () => Result.succeed('Alice')),
  Result.bind('age', () => Result.succeed(30)),
);
// { type: 'Success', value: { name: 'Alice', age: 30 } }
```

## References

| API                                                        | Purpose                                         |
|------------------------------------------------------------|-------------------------------------------------|
| [succeed(value)](../../../../api/functions/Result.succeed) | Create a success result                         |
| [fail(error)](../../../../api/functions/Result.fail)       | Create a failure result                         |
| [do()](../../../../api/functions/Result.do)                | Create a success result holding an empty object |
