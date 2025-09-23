import { Result } from '@praha/byethrow';
import { describe, expect, it } from 'vitest';

import { parsePackageJson, ParsePackageJsonError } from './parse-package-json';

describe('parsePackageJson', () => {
  describe('when the JSON is valid', () => {
    describe('when the matches the schema', () => {
      const data = JSON.stringify({ name: 'example', version: '1.0.0' });

      it('should parse the JSON', () => {
        const result = Result.pipe(
          parsePackageJson(data),
          Result.unwrap(),
        );

        expect(result).toEqual({ name: 'example', version: '1.0.0' });
      });
    });

    describe('when the mismatches the schema', () => {
      const data = JSON.stringify({ invalid: true });

      it('should return a ParsePackageJsonError', () => {
        const result = Result.pipe(
          parsePackageJson(data),
          Result.unwrapError(),
        );

        expect(result).toBeInstanceOf(ParsePackageJsonError);
      });
    });
  });

  describe('when the JSON is invalid', () => {
    const data = '{ invalid json }';

    it('should return a ParsePackageJsonError', () => {
      const result = Result.pipe(
        parsePackageJson(data),
        Result.unwrapError(),
      );

      expect(result).toBeInstanceOf(ParsePackageJsonError);
    });
  });
});
