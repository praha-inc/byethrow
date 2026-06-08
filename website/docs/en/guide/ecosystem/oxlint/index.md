# Oxlint Plugin

`@praha/byethrow-oxlint` is an [Oxlint](https://oxc.rs/docs/guide/usage/linter) plugin that enforces best practices when using `@praha/byethrow`.

## Installation

```bash
npm install -D @praha/byethrow-oxlint
```

## Setup

### Using the recommended preset

The easiest way to get started is to extend the recommended preset. It enables all rules with their default settings.

```ts title="oxlint.config.ts"
import oxlintByethrowPlugin from '@praha/byethrow-oxlint';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [
    oxlintByethrowPlugin.recommended,
  ],
});
```

### Configuring rules manually

If you need fine-grained control, you can load the plugin and enable individual rules:

```ts title="oxlint.config.ts"
import { defineConfig } from 'oxlint';

export default defineConfig({
  jsPlugins: [
    {
      name: 'byethrow',
      specifier: '@praha/byethrow-oxlint',
    },
  ],
  rules: {
    'byethrow/consistent-namespace': 'error',
    'byethrow/no-ambiguous-error-type': 'error',
    // ...
  },
});
```

## Settings

You can customize how the plugin detects byethrow imports by adding a `byethrow` key under `settings`. This is useful when you re-export `@praha/byethrow` from your own package.

| Option      | Type                 | Default             | Description                                     |
|-------------|----------------------|---------------------|-------------------------------------------------|
| `module`    | `string \| string[]` | `"@praha/byethrow"` | Module specifiers to treat as byethrow          |
| `namespace` | `string \| string[]` | `["Result", "R"]`   | Import names to treat as the byethrow namespace |

```ts title="oxlint.config.ts"
import { defineConfig } from 'oxlint';

export default defineConfig({
  settings: {
    byethrow: {
      module: ['@praha/byethrow', '@my-org/result'],
      namespace: ['Result', 'R'],
    },
  },
});
```

## Rules

| Rule                                                     | Description                                            | Fixable |
|----------------------------------------------------------|--------------------------------------------------------|---------|
| [consistent-namespace](./consistent-namespace)           | Enforce consistent namespace alias                     | ✅       |
| [no-ambiguous-error-type](./no-ambiguous-error-type)     | Disallow non-specific error types                      |         |
| [no-ambiguous-success-type](./no-ambiguous-success-type) | Disallow non-specific success types                    |         |
| [no-negated-type-guards](./no-negated-type-guards)       | Disallow negated `isSuccess`/`isFailure`               | ✅       |
| [no-throw-in-callback](./no-throw-in-callback)           | Disallow `throw` in byethrow callbacks                 |         |
| [no-try-catch-in-callback](./no-try-catch-in-callback)   | Disallow `try-catch` in byethrow callbacks             |         |
| [prefer-result-async](./prefer-result-async)             | Prefer `ResultAsync` over `Promise<Result>`            | ✅       |
| [prefer-result-matchers](./prefer-result-matchers)       | Prefer `toBeSuccess`/`toBeFailure` matchers            | ✅       |
| [prefer-result-maybe-async](./prefer-result-maybe-async) | Prefer `ResultMaybeAsync` over `Result \| ResultAsync` | ✅       |
