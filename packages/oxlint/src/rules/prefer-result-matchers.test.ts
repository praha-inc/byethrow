import dedent from 'dedent';

import { ruleTester } from '../tester';
import { preferResultMatchers } from './prefer-result-matchers';

ruleTester.run(
  'prefer-result-matchers',
  preferResultMatchers,
  {
    valid: [
      // Already using custom matchers
      {
        code: dedent`
          expect(result).toBeSuccess();
        `,
      },
      {
        code: dedent`
          expect(result).toBeFailure();
        `,
      },
      {
        code: dedent`
          expect(result).toBeSuccess((value) => {});
        `,
      },
      {
        code: dedent`
          expect(result).toBeFailure((error) => {});
        `,
      },

      // non-byethrow call should not trigger
      {
        code: dedent`
          expect(someValue).toBe(true);
        `,
      },
      {
        code: dedent`
          expect(someValue).toBeTruthy();
        `,
      },
      {
        code: dedent`
          expect(someValue).toBe(false);
        `,
      },
      {
        code: dedent`
          expect(someValue).toBeFalsy();
        `,
      },
      {
        code: dedent`
          expect(isSuccess(result)).toBe(true);
        `,
      },
      {
        code: dedent`
          expect(isSuccess(result)).toBeTruthy();
        `,
      },
      {
        code: dedent`
          expect(isSuccess(result)).toBe(false);
        `,
      },
      {
        code: dedent`
          expect(isSuccess(result)).toBeFalsy();
        `,
      },
      {
        code: dedent`
          import { Result } from 'other-package';

          expect(Result.isSuccess(result)).toBe(true);
        `,
      },
      {
        code: dedent`
          import { Result } from 'other-package';

          expect(Result.isSuccess(result)).toBeTruthy();
        `,
      },
      {
        code: dedent`
          import { Result } from 'other-package';

          expect(Result.isSuccess(result)).toBe(false);
        `,
      },
      {
        code: dedent`
          import { Result } from 'other-package';

          expect(Result.isSuccess(result)).toBeFalsy();
        `,
      },

      // assert with non-byethrow call should not trigger
      {
        code: dedent`
          assert(isSuccess(result));
        `,
      },
      {
        code: dedent`
          assert(isFailure(result));
        `,
      },
      {
        code: dedent`
          import { Result } from 'other-package';

          assert(Result.isSuccess(result));
        `,
      },
      {
        code: dedent`
          import { Result } from 'other-package';

          assert(Result.isFailure(result));
        `,
      },

      // non-byethrow unwrap should not trigger
      {
        code: dedent`
          unwrap(result);
        `,
      },
      {
        code: dedent`
          unwrapError(result);
        `,
      },
      {
        code: dedent`
          import { Result } from 'other-package';

          Result.unwrap(result);
        `,
      },
      {
        code: dedent`
          import { Result } from 'other-package';

          Result.unwrapError(result);
        `,
      },
    ],
    invalid: [
      // expect(...).toBe(true)
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          expect(Result.isSuccess(result)).toBe(true);
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          expect(result).toBeSuccess();
        `,
        errors: [{
          message: 'Use `expect(result).toBeSuccess()` instead of `expect(Result.isSuccess(result)).toBe(true)`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          expect(R.isSuccess(result)).toBe(true);
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          expect(result).toBeSuccess();
        `,
        errors: [{
          message: 'Use `expect(result).toBeSuccess()` instead of `expect(R.isSuccess(result)).toBe(true)`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          expect(Result.isFailure(result)).toBe(true);
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          expect(result).toBeFailure();
        `,
        errors: [{
          message: 'Use `expect(result).toBeFailure()` instead of `expect(Result.isFailure(result)).toBe(true)`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          expect(R.isFailure(result)).toBe(true);
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          expect(result).toBeFailure();
        `,
        errors: [{
          message: 'Use `expect(result).toBeFailure()` instead of `expect(R.isFailure(result)).toBe(true)`.',
          line: 3,
          column: 0,
        }],
      },

      // expect(...).not.toBe(true)
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          expect(Result.isSuccess(result)).not.toBe(true);
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          expect(result).toBeFailure();
        `,
        errors: [{
          message: 'Use `expect(result).toBeFailure()` instead of `expect(Result.isSuccess(result)).not.toBe(true)`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          expect(R.isSuccess(result)).not.toBe(true);
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          expect(result).toBeFailure();
        `,
        errors: [{
          message: 'Use `expect(result).toBeFailure()` instead of `expect(R.isSuccess(result)).not.toBe(true)`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          expect(Result.isFailure(result)).not.toBe(true);
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          expect(result).toBeSuccess();
        `,
        errors: [{
          message: 'Use `expect(result).toBeSuccess()` instead of `expect(Result.isFailure(result)).not.toBe(true)`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          expect(R.isFailure(result)).not.toBe(true);
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          expect(result).toBeSuccess();
        `,
        errors: [{
          message: 'Use `expect(result).toBeSuccess()` instead of `expect(R.isFailure(result)).not.toBe(true)`.',
          line: 3,
          column: 0,
        }],
      },

      // expect(...).toBe(false)
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          expect(Result.isSuccess(result)).toBe(false);
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          expect(result).toBeFailure();
        `,
        errors: [{
          message: 'Use `expect(result).toBeFailure()` instead of `expect(Result.isSuccess(result)).toBe(false)`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          expect(R.isSuccess(result)).toBe(false);
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          expect(result).toBeFailure();
        `,
        errors: [{
          message: 'Use `expect(result).toBeFailure()` instead of `expect(R.isSuccess(result)).toBe(false)`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          expect(Result.isFailure(result)).toBe(false);
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          expect(result).toBeSuccess();
        `,
        errors: [{
          message: 'Use `expect(result).toBeSuccess()` instead of `expect(Result.isFailure(result)).toBe(false)`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          expect(R.isFailure(result)).toBe(false);
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          expect(result).toBeSuccess();
        `,
        errors: [{
          message: 'Use `expect(result).toBeSuccess()` instead of `expect(R.isFailure(result)).toBe(false)`.',
          line: 3,
          column: 0,
        }],
      },

      // expect(...).not.toBe(false)
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          expect(Result.isSuccess(result)).not.toBe(false);
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          expect(result).toBeSuccess();
        `,
        errors: [{
          message: 'Use `expect(result).toBeSuccess()` instead of `expect(Result.isSuccess(result)).not.toBe(false)`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          expect(R.isSuccess(result)).not.toBe(false);
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          expect(result).toBeSuccess();
        `,
        errors: [{
          message: 'Use `expect(result).toBeSuccess()` instead of `expect(R.isSuccess(result)).not.toBe(false)`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          expect(Result.isFailure(result)).not.toBe(false);
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          expect(result).toBeFailure();
        `,
        errors: [{
          message: 'Use `expect(result).toBeFailure()` instead of `expect(Result.isFailure(result)).not.toBe(false)`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          expect(R.isFailure(result)).not.toBe(false);
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          expect(result).toBeFailure();
        `,
        errors: [{
          message: 'Use `expect(result).toBeFailure()` instead of `expect(R.isFailure(result)).not.toBe(false)`.',
          line: 3,
          column: 0,
        }],
      },

      // expect(...).toBeTruthy()
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          expect(Result.isSuccess(result)).toBeTruthy();
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          expect(result).toBeSuccess();
        `,
        errors: [{
          message: 'Use `expect(result).toBeSuccess()` instead of `expect(Result.isSuccess(result)).toBeTruthy()`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          expect(R.isSuccess(result)).toBeTruthy();
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          expect(result).toBeSuccess();
        `,
        errors: [{
          message: 'Use `expect(result).toBeSuccess()` instead of `expect(R.isSuccess(result)).toBeTruthy()`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          expect(Result.isFailure(result)).toBeTruthy();
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          expect(result).toBeFailure();
        `,
        errors: [{
          message: 'Use `expect(result).toBeFailure()` instead of `expect(Result.isFailure(result)).toBeTruthy()`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          expect(R.isFailure(result)).toBeTruthy();
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          expect(result).toBeFailure();
        `,
        errors: [{
          message: 'Use `expect(result).toBeFailure()` instead of `expect(R.isFailure(result)).toBeTruthy()`.',
          line: 3,
          column: 0,
        }],
      },

      // expect(...).not.toBeTruthy()
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          expect(Result.isSuccess(result)).not.toBeTruthy();
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          expect(result).toBeFailure();
        `,
        errors: [{
          message: 'Use `expect(result).toBeFailure()` instead of `expect(Result.isSuccess(result)).not.toBeTruthy()`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          expect(R.isSuccess(result)).not.toBeTruthy();
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          expect(result).toBeFailure();
        `,
        errors: [{
          message: 'Use `expect(result).toBeFailure()` instead of `expect(R.isSuccess(result)).not.toBeTruthy()`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          expect(Result.isFailure(result)).not.toBeTruthy();
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          expect(result).toBeSuccess();
        `,
        errors: [{
          message: 'Use `expect(result).toBeSuccess()` instead of `expect(Result.isFailure(result)).not.toBeTruthy()`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          expect(R.isFailure(result)).not.toBeTruthy();
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          expect(result).toBeSuccess();
        `,
        errors: [{
          message: 'Use `expect(result).toBeSuccess()` instead of `expect(R.isFailure(result)).not.toBeTruthy()`.',
          line: 3,
          column: 0,
        }],
      },

      // expect(...).toBeFalsy()
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          expect(Result.isSuccess(result)).toBeFalsy();
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          expect(result).toBeFailure();
        `,
        errors: [{
          message: 'Use `expect(result).toBeFailure()` instead of `expect(Result.isSuccess(result)).toBeFalsy()`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          expect(R.isSuccess(result)).toBeFalsy();
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          expect(result).toBeFailure();
        `,
        errors: [{
          message: 'Use `expect(result).toBeFailure()` instead of `expect(R.isSuccess(result)).toBeFalsy()`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          expect(Result.isFailure(result)).toBeFalsy();
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          expect(result).toBeSuccess();
        `,
        errors: [{
          message: 'Use `expect(result).toBeSuccess()` instead of `expect(Result.isFailure(result)).toBeFalsy()`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          expect(R.isFailure(result)).toBeFalsy();
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          expect(result).toBeSuccess();
        `,
        errors: [{
          message: 'Use `expect(result).toBeSuccess()` instead of `expect(R.isFailure(result)).toBeFalsy()`.',
          line: 3,
          column: 0,
        }],
      },

      // expect(...).not.toBeFalsy()
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          expect(Result.isSuccess(result)).not.toBeFalsy();
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          expect(result).toBeSuccess();
        `,
        errors: [{
          message: 'Use `expect(result).toBeSuccess()` instead of `expect(Result.isSuccess(result)).not.toBeFalsy()`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          expect(R.isSuccess(result)).not.toBeFalsy();
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          expect(result).toBeSuccess();
        `,
        errors: [{
          message: 'Use `expect(result).toBeSuccess()` instead of `expect(R.isSuccess(result)).not.toBeFalsy()`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          expect(Result.isFailure(result)).not.toBeFalsy();
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          expect(result).toBeFailure();
        `,
        errors: [{
          message: 'Use `expect(result).toBeFailure()` instead of `expect(Result.isFailure(result)).not.toBeFalsy()`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          expect(R.isFailure(result)).not.toBeFalsy();
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          expect(result).toBeFailure();
        `,
        errors: [{
          message: 'Use `expect(result).toBeFailure()` instead of `expect(R.isFailure(result)).not.toBeFalsy()`.',
          line: 3,
          column: 0,
        }],
      },

      // assert(...)
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          assert(Result.isSuccess(result));
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          expect(result).toBeSuccess((value) => {});
        `,
        errors: [{
          message: 'Use `expect(result).toBeSuccess()` instead of `assert(Result.isSuccess(result))`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          assert(R.isSuccess(result));
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          expect(result).toBeSuccess((value) => {});
        `,
        errors: [{
          message: 'Use `expect(result).toBeSuccess()` instead of `assert(R.isSuccess(result))`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          assert(Result.isFailure(result));
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          expect(result).toBeFailure((error) => {});
        `,
        errors: [{
          message: 'Use `expect(result).toBeFailure()` instead of `assert(Result.isFailure(result))`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          assert(R.isFailure(result));
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          expect(result).toBeFailure((error) => {});
        `,
        errors: [{
          message: 'Use `expect(result).toBeFailure()` instead of `assert(R.isFailure(result))`.',
          line: 3,
          column: 0,
        }],
      },

      // Result.unwrap / Result.unwrapError
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.unwrap(result);
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          expect(result).toBeSuccess((value) => {});
        `,
        errors: [{
          message: 'Use `expect(result).toBeSuccess((value) => {})` instead of `Result.unwrap(result)`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          R.unwrap(result);
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          expect(result).toBeSuccess((value) => {});
        `,
        errors: [{
          message: 'Use `expect(result).toBeSuccess((value) => {})` instead of `R.unwrap(result)`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.unwrapError(result);
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          expect(result).toBeFailure((error) => {});
        `,
        errors: [{
          message: 'Use `expect(result).toBeFailure((error) => {})` instead of `Result.unwrapError(result)`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          R.unwrapError(result);
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          expect(result).toBeFailure((error) => {});
        `,
        errors: [{
          message: 'Use `expect(result).toBeFailure((error) => {})` instead of `R.unwrapError(result)`.',
          line: 3,
          column: 0,
        }],
      },
    ],
  },
);
