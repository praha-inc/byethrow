import dedent from 'dedent';

import { ruleTester } from '../tester';
import { preferResultMaybeAsync } from './prefer-result-maybe-async';

ruleTester.run(
  'prefer-result-maybe-async',
  preferResultMaybeAsync,
  {
    valid: [
      // These cases are valid because they already use ResultMaybeAsync from byethrow.
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultMaybeAsync<string, Error>;
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultMaybeAsync<string, Error>;
        `,
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          let test: Result.ResultMaybeAsync<string, Error>;
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          let test: R.ResultMaybeAsync<string, Error>;
        `,
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          function test(arg: Result.ResultMaybeAsync<string, Error>) {}
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          function test(arg: R.ResultMaybeAsync<string, Error>) {}
        `,
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          function test(): Result.ResultMaybeAsync<string, Error> {}
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          function test(): R.ResultMaybeAsync<string, Error> {}
        `,
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          const test = (arg: Result.ResultMaybeAsync<string, Error>) => {};
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          const test = (arg: R.ResultMaybeAsync<string, Error>) => {};
        `,
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          const test = (): Result.ResultMaybeAsync<string, Error> => {};
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          const test = (): R.ResultMaybeAsync<string, Error> => {};
        `,
      },

      // These cases are valid because the types are not from the byethrow namespace.
      {
        code: dedent`
          type Test = Result<string, Error> | ResultAsync<string, Error>;
        `,
      },
      {
        code: dedent`
          import { Result } from 'other-package';

          type Test = Result.Result<string, Error> | Result.ResultAsync<string, Error>;
        `,
      },

      // These cases are valid because the type parameters differ.
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.Result<string, Error> | Result.ResultAsync<number, Error>;
        `,
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.Result<string, Error1> | Result.ResultAsync<string, Error2>;
        `,
      },

      // These cases are valid because the union does not contain both Result and ResultAsync.
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.Result<string, Error> | string;
        `,
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultAsync<string, Error> | string;
        `,
      },
    ],
    invalid: [
      // type alias
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.Result<string, Error> | Result.ResultAsync<string, Error>;
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultMaybeAsync<string, Error>;
        `,
        errors: [{
          message: 'Use `ResultMaybeAsync<T, E>` instead of `Result<T, E> | ResultAsync<T, E>`.',
          line: 3,
          column: 12,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.Result<string, Error> | R.ResultAsync<string, Error>;
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultMaybeAsync<string, Error>;
        `,
        errors: [{
          message: 'Use `ResultMaybeAsync<T, E>` instead of `Result<T, E> | ResultAsync<T, E>`.',
          line: 3,
          column: 12,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultAsync<string, Error> | Result.Result<string, Error>;
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultMaybeAsync<string, Error>;
        `,
        errors: [{
          message: 'Use `ResultMaybeAsync<T, E>` instead of `Result<T, E> | ResultAsync<T, E>`.',
          line: 3,
          column: 12,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = string | Result.Result<string, Error> | Result.ResultAsync<string, Error>;
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          type Test = string | Result.ResultMaybeAsync<string, Error>;
        `,
        errors: [{
          message: 'Use `ResultMaybeAsync<T, E>` instead of `Result<T, E> | ResultAsync<T, E>`.',
          line: 3,
          column: 12,
        }],
      },

      // variable declaration
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          let test: Result.Result<string, Error> | Result.ResultAsync<string, Error>;
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          let test: Result.ResultMaybeAsync<string, Error>;
        `,
        errors: [{
          message: 'Use `ResultMaybeAsync<T, E>` instead of `Result<T, E> | ResultAsync<T, E>`.',
          line: 3,
          column: 10,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          let test: R.Result<string, Error> | R.ResultAsync<string, Error>;
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          let test: R.ResultMaybeAsync<string, Error>;
        `,
        errors: [{
          message: 'Use `ResultMaybeAsync<T, E>` instead of `Result<T, E> | ResultAsync<T, E>`.',
          line: 3,
          column: 10,
        }],
      },

      // function parameter
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          function test(arg: Result.Result<string, Error> | Result.ResultAsync<string, Error>) {}
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          function test(arg: Result.ResultMaybeAsync<string, Error>) {}
        `,
        errors: [{
          message: 'Use `ResultMaybeAsync<T, E>` instead of `Result<T, E> | ResultAsync<T, E>`.',
          line: 3,
          column: 19,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          function test(arg: R.Result<string, Error> | R.ResultAsync<string, Error>) {}
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          function test(arg: R.ResultMaybeAsync<string, Error>) {}
        `,
        errors: [{
          message: 'Use `ResultMaybeAsync<T, E>` instead of `Result<T, E> | ResultAsync<T, E>`.',
          line: 3,
          column: 19,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          const test = (arg: Result.Result<string, Error> | Result.ResultAsync<string, Error>) => {};
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          const test = (arg: Result.ResultMaybeAsync<string, Error>) => {};
        `,
        errors: [{
          message: 'Use `ResultMaybeAsync<T, E>` instead of `Result<T, E> | ResultAsync<T, E>`.',
          line: 3,
          column: 19,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          const test = (arg: R.Result<string, Error> | R.ResultAsync<string, Error>) => {};
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          const test = (arg: R.ResultMaybeAsync<string, Error>) => {};
        `,
        errors: [{
          message: 'Use `ResultMaybeAsync<T, E>` instead of `Result<T, E> | ResultAsync<T, E>`.',
          line: 3,
          column: 19,
        }],
      },

      // function return type
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          function test(): Result.Result<string, Error> | Result.ResultAsync<string, Error> {}
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          function test(): Result.ResultMaybeAsync<string, Error> {}
        `,
        errors: [{
          message: 'Use `ResultMaybeAsync<T, E>` instead of `Result<T, E> | ResultAsync<T, E>`.',
          line: 3,
          column: 17,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          function test(): R.Result<string, Error> | R.ResultAsync<string, Error> {}
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          function test(): R.ResultMaybeAsync<string, Error> {}
        `,
        errors: [{
          message: 'Use `ResultMaybeAsync<T, E>` instead of `Result<T, E> | ResultAsync<T, E>`.',
          line: 3,
          column: 17,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          const test = (): Result.Result<string, Error> | Result.ResultAsync<string, Error> => {};
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          const test = (): Result.ResultMaybeAsync<string, Error> => {};
        `,
        errors: [{
          message: 'Use `ResultMaybeAsync<T, E>` instead of `Result<T, E> | ResultAsync<T, E>`.',
          line: 3,
          column: 17,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          const test = (): R.Result<string, Error> | R.ResultAsync<string, Error> => {};
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          const test = (): R.ResultMaybeAsync<string, Error> => {};
        `,
        errors: [{
          message: 'Use `ResultMaybeAsync<T, E>` instead of `Result<T, E> | ResultAsync<T, E>`.',
          line: 3,
          column: 17,
        }],
      },
    ],
  },
);
