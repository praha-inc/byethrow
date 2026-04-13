import type { ToBeFailure, ToBeSuccess } from './matchers';

export * as resultMatchers from './matchers';

export interface ResultMatchers<T> {
  toBeFailure: ToBeFailure<T>;
  toBeSuccess: ToBeSuccess<T>;
}
