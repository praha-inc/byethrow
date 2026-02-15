import { describe, it, expectTypeOf } from 'vitest';

import { fn } from './fn';

import type { Result, ResultAsync } from '../result';

describe('try', () => {
  describe('when Result is synchronous', () => {
    describe('when catch handler is provided', () => {
      it('should return a Result with inferred success and error types', () => {
        const result = fn({
          try: (message: string) => message,
          catch: String,
        });

        expectTypeOf(result).toEqualTypeOf<(message: string) => Result<string, string>>();
      });
    });

    describe('when safe mode is enabled', () => {
      it('should return a Result with inferred success type and never as error type', () => {
        const result = fn({
          safe: true,
          try: (message: string) => message,
        });

        expectTypeOf(result).toEqualTypeOf<(message: string) => Result<string, never>>();
      });
    });
  });

  describe('when Result is asynchronous (Promise)', () => {
    describe('when catch handler is provided', () => {
      it('should return a ResultAsync with inferred success and error types', () => {
        const result = fn({
          // eslint-disable-next-line @typescript-eslint/require-await
          try: async (message: string) => message,
          catch: String,
        });

        expectTypeOf(result).toEqualTypeOf<(message: string) => ResultAsync<string, string>>();
      });
    });

    describe('when safe mode is enabled', () => {
      it('should return a ResultAsync with inferred success type and never as error type', () => {
        const result = fn({
          safe: true,
          // eslint-disable-next-line @typescript-eslint/require-await
          try: async (message: string) => message,
        });

        expectTypeOf(result).toEqualTypeOf<(message: string) => ResultAsync<string, never>>();
      });
    });
  });
});
