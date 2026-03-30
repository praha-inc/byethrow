import dedent from 'dedent';

import { ruleTester } from '../tester';
import { noThrowInCallback } from './no-throw-in-callback';

ruleTester.run(
  'no-throw-in-callback',
  noThrowInCallback,
  {
    valid: [
      // No throw in callbacks (function expression)
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

      // No throw in callbacks (arrow function)
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

      // Non-byethrow namespaces
      dedent`
        someFunction((value) => {
          throw new Error('oops');
        });
      `,
      dedent`
        foo.map((value) => {
          throw new Error('oops');
        });
      `,

      // throw outside the callback
      'throw new Error("oops");',
      dedent`
        function test(value) {
          throw new Error('oops');
        }
      `,
      dedent`
        const test = (value) => {
          throw new Error('oops');
        };
      `,
    ],
    invalid: [
      // map
      {
        code: dedent`
          Result.map(function(value) {
            throw new Error('oops');
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 2,
          column: 2,
        }],
      },
      {
        code: dedent`
          R.map(function(value) {
            throw new Error('oops');
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 2,
          column: 2,
        }],
      },
      {
        code: dedent`
          Result.map((value) => {
            throw new Error('oops');
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 2,
          column: 2,
        }],
      },
      {
        code: dedent`
          R.map((value) => {
            throw new Error('oops');
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 2,
          column: 2,
        }],
      },

      // bind (callback at index 1)
      {
        code: dedent`
          Result.bind("name", function(user) {
            throw new Error('oops');
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 2,
          column: 2,
        }],
      },
      {
        code: dedent`
          R.bind("name", function(user) {
            throw new Error('oops');
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 2,
          column: 2,
        }],
      },
      {
        code: dedent`
          Result.bind("name", (user) => {
            throw new Error('oops');
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 2,
          column: 2,
        }],
      },
      {
        code: dedent`
          R.bind("name", (user) => {
            throw new Error('oops');
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 2,
          column: 2,
        }],
      },

      // fn (callback at object property)
      {
        code: dedent`
          Result.fn({
            try: function(value) {
              throw new Error('oops');
            },
            catch: () => new Error(),
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 3,
          column: 4,
        }],
      },
      {
        code: dedent`
          R.fn({
            try: function(value) {
              throw new Error('oops');
            },
            catch: () => new Error(),
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 3,
          column: 4,
        }],
      },
      {
        code: dedent`
          Result.fn({
            try: (value) => {
              throw new Error('oops');
            },
            catch: () => new Error(),
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 3,
          column: 4,
        }],
      },
      {
        code: dedent`
          R.fn({
            try: (value) => {
              throw new Error('oops');
            },
            catch: () => new Error(),
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 3,
          column: 4,
        }],
      },

      // Multiple throws in same callback
      {
        code: dedent`
          Result.map((value) => {
            throw new Error('first');
            throw new Error('second');
          });
        `,
        errors: [
          {
            message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
            line: 2,
            column: 2,
          },
          {
            message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
            line: 3,
            column: 2,
          },
        ],
      },

      // throw inside if-statement inside callback
      {
        code: dedent`
          Result.map((value) => {
            if (value < 0) {
              throw new Error('negative');
            }
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 3,
          column: 4,
        }],
      },

      // throw inside switch-case inside callback
      {
        code: dedent`
          Result.map((value) => {
            switch (value) {
              case 1:
                throw new Error('one');
              default:
                break;
            }
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 4,
          column: 6,
        }],
      },

      // throw inside for loop inside callback
      {
        code: dedent`
          Result.map((value) => {
            for (const i of value) {
              throw new Error('loop');
            }
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 3,
          column: 4,
        }],
      },

      // throw inside while loop inside callback
      {
        code: dedent`
          Result.map((value) => {
            while (value < 10) {
              throw new Error('loop');
            }
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 3,
          column: 4,
        }],
      },

      // throw inside try block inside callback
      {
        code: dedent`
          Result.map((value) => {
            try {
              throw new Error('oops');
            } catch (error) {}
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 3,
          column: 4,
        }],
      },
    ],
  },
);
