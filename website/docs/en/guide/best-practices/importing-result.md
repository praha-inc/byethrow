---
description: Learn the two import methods for @praha/byethrow - namespace approach and direct imports - and how to optimize your bundle size.
---

# Importing Result

`@praha/byethrow` provides two distinct import methods to balance efficient development with learnability.
Both approaches fully support tree-shaking, ensuring that unused features are automatically excluded from your final bundle.

## Two Import Methods

### Explicit Namespace Approach (`Result`)

For verbose and explicit code that prioritizes clarity, use the `Result` namespace:

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
  Result.map(id => ({ id, name: 'John Doe' }))
);

if (Result.isSuccess(result)) {
  console.log(result.value);
}
```

### Shorthand Alias (`R`)

For concise code that favors brevity, use the `R` alias:

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
  R.map(id => ({ id, name: 'John Doe' }))
);

if (R.isSuccess(result)) {
  console.log(result.value);
}
```

## Tree-Shaking Support

`@praha/byethrow` achieves **complete tree-shaking support**:

```ts
// Example: Usage in a small application
import { R } from '@praha/byethrow';

// Only these features are actually used
const parseNumber = R.fn({
  try: (input: string) => parseInt(input, 10),
  catch: () => new Error('Invalid number')
});

// In this case, only the minimal code required for parseNumber
// is included in the bundle, while other features (andThen, pipe, etc.) are excluded
```

## Best Practices

### Choosing Between Import Methods

- **Use `Result`** if you prefer explicit and descriptive naming that clearly indicates the purpose of each operation
- **Use `R`** if you prefer fewer keystrokes and more concise code for faster development

### Important: Avoid Mixing Import Methods

**We strongly recommend against mixing `Result` and `R` within the same codebase.**
Choose one approach and stick with it consistently throughout your project to maintain code readability and consistency.

```ts
// @filename: mixed-imports.ts
// ❌ Don't mix approaches - this creates inconsistent code
import { Result, R } from '@praha/byethrow';

const validateId = (id: string) => {
  return Result.succeed(id); // Using Result
};

const processData = R.pipe(  // Using R
  R.succeed('data'),
  R.andThen(validateId)
);

// @filename: consistent-imports.ts
// ✅ Choose one approach and use it consistently
import { Result } from '@praha/byethrow';

const validateId = (id: string) => {
  return Result.succeed(id);
};

const processData = Result.pipe(
  Result.succeed('data'),
  Result.andThen(validateId)
);
```
