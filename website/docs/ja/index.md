---
pageType: home
titleSuffix: 軽量なResult型ライブラリ
description: TypeScriptで型安全なエラーハンドリングを実現する、軽量でTree Shaking対応のResult型ライブラリ。
head:
  - - meta
    - property: twitter:image
      content: https://praha-inc.github.io/byethrow/og-ja.png
  - - meta
    - property: og:image
      content: https://praha-inc.github.io/byethrow/og-ja.png
  - - meta
    - property: og:image:type
      content: image/png
  - - meta
    - property: og:image:width
      content: 1200
  - - meta
    - property: og:image:height
      content: 630

hero:
  name: byethrow
  text: A&nbsp;lightweight Result&nbsp;type&nbsp;package
  tagline: throw にさよなら、型安全な Result へ
  image:
    src: /waving-hand.png
    alt: byethrowのロゴ
  actions:
    - theme: brand
      text: はじめに
      link: /guide/start/introduction
    - theme: alt
      text: クイックスタート
      link: /guide/start/quick

features:
  - title: '🌲 Tree Shaking対応'
    details: 使用しない機能はバンドルされません。モダンな JavaScript バンドラーを念頭に設計されています。
    icon: 🌲
  - title: '🧱 オブジェクトを基本とした設計'
    details: クラスや複雑な継承構造はありません。理解しやすくデバッグも簡単なプレーンオブジェクトだけです。
    icon: 🧱
  - title: '🔄 同期/非同期のAPIの統一'
    details: Result<T, E> と Promise<Result<T, E>> の両方でシームレスに動作します。
    icon: 🔄
  - title: '🎯 Resultを中心とした機能'
    details: 不必要なエイリアスや紛らわしい機能はありません。Result を中心とした機能で設計されています。
    icon: 🎯
  - title: '🔗 合成可能な関数群'
    details: 強力な pipe 関数と、andThen、andThroughなどのチェーン可能な関数でシームレスに実装出来ます。
    icon: 🔗
  - title: '🛡️ 完全に型安全'
    details: 全ての関数で型テストを実施しています。型エラーに悩まされることはありません。
    icon: 🛡️
---
