---
description: Overview of @praha/byethrow, a tree-shakable TypeScript Result type library for explicit, type-safe error handling.
---

# Introduction

Welcome to `@praha/byethrow`, a lightweight and tree-shakable Result type library designed to handle fallible operations in JavaScript and TypeScript with elegance and simplicity.

## Features

- 🌲 Tree-Shakable: Only include what you use. Lightweight and optimized for modern bundlers.
- 🧱 Object-based Design: No classes or complex inheritance hierarchies. Just plain objects that are easy to understand and debug.
- 🔀 Unified Sync/Async Handling: Works seamlessly with both Result<T, E> and Promise<Result<T, E>>.
- 🎯 Focused Functionality: Result-centric utilities without unnecessary aliases or confusing variants.
- 🔗 Composable Function: Powerful pipe function and chainable operations like andThen, andThrough for clean data flow.
- 🛡️ Fully Type-Safe: All functions are type-tested. You won't be troubled by type errors.

## When to Use byethrow

This library is perfect for:

- **API calls**: that might fail due to network issues
- **Data validation**: where you need to accumulate or handle multiple errors
- **File operations**: that might encounter permissions or I/O errors
- **Parser implementations**: where invalid input should be handled gracefully
- **Business logic**: where errors are expected and should be handled explicitly

---

*Happy coding with explicit error handling! 🎉*
