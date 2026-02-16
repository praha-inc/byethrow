---
pageType: home
titleSuffix: A lightweight Result type library
description: A lightweight, tree-shakable Result type library for type-safe error handling in TypeScript.
head:
  - - meta
    - property: twitter:image
      content: https://praha-inc.github.io/byethrow/og-en.png
  - - meta
    - property: og:image
      content: https://praha-inc.github.io/byethrow/og-en.png
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
  tagline: Say goodbye to throw, embrace type-safe results
  image:
    src: /waving-hand.png
    alt: byethrow logo
  actions:
    - theme: brand
      text: Introduction
      link: /guide/start/introduction
    - theme: alt
      text: Quick Start
      link: /guide/start/quick

features:
  - title: '🌲 Tree-shakable'
    details: Only include what you use. Lightweight and optimized for modern bundlers.
    icon: 🌲
  - title: '🧱 Object-based Design'
    details: No classes or complex inheritance hierarchies. Just plain objects that are easy to understand and debug.
    icon: 🧱
  - title: '🔄 Unified Sync/Async'
    details: Works seamlessly with both Result<T, E> and Promise<Result<T, E>>.
    icon: 🔄
  - title: '🎯 Focused Functionality'
    details: Result-centric utilities without unnecessary aliases or confusing variants.
    icon: 🎯
  - title: '🔗 Composable Pipeline'
    details: Powerful pipe function and chainable operations like andThen, andThrough for clean data flow.
    icon: 🔗
  - title: '🛡️ Fully Type-Safe'
    details: All functions are type-tested. You won't be troubled by type errors.
    icon: 🛡️
---
