# Creating Results

Now that you understand the `Result` type, let's learn how to create them using the library's helper functions.

## Creating Success Results with `succeed`

The `succeed` function creates a `Success` result:

```ts
import { Result } from '@praha/byethrow';

// With a value
const success = Result.succeed(42);
// Type: Result.Result<number, never>

// Without a value (void)
const voidSuccess = Result.succeed();
// Type: Result.Result<void, never>
```

### With Async Values

If you pass a `Promise`, `succeed` automatically returns a `ResultAsync`:

```ts
import { Result } from '@praha/byethrow';

const asyncSuccess = Result.succeed(Promise.resolve('hello'));
// Type: Result.ResultAsync<string, never>

const resolved = await asyncSuccess;
// Type: Result.Result<string, never>
```

## Creating Failure Results with `fail`

The `fail` function creates a `Failure` result:

```ts
import { Result } from '@praha/byethrow';

// With an error value
const failure = Result.fail('Something went wrong');
// Type: Result.Result<never, string>

// Without a value (void)
const voidFailure = Result.fail();
// Type: Result.Result<never, void>
```

### With Async Errors

Like `succeed`, if you pass a `Promise`, `fail` returns a `ResultAsync`:

```ts
import { Result } from '@praha/byethrow';

const asyncFailure = Result.fail(Promise.resolve('async error'));
// Type: Result.ResultAsync<never, string>

const resolved = await asyncFailure;
// Type: Result.Result<never, string>
```

## Starting a Pipeline with `do`

The `do` function is a convenient way to start a pipeline with an empty object:

```ts
import { Result } from '@praha/byethrow';

const start = Result.do();
// Type: Result.Result<{}, never>
```

This is especially useful when building up an object step by step (we'll cover this pattern with `bind` in a later section):

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.do(),
  Result.bind('name', () => Result.succeed('Alice')),
  Result.bind('age', () => Result.succeed(30)),
);
// Type: Result.Result<{ name: string; age: number }, never>
```

## References

| Function                                                | Purpose                 |
|---------------------------------------------------------|-------------------------|
| [succeed(value)](../../../api/functions/Result.succeed) | Create a success result |
| [fail(error)](../../../api/functions/Result.fail)       | Create a failure result |
| [do()](../../../api/functions/Result.do)                | Start with empty object |
