---
description: 'どのエラーを Result で表し、どのエラーを throw すべきか。想定内のビジネスエラーと想定外のインフラエラーの区別と、アプリケーションの境界での相互変換の方法。'
---

# Result vs throw

「JavaScript はどこでも例外を投げる可能性があり、すべてのエラーを `Result` で管理することは不可能なので、`Result` を導入する意味はない」という意見を耳にしたことがあるかもしれません。

私たちはそうは考えていません。重要なのは、**`Result` が表すべきなのは想定内のエラーだけ**だということです。
起こりうるすべてのエラーを `Result` で包む必要はありません。

## 想定内のエラーと想定外のエラー

エラーを `Result` で表すべきか、throw すべきかは、そのエラーの性質によって決まります。

### 想定内のエラー：`Result` を使う

想定内のエラーは、アプリケーションのビジネスロジックの一部です。
通常の運用の中で起こることが想定されており、呼び出し側はユーザーにメッセージを表示したり `404` レスポンスを返したりといった、意味のある対応ができます。

- リクエストされた投稿が存在しない
- ユーザーがその操作を行う権限を持っていない
- 送信されたフォームに不正な値が含まれている

これらのエラーは戻り値の型で表し、呼び出し側が必ず処理するようにします。

```ts
// @noErrors
class PostNotFoundError extends Error {}
class PostPermissionError extends Error {}
class PostAlreadyDeletedError extends Error {}
import { Result } from '@praha/byethrow';
// ---cut-before---
type PostDeleteError = (
  | PostNotFoundError
  | PostPermissionError
  | PostAlreadyDeletedError
);

const deletePost = async (postId: string): Result.ResultAsync<void, PostDeleteError> => {
  // ビジネスルールに違反するごとに Failure を返す
}
```

### 想定外のエラー：throw させる

想定外のエラーは、インフラやバグに起因するものです。
呼び出し側は通常、報告する以外に何もできません。

- データベースへの接続失敗
- ネットワークのタイムアウト
- メモリ不足
- `undefined` のプロパティを読み取るなどのプログラミングミス

これらのエラーはそのまま throw させ、フレームワークのエラーハンドラーや Sentry のようなエラー監視サービスなど、最上位の一箇所でまとめて処理します。

```ts
// @noErrors
interface Database {}
// ---cut-before---
// 接続失敗やタイムアウトなどで例外を投げる可能性がある
const connectToDatabase = async (): Promise<Database> => {
  // ...
};
```

:::tip
迷ったときは、**「呼び出し側はこのエラーを、他のエラーとは異なる方法で処理するだろうか？」** と自問してみてください。
答えが「はい」であれば、それは想定内のエラーであり、`Result` で表すべきです。
:::

## 2 種類のエラーを相互に変換する

実際には、2 種類のエラーはコードの境界で出会います。

- **throw から `Result` へ**：ユーザー入力に対する `JSON.parse` のように、ライブラリが想定内の失敗を例外で通知する場合は、[`Result.fn` または `Result.try`](../tutorial/basics/wrapping-functions) でラップします。
- **`Result` から throw へ**：アプリケーションのエントリーポイントでは、想定しているエラーを処理したうえで、残りは [`Result.unwrap`](../tutorial/resolving/unwrapping) に throw させます。これにより、エラー監視で検知できるようになります。

## スタックトレースを改善するために想定外のエラーをラップする

想定外のエラーのスタックトレースは、ライブラリの内部の奥深くを指していて役に立たないことがあります。
そのような場合は、処理を `Result.fn` でラップし、投げられたエラーを 1 つの `UnexpectedError` クラスに変換できます。

まず、エラークラスを定義します。

:::tip
`@praha/error-factory` の詳細については、[カスタムエラー](./custom-error)を参照してください。
:::

```ts
import { ErrorFactory } from '@praha/error-factory';

class UnexpectedError extends ErrorFactory({
  name: 'UnexpectedError',
  message: 'An unexpected error occurred',
}) {}
```

次に、元のエラーを `cause` として保持しながら処理をラップします。

```ts
import { ErrorFactory } from '@praha/error-factory';

class UnexpectedError extends ErrorFactory({
  name: 'UnexpectedError',
  message: 'An unexpected error occurred',
}) {}
const performDatabaseOperation = async (id: string): Promise<string> => Promise.resolve('data');
// ---cut-before---
import { Result } from '@praha/byethrow';

const findRecord = Result.fn({
  try: (id: string) => {
    // クエリエラーやネットワークエラーなどを投げる可能性がある
    return performDatabaseOperation(id);
  },
  catch: (error) => new UnexpectedError({ cause: error }),
});

const result = await findRecord('123');
if (Result.isFailure(result)) {
  // スタックトレースは、エラーをラップしたアプリケーション側のコードから始まる
  console.error(result.error.stack);
  // 元のエラーにも引き続きアクセスできる
  console.error(result.error.cause);
}
```

この方法には次の利点があります。

1. **読みやすいスタックトレース**：新しいエラーはアプリケーション側のコードで作成されるため、そのスタックトレースから、失敗がどこでアプリケーションに入ってきたのかがわかります。
2. **コンテキスト**：処理の引数など、デバッグに役立つ情報を付け加えられます。
3. **情報が失われない**：元のエラーには `cause` プロパティから引き続きアクセスできます。

アプリケーションのエントリーポイントでは、これらのエラーを `unwrap` して再び throw し、エラー監視に渡すこともできます。

## まとめ

目指すのは、すべての `throw` を `Result` に置き換えることではなく、それぞれを最も適した場所で使うことです。
`Result` は明示的な処理が必要な、想定内のビジネスレベルのエラーを扱うのに優れています。一方、インフラレベルで処理すべき想定外のエラーには、引き続き `throw` が適しています。

この組み合わせにより、アプリケーション内で起こりうるすべてのエラーをラップする負担を負うことなく、本当に重要な箇所で明示的なエラーハンドリングを実現できます。
