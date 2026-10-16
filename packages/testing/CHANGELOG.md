# @praha/byethrow-testing

## 0.13.0

### Minor Changes

- [#988](https://github.com/praha-inc/byethrow/pull/988) [`033b0b6`](https://github.com/praha-inc/byethrow/commit/033b0b6347c48b68407a9334fdadcab2408ee52e) Thanks [@Karibash](https://github.com/Karibash)! - Change `ResultMatchers` to accept two type parameters
  
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

### Patch Changes

- Updated dependencies [[`ae57dc7`](https://github.com/praha-inc/byethrow/commit/ae57dc74cf937a1b359eebadf6c9e360b5ab5aa9)]:
  - @praha/byethrow@0.13.0

## 0.12.0

### Patch Changes

- Updated dependencies []:
  - @praha/byethrow@0.12.0

## 0.11.2

### Patch Changes

- [#723](https://github.com/praha-inc/byethrow/pull/723) [`79a7d7f`](https://github.com/praha-inc/byethrow/commit/79a7d7fa7df4e3f90b75a7af491654402d983548) Thanks [@lppedd](https://github.com/lppedd)! - Fix `node` and `node16` module resolution for the CJS output.

- Updated dependencies [[`79a7d7f`](https://github.com/praha-inc/byethrow/commit/79a7d7fa7df4e3f90b75a7af491654402d983548)]:
  - @praha/byethrow@0.11.2

## 0.11.1

### Patch Changes

- Updated dependencies [[`5968658`](https://github.com/praha-inc/byethrow/commit/5968658dfcd27f9b1061c9ef8460616bdc63571a)]:
  - @praha/byethrow@0.11.1

## 0.11.0

### Patch Changes

- [#673](https://github.com/praha-inc/byethrow/pull/673) [`2a28570`](https://github.com/praha-inc/byethrow/commit/2a285701e17381dec5c7e6fbb7783c9d5d4e5f65) Thanks [@Karibash](https://github.com/Karibash)! - First release

- Updated dependencies []:
  - @praha/byethrow@0.11.0
