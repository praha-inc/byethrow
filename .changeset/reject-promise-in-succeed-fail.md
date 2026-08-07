---
"@praha/byethrow": major
---

reject Promise arguments in succeed/fail, returning never instead of ResultAsync

BREAKING CHANGE: `succeed` and `fail` no longer accept `Promise` arguments. Passing a `Promise` now results in a `never` return type, forcing callers to `await` the promise before wrapping. Use `succeed(await promise)` instead of `succeed(promise)`.
