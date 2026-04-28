import { ruleTester } from '../tester';
import { preferResultMatchers } from './prefer-result-matchers';

ruleTester.run(
  'prefer-result-matchers',
  preferResultMatchers,
  {
    valid: [
      // Already using custom matchers
      'expect(result).toBeSuccess();',
      'expect(result).toBeFailure();',
      'expect(result).toBeSuccess((value) => {});',
      'expect(result).toBeFailure((error) => {});',

      // non-byethrow call should not trigger
      'expect(someValue).toBe(true);',
      'expect(someValue).toBeTruthy();',
      'expect(someValue).toBe(false);',
      'expect(someValue).toBeFalsy();',
      'expect(isSuccess(result)).toBe(true);',
      'expect(isSuccess(result)).toBeTruthy();',
      'expect(isSuccess(result)).toBe(false);',
      'expect(isSuccess(result)).toBeFalsy();',
      'expect(Z.isSuccess(result)).toBe(true);',
      'expect(Z.isSuccess(result)).toBeTruthy();',
      'expect(Z.isSuccess(result)).toBe(false);',
      'expect(Z.isSuccess(result)).toBeFalsy();',

      // assert with non-byethrow call should not trigger
      'assert(isSuccess(result));',
      'assert(isFailure(result));',
      'assert(Z.isSuccess(result));',
      'assert(Z.isFailure(result));',

      // non-byethrow unwrap should not trigger
      'unwrap(result);',
      'unwrapError(result);',
      'Z.unwrap(result);',
      'Z.unwrapError(result);',
    ],
    invalid: [
      // expect(...).toBe(true)
      {
        code: 'expect(Result.isSuccess(result)).toBe(true);',
        output: 'expect(result).toBeSuccess();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },
      {
        code: 'expect(R.isSuccess(result)).toBe(true);',
        output: 'expect(result).toBeSuccess();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },
      {
        code: 'expect(Result.isFailure(result)).toBe(true);',
        output: 'expect(result).toBeFailure();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },
      {
        code: 'expect(R.isFailure(result)).toBe(true);',
        output: 'expect(result).toBeFailure();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },

      // expect(...).not.toBe(true)
      {
        code: 'expect(Result.isSuccess(result)).not.toBe(true);',
        output: 'expect(result).toBeFailure();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },
      {
        code: 'expect(R.isSuccess(result)).not.toBe(true);',
        output: 'expect(result).toBeFailure();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },
      {
        code: 'expect(Result.isFailure(result)).not.toBe(true);',
        output: 'expect(result).toBeSuccess();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },
      {
        code: 'expect(R.isFailure(result)).not.toBe(true);',
        output: 'expect(result).toBeSuccess();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },

      // expect(...).toBe(false)
      {
        code: 'expect(Result.isSuccess(result)).toBe(false);',
        output: 'expect(result).toBeFailure();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },
      {
        code: 'expect(R.isSuccess(result)).toBe(false);',
        output: 'expect(result).toBeFailure();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },
      {
        code: 'expect(Result.isFailure(result)).toBe(false);',
        output: 'expect(result).toBeSuccess();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },
      {
        code: 'expect(R.isFailure(result)).toBe(false);',
        output: 'expect(result).toBeSuccess();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },

      // expect(...).not.toBe(false)
      {
        code: 'expect(Result.isSuccess(result)).not.toBe(false);',
        output: 'expect(result).toBeSuccess();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },
      {
        code: 'expect(R.isSuccess(result)).not.toBe(false);',
        output: 'expect(result).toBeSuccess();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },
      {
        code: 'expect(Result.isFailure(result)).not.toBe(false);',
        output: 'expect(result).toBeFailure();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },
      {
        code: 'expect(R.isFailure(result)).not.toBe(false);',
        output: 'expect(result).toBeFailure();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },

      // expect(...).toBeTruthy()
      {
        code: 'expect(Result.isSuccess(result)).toBeTruthy();',
        output: 'expect(result).toBeSuccess();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },
      {
        code: 'expect(R.isSuccess(result)).toBeTruthy();',
        output: 'expect(result).toBeSuccess();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },
      {
        code: 'expect(Result.isFailure(result)).toBeTruthy();',
        output: 'expect(result).toBeFailure();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },
      {
        code: 'expect(R.isFailure(result)).toBeTruthy();',
        output: 'expect(result).toBeFailure();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },

      // expect(...).not.toBeTruthy()
      {
        code: 'expect(Result.isSuccess(result)).not.toBeTruthy();',
        output: 'expect(result).toBeFailure();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },
      {
        code: 'expect(R.isSuccess(result)).not.toBeTruthy();',
        output: 'expect(result).toBeFailure();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },
      {
        code: 'expect(Result.isFailure(result)).not.toBeTruthy();',
        output: 'expect(result).toBeSuccess();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },
      {
        code: 'expect(R.isFailure(result)).not.toBeTruthy();',
        output: 'expect(result).toBeSuccess();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },

      // expect(...).toBeFalsy()
      {
        code: 'expect(Result.isSuccess(result)).toBeFalsy();',
        output: 'expect(result).toBeFailure();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },
      {
        code: 'expect(R.isSuccess(result)).toBeFalsy();',
        output: 'expect(result).toBeFailure();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },
      {
        code: 'expect(Result.isFailure(result)).toBeFalsy();',
        output: 'expect(result).toBeSuccess();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },
      {
        code: 'expect(R.isFailure(result)).toBeFalsy();',
        output: 'expect(result).toBeSuccess();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },

      // expect(...).not.toBeFalsy()
      {
        code: 'expect(Result.isSuccess(result)).not.toBeFalsy();',
        output: 'expect(result).toBeSuccess();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },
      {
        code: 'expect(R.isSuccess(result)).not.toBeFalsy();',
        output: 'expect(result).toBeSuccess();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },
      {
        code: 'expect(Result.isFailure(result)).not.toBeFalsy();',
        output: 'expect(result).toBeFailure();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },
      {
        code: 'expect(R.isFailure(result)).not.toBeFalsy();',
        output: 'expect(result).toBeFailure();',
        errors: [{ messageId: 'preferResultMatchersOverExpect' }],
      },

      // assert(...)
      {
        code: 'assert(Result.isSuccess(result));',
        output: 'expect(result).toBeSuccess((value) => {});',
        errors: [{
          message: 'Use `expect(result).toBeSuccess()` instead of `assert(Result.isSuccess(result))`.',
          line: 1,
          column: 0,
        }],
      },
      {
        code: 'assert(R.isSuccess(result));',
        output: 'expect(result).toBeSuccess((value) => {});',
        errors: [{
          message: 'Use `expect(result).toBeSuccess()` instead of `assert(R.isSuccess(result))`.',
          line: 1,
          column: 0,
        }],
      },
      {
        code: 'assert(Result.isFailure(result));',
        output: 'expect(result).toBeFailure((error) => {});',
        errors: [{
          message: 'Use `expect(result).toBeFailure()` instead of `assert(Result.isFailure(result))`.',
          line: 1,
          column: 0,
        }],
      },
      {
        code: 'assert(R.isFailure(result));',
        output: 'expect(result).toBeFailure((error) => {});',
        errors: [{
          message: 'Use `expect(result).toBeFailure()` instead of `assert(R.isFailure(result))`.',
          line: 1,
          column: 0,
        }],
      },

      // Result.unwrap / Result.unwrapError
      {
        code: 'Result.unwrap(result);',
        output: 'expect(result).toBeSuccess((value) => {});',
        errors: [{
          message: 'Use `expect(result).toBeSuccess((value) => {})` instead of `Result.unwrap(result)`.',
          line: 1,
          column: 0,
        }],
      },
      {
        code: 'R.unwrap(result);',
        output: 'expect(result).toBeSuccess((value) => {});',
        errors: [{
          message: 'Use `expect(result).toBeSuccess((value) => {})` instead of `R.unwrap(result)`.',
          line: 1,
          column: 0,
        }],
      },
      {
        code: 'Result.unwrapError(result);',
        output: 'expect(result).toBeFailure((error) => {});',
        errors: [{
          message: 'Use `expect(result).toBeFailure((error) => {})` instead of `Result.unwrapError(result)`.',
          line: 1,
          column: 0,
        }],
      },
      {
        code: 'R.unwrapError(result);',
        output: 'expect(result).toBeFailure((error) => {});',
        errors: [{
          message: 'Use `expect(result).toBeFailure((error) => {})` instead of `R.unwrapError(result)`.',
          line: 1,
          column: 0,
        }],
      },
    ],
  },
);
