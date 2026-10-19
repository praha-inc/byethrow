---
description: テストファイルで、isSuccess/isFailure の真偽値に対するアサーションや unwrap の呼び出しの代わりに toBeSuccess() と toBeFailure() マッチャーを使うことを強制する Oxlint ルール。自動修正に対応しています。
---

# prefer-result-matchers

テストで [`@praha/byethrow-testing`](../testing) の `toBeSuccess()` / `toBeFailure()` マッチャーを使うことを強制します。

このルールは自動修正に対応しています。推奨プリセットでは、テストファイルに対してのみ有効になります。

## ルールの詳細

`Result.isSuccess()` が返す真偽値に対してアサーションを書くのは冗長で、失敗しても `false` が `true` ではなかったことしかわかりません。
また、テスト内で `Result.unwrap()` を呼ぶと、結果が失敗だった場合に役に立たないエラーが投げられます。
専用のマッチャーを使えば記述が短くなり、失敗時には受け取った `Result` が表示され、コールバックでは型の付いた値を受け取れます。

このルールは次のパターンを報告します。

- `expect(Result.isSuccess(result))` / `expect(Result.isFailure(result))` に続く `.toBe()`、`.toBeTruthy()`、`.toBeFalsy()`
- `assert(Result.isSuccess(result))` / `assert(Result.isFailure(result))`
- `Result.unwrap(result)` / `Result.unwrapError(result)`

### 誤った例

```ts
import { Result } from '@praha/byethrow';
import { assert, expect } from 'vitest';

declare const result: Result.Result<string, Error>;

// ❌ isSuccess / isFailure が返す真偽値に対してアサーションしている
expect(Result.isSuccess(result)).toBe(true);
expect(Result.isFailure(result)).toBeTruthy();
assert(Result.isSuccess(result));

// ❌ 値をアサーションするために Result を unwrap している
expect(Result.unwrap(result)).toBe('hello');
```

### 正しい例

```ts
import type { ResultMatchers } from '@praha/byethrow-testing';

declare module 'vitest' {
  interface Matchers<R, T> extends ResultMatchers<R, T> {}
}
// ---cut-before---
import { Result } from '@praha/byethrow';
import { expect } from 'vitest';

declare const result: Result.Result<string, Error>;

// ✅ 専用のマッチャーを使っている
expect(result).toBeSuccess();
expect(result).toBeFailure();

// ✅ コールバックで値をアサーションしている
expect(result).toBeSuccess((value) => {
  expect(value).toBe('hello');
});

expect(result).toBeFailure((error) => {
  expect(error).toBeInstanceOf(Error);
});
```

`@praha/byethrow-testing` のセットアップ方法は[テスト](../testing)を参照してください。

## オプション

このルールにオプションはありません。
