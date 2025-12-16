# @praha/byethrow

## 0.8.2

### Patch Changes

- [#415](https://github.com/praha-inc/byethrow/pull/415) [`34e38b9`](https://github.com/praha-inc/byethrow/commit/34e38b9f47b0bbb3b8660a0d075f65deabc1b299) Thanks [@Karibash](https://github.com/Karibash)! - Configure fixed versioning for @praha/byethrow\* packages

## 0.8.1

### Patch Changes

- [#314](https://github.com/praha-inc/byethrow/pull/314) [`1f65986`](https://github.com/praha-inc/byethrow/commit/1f65986ffe8297bd999ad6917b47cdc0bb13e908) Thanks [@Karibash](https://github.com/Karibash)! - Make it possible to overwrite existing keys using the bind function

## 0.8.0

### Minor Changes

- [#298](https://github.com/praha-inc/byethrow/pull/298) [`f270af3`](https://github.com/praha-inc/byethrow/commit/f270af333ff9ac4d9d6c5b01dfc3c0fd0ed2ae8b) Thanks [@Karibash](https://github.com/Karibash)! - Rename combine function to collect

  **BREAKING CHANGES:**

  The `combine` function has been renamed to `collect`.
  Update all usages from `Result.combine()` to `Result.collect()`.

- [#302](https://github.com/praha-inc/byethrow/pull/302) [`89b6142`](https://github.com/praha-inc/byethrow/commit/89b61425c5caa23b083d0be4358ca2bacc481802) Thanks [@Karibash](https://github.com/Karibash)! - Add a sequence function

- [#301](https://github.com/praha-inc/byethrow/pull/301) [`bc91d35`](https://github.com/praha-inc/byethrow/commit/bc91d35db5b7383efdb00f832849467be95b8e8d) Thanks [@Karibash](https://github.com/Karibash)! - Add a mapping function that converts array elements into Result

### Patch Changes

- [#304](https://github.com/praha-inc/byethrow/pull/304) [`262f781`](https://github.com/praha-inc/byethrow/commit/262f781367d941a8919cf1b929b436d2ff75dfdb) Thanks [@Karibash](https://github.com/Karibash)! - Add const type parameters to map functions

- [#296](https://github.com/praha-inc/byethrow/pull/296) [`1fd15a6`](https://github.com/praha-inc/byethrow/commit/1fd15a69fe6876397e1a9df6aa3bc5a8a2187a23) Thanks [@Karibash](https://github.com/Karibash)! - Make it require TypeScript v5 or higher

- [#300](https://github.com/praha-inc/byethrow/pull/300) [`59bbe47`](https://github.com/praha-inc/byethrow/commit/59bbe47367155e8497e60c3d6aec72151bb23bd3) Thanks [@Karibash](https://github.com/Karibash)! - Add const type parameters to succeed and fail functions

## 0.7.2

### Patch Changes

- [#287](https://github.com/praha-inc/byethrow/pull/287) [`6c47351`](https://github.com/praha-inc/byethrow/commit/6c47351e5acd94c3843570a5db3ca683b282f92a) Thanks [@Karibash](https://github.com/Karibash)! - Ensure inspect function waits for callback execution to complete

  **BREAKING CHANGES:**

  - The `inspect` function now waits for the callback to complete before returning the result. This may affect code that relies on immediate return values from `inspect`.
  - If you want to perform asynchronous processing inside a callback without making the entire pipeline asynchronous, use an immediately invoked function.

  ### Migration guide:

  **Before:**

  ```ts
  const result = Result.pipe(
    Result.succeed("success"),
    // This does not wait for the async operation to complete
    Result.inspect(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("This runs after 1 second");
    }),
    Result.map((value) => value.toUpperCase())
  );
  // Still returns Result
  console.log(result); // Result<string, never>
  ```

  **After:**

  ```ts
  const result = Result.pipe(
    Result.succeed("success"),
    // This now waits for the async operation to complete
    Result.inspect(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("This runs after 1 second");
    }),
    Result.map((value) => value.toUpperCase())
  );
  // Now returns ResultAsync
  console.log(result); // ResultAsync<string, never>
  ```

  If you want to keep the pipeline synchronous, use an immediately invoked function:

  ```ts
  const result = Result.pipe(
    Result.succeed("success"),
    // Use an immediately invoked function to keep it synchronous
    Result.inspect(() => {
      void (async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("This runs after 1 second");
      })();
    }),
    Result.map((value) => value.toUpperCase())
  );
  // Still returns Result
  console.log(result); // Result<string, never>
  ```

## 0.7.1

### Patch Changes

- [#238](https://github.com/praha-inc/byethrow/pull/238) [`2b198c8`](https://github.com/praha-inc/byethrow/commit/2b198c8de38cf1888eb9015223a23eaf65172057) Thanks [@Karibash](https://github.com/Karibash)! - Add file extensions to import paths in TypeScript declaration files

## 0.7.0

### Minor Changes

- [#212](https://github.com/praha-inc/byethrow/pull/212) [`a6e7d98`](https://github.com/praha-inc/byethrow/commit/a6e7d98486887e519252fa03c7be88d92a05847c) Thanks [@Karibash](https://github.com/Karibash)! - Add immediate mode option to execute try functions immediately

  **BREAKING CHANGES:**

  - Removed support for passing Promise objects directly to the `Result.try` function
  - All async operations must now be wrapped in functions before being passed to `Result.try`

  ### What's no longer supported:

  **Direct Promise passing:**

  ```ts
  // ❌ No longer works
  const result = await Result.try({
    try: Promise.resolve("success"),
    catch: String,
  });

  // ❌ No longer works
  const result = await Result.try({
    safe: true,
    try: Promise.reject(new Error("failure")),
  });
  ```

  ### Migration guide:

  **Replace direct Promise usage with function wrappers:**

  ```ts
  // ✅ New way - use immediate mode for direct execution
  const result = await Result.try({
    immediate: true,
    try: () => Promise.resolve("success"),
    catch: String,
  });

  // ✅ Safe mode with immediate execution
  const result = await Result.try({
    safe: true,
    immediate: true,
    try: () => Promise.resolve("success"),
  });
  ```

## 0.6.3

### Patch Changes

- [#134](https://github.com/praha-inc/byethrow/pull/134) [`22dedca`](https://github.com/praha-inc/byethrow/commit/22dedca5646471e43f2de1781eef4da641d68c0d) Thanks [@Karibash](https://github.com/Karibash)! - Fix bug where specifying undefined when creating a Result causes the value and error properties to be missing

## 0.6.2

### Patch Changes

- [#78](https://github.com/praha-inc/byethrow/pull/78) [`5c58e25`](https://github.com/praha-inc/byethrow/commit/5c58e250c8dd4c35dbf24278fb203b6746c33ca9) Thanks [@kmymso](https://github.com/kmymso)! - Fix a bug where an error wrapped by the unwrap function is thrown

## 0.6.1

### Patch Changes

- [#74](https://github.com/praha-inc/byethrow/pull/74) [`1229e80`](https://github.com/praha-inc/byethrow/commit/1229e80f7daab65d8026a8a95a8e8206f31ca928) Thanks [@Karibash](https://github.com/Karibash)! - Make it possible to pass Promise directly to the assert functions

## 0.6.0

### Minor Changes

- [#63](https://github.com/praha-inc/byethrow/pull/63) [`d9fbb0c`](https://github.com/praha-inc/byethrow/commit/d9fbb0c7892fed88d566593cdb6351046d4fff6b) Thanks [@Karibash](https://github.com/Karibash)! - Add Result assertion functions

## 0.5.0

### Minor Changes

- [#61](https://github.com/praha-inc/byethrow/pull/61) [`19d515e`](https://github.com/praha-inc/byethrow/commit/19d515e453615146fe584476624d211b0249c745) Thanks [@Karibash](https://github.com/Karibash)! - Add parse function with Standard Schema support

## 0.4.1

### Patch Changes

- [#56](https://github.com/praha-inc/byethrow/pull/56) [`4822d35`](https://github.com/praha-inc/byethrow/commit/4822d35fa4f06067214b5264be13fb80a288edec) Thanks [@Karibash](https://github.com/Karibash)! - Make it possible to pass Promise directly to the try function

- [#52](https://github.com/praha-inc/byethrow/pull/52) [`d8d2e0b`](https://github.com/praha-inc/byethrow/commit/d8d2e0b798e126ab28e7aa7175b3edb0ad6dcf5f) Thanks [@Karibash](https://github.com/Karibash)! - Make it possible to pass default values to unwrap and unwrapError functions

## 0.4.0

### Minor Changes

- [#48](https://github.com/praha-inc/byethrow/pull/48) [`f35c6c9`](https://github.com/praha-inc/byethrow/commit/f35c6c9d0f9e7a3803c10ae4e5d425b7b9abe0aa) Thanks [@Karibash](https://github.com/Karibash)! - Add type guard function to check if unknown values are Result types

## 0.3.0

### Minor Changes

- [#29](https://github.com/praha-inc/byethrow/pull/29) [`facac40`](https://github.com/praha-inc/byethrow/commit/facac402c93c8b6195922644b9b8a9458b266e29) Thanks [@Karibash](https://github.com/Karibash)! - Add inspect function

### Patch Changes

- [#29](https://github.com/praha-inc/byethrow/pull/29) [`9d8144d`](https://github.com/praha-inc/byethrow/commit/9d8144d2783bd21dda6ae0c7d3fe0d2326923549) Thanks [@Karibash](https://github.com/Karibash)! - Use isPromise instead of instanceof to confirm the promise

## 0.2.1

### Patch Changes

- [#30](https://github.com/praha-inc/byethrow/pull/30) [`45220aa`](https://github.com/praha-inc/byethrow/commit/45220aa5e43b4e2670dec320ea9974b09b396001) Thanks [@Karibash](https://github.com/Karibash)! - Make it possible to pass ResultAsync to the unwrap function

## 0.2.0

### Minor Changes

- [#19](https://github.com/praha-inc/byethrow/pull/19) [`dc54f50`](https://github.com/praha-inc/byethrow/commit/dc54f50f4db183d8c1b2735f07b0d3c4c665173f) Thanks [@Karibash](https://github.com/Karibash)! - feature: Add orElse function

## 0.1.0

### Minor Changes

- [#17](https://github.com/praha-inc/byethrow/pull/17) [`d4f0d4d`](https://github.com/praha-inc/byethrow/commit/d4f0d4d2ffbdfc366f61ce564dde5c54040b55a2) Thanks [@Karibash](https://github.com/Karibash)! - Add a function to combine multiple Results

## 0.0.1

### Patch Changes

- [`b9ab8b9`](https://github.com/praha-inc/byethrow/commit/b9ab8b966e74b182d9d2ec952f19c312fb7002c5) Thanks [@Karibash](https://github.com/Karibash)! - First release
