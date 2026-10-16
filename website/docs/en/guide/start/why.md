---
description: Why use a Result type instead of try/catch, and how @praha/byethrow compares to neverthrow and Effect — practical, type-safe error handling without functional programming overhead.
---

# Why byethrow?

This page explains the problems a `Result` type solves, and why byethrow in particular is a good fit for everyday TypeScript projects.

## The Problem with `try/catch`

JavaScript lets any function throw at any time, and TypeScript cannot describe what a function throws.
This leads to several problems:

- **Invisible failures**: Nothing in a function's signature tells you that it can fail, so it is easy to forget to handle an error.
- **Untyped errors**: The value caught in a `catch` block is always `unknown`, so you have to guess what it is.
- **Tangled control flow**: `try/catch` blocks mix error handling with business logic and make the happy path harder to follow.

A `Result` type solves these problems by treating failures as ordinary return values:

- **Explicit**: Failures are part of the return type, so the compiler reminds you to handle them.
- **Typed**: Each error keeps its exact type, all the way to the place where it is handled.
- **Composable**: Operations can be chained, and a failure automatically skips the remaining steps.
- **Separated**: Business logic reads as a straight line, and error handling happens in one place.

## Why byethrow Over Other Libraries?

There are several excellent Result libraries in the TypeScript ecosystem.
byethrow aims for the sweet spot between a minimal utility and a full functional programming framework.

### Compared to neverthrow

neverthrow represents results as class instances with methods, and provides separate `Result` and `ResultAsync` classes.
byethrow makes different trade-offs:

- **Plain objects**: A byethrow `Result` is a plain `{ type, value }` or `{ type, error }` object that can be logged, serialized, and compared as it is.
- **Standalone functions**: Operations are independent functions combined with `pipe`, so unused ones are removed by tree-shaking.
- **One API for sync and async**: The same functions work with both `Result` and `Promise<Result>`, so you never need to convert between two kinds of results.
- **More building blocks**: Functions such as `bind` for building objects, `collect` for gathering every error, and `parse` for [Standard Schema](https://standardschema.dev/) validation cover common real-world needs.

### Compared to Effect and fp-ts

Effect and fp-ts are extremely powerful, but they come with their own runtime model and a large vocabulary of functional programming concepts.
byethrow only deals with success and failure, so your team can adopt it without learning a new programming paradigm.

## Designed for Real-World Use

- **Team-friendly**: Adopt it one function at a time. It works alongside existing code that throws.
- **TypeScript-first**: Success and error types are inferred through every step of a pipeline.
- **Lightweight**: A small runtime with full tree-shaking support.
- **Predictable**: A consistent naming scheme (`map` / `mapError`, `andThen` / `orElse`, and so on) keeps the API easy to remember.
- **Well-equipped**: A [linter plugin](../ecosystem/linter/index), [test matchers](../ecosystem/testing), and [documentation for AI assistants](../ecosystem/llm-integration) help the whole team follow the same patterns.
