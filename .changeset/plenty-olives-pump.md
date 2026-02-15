---
"@praha/byethrow": minor
---

Add fn function to wrap throwing functions into Result

**BREAKING CHANGES:**

The `Result.try` function has been simplified to always execute immediately and return a `Result` or `ResultAsync` directly.
The previous behavior of returning a wrapped function has been moved to the new `Result.fn` function.

### Changes to `Result.try`

- **Removed**: The `immediate` option is no longer needed and has been removed. `Result.try` now always executes immediately.
- **Changed**: The `try` callback no longer accepts arguments. It must be a zero-argument function `() => ...`.

### New `Result.fn` function

A new `Result.fn` function has been added to handle the use case of wrapping a function that accepts arguments and returns a `Result`-returning function.

## Migration Guide

### If you were using `Result.try` with `immediate: true`

Simply remove the `immediate` option:

```ts
// Before
const result = Result.try({
  immediate: true,
  try: () => JSON.parse(jsonString),
  catch: (error) => new ParseError(error),
});

// After
const result = Result.try({
  try: () => JSON.parse(jsonString),
  catch: (error) => new ParseError(error),
});
```

### If you were using `Result.try` to create a reusable function

Use the new `Result.fn` function instead:

```ts
// Before
const parseJson = Result.try({
  try: (jsonString: string) => JSON.parse(jsonString),
  catch: (error) => new ParseError(error),
});
const result = parseJson('{"key": "value"}');

// After
const parseJson = Result.fn({
  try: (jsonString: string) => JSON.parse(jsonString),
  catch: (error) => new ParseError(error),
});
const result = parseJson('{"key": "value"}');
```
