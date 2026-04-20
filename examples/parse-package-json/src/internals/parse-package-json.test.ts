import { describe, expect, it } from 'vitest';

import { parsePackageJson, ParsePackageJsonError } from './parse-package-json';

describe('parsePackageJson', () => {
  describe('when the JSON is valid', () => {
    describe('when the matches the schema', () => {
      const data = JSON.stringify({ name: 'example', version: '1.0.0' });

      it('should parse the JSON', () => {
        const result = parsePackageJson(data);

        expect(result).toBeSuccess((value) => {
          expect(value).toEqual({ name: 'example', version: '1.0.0' });
        });
      });
    });

    describe('when the mismatches the schema', () => {
      const data = JSON.stringify({ invalid: true });

      it('should return a ParsePackageJsonError', () => {
        const result = parsePackageJson(data);

        expect(result).toBeFailure((error) => {
          expect(error).toBeInstanceOf(ParsePackageJsonError);
        });
      });
    });
  });

  describe('when the JSON is invalid', () => {
    const data = '{ invalid json }';

    it('should return a ParsePackageJsonError', () => {
      const result = parsePackageJson(data);

      expect(result).toBeFailure((error) => {
        expect(error).toBeInstanceOf(ParsePackageJsonError);
      });
    });
  });
});
