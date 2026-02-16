---
description: '@praha/byethrowのandThenとorElse関数を使って、Resultの計算を連結し、順次エラーハンドリングを行う方法を学びましょう。'
---

# 関数を合成する

`andThen` と `orElse` 関数を使うと、それ自体が `Result` を返す可能性のある計算を連結できます。
値を変換するだけの `map` や `mapError` とは異なり、これらの関数は各ステップが成功または失敗する可能性のある順次処理を可能にします。

## `andThen` - 成功時の計算を連結

`andThen` 関数は成功値を使って次の計算を連結します。
元の `Result` が `Failure` の場合は、変更されずにそのまま返されます。
それ以外の場合、提供された関数が呼び出され、その結果がそのまま返されます。

### 基本的な使い方

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.succeed(3),
  Result.andThen((value) => Result.succeed(value * 2)),
);
// { type: 'Success', value: 6 }
```

### 入力が `Failure` の場合

入力が `Failure` の場合、`andThen` は何もせず、`Failure` をそのまま返します。

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.fail('error'),
  Result.andThen((value) => Result.succeed(value * 2)),
);
// { type: 'Failure', error: 'error' }
```

### 関数が `Failure` を返す場合

連結された関数は `Failure` を返すことができ、それはパイプラインを通じて伝播します。

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.succeed(3),
  Result.andThen((value) => Result.fail('error: ' + value)),
);
// { type: 'Failure', error: 'error: 3' }
```

### 例：順次バリデーション

よくある使い方として、複数のバリデーションや処理ステップを連結する例があります。

```ts
import { Result } from '@praha/byethrow';

type User = { id: string; name: string; email: string };

declare const findUserById: (id: string) => Result.ResultAsync<User, 'NotFound'>;
declare const validateEmail: (user: User) => Result.Result<User, 'InvalidEmail'>;
declare const saveUser: (user: User) => Result.ResultAsync<User, 'SaveFailed'>;

const result = await Result.pipe(
  Result.succeed('user-123'),
  Result.andThen(findUserById),
  Result.andThen(validateEmail),
  Result.andThen(saveUser),
);
// いずれかのステップが失敗すると、パイプラインはそのエラーでショートサーキットする
```

## `orElse` - 失敗からの回復

`orElse` 関数はエラー値を使って次の計算を連結します。
元の `Result` が `Success` の場合は、変更されずにそのまま返されます。
それ以外の場合、提供された関数が呼び出され、その結果がそのまま返されます。

これはエラー回復に便利で、フォールバック値を提供したり、異なる戦略でリトライしたりできます。

### 基本的な使い方

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.succeed(42),
  Result.orElse((error) => Result.succeed(0)),
);
// { type: 'Success', value: 42 }
```

### 入力が `Failure` の場合

入力が `Failure` の場合、`orElse` は回復関数を実行します。

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.fail('original error'),
  Result.orElse((error) => Result.succeed('default value')),
);
// { type: 'Success', value: 'default value' }
```

### 回復関数が `Failure` を返す場合

回復関数も `Failure` を返すことができます。

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.fail('original error'),
  Result.orElse((error) => Result.fail('new error: ' + error)),
);
// { type: 'Failure', error: 'new error: original error' }
```

### 例：フォールバック戦略

よくあるパターンとして、フォールバック戦略の実装があります。

```ts
import { Result } from '@praha/byethrow';

type Config = { apiUrl: string; timeout: number };

declare const loadConfigFromFile: () => Result.ResultAsync<Config, 'FileNotFound'>;
declare const loadConfigFromEnv: () => Result.ResultAsync<Config, 'EnvNotSet'>;

const config = await Result.pipe(
  loadConfigFromFile(),
  Result.orElse(() => loadConfigFromEnv()),
);
// まずファイルを試し、次に環境変数を試し、それでもダメなら失敗
```

## `andThen` と `orElse` の組み合わせ

両方の関数を一緒に使って、成功時の連結とエラー回復の両方を含む複雑なフローを作成できます。

```ts
import { Result } from '@praha/byethrow';

type User = { id: string; name: string };

declare const fetchUserFromCache: (id: string) => Result.ResultAsync<User, 'CacheMiss'>;
declare const fetchUserFromDb: (id: string) => Result.ResultAsync<User, 'NotFound'>;
declare const validateUser: (user: User) => Result.Result<User, 'Invalid'>;

const getValidatedUser = (id: string) => Result.pipe(
  fetchUserFromCache(id),
  Result.orElse(() => fetchUserFromDb(id)),
  Result.andThen(validateUser),
);
// まずキャッシュを試し、DB にフォールバックし、その後結果をバリデート
```

## リファレンス

| 関数                                                      | 目的             |
|---------------------------------------------------------|----------------|
| [andThen(fn)](../../../../api/functions/Result.andThen) | 成功値を使って計算を連結する |
| [orElse(fn)](../../../../api/functions/Result.orElse)   | 失敗から新しい計算で回復する |
