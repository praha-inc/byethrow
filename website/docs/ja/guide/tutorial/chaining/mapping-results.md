---
description: '@praha/byethrowのmapとmapError関数を使って、Result内の成功値やエラー値を変換する方法を学びましょう。'
---

# Result を変換する

`map` と `mapError` 関数を使うと、`Result` の型（`Success` または `Failure`）を変えずに、内部の値を変換できます。

## `map` - 成功値を変換する

`map` 関数は `Result` の成功値を変換します。
`Result` が `Failure` の場合は、変更されずにそのまま通過します。

### 基本的な使い方

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.succeed(2),
  Result.map((value) => value * 10),
);
// { type: 'Success', value: 20 }
```

### `Result` が `Failure` の場合

入力が `Failure` の場合、`map` は何もせず、`Failure` をそのまま返します。

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.fail('error'),
  Result.map((value) => value * 10),
);
// { type: 'Failure', error: 'error' }
```

### 例：表示用のデータフォーマット

よくある使い方として、生データを表示に適した形式に変換する例があります。

```ts
declare const fetchProduct: (id: number) => Result.ResultAsync<ProductRow, 'NotFound'>;
// ---cut-before---
import { Result } from '@praha/byethrow';

type ProductRow = {
  id: number;
  name: string;
  priceInCents: number;
};

type ProductView = {
  id: string;
  name: string;
  price: string;
};

const formatPrice = (cents: number): string => `$${(cents / 100).toFixed(2)}`;

const toProductView = (product: ProductRow): ProductView => ({
  id: String(product.id),
  name: product.name,
  price: formatPrice(product.priceInCents),
});

const getProductForDisplay = (id: number): Result.ResultAsync<ProductView, 'NotFound'> => {
  return Result.pipe(
    fetchProduct(id),
    Result.map(toProductView),
  );
};
// 生の商品データを UI に適した形式に変換
```

## `mapError` - 失敗値を変換する

`mapError` 関数は `Result` の失敗値を変換します。
`Result` が `Success` の場合は、変更されずにそのまま通過します。

### 基本的な使い方

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.fail('NotFound'),
  Result.mapError((error) => new Error(error)),
);
// { type: 'Failure', error: Error('NotFound') }
```

### Result が Success の場合

入力が `Success` の場合、`mapError` は何もせず、`Success` をそのまま返します。

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.succeed(123),
  Result.mapError((error) => new Error(error)),
);
// { type: 'Success', value: 123 }
```

### 例：内部エラーを HTTP レスポンスに変換

よくある使い方として、ドメイン固有のエラーを標準化された HTTP エラーレスポンスに変換する例があります。

```ts
declare const processRequest: () => Result.ResultAsync<{ data: string }, DomainError>;
// ---cut-before---
import { Result } from '@praha/byethrow';

type DomainError = 
  | { type: 'NotFound'; resource: string }
  | { type: 'ValidationError'; field: string; message: string }
  | { type: 'Unauthorized' };

type HttpError = {
  status: number;
  body: { error: string; details?: string };
};

const toHttpError = (error: DomainError): HttpError => {
  switch (error.type) {
    case 'NotFound':
      return {
        status: 404,
        body: { error: 'Not Found', details: `${error.resource} was not found` },
      };
    case 'ValidationError':
      return {
        status: 400,
        body: { error: 'Bad Request', details: `${error.field}: ${error.message}` },
      };
    case 'Unauthorized':
      return {
        status: 401,
        body: { error: 'Unauthorized' },
      };
  }
};

const handleRequest = (): Result.ResultAsync<{ data: string }, HttpError> => {
  return Result.pipe(
    processRequest(),
    Result.mapError(toHttpError),
  );
};
// ドメインエラーを HTTP 適切なエラーレスポンスに変換
```

## `map` と `mapError` の組み合わせ

同じパイプラインで `map` と `mapError` の両方を使って、成功値と失敗値の両方を変換できます。

データベースからユーザーを取得する関数があるとします。
生データは UI 用にフォーマットが必要で、内部エラーコードはユーザーフレンドリーなメッセージに変換する必要がある場合を考えます。

```ts
type UserRow = {
  id: number;
  first_name: string;
  last_name: string;
  created_at: string;
};

type UserView = {
  id: string;
  fullName: string;
  memberSince: string;
};

type DatabaseError = 'RECORD_NOT_FOUND' | 'CONNECTION_FAILED' | 'TIMEOUT';

type HttpError = {
  status: number;
  body: { error: string; details?: string };
};

declare const fetchUser: (id: number) => Result.ResultAsync<UserRow, DatabaseError>;
// ---cut-before---
import { Result } from '@praha/byethrow';

const toView = (row: UserRow): UserView => ({
  id: String(row.id),
  fullName: `${row.first_name} ${row.last_name}`,
  memberSince: new Date(row.created_at).toLocaleDateString(),
});

const toHttpError = (error: DatabaseError): HttpError => {
  switch (error) {
    case 'RECORD_NOT_FOUND':
      return {
        status: 404,
        body: {
          error: 'User Not Found',
          details: 'The requested user does not exist.',
        },
      };
    case 'CONNECTION_FAILED':
    case 'TIMEOUT':
      return {
        status: 503,
        body: {
          error: 'Service Unavailable',
          details: 'Please try again later.',
        },
      };
  }
};

const getUserForView = (id: number): Result.ResultAsync<UserView, HttpError> => {
  return Result.pipe(
    fetchUser(id),
    Result.map(toView),
    Result.mapError(toHttpError),
  );
}
```

## リファレンス

| 関数                                                        | 目的                |
|-----------------------------------------------------------|-------------------|
| [map(fn)](../../../../api/functions/Result.map)           | Result の成功値を変換する  |
| [mapError(fn)](../../../../api/functions/Result.mapError) | Result のエラー値を変換する |
