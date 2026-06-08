# prefer-result-matchers

テスト内で `@praha/byethrow-testing` の `toBeSuccess()` / `toBeFailure()` を使用することを強制します。

## ルールの詳細

`Result.isSuccess(result)` を呼び出してbooleanをアサートするのは冗長です。専用のマッチャー `toBeSuccess()` と `toBeFailure()` はより短く、失敗時のメッセージもわかりやすく、オプションのコールバック内で型も絞り込まれます。このルールは自動修正に対応しています。

`@praha/byethrow-testing` のセットアップ方法は[テスト](../testing)を参照してください。

### 誤り

```ts
import { Result } from '@praha/byethrow';
import { expect } from 'vitest';

const result: Result.Result<string, Error> = Result.succeed('hello');

// ❌ isSuccess / isFailureのboolean戻り値をアサート
expect(Result.isSuccess(result)).toBe(true);
expect(Result.isFailure(result)).toBeTruthy();
expect(Result.isSuccess(result)).not.toBe(false);
```

### 正しい

```ts
import type { ResultMatchers } from '@praha/byethrow-testing';

declare module 'vitest' {
  interface Matchers<T> extends ResultMatchers<T> {}
}
// ---cut-before---
import { Result } from '@praha/byethrow';
import { expect } from 'vitest';

const result: Result.Result<string, Error> = Result.succeed('hello');

// ✅ 専用マッチャーを使用
expect(result).toBeSuccess();
expect(result).toBeFailure();
```

コールバックで内部の値をアサートする場合:

```ts
import type { ResultMatchers } from '@praha/byethrow-testing';

declare module 'vitest' {
  interface Matchers<T> extends ResultMatchers<T> {}
}
// ---cut-before---
import { Result } from '@praha/byethrow';
import { expect } from 'vitest';

const result: Result.Result<string, Error> = Result.succeed('hello');

expect(result).toBeSuccess((value) => {
  expect(value).toBe(42);
});

expect(result).toBeFailure((error) => {
  expect(error).toBeInstanceOf(Error);
});
```
