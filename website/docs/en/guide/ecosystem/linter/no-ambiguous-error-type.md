---
description: Oxlint rule that disallows vague error types such as unknown, any, string, or Error in Result, ResultAsync, and ResultMaybeAsync type annotations.
---

# no-ambiguous-error-type

Disallows non-specific types in the error position of `Result`, `ResultAsync`, and `ResultMaybeAsync`.

## Rule Details

When the error type of a `Result` is vague, callers cannot tell the different failure cases apart and cannot handle them exhaustively.
Use a concrete, domain-specific error type instead, as described in [Custom Error](../../best-practices/custom-error).

The following types are reported in the error position:

- `unknown` and `any`
- Primitive types: `string`, `number`, `boolean`, `bigint`, `symbol`, `null`, and `undefined`
- `object` and `{}`
- The base `Error` class

The rule checks explicit type annotations such as `Result.Result<T, E>`. Types inferred by TypeScript are not checked.

### Incorrect

```ts
import { Result } from '@praha/byethrow';

// ❌ unknown
type FindUserResult = Result.Result<string, unknown>;

// ❌ A primitive type
type ParseResult = Result.Result<number, string>;

// ❌ The base Error class
type SaveResult = Result.ResultAsync<void, Error>;
```

### Correct

```ts
import { Result } from '@praha/byethrow';

class UserNotFoundError extends Error {
  override readonly name = 'UserNotFoundError';
}

// ✅ A concrete error class
type FindUserResult = Result.Result<string, UserNotFoundError>;
```

## Options

This rule has no options.
