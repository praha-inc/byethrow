import dedent from 'dedent';

import { ruleTester } from '../tester';
import { noThrowInCallback } from './no-throw-in-callback';

ruleTester.run(
  'no-throw-in-callback',
  noThrowInCallback,
  {
    valid: [
      // No throw in callbacks (function expression)
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

      // No throw in callbacks (arrow function)
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

      // Non-byethrow namespaces
      {
        code: dedent`
          map((value) => {
            throw new Error('oops');
          });
        `,
      },
      {
        code: dedent`
          bind('name', (value) => {
            throw new Error('oops');
          });
        `,
      },
      {
        code: dedent`
          fn({
            try: (value) => {
              throw new Error('oops');
            },
            catch: () => new Error(),
          });
        `,
      },
      {
        code: dedent`
          import { Result } from 'other-package';

          Result.map((value) => {
            throw new Error('oops');
          });
        `,
      },
      {
        code: dedent`
          import { Result } from 'other-package';

          Result.bind('name', (value) => {
            throw new Error('oops');
          });
        `,
      },
      {
        code: dedent`
          import { Result } from 'other-package';

          Result.fn({
            try: (value) => {
              throw new Error('oops');
            },
            catch: () => new Error(),
          });
        `,
      },

      // throw outside the callback
      {
        code: dedent`
          throw new Error('oops');
        `,
      },
      {
        code: dedent`
          function test(value) {
            throw new Error('oops');
          }
        `,
      },
      {
        code: dedent`
          const test = (value) => {
            throw new Error('oops');
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
            throw new Error('oops');
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 4,
          column: 2,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          R.map(function(value) {
            throw new Error('oops');
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 4,
          column: 2,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.map((value) => {
            throw new Error('oops');
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 4,
          column: 2,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          R.map((value) => {
            throw new Error('oops');
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 4,
          column: 2,
        }],
      },

      // bind (callback at index 1)
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.bind('name', function(user) {
            throw new Error('oops');
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 4,
          column: 2,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';
  
          R.bind('name', function(user) {
            throw new Error('oops');
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 4,
          column: 2,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.bind('name', (user) => {
            throw new Error('oops');
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 4,
          column: 2,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          R.bind('name', (user) => {
            throw new Error('oops');
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
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
              throw new Error('oops');
            },
            catch: () => new Error(),
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 5,
          column: 4,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          R.fn({
            try: function(value) {
              throw new Error('oops');
            },
            catch: () => new Error(),
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 5,
          column: 4,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.fn({
            try: (value) => {
              throw new Error('oops');
            },
            catch: () => new Error(),
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 5,
          column: 4,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          R.fn({
            try: (value) => {
              throw new Error('oops');
            },
            catch: () => new Error(),
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 5,
          column: 4,
        }],
      },

      // Multiple throws in same callback
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.map((value) => {
            throw new Error('first');
            throw new Error('second');
          });
        `,
        errors: [
          {
            message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
            line: 4,
            column: 2,
          },
          {
            message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
            line: 5,
            column: 2,
          },
        ],
      },

      // throw inside if-statement inside callback
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.map((value) => {
            if (value < 0) {
              throw new Error('negative');
            }
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 5,
          column: 4,
        }],
      },

      // throw inside switch-case inside callback
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

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
          line: 6,
          column: 6,
        }],
      },

      // throw inside for loop inside callback
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.map((value) => {
            for (const i of value) {
              throw new Error('loop');
            }
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 5,
          column: 4,
        }],
      },

      // throw inside while loop inside callback
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.map((value) => {
            while (value < 10) {
              throw new Error('loop');
            }
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 5,
          column: 4,
        }],
      },

      // throw inside try block inside callback
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.map((value) => {
            try {
              throw new Error('oops');
            } catch (error) {}
          });
        `,
        errors: [{
          message: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
          line: 5,
          column: 4,
        }],
      },
    ],
  },
);
