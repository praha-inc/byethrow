---
description: Oxlint rule that enforces a single namespace alias — Result or R — for @praha/byethrow imports, with auto-fix support.
---

# consistent-namespace

Enforces that `@praha/byethrow` is always imported under the same namespace alias, either `Result` or `R`.

This rule is auto-fixable. The fix renames the import and every reference to it.

## Rule Details

`@praha/byethrow` exports the same functions as both `Result` and `R`.
Using both in one codebase makes the code inconsistent and harder to search, as explained in [Importing Result](../../best-practices/importing-result).
This rule reports every import whose local name is not the preferred alias.

### Incorrect

```ts
// ❌ R is used although Result is preferred
import { R } from '@praha/byethrow';

const success = R.succeed(42);
```

```ts
// ❌ Mixing Result and R
import { Result, R } from '@praha/byethrow';

const success = Result.succeed(42);
const failure = R.fail(new Error('Something went wrong'));
```

### Correct

```ts
// ✅ Using Result consistently
import { Result } from '@praha/byethrow';

const success = Result.succeed(42);
const failure = Result.fail(new Error('Something went wrong'));
```

## Options

The rule accepts the preferred alias as a string. The default is `"Result"`.

To prefer `R` instead:

```ts title="oxlint.config.ts"
import { defineConfig } from 'oxlint';

export default defineConfig({
  rules: {
    'byethrow/consistent-namespace': ['error', 'R'],
  },
});
```

With this option, the following code is correct:

```ts
// ✅ Using R consistently
import { R } from '@praha/byethrow';

const success = R.succeed(42);
const failure = R.fail(new Error('Something went wrong'));
```
