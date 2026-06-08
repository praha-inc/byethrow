---
description: Oxlint rule that enforces a single namespace alias — Result or R — for @praha/byethrow imports, with auto-fix support
---

# consistent-namespace

Enforces that imports from `@praha/byethrow` use a consistent namespace alias — either `Result` or `R`.

## Rule details

When working with `@praha/byethrow`, you can import the namespace as either `Result` or `R`. Mixing both aliases in a project makes code inconsistent and harder to search. This rule enforces a single preferred alias and auto-fixes violations.

The default preferred namespace is `Result`.

### Incorrect

```ts
// ❌ mixing Result and R in the same codebase
import { Result, R } from '@praha/byethrow';

const success = Result.succeed(42);
const failure = R.fail(new Error('Something went wrong'));
```

### Correct

```ts
// ✅ using Result consistently
import { Result } from '@praha/byethrow';

const success = Result.succeed(42);
const failure = Result.fail(new Error('Something went wrong'));
```

```ts
// ✅ using R consistently (when configured to prefer R)
import { R } from '@praha/byethrow';

const success = R.succeed(42);
const failure = R.fail(new Error('Something went wrong'));
```

## Options

The rule accepts a single string option for the preferred namespace (default: `"Result"`).

prefer R instead of Result:
```ts
import { defineConfig } from 'oxlint';

export default defineConfig({
  rules: {
    'byethrow/consistent-namespace': ['error', 'R'],
  },
});
```
