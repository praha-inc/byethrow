---
description: Learn how to wrap throwing functions and convert exceptions into Result types using the try and fn functions in @praha/byethrow.
---

# Wrapping Functions

Sometimes you need to work with code that throws exceptions—third-party libraries, built-in APIs, or legacy code. The `try` and `fn` functions wrap these potentially throwing operations and convert them into `Result` types.

## Executing and Wrapping with `try`

The `try` function executes a function that might throw and returns a `Result` directly:

```ts
import { Result } from '@praha/byethrow';

const result = Result.try({
  try: () => JSON.parse('{"name": "Alice"}') as { name: string },
  catch: (error) => new Error('Invalid JSON', { cause: error }),
});
// Type: Result.Result<{ name: string }, Error>

if (Result.isSuccess(result)) {
  console.log(result.value.name); // "Alice"
}
```

### How It Works

- The `try` property contains a zero-argument function that might throw
- The `catch` property handles any thrown errors and converts them to your error type
- The function is executed immediately and returns a `Result`

### Safe Mode for Non-Throwing Functions

When you're certain a function won't throw, use the `safe` option to skip the catch handler:

```ts
import { Result } from '@praha/byethrow';

const result = Result.try({
  safe: true,
  try: () => Math.random() + 1,
});
// Type: Result.Result<number, never>
// The error type is `never` because we guarantee no exceptions
```

### Working with Async Functions

The `try` function seamlessly handles async functions, returning a `ResultAsync`:

```ts
import { Result } from '@praha/byethrow';

const result = await Result.try({
  try: () => fetch('/api/health'),
  catch: (error) => new Error('Health check failed', { cause: error }),
});
// Type: Result.Result<Response, Error>
```

## Creating Reusable Wrappers with `fn`

The `fn` function wraps a potentially throwing function and returns a new function that returns a `Result`. This is useful when you want to create reusable wrappers:

```ts
import { Result } from '@praha/byethrow';

const parseJSON = Result.fn({
  try: (input: string) => JSON.parse(input) as unknown,
  catch: (error) => new Error('Invalid JSON', { cause: error }),
});

const result = parseJSON('{"name": "Alice"}');
// Type: Result.Result<unknown, Error>

if (Result.isSuccess(result)) {
  console.log(result.value); // { name: "Alice" }
}
```

### How It Works

- The `try` property contains the function that might throw (can accept arguments)
- The `catch` property handles any thrown errors and converts them to your error type
- Returns a wrapped function that returns a `Result` instead of throwing

### Safe Mode for Non-Throwing Functions

When you're certain a function won't throw, use the `safe` option:

```ts
import { Result } from '@praha/byethrow';

const double = Result.fn({
  safe: true,
  try: (x: number) => x * 2,
});

const result = double(5);
// Type: Result.Result<number, never>
// The error type is `never` because we guarantee no exceptions
```

### Working with Async Functions

The `fn` function seamlessly handles async functions, returning a function that produces `ResultAsync`:

```ts
import { Result } from '@praha/byethrow';

const fetchUser = Result.fn({
  try: async (id: string) => {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) throw new Error('Not found');
    return await response.json() as { id: string; name: string };
  },
  catch: (error) => new Error('Failed to fetch user', { cause: error }),
});

const result = await fetchUser('123');
// Type: Result.Result<{ id: string; name: string }, Error>
```

## Choosing Between `try` and `fn`

| Scenario                                | Function to Use |
|-----------------------------------------|-----------------|
| Execute once and get result immediately | `try`           |
| Create a reusable wrapped function      | `fn`            |
| Function needs to accept arguments      | `fn`            |
| Inline one-off error handling           | `try`           |

### Example: When to Use Each

Use `try` for one-off executions:

```ts
type Config = { name: string };
class ConfigError extends Error {}
// ---cut-before---
import { Result } from '@praha/byethrow';

// Reading config once at startup
const config = Result.try({
  try: () => JSON.parse('{"name": "Alice"}') as Config,
  catch: (error) => new ConfigError('Invalid config', { cause: error }),
});
```

Use `fn` for reusable utilities:

```ts
class ParseError extends Error {}
// ---cut-before---
import { Result } from '@praha/byethrow';

// Creating a reusable JSON parser
const parseJSON = Result.fn({
  try: (input: string) => JSON.parse(input) as unknown,
  catch: (error) => new ParseError('Invalid JSON', { cause: error }),
});

// Use it multiple times
const config = parseJSON('{"name": "Alice"}');
const data = parseJSON('{"name": "Bob"}');
```

## References

| Function                                          | Purpose                                              |
|---------------------------------------------------|------------------------------------------------------|
| [try(options)](../../../api/functions/Result.try) | Execute a throwing function and return a Result      |
| [fn(options)](../../../api/functions/Result.fn)   | Wrap a throwing function into a Result-returning one |
