---
description: Oxlint rule that disallows vague success types such as unknown, any, object, or {} in Result, ResultAsync, and ResultMaybeAsync type annotations.
---

# no-ambiguous-success-type

Disallows non-specific types in the success position of `Result`, `ResultAsync`, and `ResultMaybeAsync`.

## Rule Details

When the success type of a `Result` is vague, callers don't know what they receive on success and have to check or cast the value themselves.
Use a concrete type instead.

The following types are reported in the success position: `unknown`, `any`, `object`, and `{}`.
`void` is allowed for operations that don't return a value.

The rule checks explicit type annotations such as `Result.Result<T, E>`. Types inferred by TypeScript are not checked.

### Incorrect

```ts
import { Result } from '@praha/byethrow';

class FetchError extends Error {}

// ❌ unknown
type FetchResult1 = Result.Result<unknown, FetchError>;

// ❌ any
type FetchResult2 = Result.Result<any, FetchError>;

// ❌ object
type FetchResult3 = Result.Result<object, FetchError>;
```

### Correct

```ts
import { Result } from '@praha/byethrow';

class FetchError extends Error {}

// ✅ A concrete type
type FetchResult = Result.Result<{ id: string }, FetchError>;

// ✅ void for operations that return no value
type DeleteResult = Result.Result<void, FetchError>;
```

:::tip
When a value really is unknown, such as a parsed JSON body, validate it with [`Result.parse`](../../tutorial/basics/parsing-values) to obtain a concrete type.
:::

## Options

This rule has no options.
