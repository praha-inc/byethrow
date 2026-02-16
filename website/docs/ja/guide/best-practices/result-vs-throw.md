---
description: Result型とthrow文をいつ使い分けるべきか、そして「予期されたエラー」と「予期しないエラー」の処理哲学を学びましょう。
---

# Result vs throw

「JavaScriptはどこでもエラーを投げられるため、Resultですべてを管理することは不可能であり、Resultを導入する意味がない」という意見を耳にしたことがあるかもしれません。

しかし、この見解に私たちは必ずしも同意しません。重要なのは、**Resultは「予期されたエラー」のみを処理すべき**であり、すべてのエラーをResultでラップする必要はないということです。

## 予期されたエラー vs 予期しないエラー

`Result` で処理すべきものとエラーが投げられることを許容すべきものの違いは、エラーの性質を理解することにあります。

### 予期されたエラー（Resultを使用する）

これらはアプリケーションのビジネスロジックの一部であり、明示的に処理されるべきエラーです。

```ts
// @noErrors
class PostNotFoundError extends Error {}
class PostPermissionError extends Error {}
class PostAlreadyDeletedError extends Error {}
import { Result } from '@praha/byethrow';
// ---cut-before---
// 投稿削除関数の例
type PostDeleteError = (
  | PostNotFoundError
  | PostPermissionError
  | PostAlreadyDeletedError
);

const deletePost = async (postId: string): Result.ResultAsync<void, PostDeleteError> => {
  // アプリケーションで処理すべきビジネスロジックエラー
}
```

### 予期しないエラー（エラーを投げる）

これらはインフラストラクチャレベルで処理すべき予期しないエラーです。

- データベース接続の失敗
- ネットワークタイムアウト
- メモリ不足エラー
- 未知の例外

```ts
// @noErrors
interface Database {}
// ---cut-before---
// インフラストラクチャレベルの関数の例
const connectToDatabase = async (): Promise<Database> => {
  // この関数は接続失敗やタイムアウトなどのエラーを投げる可能性がある
};
```

これらはエラーが投げられることを許容し、インフラストラクチャレベルのエラーハンドリング（Sentryなど）でキャッチされるべきです。

## より詳細なスタックトレースが必要な場合は `Result.fn` を使用する

ただし、デバッグ目的でより詳細なスタックトレースが必要な場合は、`Result.fn` を使用して予期しないエラーをカスタムエラークラスでラップすることをお勧めします。
このアプローチにより、ライブラリレベルのスタックトレースではなく、アプリケーションレベルのスタックトレースを得れます。

### カスタムエラークラスの定義

まず、予期しないエラー用のカスタムエラークラスを定義します。

:::tip
`@praha/error-factory` の詳細については、[Custom Error](custom-error.mdx#推奨prahaerror-factoryを使用する)ページを参照してください。
:::

```ts
import { ErrorFactory } from '@praha/error-factory';

class UnexpectedError extends ErrorFactory({
  name: 'UnexpectedError',
  message: 'An unexpected error occurred',
}) {}
```

### `Result.fn` を使用する

```ts
import { ErrorFactory } from '@praha/error-factory';

class UnexpectedError extends ErrorFactory({
  name: 'UnexpectedError',
  message: 'An unexpected error occurred',
}) {}
const performDatabaseOperation = async (id: string): Promise<string> => Promise.resolve('data');
// ---cut-before---
import { Result } from '@praha/byethrow';

// エラーが投げられる可能性のある操作をラップ
const safeDatabaseOperation = Result.fn({
  try: (id: string) => {
    // データベースクエリエラーやネットワークエラーなどを投げる可能性がある
    return performDatabaseOperation(id);
  },
  catch: (error) => new UnexpectedError({ cause: error }),
});

// 使用例
const result = await safeDatabaseOperation('123');
if (Result.isFailure(result)) {
  // ライブラリの深いスタックトレースではなく、
  // アプリケーションのスタックトレースを持つクリーンなUnexpectedErrorが得られます
  console.error(result.error.stack);
  // 元のエラーにも引き続きアクセス可能
  console.error(result.error.cause);
}
```

### このアプローチの利点

1. **クリーンなスタックトレース**：ライブラリ内部の深い場所ではなく、アプリケーションコードを指すスタックトレースが得られます
2. **エラーコンテキスト**：元のエラーを保持しながら、エラーに意味のあるコンテキストを追加できます
3. **デバッグ**：元のエラーは `cause` プロパティを通じてデバッグ目的でアクセス可能です

## 結論

目標は、Resultを優先して投げられるエラーすべてを排除することではなく、それぞれのアプローチを最も適切な場所で使用することです。Resultは明示的な処理が必要な予期されたビジネスレベルのエラーの処理に優れており、throwはインフラストラクチャレベルで処理されるべき予期しないシステムエラーには依然として正しい選択です。

このハイブリッドアプローチにより、最も重要な場所で明示的なエラーハンドリングの利点を得られ、アプリケーション内のすべての可能なエラーをラップする負担を負うことなく済みます。
