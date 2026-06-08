import dedent from 'dedent';

import { ruleTester } from '../tester';
import { noAmbiguousSuccessType } from './no-ambiguous-success-type';

ruleTester.run(
  'no-ambiguous-success-type',
  noAmbiguousSuccessType,
  {
    valid: [
      // Concrete success types are allowed
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.Result<string, TypeError>;
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.Result<string, TypeError>;
        `,
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultAsync<string, TypeError>;
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultAsync<string, TypeError>;
        `,
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultMaybeAsync<string, TypeError>;
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultMaybeAsync<string, TypeError>;
        `,
      },

      // Non-byethrow Result types should not trigger
      {
        code: dedent`
          import { Result } from 'other-package';

          type Test = Result.Result<unknown, TypeError>;
        `,
      },
      {
        code: dedent`
          type Test = Result.Result<unknown, TypeError>;
        `,
      },
    ],
    invalid: [
      // Result<T, E>
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.Result<unknown, TypeError>;
        `,
        errors: [{
          message: 'Specify a concrete success type instead of `unknown` in `Result.Result<unknown, TypeError>`.',
          line: 3,
          column: 26,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.Result<unknown, TypeError>;
        `,
        errors: [{
          message: 'Specify a concrete success type instead of `unknown` in `R.Result<unknown, TypeError>`.',
          line: 3,
          column: 21,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.Result<any, TypeError>;
        `,
        errors: [{
          message: 'Specify a concrete success type instead of `any` in `Result.Result<any, TypeError>`.',
          line: 3,
          column: 26,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.Result<any, TypeError>;
        `,
        errors: [{
          message: 'Specify a concrete success type instead of `any` in `R.Result<any, TypeError>`.',
          line: 3,
          column: 21,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.Result<object, TypeError>;
        `,
        errors: [{
          message: 'Specify a concrete success type instead of `object` in `Result.Result<object, TypeError>`.',
          line: 3,
          column: 26,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.Result<object, TypeError>;
        `,
        errors: [{
          message: 'Specify a concrete success type instead of `object` in `R.Result<object, TypeError>`.',
          line: 3,
          column: 21,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.Result<{}, TypeError>;
        `,
        errors: [{
          message: 'Specify a concrete success type instead of `{}` in `Result.Result<{}, TypeError>`.',
          line: 3,
          column: 26,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.Result<{}, TypeError>;
        `,
        errors: [{
          message: 'Specify a concrete success type instead of `{}` in `R.Result<{}, TypeError>`.',
          line: 3,
          column: 21,
        }],
      },

      // ResultAsync<T, E>
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultAsync<unknown, TypeError>;
        `,
        errors: [{
          message: 'Specify a concrete success type instead of `unknown` in `Result.ResultAsync<unknown, TypeError>`.',
          line: 3,
          column: 31,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultAsync<unknown, TypeError>;
        `,
        errors: [{
          message: 'Specify a concrete success type instead of `unknown` in `R.ResultAsync<unknown, TypeError>`.',
          line: 3,
          column: 26,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultAsync<any, TypeError>;
        `,
        errors: [{
          message: 'Specify a concrete success type instead of `any` in `Result.ResultAsync<any, TypeError>`.',
          line: 3,
          column: 31,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultAsync<any, TypeError>;
        `,
        errors: [{
          message: 'Specify a concrete success type instead of `any` in `R.ResultAsync<any, TypeError>`.',
          line: 3,
          column: 26,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultAsync<object, TypeError>;
        `,
        errors: [{
          message: 'Specify a concrete success type instead of `object` in `Result.ResultAsync<object, TypeError>`.',
          line: 3,
          column: 31,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultAsync<object, TypeError>;
        `,
        errors: [{
          message: 'Specify a concrete success type instead of `object` in `R.ResultAsync<object, TypeError>`.',
          line: 3,
          column: 26,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultAsync<{}, TypeError>;
        `,
        errors: [{
          message: 'Specify a concrete success type instead of `{}` in `Result.ResultAsync<{}, TypeError>`.',
          line: 3,
          column: 31,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultAsync<{}, TypeError>;
        `,
        errors: [{
          message: 'Specify a concrete success type instead of `{}` in `R.ResultAsync<{}, TypeError>`.',
          line: 3,
          column: 26,
        }],
      },

      // ResultMaybeAsync<T, E>
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultMaybeAsync<unknown, TypeError>;
        `,
        errors: [{
          message: 'Specify a concrete success type instead of `unknown` in `Result.ResultMaybeAsync<unknown, TypeError>`.',
          line: 3,
          column: 36,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultMaybeAsync<unknown, TypeError>;
        `,
        errors: [{
          message: 'Specify a concrete success type instead of `unknown` in `R.ResultMaybeAsync<unknown, TypeError>`.',
          line: 3,
          column: 31,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultMaybeAsync<any, TypeError>;
        `,
        errors: [{
          message: 'Specify a concrete success type instead of `any` in `Result.ResultMaybeAsync<any, TypeError>`.',
          line: 3,
          column: 36,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultMaybeAsync<any, TypeError>;
        `,
        errors: [{
          message: 'Specify a concrete success type instead of `any` in `R.ResultMaybeAsync<any, TypeError>`.',
          line: 3,
          column: 31,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultMaybeAsync<object, TypeError>;
        `,
        errors: [{
          message: 'Specify a concrete success type instead of `object` in `Result.ResultMaybeAsync<object, TypeError>`.',
          line: 3,
          column: 36,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultMaybeAsync<object, TypeError>;
        `,
        errors: [{
          message: 'Specify a concrete success type instead of `object` in `R.ResultMaybeAsync<object, TypeError>`.',
          line: 3,
          column: 31,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultMaybeAsync<{}, TypeError>;
        `,
        errors: [{
          message: 'Specify a concrete success type instead of `{}` in `Result.ResultMaybeAsync<{}, TypeError>`.',
          line: 3,
          column: 36,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultMaybeAsync<{}, TypeError>;
        `,
        errors: [{
          message: 'Specify a concrete success type instead of `{}` in `R.ResultMaybeAsync<{}, TypeError>`.',
          line: 3,
          column: 31,
        }],
      },

      // variable declaration
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          let test: R.Result<unknown, TypeError>;
        `,
        errors: [{
          message: 'Specify a concrete success type instead of `unknown` in `R.Result<unknown, TypeError>`.',
          line: 3,
          column: 19,
        }],
      },

      // function parameter
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          function test(arg: R.Result<unknown, TypeError>) {}
        `,
        errors: [{
          message: 'Specify a concrete success type instead of `unknown` in `R.Result<unknown, TypeError>`.',
          line: 3,
          column: 28,
        }],
      },

      // function return type
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          function test(): R.Result<unknown, TypeError> {}
        `,
        errors: [{
          message: 'Specify a concrete success type instead of `unknown` in `R.Result<unknown, TypeError>`.',
          line: 3,
          column: 26,
        }],
      },

      // arrow function return type
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          const test = (): R.Result<unknown, TypeError> => {};
        `,
        errors: [{
          message: 'Specify a concrete success type instead of `unknown` in `R.Result<unknown, TypeError>`.',
          line: 3,
          column: 26,
        }],
      },
    ],
  },
);
