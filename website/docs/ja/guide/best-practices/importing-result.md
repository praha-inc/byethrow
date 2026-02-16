---
description: '@praha/byethrowの2つのインポート方法（名前空間アプローチと直接インポート）を学び、バンドルサイズを最適化する方法を理解しましょう。'
---

# Resultのインポート方法

`@praha/byethrow` は、効率的な開発と学習コストのバランスを取るために、2つの異なるインポート方法を提供しています。
どちらのアプローチもTree-shakingを完全にサポートしており、未使用の機能は最終バンドルから自動的に除外されます。

## 2つのインポート方法

### 明示的な名前空間アプローチ（`Result`）

明確さを重視するコードには、`Result` を使用します。

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

### 短縮エイリアス（`R`）

簡潔さを重視するコードには、`R` エイリアスを使用します。

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

## Tree-Shakingサポート

`@praha/byethrow` は**完全なTree-shakingサポート**を実現しています。

```ts
// 例：小規模アプリケーションでの使用
import { R } from '@praha/byethrow';

// 実際に使用されているのはこれらの機能のみ
const parseNumber = R.fn({
  try: (input: string) => parseInt(input, 10),
  catch: () => new Error('Invalid number')
});

// この場合、parseNumberに必要な最小限のコードのみが
// バンドルに含まれ、他の機能（andThen、pipeなど）は除外されます
```

## ベストプラクティス

### インポート方法の選択

- **`Result` を使用する**：各操作の目的を明確に示す、明示的で説明的な命名を好む場合
- **`R` を使用する**：より少ないキーストロークと簡潔なコードで、より速い開発を好む場合

### 重要：インポート方法を混在させない

**同じコードベース内で `Result` と `R` を混在させることは強くお勧めしません。**
コードの可読性と一貫性を維持するために、プロジェクト全体で1つのアプローチを選択し、一貫して使用するように気をつけてください。

```ts
// @filename: mixed-imports.ts
// ❌ アプローチを混在させないでください - 一貫性のないコードになります
import { Result, R } from '@praha/byethrow';

const validateId = (id: string) => {
  return Result.succeed(id); // Resultを使用
};

const processData = R.pipe(  // Rを使用
  R.succeed('data'),
  R.andThen(validateId)
);

// @filename: consistent-imports.ts
// ✅ 1つのアプローチを選択し、一貫して使用してください
import { Result } from '@praha/byethrow';

const validateId = (id: string) => {
  return Result.succeed(id);
};

const processData = Result.pipe(
  Result.succeed('data'),
  Result.andThen(validateId)
);
```
