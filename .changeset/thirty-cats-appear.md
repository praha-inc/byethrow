---
"@praha/byethrow": minor
---

Add immediate mode option to execute try functions immediately

**BREAKING CHANGES:**
- Removed support for passing Promise objects directly to the `Result.try` function
- All async operations must now be wrapped in functions before being passed to `Result.try`

### What's no longer supported:

**Direct Promise passing:**
```ts
// ❌ No longer works
const result = await Result.try({
  try: Promise.resolve('success'),
  catch: String,
});

// ❌ No longer works  
const result = await Result.try({
  safe: true,
  try: Promise.reject(new Error('failure')),
});
```

### Migration guide:

**Replace direct Promise usage with function wrappers:**
```ts
// ✅ New way - use immediate mode for direct execution
const result = await Result.try({
  immediate: true,
  try: () => Promise.resolve('success'),
  catch: String,
});

// ✅ Safe mode with immediate execution
const result = await Result.try({
  safe: true,
  immediate: true,
  try: () => Promise.resolve('success'),
});
```
