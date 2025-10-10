---
"@praha/byethrow": patch
---

Ensure inspect function waits for callback execution to complete

**BREAKING CHANGES:**
- The `inspect` function now waits for the callback to complete before returning the result. This may affect code that relies on immediate return values from `inspect`.
- If you want to perform asynchronous processing inside a callback without making the entire pipeline asynchronous, use an immediately invoked function.

### Migration guide:

**Before:**
```ts
const result = Result.pipe(
  Result.succeed('success'),
  // This does not wait for the async operation to complete
  Result.inspect(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('This runs after 1 second');
  }),
  Result.map((value) => value.toUpperCase()),
);
// Still returns Result
console.log(result); // Result<string, never>
```

**After:**
```ts
const result = Result.pipe(
  Result.succeed('success'),
  // This now waits for the async operation to complete
  Result.inspect(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('This runs after 1 second');
  }),
  Result.map((value) => value.toUpperCase()),
);
// Now returns ResultAsync
console.log(result); // ResultAsync<string, never>
```

If you want to keep the pipeline synchronous, use an immediately invoked function:

```ts
const result = Result.pipe(
  Result.succeed('success'),
  // Use an immediately invoked function to keep it synchronous
  Result.inspect(() => {
    void (async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('This runs after 1 second');
    })();
  }),
  Result.map((value) => value.toUpperCase()),
);
// Still returns Result
console.log(result); // Result<string, never>
```
