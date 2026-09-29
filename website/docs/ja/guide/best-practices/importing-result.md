---
description: '@praha/byethrow の 2 つのインポート方法（Result 名前空間と R エイリアス）、どちらもツリーシェイキングに対応していること、そしてコードベースごとにどちらか一方に統一すべき理由。'
---

# Result のインポート方法

`@praha/byethrow` は、同じ関数群を `Result` と `R` の 2 つの名前でエクスポートしています。
どちらもツリーシェイキングに完全に対応しているため、どちらを選ぶかは純粋にスタイルの問題です。

## 2 つのインポート方法

### `Result`：明示的なアプローチ

`Result` ネームスペースを使うと、各関数がどこから来たものかが一目でわかります。

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

### `R`：簡潔なエイリアス

`R` エイリアスを使うと、パイプラインを短く書けます。

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

このドキュメントの例では `Result` を使っていますが、`R` でもすべて同じように動作します。

## ツリーシェイキング

名前空間としてインポートしていても、各関数は独立したエクスポートです。
モダンなバンドラーは、実際に使っている関数だけをバンドルに含めます。

```ts
import { R } from '@praha/byethrow';

// バンドルに含まれるのは `fn` とその依存コードだけ。
// `andThen` や `pipe` などの関数は取り除かれる。
const parseNumber = R.fn({
  try: (input: string) => parseInt(input, 10),
  catch: () => new Error('Invalid number'),
});
```

## スタイルの選び方

- **`Result`**：明示的で意味がわかりやすいコードを好む場合。初めて触れる人にとっても検索しやすくなります。
- **`R`**：タイプ量を減らし、パイプラインをコンパクトに書きたい場合。

### 2 つを混在させない

**どちらか一方のスタイルを選び、コードベース全体で統一することを強く推奨します。**
混在させると、コードの一貫性が失われ、検索もしにくくなります。

```ts
// @filename: mixed-imports.ts
// ❌ 両方のスタイルを混在させている
import { Result, R } from '@praha/byethrow';

const validateId = (id: string) => {
  return Result.succeed(id);
};

const processData = R.pipe(
  R.succeed('data'),
  R.andThen(validateId),
);

// @filename: consistent-imports.ts
// ✅ 1 つのスタイルで統一している
import { Result } from '@praha/byethrow';

const validateId = (id: string) => {
  return Result.succeed(id);
};

const processData = Result.pipe(
  Result.succeed('data'),
  Result.andThen(validateId),
);
```

Lint ルールの [consistent-namespace](../ecosystem/linter/consistent-namespace) を使うと、選んだスタイルを強制し、違反を自動で修正できます。
