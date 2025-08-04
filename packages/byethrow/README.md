# @praha/byethrow 👋

[![npm version](https://badge.fury.io/js/@praha%2Fbyethrow.svg)](https://www.npmjs.com/package/@praha/byethrow)
[![npm download](https://img.shields.io/npm/dm/@praha/byethrow.svg)](https://www.npmjs.com/package/@praha/byethrow)
[![license](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/praha-inc/byethrow/blob/main/packages/byethrow/LICENSE)
[![Github](https://img.shields.io/github/followers/praha-inc?label=Follow&logo=github&style=social)](https://github.com/orgs/praha-inc/followers)

A lightweight, tree-shakable Result type package with a simple, consistent API designed.

## ✨ Features

- 🌲 Tree-shakable: Only include what you use.
- 🧱 Lightweight & object-based: No classes, no magic—just plain objects.
- 🔄 Consistent API: Designed for readability and predictability.
- 🔀 Unified sync/async handling: Works seamlessly with both Result<T, E> and Promise<Result<T, E>>.
- 🎯 Focused functionality: Result-centric utilities without unnecessary aliases or confusing variants.

## 🧠 Motivation

Handling errors in JavaScript and TypeScript often leads to unstructured code. The typical try/catch approach doesn’t scale well and mixes error handling with business logic. `@praha/byethrow` addresses this by introducing a simple Result type, empowering you to model computation outcomes clearly—while keeping control flow explicit and maintainable.

If you're a fan of libraries like `neverthrow` or effect-ts, this tool will feel familiar. While `neverthrow` may occasionally lack certain features, and `effect-ts` or `fp-ts` can introduce unnecessary complexity or overhead for many use cases, `@praha/byethrow` strikes a thoughtful balance—remaining lightweight and focused, while still offering everything you need to handle both synchronous and asynchronous fallible operations.

## 📦 Installation

```bash
npm install @praha/byethrow
```

## 📚 Documentation

- Website: For detailed information and usage examples, visit the [byethrow website](https://praha-inc.github.io/byethrow).
- API Reference: For a complete API reference of the core package effect, see the [byethrow API Reference](https://praha-inc.github.io/byethrow/api).

## 🚀 Quick Example

Here's a simple example showing how it is used:

```ts
import { Result } from '@praha/byethrow';

const validateId = (id: string) => {
  if (!id.startsWith('u')) {
    return Result.fail(new Error('Invalid ID format'));
  }
  return Result.succeed();
};

const findUser = Result.try({
  try: (id: string) => {
    return { id, name: 'John Doe' };
  },
  catch: (error) => new Error('Failed to find user', { cause: error }),
});

const result = Result.pipe(
  Result.succeed('u123'),
  Result.andThrough(validateId),
  Result.andThen(findUser),
);

if (Result.isSuccess(result)) {
  console.log(result.value); // User found: John Doe
}
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome.

Feel free to check [issues page](https://github.com/praha-inc/byethrow/issues) if you want to contribute.

## 📝 License

Copyright © [PrAha, Inc.](https://www.praha-inc.com/)

This project is [```MIT```](https://github.com/praha-inc/byethrow/blob/main/packages/byethrow/LICENSE) licensed.
