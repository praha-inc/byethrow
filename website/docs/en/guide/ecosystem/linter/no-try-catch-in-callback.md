---
description: Oxlint rule that disallows try-catch blocks inside callbacks passed to @praha/byethrow functions — wrap throwing code with Result.fn() instead.
---

# no-try-catch-in-callback

Disallows `try-catch` blocks inside callbacks passed to `@praha/byethrow` functions, such as `Result.andThen` and `Result.map`.

## Rule Details

A `try-catch` inside a callback is a sign that error handling has escaped the `Result` model.
Wrap the throwing code with [`Result.fn()` or `Result.try()`](../../tutorial/basics/wrapping-functions) instead, and keep the pipeline itself free of `try-catch`.

### Incorrect

```ts
class ParseError extends Error {}
// ---cut-before---
import { Result } from '@praha/byethrow';

// ❌ try-catch inside a callback
const result = Result.pipe(
  Result.succeed('{"key": "value"}'),
  Result.andThen((value) => {
    try {
      return Result.succeed(JSON.parse(value));
    } catch {
      return Result.fail(new ParseError());
    }
  }),
);
```

### Correct

```ts
class ParseError extends Error {}
// ---cut-before---
import { Result } from '@praha/byethrow';

const parseJson = Result.fn({
  try: (value: string) => JSON.parse(value) as unknown,
  catch: (error) => new ParseError('Invalid JSON', { cause: error }),
});

// ✅ Wrapping the throwing code with Result.fn()
const result = Result.pipe(
  Result.succeed('{"key": "value"}'),
  Result.andThen(parseJson),
);
```

## Options

This rule has no options.
