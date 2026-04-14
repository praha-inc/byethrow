---
description: Custom test matchers for asserting @praha/byethrow Result types with Jest, Vitest, and Rstest.
---

# Testing

`@praha/byethrow-testing` provides custom test matchers for asserting `Result` types, making your tests more expressive and readable.

## Installation

```bash
npm install -D @praha/byethrow-testing
```

## Setup

### Jest

Add the following to your Jest setup file (e.g. `jest.setup.ts`):

```ts
// jest.setup.ts
import { expect } from '@jest/globals';
import { resultMatchers } from '@praha/byethrow-testing';

import type { ResultMatchers } from '@praha/byethrow-testing';

declare module 'expect' {
  interface Matchers<R> extends ResultMatchers<R> {}
}

expect.extend(resultMatchers);
```

Then reference the setup file in your Jest config:

```ts
// jest.config.ts
export default {
  setupFilesAfterEnv: ['./jest.setup.ts'],
};
```

### Vitest

Add the following to your Vitest setup file (e.g. `vitest.setup.ts`):

```ts
// vitest.setup.ts
import { resultMatchers } from '@praha/byethrow-testing';
import { expect } from 'vitest';

import type { ResultMatchers } from '@praha/byethrow-testing';

declare module 'vitest' {
  interface Matchers<T> extends ResultMatchers<T> {}
}

expect.extend(resultMatchers);
```

Then reference the setup file in your Vitest config:

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./vitest.setup.ts'],
  },
});
```

### Rstest

Add the following to your Rstest setup file (e.g. `rstest.setup.ts`):

```ts
// rstest.setup.ts
import { resultMatchers } from '@praha/byethrow-testing';
import { expect } from '@rstest/core';

import type { ResultMatchers } from '@praha/byethrow-testing';

declare module '@rstest/core' {
  interface Matchers<T> extends ResultMatchers<T> {}
}

expect.extend(resultMatchers);
```

Then reference the setup file in your Rstest config:

```ts
// rstest.config.ts
import { defineConfig } from '@rstest/core';

export default defineConfig({
  setupFiles: ['./rstest.setup.ts'],
});
```

## Matchers

### `toBeSuccess(callback?)`

Asserts that the received value is a success `Result`. An optional callback receives the success value for further assertions.

Without a callback, it only checks that the result is a success:

```ts
import type { ResultMatchers } from '@praha/byethrow-testing';

declare module 'vitest' {
  interface Matchers<T> extends ResultMatchers<T> {}
}
// ---cut-before---
import { Result } from '@praha/byethrow';
import { test, expect } from 'vitest';

test('result is success', () => {
  const result = Result.succeed(42);

  expect(result).toBeSuccess();
});
```

With a callback, the success value is passed to it for further assertions:

```ts
import type { ResultMatchers } from '@praha/byethrow-testing';

declare module 'vitest' {
  interface Matchers<T> extends ResultMatchers<T> {}
}
// ---cut-before---
import { Result } from '@praha/byethrow';
import { test, expect } from 'vitest';

test('result is success with value', () => {
  const result = Result.succeed(42);

  expect(result).toBeSuccess((value) => {
    expect(value).toBe(42);
  });
});
```

### `toBeFailure(callback?)`

Asserts that the received value is a failure `Result`. An optional callback receives the error value for further assertions.

Without a callback, it only checks that the result is a failure:

```ts
import type { ResultMatchers } from '@praha/byethrow-testing';

declare module 'vitest' {
  interface Matchers<T> extends ResultMatchers<T> {}
}
// ---cut-before---
import { Result } from '@praha/byethrow';
import { test, expect } from 'vitest';

test('result is failure', () => {
  const result = Result.fail(new Error('something went wrong'));

  expect(result).toBeFailure();
});
```

With a callback, the error value is passed to it for further assertions:

```ts
import type { ResultMatchers } from '@praha/byethrow-testing';

declare module 'vitest' {
  interface Matchers<T> extends ResultMatchers<T> {}
}
// ---cut-before---
import { Result } from '@praha/byethrow';
import { test, expect } from 'vitest';

test('result is failure with error', () => {
  const result = Result.fail(new Error('something went wrong'));

  expect(result).toBeFailure((error) => {
    expect(error.message).toBe('something went wrong');
  });
});
```
