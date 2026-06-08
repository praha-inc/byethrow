import dedent from 'dedent';

import { ruleTester } from '../tester';
import { noAmbiguousErrorType } from './no-ambiguous-error-type';

ruleTester.run(
  'no-ambiguous-error-type',
  noAmbiguousErrorType,
  {
    valid: [
      // Concrete error types are allowed
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

          type Test = Result.Result<string, unknown>;
        `,
      },
      {
        code: dedent`
          type Test = Result.Result<string, unknown>;
        `,
      },
    ],
    invalid: [
      // Result<T, E>
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.Result<string, unknown>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `unknown` in `Result.Result<string, unknown>`.',
          line: 3,
          column: 34,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.Result<string, unknown>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `unknown` in `R.Result<string, unknown>`.',
          line: 3,
          column: 29,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.Result<string, any>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `any` in `Result.Result<string, any>`.',
          line: 3,
          column: 34,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.Result<string, any>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `any` in `R.Result<string, any>`.',
          line: 3,
          column: 29,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.Result<string, string>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `string` in `Result.Result<string, string>`.',
          line: 3,
          column: 34,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.Result<string, string>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `string` in `R.Result<string, string>`.',
          line: 3,
          column: 29,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.Result<string, number>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `number` in `Result.Result<string, number>`.',
          line: 3,
          column: 34,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.Result<string, number>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `number` in `R.Result<string, number>`.',
          line: 3,
          column: 29,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.Result<string, boolean>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `boolean` in `Result.Result<string, boolean>`.',
          line: 3,
          column: 34,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.Result<string, boolean>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `boolean` in `R.Result<string, boolean>`.',
          line: 3,
          column: 29,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.Result<string, bigint>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `bigint` in `Result.Result<string, bigint>`.',
          line: 3,
          column: 34,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.Result<string, bigint>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `bigint` in `R.Result<string, bigint>`.',
          line: 3,
          column: 29,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.Result<string, symbol>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `symbol` in `Result.Result<string, symbol>`.',
          line: 3,
          column: 34,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.Result<string, symbol>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `symbol` in `R.Result<string, symbol>`.',
          line: 3,
          column: 29,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.Result<string, object>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `object` in `Result.Result<string, object>`.',
          line: 3,
          column: 34,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.Result<string, object>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `object` in `R.Result<string, object>`.',
          line: 3,
          column: 29,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.Result<string, {}>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `{}` in `Result.Result<string, {}>`.',
          line: 3,
          column: 34,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.Result<string, {}>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `{}` in `R.Result<string, {}>`.',
          line: 3,
          column: 29,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.Result<string, null>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `null` in `Result.Result<string, null>`.',
          line: 3,
          column: 34,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.Result<string, null>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `null` in `R.Result<string, null>`.',
          line: 3,
          column: 29,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.Result<string, undefined>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `undefined` in `Result.Result<string, undefined>`.',
          line: 3,
          column: 34,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.Result<string, undefined>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `undefined` in `R.Result<string, undefined>`.',
          line: 3,
          column: 29,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.Result<string, Error>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `Error` in `Result.Result<string, Error>`.',
          line: 3,
          column: 34,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.Result<string, Error>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `Error` in `R.Result<string, Error>`.',
          line: 3,
          column: 29,
        }],
      },

      // ResultAsync<T, E>
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultAsync<string, unknown>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `unknown` in `Result.ResultAsync<string, unknown>`.',
          line: 3,
          column: 39,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultAsync<string, unknown>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `unknown` in `R.ResultAsync<string, unknown>`.',
          line: 3,
          column: 34,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultAsync<string, any>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `any` in `Result.ResultAsync<string, any>`.',
          line: 3,
          column: 39,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultAsync<string, any>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `any` in `R.ResultAsync<string, any>`.',
          line: 3,
          column: 34,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultAsync<string, string>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `string` in `Result.ResultAsync<string, string>`.',
          line: 3,
          column: 39,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultAsync<string, string>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `string` in `R.ResultAsync<string, string>`.',
          line: 3,
          column: 34,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultAsync<string, number>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `number` in `Result.ResultAsync<string, number>`.',
          line: 3,
          column: 39,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultAsync<string, number>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `number` in `R.ResultAsync<string, number>`.',
          line: 3,
          column: 34,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultAsync<string, boolean>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `boolean` in `Result.ResultAsync<string, boolean>`.',
          line: 3,
          column: 39,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultAsync<string, boolean>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `boolean` in `R.ResultAsync<string, boolean>`.',
          line: 3,
          column: 34,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultAsync<string, bigint>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `bigint` in `Result.ResultAsync<string, bigint>`.',
          line: 3,
          column: 39,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultAsync<string, bigint>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `bigint` in `R.ResultAsync<string, bigint>`.',
          line: 3,
          column: 34,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultAsync<string, symbol>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `symbol` in `Result.ResultAsync<string, symbol>`.',
          line: 3,
          column: 39,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultAsync<string, symbol>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `symbol` in `R.ResultAsync<string, symbol>`.',
          line: 3,
          column: 34,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultAsync<string, object>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `object` in `Result.ResultAsync<string, object>`.',
          line: 3,
          column: 39,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultAsync<string, object>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `object` in `R.ResultAsync<string, object>`.',
          line: 3,
          column: 34,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultAsync<string, {}>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `{}` in `Result.ResultAsync<string, {}>`.',
          line: 3,
          column: 39,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultAsync<string, {}>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `{}` in `R.ResultAsync<string, {}>`.',
          line: 3,
          column: 34,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultAsync<string, null>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `null` in `Result.ResultAsync<string, null>`.',
          line: 3,
          column: 39,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultAsync<string, null>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `null` in `R.ResultAsync<string, null>`.',
          line: 3,
          column: 34,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultAsync<string, undefined>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `undefined` in `Result.ResultAsync<string, undefined>`.',
          line: 3,
          column: 39,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultAsync<string, undefined>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `undefined` in `R.ResultAsync<string, undefined>`.',
          line: 3,
          column: 34,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultAsync<string, Error>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `Error` in `Result.ResultAsync<string, Error>`.',
          line: 3,
          column: 39,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultAsync<string, Error>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `Error` in `R.ResultAsync<string, Error>`.',
          line: 3,
          column: 34,
        }],
      },

      // ResultMaybeAsync<T, E>
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultMaybeAsync<string, unknown>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `unknown` in `Result.ResultMaybeAsync<string, unknown>`.',
          line: 3,
          column: 44,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultMaybeAsync<string, unknown>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `unknown` in `R.ResultMaybeAsync<string, unknown>`.',
          line: 3,
          column: 39,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultMaybeAsync<string, any>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `any` in `Result.ResultMaybeAsync<string, any>`.',
          line: 3,
          column: 44,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultMaybeAsync<string, any>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `any` in `R.ResultMaybeAsync<string, any>`.',
          line: 3,
          column: 39,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultMaybeAsync<string, string>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `string` in `Result.ResultMaybeAsync<string, string>`.',
          line: 3,
          column: 44,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultMaybeAsync<string, string>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `string` in `R.ResultMaybeAsync<string, string>`.',
          line: 3,
          column: 39,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultMaybeAsync<string, number>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `number` in `Result.ResultMaybeAsync<string, number>`.',
          line: 3,
          column: 44,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultMaybeAsync<string, number>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `number` in `R.ResultMaybeAsync<string, number>`.',
          line: 3,
          column: 39,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultMaybeAsync<string, boolean>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `boolean` in `Result.ResultMaybeAsync<string, boolean>`.',
          line: 3,
          column: 44,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultMaybeAsync<string, boolean>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `boolean` in `R.ResultMaybeAsync<string, boolean>`.',
          line: 3,
          column: 39,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultMaybeAsync<string, bigint>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `bigint` in `Result.ResultMaybeAsync<string, bigint>`.',
          line: 3,
          column: 44,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultMaybeAsync<string, bigint>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `bigint` in `R.ResultMaybeAsync<string, bigint>`.',
          line: 3,
          column: 39,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultMaybeAsync<string, symbol>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `symbol` in `Result.ResultMaybeAsync<string, symbol>`.',
          line: 3,
          column: 44,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultMaybeAsync<string, symbol>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `symbol` in `R.ResultMaybeAsync<string, symbol>`.',
          line: 3,
          column: 39,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultMaybeAsync<string, object>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `object` in `Result.ResultMaybeAsync<string, object>`.',
          line: 3,
          column: 44,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultMaybeAsync<string, object>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `object` in `R.ResultMaybeAsync<string, object>`.',
          line: 3,
          column: 39,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultMaybeAsync<string, {}>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `{}` in `Result.ResultMaybeAsync<string, {}>`.',
          line: 3,
          column: 44,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultMaybeAsync<string, {}>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `{}` in `R.ResultMaybeAsync<string, {}>`.',
          line: 3,
          column: 39,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultMaybeAsync<string, null>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `null` in `Result.ResultMaybeAsync<string, null>`.',
          line: 3,
          column: 44,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultMaybeAsync<string, null>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `null` in `R.ResultMaybeAsync<string, null>`.',
          line: 3,
          column: 39,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultMaybeAsync<string, undefined>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `undefined` in `Result.ResultMaybeAsync<string, undefined>`.',
          line: 3,
          column: 44,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultMaybeAsync<string, undefined>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `undefined` in `R.ResultMaybeAsync<string, undefined>`.',
          line: 3,
          column: 39,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultMaybeAsync<string, Error>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `Error` in `Result.ResultMaybeAsync<string, Error>`.',
          line: 3,
          column: 44,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultMaybeAsync<string, Error>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `Error` in `R.ResultMaybeAsync<string, Error>`.',
          line: 3,
          column: 39,
        }],
      },

      // variable declaration
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          let test: R.Result<string, unknown>;
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `unknown` in `R.Result<string, unknown>`.',
          line: 3,
          column: 27,
        }],
      },

      // function parameter
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          function test(arg: R.Result<string, unknown>) {}
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `unknown` in `R.Result<string, unknown>`.',
          line: 3,
          column: 36,
        }],
      },

      // function return type
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          function test(): R.Result<string, unknown> {}
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `unknown` in `R.Result<string, unknown>`.',
          line: 3,
          column: 34,
        }],
      },

      // arrow function return type
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          const test = (): R.Result<string, unknown> => {};
        `,
        errors: [{
          message: 'Specify a concrete error type instead of `unknown` in `R.Result<string, unknown>`.',
          line: 3,
          column: 34,
        }],
      },
    ],
  },
);
