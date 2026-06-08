---
description: Oxlint rule that disallows try-catch blocks inside @praha/byethrow callbacks — use Result.fn() to wrap throwing code instead
---

# no-try-catch-in-callback

Disallows `try-catch` blocks inside callbacks passed to `@praha/byethrow` functions such as `Result.andThen`, `Result.map`, etc.

## Rule details

A `try-catch` inside a `@praha/byethrow` callback is a sign that error handling has escaped the `Result` model. Use `Result.fn()` to wrap potentially-throwing code into a `Result`, keeping the pipeline clean.

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

const parser = Result.fn({
  try: (value: string) => JSON.parse(value),
  catch: (error: unknown) => new ParseError(),
});

// ✅ wrapping with Result.fn()
const result = Result.pipe(
  Result.succeed('{"key": "value"}'),
  Result.andThen(parser),
);
```
