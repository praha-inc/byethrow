import { ruleTester } from '../tester';
import { preferResultAsync } from './prefer-result-async';

ruleTester.run(
  'prefer-result-async',
  preferResultAsync,
  {
    valid: [
      // These cases are valid because they already use the ResultAsync type from byethrow, so the rule should not report any issues for them.
      'type Test = Result.ResultAsync<string, Error>;',
      'type Test = R.ResultAsync<string, Error>;',
      'let Test: Result.ResultAsync<string, Error>;',
      'let Test: R.ResultAsync<string, Error>;',
      'function Test(test: Result.ResultAsync<string, Error>) {}',
      'function Test(test: R.ResultAsync<string, Error>) {}',
      'function Test(): Result.ResultAsync<string, Error> {}',
      'function Test(): R.ResultAsync<string, Error> {}',
      'const Test = (test: Result.ResultAsync<string, Error>) => {};',
      'const Test = (test: R.ResultAsync<string, Error>) => {};',
      'const Test = (): Result.ResultAsync<string, Error> => {};',
      'const Test = (): R.ResultAsync<string, Error> => {};',

      // These cases are valid because they do not use the Promise type, so the rule should not apply to them.
      'type Test = Array<Result.Result<string, Error>>;',
      'type Test = Array<R.Result<string, Error>>;',
      'let Test: Array<Result.Result<string, Error>>;',
      'let Test: Array<R.Result<string, Error>>;',
      'function Test(test: Array<Result.Result<string, Error>>) {}',
      'function Test(test: Array<R.Result<string, Error>>) {}',
      'function Test(): Array<Result.Result<string, Error>> {}',
      'function Test(): Array<R.Result<string, Error>> {}',
      'const Test = (test: Array<Result.Result<string, Error>>) => {};',
      'const Test = (test: Array<R.Result<string, Error>>) => {};',
      'const Test = (): Array<Result.Result<string, Error>> => {};',
      'const Test = (): Array<R.Result<string, Error>> => {};',
      'type Test = Promise<T>;',
      'let Test: Promise<T>;',
      'function Test(test: Promise<T>) {}',
      'function Test(): Promise<void> {}',
      'const Test = (test: Promise<T>) => {};',
      'const Test = (): Promise<void> => {};',

      // These cases are valid because they do not use the Result type from byethrow, so the rule should not apply to them.
      'type Test = Promise<Result<string, Error>>;',
      'type Test = Promise<Z.Result<string, Error>>;',
      'let Test: Promise<Result<string, Error>>;',
      'let Test: Promise<Z.Result<string, Error>>;',
      'function Test(test: Promise<Result<string, Error>>) {}',
      'function Test(test: Promise<Z.Result<string, Error>>) {}',
      'function Test(): Promise<Result<string, Error>> {}',
      'function Test(): Promise<Z.Result<string, Error>> {}',
      'const Test = (test: Promise<Result<string, Error>>) => {};',
      'const Test = (test: Promise<Z.Result<string, Error>>) => {};',
      'const Test = (): Promise<Result<string, Error>> => {};',
      'const Test = (): Promise<Z.Result<string, Error>> => {};',
    ],
    invalid: [
      // type alias
      {
        code: 'type Test = Promise<Result.Result<string, Error>>;',
        output: `type Test = Result.ResultAsync<string, Error>;`,
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 1,
          column: 12,
        }],
      },
      {
        code: 'type Test = Promise<R.Result<string, Error>>;',
        output: `type Test = R.ResultAsync<string, Error>;`,
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 1,
          column: 12,
        }],
      },
      {
        code: 'type Test = Array<Promise<Result.Result<string, Error>>>;',
        output: 'type Test = Array<Result.ResultAsync<string, Error>>;',
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 1,
          column: 18,
        }],
      },
      {
        code: 'type Test = Array<Promise<R.Result<string, Error>>>;',
        output: 'type Test = Array<R.ResultAsync<string, Error>>;',
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 1,
          column: 18,
        }],
      },

      // variable declaration
      {
        code: 'let Test: Promise<Result.Result<string, Error>>;',
        output: `let Test: Result.ResultAsync<string, Error>;`,
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 1,
          column: 10,
        }],
      },
      {
        code: 'let Test: Promise<R.Result<string, Error>>;',
        output: `let Test: R.ResultAsync<string, Error>;`,
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 1,
          column: 10,
        }],
      },
      {
        code: 'let Test: Array<Promise<Result.Result<string, Error>>>;',
        output: 'let Test: Array<Result.ResultAsync<string, Error>>;',
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 1,
          column: 16,
        }],
      },
      {
        code: 'let Test: Array<Promise<R.Result<string, Error>>>;',
        output: 'let Test: Array<R.ResultAsync<string, Error>>;',
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 1,
          column: 16,
        }],
      },

      // function parameter
      {
        code: 'function Test(test: Promise<Result.Result<string, Error>>) {}',
        output: 'function Test(test: Result.ResultAsync<string, Error>) {}',
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 1,
          column: 20,
        }],
      },
      {
        code: 'function Test(test: Promise<R.Result<string, Error>>) {}',
        output: `function Test(test: R.ResultAsync<string, Error>) {}`,
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 1,
          column: 20,
        }],
      },
      {
        code: 'function Test(test: Array<Promise<Result.Result<string, Error>>>) {}',
        output: 'function Test(test: Array<Result.ResultAsync<string, Error>>) {}',
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 1,
          column: 26,
        }],
      },
      {
        code: 'function Test(test: Array<Promise<R.Result<string, Error>>>) {}',
        output: 'function Test(test: Array<R.ResultAsync<string, Error>>) {}',
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 1,
          column: 26,
        }],
      },
      {
        code: 'const Test = (test: Promise<Result.Result<string, Error>>) => {};',
        output: 'const Test = (test: Result.ResultAsync<string, Error>) => {};',
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 1,
          column: 20,
        }],
      },
      {
        code: 'const Test = (test: Promise<R.Result<string, Error>>) => {};',
        output: `const Test = (test: R.ResultAsync<string, Error>) => {};`,
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 1,
          column: 20,
        }],
      },
      {
        code: 'const Test = (test: Array<Promise<Result.Result<string, Error>>>) => {};',
        output: 'const Test = (test: Array<Result.ResultAsync<string, Error>>) => {};',
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 1,
          column: 26,
        }],
      },
      {
        code: 'const Test = (test: Array<Promise<R.Result<string, Error>>>) => {};',
        output: 'const Test = (test: Array<R.ResultAsync<string, Error>>) => {};',
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 1,
          column: 26,
        }],
      },

      // function return type
      {
        code: 'function Test(): Promise<Result.Result<string, Error>> {}',
        output: 'function Test(): Result.ResultAsync<string, Error> {}',
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 1,
          column: 17,
        }],
      },
      {
        code: 'function Test(): Promise<R.Result<string, Error>> {}',
        output: 'function Test(): R.ResultAsync<string, Error> {}',
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 1,
          column: 17,
        }],
      },
      {
        code: 'function Test(): Array<Promise<Result.Result<string, Error>>> {}',
        output: 'function Test(): Array<Result.ResultAsync<string, Error>> {}',
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 1,
          column: 23,
        }],
      },
      {
        code: 'function Test(): Array<Promise<R.Result<string, Error>>> {}',
        output: 'function Test(): Array<R.ResultAsync<string, Error>> {}',
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 1,
          column: 23,
        }],
      },
      {
        code: 'const Test = (): Promise<Result.Result<string, Error>> => {};',
        output: 'const Test = (): Result.ResultAsync<string, Error> => {};',
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 1,
          column: 17,
        }],
      },
      {
        code: 'const Test = (): Promise<R.Result<string, Error>> => {};',
        output: 'const Test = (): R.ResultAsync<string, Error> => {};',
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 1,
          column: 17,
        }],
      },
      {
        code: 'const Test = (): Array<Promise<Result.Result<string, Error>>> => {};',
        output: 'const Test = (): Array<Result.ResultAsync<string, Error>> => {};',
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 1,
          column: 23,
        }],
      },
      {
        code: 'const Test = (): Array<Promise<R.Result<string, Error>>> => {};',
        output: 'const Test = (): Array<R.ResultAsync<string, Error>> => {};',
        errors: [{
          message: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
          line: 1,
          column: 23,
        }],
      },
    ],
  },
);
