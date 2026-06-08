# no-negated-type-guards

`Result.isSuccess()` または `Result.isFailure()` に否定演算子（`!`）を使用することを禁止します。

## ルールの詳細

`!Result.isSuccess(result)` は `Result.isFailure(result)` と同等ですが、否定形は可読性が低く、読み手に余分な認知負荷をかけます。このルールは自動修正に対応しています。

### 誤り

```ts
import { Result } from '@praha/byethrow';

const result: Result.Result<string, Error> = Result.succeed('hello');

// ❌ isSuccessを否定
if (!Result.isSuccess(result)) {
  // 失敗時の処理
}

// ❌ isFailureを否定
if (!Result.isFailure(result)) {
  // 成功時の処理
}
```

### 正しい

```ts
import { Result } from '@praha/byethrow';

const result: Result.Result<string, Error> = Result.succeed('hello');

// ✅ 直接の型ガードを使用
if (Result.isFailure(result)) {
  // 失敗時の処理
}

if (Result.isSuccess(result)) {
  // 成功時の処理
}
```
