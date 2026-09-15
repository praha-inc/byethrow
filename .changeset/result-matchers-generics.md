---
"@praha/byethrow-testing": minor
---

Change `ResultMatchers` to accept two type parameters

**BREAKING CHANGES:**

`ResultMatchers<T>` is now `ResultMatchers<R, T>`, where `R` is the matcher return type and `T` is the received value type. This mirrors the `Matchers<R, T>` interface of Jest and Vitest 5, and lets `.resolves` / `.rejects` chains return `Promise<void>` correctly. Update your setup file as follows:

```ts
// Jest
declare module 'expect' {
  interface Matchers<R, T> extends ResultMatchers<R, T> {}
}

// Vitest
declare module 'vitest' {
  interface Matchers<R, T> extends ResultMatchers<R, T> {}
}

// Rstest
declare module '@rstest/core' {
  interface Matchers<T> extends ResultMatchers<void, T> {}
}
```
