import type { ToBeFailure, ToBeSuccess } from './matchers';

export * as resultMatchers from './matchers';

export interface ResultMatchers<R, T> {
  toBeFailure: ToBeFailure<R, T>;
  toBeSuccess: ToBeSuccess<R, T>;
}
