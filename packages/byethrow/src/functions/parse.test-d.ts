import { describe, expectTypeOf, it } from 'vitest';

import { parse } from './parse';
import { pipe } from './pipe';

import type { Result } from '../result';
import type { StandardSchemaV1 } from '@standard-schema/spec';

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

describe('parse', () => {
  describe('when used without the pipe function', () => {
    it('should infer the correct types', () => {
      const result = parse(schema, 'hello');

      expectTypeOf(result).toEqualTypeOf<Result<string, ReadonlyArray<StandardSchemaV1.Issue>>>();
    });
  });

  describe('when used wit the pipe function', () => {
    it('should infer the correct types', () => {
      const result = pipe(
        'hello',
        parse(schema),
      );

      expectTypeOf(result).toEqualTypeOf<Result<string, ReadonlyArray<StandardSchemaV1.Issue>>>();
    });
  });
});
