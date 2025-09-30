import { Result } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';

import { cache } from './cache';
import { makeTimeout } from './make-timeout';
import { retry } from './retry';

export class FetchHttpError extends ErrorFactory({
  name: 'FetchHttpError',
  message: ({ status }) => `Fetch request failed with status ${status}`,
  fields: ErrorFactory.fields<{ status: number }>(),
}) {}

export class FetchNetworkError extends ErrorFactory({
  name: 'FetchNetworkError',
  message: 'Fetch request failed due to a network error',
}) {}

export class FetchTimeoutError extends ErrorFactory({
  name: 'FetchTimeoutError',
  message: 'Fetch request timed out',
}) {}

export class FetchJsonParseError extends ErrorFactory({
  name: 'FetchJsonParseError',
  message: 'Failed to parse JSON response',
}) {}

export type FetchError = (
  | FetchHttpError
  | FetchNetworkError
  | FetchTimeoutError
  | FetchJsonParseError
);

export const fetch = Result.pipe(
  (url: string): Result.ResultAsync<unknown, FetchError> => {
    return Result.pipe(
      Promise.race([
        Result.pipe(
          makeTimeout(1000),
          Result.mapError((error) => new FetchTimeoutError({ cause: error })),
        ),
        Result.try({
          immediate: true,
          try: async () => globalThis.fetch(url),
          catch: (error) => new FetchNetworkError({ cause: error }),
        }),
      ]),
      Result.andThen((response) => {
        if (response.ok) return Result.succeed(response);
        return Result.fail(new FetchHttpError({ status: response.status }));
      }),
      Result.andThen((response) => {
        return Result.try({
          immediate: true,
          try: async () => await response.json() as unknown,
          catch: (error) => new FetchJsonParseError({ cause: error }),
        });
      }),
    );
  },
  retry(2),
  cache(16),
);
