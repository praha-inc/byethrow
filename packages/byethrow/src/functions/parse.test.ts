import { describe, expect, it } from 'vitest';

import { parse } from './parse';

import type { StandardSchemaV1 } from '@standard-schema/spec';

describe('parse', () => {
  describe('when schema is synchronous', () => {
    const schema: StandardSchemaV1<unknown, string> = {
      '~standard': {
        version: 1,
        vendor: 'test',
        validate: (value: unknown) => {
          if (typeof value === 'string') return { value };
          return { issues: [{ message: 'Value must be a string' }] };
        },
      },
    };

    it('should create a Success result when parsing is successful', () => {
      const result = parse(schema, 'hello');

      expect(result).toEqual({
        type: 'Success',
        value: 'hello',
      });
    });

    it('should create a Failure result when parsing fails', () => {
      const result = parse(schema, 123);

      expect(result).toEqual({
        type: 'Failure',
        error: [{ message: 'Value must be a string' }],
      });
    });
  });

  describe('when schema is asynchronous (Promise)', () => {
    const schema: StandardSchemaV1<unknown, string> = {
      '~standard': {
        version: 1,
        vendor: 'test',
        validate: (value: unknown) => {
          if (typeof value === 'string') return Promise.resolve({ value });
          return Promise.resolve({ issues: [{ message: 'Value must be a string' }] });
        },
      },
    };

    it('should throw an error', () => {
      expect(() => parse(schema, 'hello')).toThrow();
    });
  });
});
