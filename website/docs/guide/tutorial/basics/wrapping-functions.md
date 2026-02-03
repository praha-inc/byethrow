---
description: Learn how to wrap throwing functions and convert exceptions into Result types using the try function in @praha/byethrow.
---

# Wrapping Functions

Sometimes you need to work with code that throws exceptions—third-party libraries, built-in APIs, or legacy code. The `try` function wraps these potentially throwing operations and converts them into `Result` types.

## Basic Usage with Catch Handler

The most common pattern is to provide both a `try` function and a `catch` handler:

```ts
import { Result } from '@praha/byethrow';

const parseJSON = Result.try({
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

- The `try` property contains the function that might throw
- The `catch` property handles any thrown errors and converts them to your error type
- The return value is a wrapped function that returns a `Result` instead of throwing

## Immediate Execution

If you want to execute the function immediately instead of creating a wrapper, use the `immediate` option:

```ts
import { Result } from '@praha/byethrow';

const result = Result.try({
  immediate: true,
  try: () => JSON.parse('{"valid": true}') as { valid: boolean },
  catch: (error) => new Error('Parse failed', { cause: error }),
});

// result is Result<{ valid: boolean }, Error> (not a function)
if (Result.isSuccess(result)) {
  console.log(result.value.valid); // true
}
```

This is useful when you don't need to reuse the wrapped function.

## Safe Mode for Non-Throwing Functions

When you're certain a function won't throw, use the `safe` option to skip the catch handler:

```ts
import { Result } from '@praha/byethrow';

const double = Result.try({
  safe: true,
  try: (x: number) => x * 2,
});

const result = double(5);
// Type: Result.Result<number, never>
// The error type is `never` because we guarantee no exceptions
```

### Safe Mode with Immediate Execution

You can combine `safe` with `immediate`:

```ts
import { Result } from '@praha/byethrow';

const result = Result.try({
  safe: true,
  immediate: true,
  try: () => Math.random() + 1,
});

// result is Result<number, never>
```

## Working with Async Functions

The `try` function seamlessly handles async functions, returning a `ResultAsync`:

```ts
import { Result } from '@praha/byethrow';

const fetchUser = Result.try({
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

### Async with Immediate Execution

If you want to execute an async function immediately:

```ts
import { Result } from '@praha/byethrow';

const result = await Result.try({
  immediate: true,
  try: () => fetch('/api/health'),
  catch: (error) => new Error('Health check failed', { cause: error }),
});

// result is Result<Response, Error>
```

### Async Safe Mode

If your async function is guaranteed not to throw, use `safe`:

```ts
import { Result } from '@praha/byethrow';

const fn = Result.try({
  safe: true,
  try: async () => await Promise.resolve('ok'),
});

const result = await fn();
// Type: Result.Result<string, never>
```

## Choosing Between Options

| Scenario                                | Options to Use                           |
|-----------------------------------------|------------------------------------------|
| Wrap a throwing function for reuse      | `try` + `catch`                          |
| Execute once and get result             | `immediate: true` + `try` + `catch`      |
| Wrap a guaranteed non-throwing function | `safe: true` + `try`                     |
| Execute non-throwing function once      | `safe: true` + `immediate: true` + `try` |

## References

| Function                                          | Purpose                                    |
|---------------------------------------------------|--------------------------------------------|
| [try(options)](../../../api/functions/Result.try) | Wrap potentially throwing code in a Result |
