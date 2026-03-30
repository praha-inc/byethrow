import dedent from 'dedent';

import { ruleTester } from '../tester';
import { noTryCatchInCallback } from './no-try-catch-in-callback';

ruleTester.run(
  'no-try-catch-in-callback',
  noTryCatchInCallback,
  {
    valid: [
      // No try-catch in callbacks (function expression)
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.map(function(value) {
            return value + 1;
          });
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          R.map(function(value) {
            return value + 1;
          });
        `,
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.bind('name', function(user) {
            return Result.succeed(user.name);
          });
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          R.bind('name', function(user) {
            return R.succeed(user.name);
          });
        `,
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.fn({
            try: function(value) {
              return value + 1;
            },
            catch: () => new Error(),
          });
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          R.fn({
            try: function (value) {
              return value + 1;
            },
            catch: () => new Error(),
          });
        `,
      },

      // No try-catch in callbacks (arrow function)
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.map((value) => {
            return value + 1;
          });
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          R.map((value) => {
            return value + 1;
          });
        `,
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.bind('name', (user) => {
            return Result.succeed(user.name);
          });
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          R.bind('name', (user) => {
            return R.succeed(user.name);
          });
        `,
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.fn({
            try: (value) => value + 1,
            catch: () => new Error(),
          });
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          R.fn({
            try: (value) => value + 1,
            catch: () => new Error(),
          });
        `,
      },

      // try-finally (function expression)
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.map(function(value) {
            try {
              return value + 1;
            } finally {}
          });
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          R.map(function(value) {
            try {
              return value + 1;
            } finally {}
          });
        `,
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.bind('name', function(user) {
            try {
              return Result.succeed(user.name);
            } finally {}
          });
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          R.bind('name', function(user) {
            try {
              return Result.succeed(user.name);
            } finally {}
          });
        `,
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.fn({
            try: function(value) {
              try {
                return value + 1;
              } finally {}
            },
            catch: () => new Error(),
          });
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          R.fn({
            try: function (value) {
              try {
                return value + 1;
              } finally {}
            },
            catch: () => new Error(),
          });
        `,
      },

      // try-finally (arrow function)
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.map((value) => {
            try {
              return value + 1;
            } finally {}
          });
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          R.map((value) => {
            try {
              return value + 1;
            } finally {}
          });
        `,
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.bind('name', (user) => {
            try {
              return Result.succeed(user.name);
            } finally {}
          });
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          R.bind('name', (user) => {
            try {
              return Result.succeed(user.name);
            } finally {}
          });
        `,
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.fn({
            try: (value) => {
              try {
                return value + 1;
              } finally {}
            },
            catch: () => new Error(),
          });
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          R.fn({
            try: (value) => {
              try {
                return value + 1;
              } finally {}
            },
            catch: () => new Error(),
          });
        `,
      },

      // Non-byethrow namespaces
      {
        code: dedent`
          map((value) => {
            try {
             return value;
            } catch (error) {}
          });
        `,
      },
      {
        code: dedent`
          bind('name', (value) => {
            try {
             return value;
            } catch (error) {}
          });
        `,
      },
      {
        code: dedent`
          fn({
            try: (value) => {
              try {
                return value + 1;
              } finally {}
            },
            catch: () => new Error(),
          });
        `,
      },
      {
        code: dedent`
          import { Result } from 'other-package';

          Result.map((value) => {
            try {
             return value;
            } catch (error) {}
          });
        `,
      },
      {
        code: dedent`
          import { Result } from 'other-package';

          Result.bind('name', (value) => {
            try {
             return value;
            } catch (error) {}
          });      
        `,
      },
      {
        code: dedent`
          import { Result } from 'other-package';

          Result.fn({
            try: (value) => {
              try {
                return value + 1;
              } finally {}
            },
            catch: () => new Error(),
          });    
        `,
      },

      // try-catch outside the callback
      {
        code: dedent`
          try {} catch (error) {}
        `,
      },
      {
        code: dedent`
          function test(value) {
            try {
             return value;
            } catch (error) {}
          }
        `,
      },
      {
        code: dedent`
          const test = (value) => {
            try {
             return value;
            } catch (error) {}
          };
        `,
      },
    ],
    invalid: [
      // map
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.map(function(value) {
            try {
              return value;
            } catch (error) {}
          });
        `,
        errors: [{
          message: 'Avoid try-catch inside byethrow callbacks. Use Result.fn() to wrap throwing code instead.',
          line: 4,
          column: 2,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          R.map(function(value) {
            try {
              return value;
            } catch (error) {}
          });
        `,
        errors: [{
          message: 'Avoid try-catch inside byethrow callbacks. Use Result.fn() to wrap throwing code instead.',
          line: 4,
          column: 2,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.map((value) => {
            try {
              return value;
            } catch (error) {}
          });
        `,
        errors: [{
          message: 'Avoid try-catch inside byethrow callbacks. Use Result.fn() to wrap throwing code instead.',
          line: 4,
          column: 2,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          R.map((value) => {
            try {
              return value;
            } catch (error) {}
          });
        `,
        errors: [{
          message: 'Avoid try-catch inside byethrow callbacks. Use Result.fn() to wrap throwing code instead.',
          line: 4,
          column: 2,
        }],
      },

      // bind (callback at index 1)
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.bind('name', function(user) {
            try {
              return Result.succeed(user.name);
            } catch (error) {}
          });
        `,
        errors: [{
          message: 'Avoid try-catch inside byethrow callbacks. Use Result.fn() to wrap throwing code instead.',
          line: 4,
          column: 2,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          R.bind('name', function(user) {
            try {
              return R.succeed(user.name);
            } catch (error) {}
          });
        `,
        errors: [{
          message: 'Avoid try-catch inside byethrow callbacks. Use Result.fn() to wrap throwing code instead.',
          line: 4,
          column: 2,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.bind('name', (user) => {
            try {
              return Result.succeed(user.name);
            } catch (error) {}
          });
        `,
        errors: [{
          message: 'Avoid try-catch inside byethrow callbacks. Use Result.fn() to wrap throwing code instead.',
          line: 4,
          column: 2,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          R.bind('name', (user) => {
            try {
              return R.succeed(user.name);
            } catch (error) {}
          });
        `,
        errors: [{
          message: 'Avoid try-catch inside byethrow callbacks. Use Result.fn() to wrap throwing code instead.',
          line: 4,
          column: 2,
        }],
      },

      // fn (callback at object property)
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.fn({
            try: function(value) {
              try {
                return value + 1;
              } catch (error) {}
            },
            catch: () => new Error(),
          });
        `,
        errors: [{
          message: 'Avoid try-catch inside byethrow callbacks. Use Result.fn() to wrap throwing code instead.',
          line: 5,
          column: 4,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          R.fn({
            try: function(value) {
              try {
                return value + 1;
              } catch (error) {}
            },
            catch: () => new Error(),
          });
        `,
        errors: [{
          message: 'Avoid try-catch inside byethrow callbacks. Use Result.fn() to wrap throwing code instead.',
          line: 5,
          column: 4,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.fn({
            try: (value) => {
              try {
                return value + 1;
              } catch (error) {}
            },
            catch: () => new Error(),
          });
        `,
        errors: [{
          message: 'Avoid try-catch inside byethrow callbacks. Use Result.fn() to wrap throwing code instead.',
          line: 5,
          column: 4,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          R.fn({
            try: (value) => {
              try {
                return value + 1;
              } catch (error) {}
            },
            catch: () => new Error(),
          });
        `,
        errors: [{
          message: 'Avoid try-catch inside byethrow callbacks. Use Result.fn() to wrap throwing code instead.',
          line: 5,
          column: 4,
        }],
      },

      // Multiple try-catch in same callback
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.map((value) => {
            try {
              return value;
            } catch (error) {}
            try {
              return x * 2;
            } catch (error) {}
          });
        `,
        errors: [
          {
            message: 'Avoid try-catch inside byethrow callbacks. Use Result.fn() to wrap throwing code instead.',
            line: 4,
            column: 2,
          },
          {
            message: 'Avoid try-catch inside byethrow callbacks. Use Result.fn() to wrap throwing code instead.',
            line: 7,
            column: 2,
          },
        ],
      },

      // try-catch inside if-statement inside callback
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.map((value) => {
            if (x < 0) {
              try {
                return x;
              } catch (error) {}
            }
          });
        `,
        errors: [{
          message: 'Avoid try-catch inside byethrow callbacks. Use Result.fn() to wrap throwing code instead.',
          line: 5,
          column: 4,
        }],
      },

      // try-catch inside switch-case inside callback
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.map((value) => {
            switch (x) {
              case 1:
                try {
                  return x;
                } catch (error) {}
                break;
              default:
                break;
            }
          });
        `,
        errors: [{
          message: 'Avoid try-catch inside byethrow callbacks. Use Result.fn() to wrap throwing code instead.',
          line: 6,
          column: 6,
        }],
      },

      // try-catch inside for loop inside callback
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.map((value) => {
            for (const i of x) {
              try {
                return i;
              } catch (error) {}
            }
          });
        `,
        errors: [{
          message: 'Avoid try-catch inside byethrow callbacks. Use Result.fn() to wrap throwing code instead.',
          line: 5,
          column: 4,
        }],
      },

      // try-catch inside for while loop inside callback
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.map((value) => {
            while (x < 10) {
              try {
                return x;
              } catch (error) {}
            }
          });
        `,
        errors: [{
          message: 'Avoid try-catch inside byethrow callbacks. Use Result.fn() to wrap throwing code instead.',
          line: 5,
          column: 4,
        }],
      },
    ],
  },
);
