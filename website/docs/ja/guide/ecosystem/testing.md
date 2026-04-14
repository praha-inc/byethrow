---
description: Jest・Vitest・Rstestで@praha/byethrowのResult型をアサートするためのカスタムテストマッチャー。
---

# テスト

`@praha/byethrow-testing` は `Result` 型をアサートするためのカスタムテストマッチャーを提供し、テストをより表現力豊かで読みやすくします。

## インストール

```bash
npm install -D @praha/byethrow-testing
```

## セットアップ

### Jest

Jest のセットアップファイル（例: `jest.setup.ts`）に以下を追加してください。

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

次に、Jest の設定ファイルでセットアップファイルを参照します。

```ts
// jest.config.ts
export default {
  setupFilesAfterEnv: ['./jest.setup.ts'],
};
```

### Vitest

Vitest のセットアップファイル（例: `vitest.setup.ts`）に以下を追加してください。

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

次に、Vitest の設定ファイルでセットアップファイルを参照します。

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

Rstest のセットアップファイル（例: `rstest.setup.ts`）に以下を追加してください。

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

次に、Rstest の設定ファイルでセットアップファイルを参照します。

```ts
// rstest.config.ts
import { defineConfig } from '@rstest/core';

export default defineConfig({
  setupFiles: ['./rstest.setup.ts'],
});
```

## マッチャー

### `toBeSuccess(callback?)`

受け取った値が成功の `Result` であることをアサートします。オプションのコールバックで成功値をさらにアサートできます。

コールバックなしの場合、結果が成功であることのみを確認します。

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

コールバックありの場合、成功値がコールバックに渡されます。

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

受け取った値が失敗の `Result` であることをアサートします。オプションのコールバックでエラー値をさらにアサートできます。

コールバックなしの場合、結果が失敗であることのみを確認します。

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

コールバックありの場合、エラー値がコールバックに渡されます。

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
