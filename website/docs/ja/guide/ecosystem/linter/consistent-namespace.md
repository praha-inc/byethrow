---
description: '@praha/byethrow のインポートで使う名前空間のエイリアスを Result か R のどちらかに統一する Oxlint ルール。自動修正に対応しています。'
---

# consistent-namespace

`@praha/byethrow` を常に同じ名前空間のエイリアス（`Result` または `R`）でインポートすることを強制します。

このルールは自動修正に対応しています。修正時には、インポートとそのすべての参照がリネームされます。

## ルールの詳細

`@praha/byethrow` は同じ関数群を `Result` と `R` の両方の名前でエクスポートしています。
[Result のインポート方法](../../best-practices/importing-result)で説明しているとおり、1 つのコードベースで両方を使うとコードの一貫性が失われ、検索もしにくくなります。
このルールは、ローカル名が推奨するエイリアスと異なるインポートをすべて報告します。

### 誤った例

```ts
// ❌ Result を推奨しているのに R を使っている
import { R } from '@praha/byethrow';

const success = R.succeed(42);
```

```ts
// ❌ Result と R を混在させている
import { Result, R } from '@praha/byethrow';

const success = Result.succeed(42);
const failure = R.fail(new Error('Something went wrong'));
```

### 正しい例

```ts
// ✅ Result で統一している
import { Result } from '@praha/byethrow';

const success = Result.succeed(42);
const failure = Result.fail(new Error('Something went wrong'));
```

## オプション

推奨するエイリアスを文字列で指定します。デフォルトは `"Result"` です。

`R` を推奨する場合は次のように設定します。

```ts title="oxlint.config.ts"
import { defineConfig } from 'oxlint';

export default defineConfig({
  rules: {
    'byethrow/consistent-namespace': ['error', 'R'],
  },
});
```

このオプションを指定すると、次のコードが正しい例になります。

```ts
// ✅ R で統一している
import { R } from '@praha/byethrow';

const success = R.succeed(42);
const failure = R.fail(new Error('Something went wrong'));
```
