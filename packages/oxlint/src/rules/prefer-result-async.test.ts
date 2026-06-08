import dedent from 'dedent';

import { ruleTester } from '../tester';
import { preferResultAsync } from './prefer-result-async';

ruleTester.run(
  'prefer-result-async',
  preferResultAsync,
  {
    valid: [
      // These cases are valid because they already use the ResultAsync type from byethrow, so the rule should not report any issues for them.
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultAsync<string, Error>;
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultAsync<string, Error>;
        `,
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          let Test: Result.ResultAsync<string, Error>;
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          let Test: R.ResultAsync<string, Error>;
        `,
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          function Test(test: Result.ResultAsync<string, Error>) {}
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          function Test(test: R.ResultAsync<string, Error>) {}
        `,
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          function Test(): Result.ResultAsync<string, Error> {}
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          function Test(): R.ResultAsync<string, Error> {}
        `,
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          const Test = (test: Result.ResultAsync<string, Error>) => {};
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          const Test = (test: R.ResultAsync<string, Error>) => {};
        `,
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          const Test = (): Result.ResultAsync<string, Error> => {};
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          const Test = (): R.ResultAsync<string, Error> => {};
        `,
      },

      // These cases are valid because they do not use the Promise type, so the rule should not apply to them.
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Array<Result.Result<string, Error>>;
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = Array<R.Result<string, Error>>;
        `,
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          let Test: Array<Result.Result<string, Error>>;
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          let Test: Array<R.Result<string, Error>>;
        `,
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          function Test(test: Array<Result.Result<string, Error>>) {}
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          function Test(test: Array<R.Result<string, Error>>) {}
        `,
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          function Test(): Array<Result.Result<string, Error>> {}
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          function Test(): Array<R.Result<string, Error>> {}
        `,
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          const Test = (test: Array<Result.Result<string, Error>>) => {};
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          const Test = (test: Array<R.Result<string, Error>>) => {};
        `,
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          const Test = (): Array<Result.Result<string, Error>> => {};
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          const Test = (): Array<R.Result<string, Error>> => {};
        `,
      },
      {
        code: dedent`
          type Test = Promise<T>;
        `,
      },
      {
        code: dedent`
          let Test: Promise<T>;
        `,
      },
      {
        code: dedent`
          function Test(test: Promise<T>) {}
        `,
      },
      {
        code: dedent`
          function Test(): Promise<void> {}
        `,
      },
      {
        code: dedent`
          const Test = (test: Promise<T>) => {};
        `,
      },
      {
        code: dedent`
          const Test = (): Promise<void> => {};
        `,
      },

      // These cases are valid because they do not use the Result type from byethrow, so the rule should not apply to them.
      {
        code: dedent`
          type Test = Promise<Result<string, Error>>;
        `,
      },
      {
        code: dedent`
          import { Result } from 'other-package';

          type Test = Promise<Result.Result<string, Error>>;
        `,
      },
      {
        code: dedent`
          let Test: Promise<Result<string, Error>>;
        `,
      },
      {
        code: dedent`
          import { Result } from 'other-package';

          let Test: Promise<Result.Result<string, Error>>;
        `,
      },
      {
        code: dedent`
          function Test(test: Promise<Result<string, Error>>) {}
        `,
      },
      {
        code: dedent`
          import { Result } from 'other-package';

          function Test(test: Promise<Result.Result<string, Error>>) {}
        `,
      },
      {
        code: dedent`
          function Test(): Promise<Result<string, Error>> {}
        `,
      },
      {
        code: dedent`
          import { Result } from 'other-package';

          function Test(): Promise<Result.Result<string, Error>> {}
        `,
      },
      {
        code: dedent`
          const Test = (test: Promise<Result<string, Error>>) => {};
        `,
      },
      {
        code: dedent`
          import { Result } from 'other-package';

          const Test = (test: Promise<Result.Result<string, Error>>) => {};
        `,
      },
      {
        code: dedent`
          const Test = (): Promise<Result<string, Error>> => {};
        `,
      },
      {
        code: dedent`
          import { Result } from 'other-package';

          const Test = (): Promise<Result.Result<string, Error>> => {};
        `,
      },
    ],
    invalid: [
      // type alias
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Promise<Result.Result<string, Error>>;
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.ResultAsync<string, Error>;
        `,
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 3,
          column: 12,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = Promise<R.Result<string, Error>>;
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.ResultAsync<string, Error>;
        `,
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 3,
          column: 12,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Array<Promise<Result.Result<string, Error>>>;
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Array<Result.ResultAsync<string, Error>>;
        `,
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 3,
          column: 18,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = Array<Promise<R.Result<string, Error>>>;
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          type Test = Array<R.ResultAsync<string, Error>>;
        `,
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 3,
          column: 18,
        }],
      },

      // variable declaration
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          let Test: Promise<Result.Result<string, Error>>;
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          let Test: Result.ResultAsync<string, Error>;
        `,
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 3,
          column: 10,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          let Test: Promise<R.Result<string, Error>>;
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          let Test: R.ResultAsync<string, Error>;
        `,
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 3,
          column: 10,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          let Test: Array<Promise<Result.Result<string, Error>>>;
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          let Test: Array<Result.ResultAsync<string, Error>>;
        `,
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 3,
          column: 16,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          let Test: Array<Promise<R.Result<string, Error>>>;
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          let Test: Array<R.ResultAsync<string, Error>>;
        `,
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 3,
          column: 16,
        }],
      },

      // function parameter
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          function Test(test: Promise<Result.Result<string, Error>>) {}
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          function Test(test: Result.ResultAsync<string, Error>) {}
        `,
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 3,
          column: 20,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          function Test(test: Promise<R.Result<string, Error>>) {}
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          function Test(test: R.ResultAsync<string, Error>) {}
        `,
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 3,
          column: 20,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          function Test(test: Array<Promise<Result.Result<string, Error>>>) {}
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          function Test(test: Array<Result.ResultAsync<string, Error>>) {}
        `,
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 3,
          column: 26,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          function Test(test: Array<Promise<R.Result<string, Error>>>) {}
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          function Test(test: Array<R.ResultAsync<string, Error>>) {}
        `,
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 3,
          column: 26,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          const Test = (test: Promise<Result.Result<string, Error>>) => {};
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          const Test = (test: Result.ResultAsync<string, Error>) => {};
        `,
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 3,
          column: 20,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          const Test = (test: Promise<R.Result<string, Error>>) => {};
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          const Test = (test: R.ResultAsync<string, Error>) => {};
        `,
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 3,
          column: 20,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          const Test = (test: Array<Promise<Result.Result<string, Error>>>) => {};
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          const Test = (test: Array<Result.ResultAsync<string, Error>>) => {};
        `,
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 3,
          column: 26,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          const Test = (test: Array<Promise<R.Result<string, Error>>>) => {};
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          const Test = (test: Array<R.ResultAsync<string, Error>>) => {};
        `,
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 3,
          column: 26,
        }],
      },

      // function return type
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          function Test(): Promise<Result.Result<string, Error>> {}
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          function Test(): Result.ResultAsync<string, Error> {}
        `,
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 3,
          column: 17,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          function Test(): Promise<R.Result<string, Error>> {}
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          function Test(): R.ResultAsync<string, Error> {}
        `,
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 3,
          column: 17,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          function Test(): Array<Promise<Result.Result<string, Error>>> {}
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          function Test(): Array<Result.ResultAsync<string, Error>> {}
        `,
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 3,
          column: 23,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          function Test(): Array<Promise<R.Result<string, Error>>> {}
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          function Test(): Array<R.ResultAsync<string, Error>> {}
        `,
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 3,
          column: 23,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          const Test = (): Promise<Result.Result<string, Error>> => {};
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          const Test = (): Result.ResultAsync<string, Error> => {};
        `,
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 3,
          column: 17,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          const Test = (): Promise<R.Result<string, Error>> => {};
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          const Test = (): R.ResultAsync<string, Error> => {};
        `,
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 3,
          column: 17,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          const Test = (): Array<Promise<Result.Result<string, Error>>> => {};
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          const Test = (): Array<Result.ResultAsync<string, Error>> => {};
        `,
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 3,
          column: 23,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          const Test = (): Array<Promise<R.Result<string, Error>>> => {};
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          const Test = (): Array<R.ResultAsync<string, Error>> => {};
        `,
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 3,
          column: 23,
        }],
      },
    ],
  },
);
