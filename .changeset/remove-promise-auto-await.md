---
"@praha/byethrow": minor
---

Remove Promise auto-await from succeed/fail

**BREAKING CHANGES:**

`succeed` and `fail` no longer detect and auto-await `Promise` arguments. Passing a `Promise` now flows straight through as the wrapped value/error instead of resolving into a `ResultAsync`. Await the `Promise` yourself before calling `succeed`/`fail`, e.g. `succeed(await promise)` instead of `succeed(promise)`.
