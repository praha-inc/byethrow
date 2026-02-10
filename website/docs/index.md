---
pageType: home
titleSuffix: A lightweight Result type library
head:
  - - meta
    - property: twitter:image
      content: https://praha-inc.github.io/byethrow/og.png
  - - meta
    - property: og:image
      content: https://praha-inc.github.io/byethrow/og.png
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
  text: A lightweight Result type library
  tagline: Tree-shakable error handling with functional programming approach
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
    details: No classes, no magic—just plain objects with consistent API design.
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
  - title: '🛡️ Type-safe Validation'
    details: Built-in schema validation support with comprehensive error handling and type inference.
    icon: 🛡️
---
