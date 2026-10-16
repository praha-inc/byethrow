---
description: '@praha/byethrowの概要。TypeScriptで明示的かつ型安全なエラーハンドリングを実現する、軽量でツリーシェイキング可能なResult型ライブラリの紹介。'
---

# はじめに

`@praha/byethrow` は、JavaScript と TypeScript に `Result` 型をもたらす、軽量でツリーシェイキング可能なライブラリです。
関数は例外を投げる代わりに、成功または失敗のどちらかを表す値を返します。
失敗の可能性が型の一部になるため、それが処理されていることをコンパイラが保証できます。

## ひと目でわかる byethrow

`throw` を使う場合、関数のシグネチャからはその関数がどのように失敗するのかがわかりません。

```ts
// @noErrors
type User = { id: string; name: string };
// ---cut-before---
// 例外を投げる？どんなエラー？シグネチャからはわからない
const findUser = async (id: string): Promise<User> => {
  // ...
};
```

byethrow を使うと、想定されるすべての失敗が戻り値の型に現れ、`try/catch` を使わずに `Result` を一歩ずつ組み合わせられます。

```ts
type User = { id: string; name: string };
declare const db: { findUser: (id: string) => Promise<User | undefined> };
class InvalidIdError extends Error { override readonly name = 'InvalidIdError'; }
class UserNotFoundError extends Error { override readonly name = 'UserNotFoundError'; }
// ---cut-before---
import { Result } from '@praha/byethrow';

const validateId = (id: string) => {
  if (!id.startsWith('u')) {
    return Result.fail(new InvalidIdError());
  }
  return Result.succeed(id);
};

const findUser = async (id: string): Result.ResultAsync<User, UserNotFoundError> => {
  const user = await db.findUser(id);
  if (!user) {
    return Result.fail(new UserNotFoundError());
  }
  return Result.succeed(user);
};

const result = await Result.pipe(
  Result.succeed('u123'),
  Result.andThen(validateId),
  Result.andThen(findUser),
);
// 型: Result.Result<User, InvalidIdError | UserNotFoundError>
```

## 特徴

- **ツリーシェイキング対応**：すべての関数が独立したエクスポートなので、バンドルには実際に使う関数だけが含まれます。
- **プレーンオブジェクト**：`Result` はクラスのインスタンスではなく、ただのプレーンオブジェクトです。ログ出力、シリアライズ、デバッグが簡単です。
- **同期と非同期で同じ API**：すべての関数が `Result<T, E>` と `Promise<Result<T, E>>` の両方を受け付けます。
- **合成しやすい設計**：`pipe` と、`map`・`andThen`・`andThrough` などの関数を組み合わせて、読みやすいパイプラインを構築できます。
- **機能を絞った API**：エイリアスや紛らわしいバリエーションのない、Result を中心とした少数の関数で構成されています。
- **完全に型安全**：すべての関数に型テストがあり、成功値とエラーの型が正確に推論されます。

## byethrow が役立つ場面

byethrow は、アプリケーションの通常の動作の一部として起こる失敗に最も適しています。例えば次のような場面です。

- **API 呼び出し**：ネットワークエラーやサーバーエラーで失敗する可能性がある場合
- **入力のバリデーション**：問題点を 1 つ、またはすべてユーザーに伝えたい場合
- **ファイル操作**：ファイルが存在しない、権限がないなどの理由で失敗する可能性がある場合
- **パーサー**：不正な入力を適切に拒否する必要がある場合
- **ビジネスルール**：「投稿はすでに削除されている」「ユーザーに権限がない」といったルールを扱う場合

起こり得るすべてのエラーを `Result` で包む必要はありません。
データベース接続の切断のような本当に想定外のエラーは、これまで通り throw して、インフラ側で処理できます。
その線引きについては [Result vs throw](../best-practices/result-vs-throw) を参照してください。

## 次のステップ

- [byethrow を選ぶ理由](./why)：byethrow が解決する課題と、他のアプローチとの比較
- [クイックスタート](./quick)：パッケージをインストールして、`Result` を使った最初のコードを書く
- [チュートリアル](../tutorial/basics/result-type)：すべての関数を一歩ずつ学ぶ
