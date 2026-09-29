---
description: The two import styles of @praha/byethrow — the Result namespace and the R shorthand alias — how both support tree-shaking, and why you should pick one per codebase.
---

# Importing Result

`@praha/byethrow` exports the same set of functions under two names: `Result` and `R`.
Both fully support tree-shaking, so the choice is purely a matter of style.

## Two Import Styles

### `Result`: Explicit

The `Result` namespace makes it obvious where each function comes from:

```ts
import { Result } from '@praha/byethrow';

const validateUser = (id: string) => {
  if (!id.startsWith('u')) {
    return Result.fail(new Error('Invalid ID format'));
  }
  return Result.succeed(id);
};

const result = Result.pipe(
  Result.succeed('u123'),
  Result.andThen(validateUser),
  Result.map((id) => ({ id, name: 'John Doe' })),
);

if (Result.isSuccess(result)) {
  console.log(result.value);
}
```

### `R`: Concise

The `R` alias keeps pipelines short:

```ts
import { R } from '@praha/byethrow';

const validateUser = (id: string) => {
  if (!id.startsWith('u')) {
    return R.fail(new Error('Invalid ID format'));
  }
  return R.succeed(id);
};

const result = R.pipe(
  R.succeed('u123'),
  R.andThen(validateUser),
  R.map((id) => ({ id, name: 'John Doe' })),
);

if (R.isSuccess(result)) {
  console.log(result.value);
}
```

The examples in this documentation use `Result`, but everything works the same with `R`.

## Tree-Shaking

Although you import a namespace, each function is an independent export.
Modern bundlers include only the functions you actually use:

```ts
import { R } from '@praha/byethrow';

// Only `fn` and the code it depends on end up in the bundle.
// Functions such as `andThen` and `pipe` are removed.
const parseNumber = R.fn({
  try: (input: string) => parseInt(input, 10),
  catch: () => new Error('Invalid number'),
});
```

## Choosing a Style

- **`Result`** if you prefer explicit, self-descriptive code. It is also easier for newcomers to search for.
- **`R`** if you prefer fewer keystrokes and compact pipelines.

### Don't Mix the Two

**We strongly recommend choosing one style and using it throughout your codebase.**
Mixing them makes code inconsistent and harder to search:

```ts
// @filename: mixed-imports.ts
// ❌ Mixing both styles
import { Result, R } from '@praha/byethrow';

const validateId = (id: string) => {
  return Result.succeed(id);
};

const processData = R.pipe(
  R.succeed('data'),
  R.andThen(validateId),
);

// @filename: consistent-imports.ts
// ✅ Using one style consistently
import { Result } from '@praha/byethrow';

const validateId = (id: string) => {
  return Result.succeed(id);
};

const processData = Result.pipe(
  Result.succeed('data'),
  Result.andThen(validateId),
);
```

The [consistent-namespace](../ecosystem/linter/consistent-namespace) lint rule enforces your chosen style and fixes violations automatically.
