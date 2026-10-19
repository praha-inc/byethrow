---
description: Converting code that throws into Results with Result.fn for reusable wrappers and Result.try for one-off execution, including async functions and the safe option.
---

# Wrapping Functions

Third-party libraries, built-in APIs such as `JSON.parse`, and legacy code often throw exceptions.
`fn` and `try` wrap such code and convert thrown exceptions into `Failure` results.

## Creating Reusable Wrappers with `fn`

`fn` takes a potentially throwing function and returns a new function that returns a `Result` instead:

```ts
import { Result } from '@praha/byethrow';

const parseJson = Result.fn({
  try: (input: string) => JSON.parse(input) as unknown,
  catch: (error) => new Error('Invalid JSON', { cause: error }),
});

const result = parseJson('{"name": "Alice"}');
// Type: Result.Result<unknown, Error>
```

It takes two options:

- `try`: The function to wrap. The wrapped function accepts the same arguments.
- `catch`: Converts the thrown value into your error type. The thrown value is `unknown`, so pass it as `cause` to keep the original error.

If `try` returns normally, its return value becomes a `Success`. If it throws, the value returned by `catch` becomes a `Failure`.

### Async Functions

If `try` returns a `Promise`, the wrapped function returns a `ResultAsync`.
A rejected promise is converted into a `Failure` in the same way as a thrown exception:

```ts
import { Result } from '@praha/byethrow';

type User = { id: string; name: string };

const fetchUser = Result.fn({
  try: async (id: string) => {
    const response = await fetch(`/api/users/${id}`);
    return await response.json() as User;
  },
  catch: (error) => new Error('Failed to fetch user', { cause: error }),
});

const result = await fetchUser('u123');
// Type: Result.Result<User, Error>
```

:::tip
Use `try` only to wrap code that throws on its own.
Don't `throw` inside it yourself to signal an expected failure, such as a non-OK HTTP status.
Instead, chain a step that returns `Result.fail`, as shown in [Chaining Results](../chaining/chaining-results).
The [no-throw-in-callback](../../ecosystem/linter/no-throw-in-callback) lint rule detects this mistake.
:::

## Running Code Once with `try`

`try` runs a function immediately and returns its outcome as a `Result`.
It is convenient when you only need to run the code once, in place:

```ts
import { Result } from '@praha/byethrow';

const result = Result.try({
  try: () => JSON.parse('{"name": "Alice"}') as { name: string },
  catch: (error) => new Error('Invalid JSON', { cause: error }),
});
// Type: Result.Result<{ name: string }, Error>
```

The options are the same as for `fn`, except that the `try` function takes no arguments.
Async functions are supported as well, and return a `ResultAsync`:

```ts
import { Result } from '@praha/byethrow';

const result = await Result.try({
  try: () => fetch('/api/health'),
  catch: (error) => new Error('Health check failed', { cause: error }),
});
// Type: Result.Result<Response, Error>
```

## Choosing Between `fn` and `try`

| Scenario                                            | Function to use |
|-----------------------------------------------------|-----------------|
| Define a reusable function, possibly with arguments | `fn`            |
| Run the code once, right where you need it          | `try`           |

For example, use `fn` for a utility called from many places, and `try` for a one-off operation such as reading configuration at startup:

```ts
class ParseError extends Error {}
type Config = { name: string };
declare const configText: string;
// ---cut-before---
import { Result } from '@praha/byethrow';

// A reusable JSON parser
const parseJson = Result.fn({
  try: (input: string) => JSON.parse(input) as unknown,
  catch: (error) => new ParseError('Invalid JSON', { cause: error }),
});

// Reading the configuration once at startup
const config = Result.try({
  try: () => JSON.parse(configText) as Config,
  catch: (error) => new ParseError('Invalid config', { cause: error }),
});
```

## Functions That Never Throw: the `safe` Option

If a function is known not to throw, pass `safe: true` instead of `catch`.
The error type becomes `never`:

```ts
import { Result } from '@praha/byethrow';

const double = Result.fn({
  safe: true,
  try: (x: number) => x * 2,
});

const result = double(5);
// Type: Result.Result<number, never>
```

This is useful for turning a plain function into one that fits into a `Result` pipeline.
`try` accepts the same option.

:::warning
With `safe: true`, exceptions are not caught.
If the function does throw (or its promise rejects), the exception propagates to the caller as usual.
Only use this option when you are sure the function cannot fail.
:::

## References

| API                                                  | Purpose                                                   |
|------------------------------------------------------|-----------------------------------------------------------|
| [fn(options)](../../../../api/functions/Result.fn)   | Wrap a throwing function into a function returning Result |
| [try(options)](../../../../api/functions/Result.try) | Run a throwing function once and return a Result          |
