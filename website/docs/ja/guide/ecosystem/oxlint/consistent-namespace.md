# consistent-namespace

`@praha/byethrow` から一貫したネームスペース（`Result` または `R`）でインポートを使用することを強制します。

## ルールの詳細

`@praha/byethrow` ではネームスペースを `Result` または `R` としてインポートできますが、プロジェクト内で両方が混在していると一貫性が失われ、コード検索が難しくなります。このルールは単一の優先エイリアスを強制し、違反を自動修正します。

デフォルトで優先するネームスペースは `Result` です。

### 誤り

```ts
// ❌ 同じコードベースでResultとRが混在している
import { Result, R } from '@praha/byethrow';

const success = Result.succeed(42);
const failure = R.fail(new Error('Something went wrong'));
```

### 正しい

```ts
// ✅ Resultを一貫して使用
import { Result } from '@praha/byethrow';

const success = Result.succeed(42);
const failure = Result.fail(new Error('Something went wrong'));
```

```ts
// ✅ Rを一貫して使用（Rを優先するよう設定した場合）
import { R } from '@praha/byethrow';

const success = R.succeed(42);
const failure = R.fail(new Error('Something went wrong'));
```

## オプション

ルールは優先する名前空間を単一の文字列で受け取ります（デフォルト: `"Result"`）。

ResultではなくRを優先する場合:
```ts
import { defineConfig } from 'oxlint';

export default defineConfig({
  rules: {
    'byethrow/consistent-namespace': ['error', 'R'],
  },
});
```
