import dedent from 'dedent';

import { ruleTester } from '../tester';
import { noTryCatchInCallback } from './no-try-catch-in-callback';

ruleTester.run(
  'no-try-catch-in-callback',
  noTryCatchInCallback,
  {
    valid: [
      // No try-catch in callbacks (function expression)
      dedent`
        Result.map(function(value) {
          return value + 1;
        });
      `,
      dedent`
        R.map(function(value) {
          return value + 1;
        });
      `,
      dedent`
        Result.bind("name", function(user) {
          return Result.succeed(user.name);
        });
      `,
      dedent`
        R.bind("name", function(user) {
          return R.succeed(user.name);
        });
      `,
      dedent`
        Result.fn({
          try: function(value) {
            return value + 1;
          },
          catch: () => new Error(),
        });
      `,
      dedent`
        R.fn({
          try: function (value) {
            return value + 1;
          },
          catch: () => new Error(),
        });
      `,

      // No try-catch in callbacks (arrow function)
      dedent`
        Result.map((value) => {
          return value + 1;
        });
      `,
      dedent`
        R.map((value) => {
          return value + 1;
        });
      `,
      dedent`
        Result.bind("name", (user) => {
          return Result.succeed(user.name);
        });
      `,
      dedent`
        R.bind("name", (user) => {
          return R.succeed(user.name);
        });
      `,
      dedent`
        Result.fn({
          try: (value) => value + 1,
          catch: () => new Error(),
        });
      `,
      dedent`
        R.fn({
          try: (value) => value + 1,
          catch: () => new Error(),
        });
      `,

      // try-finally (function expression)
      dedent`
        Result.map(function(value) {
          try {
            return value + 1;
          } finally {}
        });
      `,
      dedent`
        R.map(function(value) {
          try {
            return value + 1;
          } finally {}
        });
      `,
      dedent`
        Result.bind("name", function(user) {
          try {
            return Result.succeed(user.name);
          } finally {}
        });
      `,
      dedent`
        R.bind("name", function(user) {
          try {
            return Result.succeed(user.name);
          } finally {}
        });
      `,
      dedent`
        Result.fn({
          try: function(value) {
            try {
              return value + 1;
            } finally {}
          },
          catch: () => new Error(),
        });
      `,
      dedent`
        R.fn({
          try: function (value) {
            try {
              return value + 1;
            } finally {}
          },
          catch: () => new Error(),
        });
      `,

      // try-finally (arrow function)
      dedent`
        Result.map((value) => {
          try {
            return value + 1;
          } finally {}
        });
      `,
      dedent`
        R.map((value) => {
          try {
            return value + 1;
          } finally {}
        });
      `,
      dedent`
        Result.bind("name", (user) => {
          try {
            return Result.succeed(user.name);
          } finally {}
        });
      `,
      dedent`
        R.bind("name", (user) => {
          try {
            return Result.succeed(user.name);
          } finally {}
        });
      `,
      dedent`
        Result.fn({
          try: (value) => {
            try {
              return value + 1;
            } finally {}
          },
          catch: () => new Error(),
        });
      `,
      dedent`
        R.fn({
          try: (value) => {
            try {
              return value + 1;
            } finally {}
          },
          catch: () => new Error(),
        });
      `,

      // Non-byethrow namespaces
      dedent`
        someFunction((value) => {
          try {
           return value;
          } catch (error) {}
        });
      `,
      dedent`
        foo.map((value) => {
          try {
           return value;
          } catch (error) {}
        });      
      `,

      // try-catch outside the callback
      'try {} catch (error) {}',
      dedent`
        function test(value) {
          try {
           return value;
          } catch (error) {}
        }
      `,
      dedent`
        const test = (value) => {
          try {
           return value;
          } catch (error) {}
        };
      `,
    ],
    invalid: [
      // map
      {
        code: dedent`
          Result.map(function(value) {
            try {
              return value;
            } catch (error) {}
          });
        `,
        errors: [{
          message: 'Avoid try-catch inside byethrow callbacks. Use Result.fn() to wrap throwing code instead.',
          line: 2,
          column: 2,
        }],
      },
      {
        code: dedent`
          R.map(function(value) {
            try {
              return value;
            } catch (error) {}
          });
        `,
        errors: [{
          message: 'Avoid try-catch inside byethrow callbacks. Use Result.fn() to wrap throwing code instead.',
          line: 2,
          column: 2,
        }],
      },
      {
        code: dedent`
          Result.map((value) => {
            try {
              return value;
            } catch (error) {}
          });
        `,
        errors: [{
          message: 'Avoid try-catch inside byethrow callbacks. Use Result.fn() to wrap throwing code instead.',
          line: 2,
          column: 2,
        }],
      },
      {
        code: dedent`
          R.map((value) => {
            try {
              return value;
            } catch (error) {}
          });
        `,
        errors: [{
          message: 'Avoid try-catch inside byethrow callbacks. Use Result.fn() to wrap throwing code instead.',
          line: 2,
          column: 2,
        }],
      },

      // bind (callback at index 1)
      {
        code: dedent`
          Result.bind("name", function(user) {
            try {
              return Result.succeed(user.name);
            } catch (error) {}
          });
        `,
        errors: [{
          message: 'Avoid try-catch inside byethrow callbacks. Use Result.fn() to wrap throwing code instead.',
          line: 2,
          column: 2,
        }],
      },
      {
        code: dedent`
          R.bind("name", function(user) {
            try {
              return R.succeed(user.name);
            } catch (error) {}
          });
        `,
        errors: [{
          message: 'Avoid try-catch inside byethrow callbacks. Use Result.fn() to wrap throwing code instead.',
          line: 2,
          column: 2,
        }],
      },
      {
        code: dedent`
          Result.bind("name", (user) => {
            try {
              return Result.succeed(user.name);
            } catch (error) {}
          });
        `,
        errors: [{
          message: 'Avoid try-catch inside byethrow callbacks. Use Result.fn() to wrap throwing code instead.',
          line: 2,
          column: 2,
        }],
      },
      {
        code: dedent`
          R.bind("name", (user) => {
            try {
              return R.succeed(user.name);
            } catch (error) {}
          });
        `,
        errors: [{
          message: 'Avoid try-catch inside byethrow callbacks. Use Result.fn() to wrap throwing code instead.',
          line: 2,
          column: 2,
        }],
      },

      // fn (callback at object property)
      {
        code: dedent`
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
          line: 3,
          column: 4,
        }],
      },
      {
        code: dedent`
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
          line: 3,
          column: 4,
        }],
      },
      {
        code: dedent`
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
          line: 3,
          column: 4,
        }],
      },
      {
        code: dedent`
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
          line: 3,
          column: 4,
        }],
      },

      // Multiple try-catch in same callback
      {
        code: dedent`
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
            line: 2,
            column: 2,
          },
          {
            message: 'Avoid try-catch inside byethrow callbacks. Use Result.fn() to wrap throwing code instead.',
            line: 5,
            column: 2,
          },
        ],
      },

      // try-catch inside if-statement inside callback
      {
        code: dedent`
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
          line: 3,
          column: 4,
        }],
      },

      // try-catch inside switch-case inside callback
      {
        code: dedent`
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
          line: 4,
          column: 6,
        }],
      },

      // try-catch inside for loop inside callback
      {
        code: dedent`
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
          line: 3,
          column: 4,
        }],
      },

      // try-catch inside for while loop inside callback
      {
        code: dedent`
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
          line: 3,
          column: 4,
        }],
      },
    ],
  },
);
