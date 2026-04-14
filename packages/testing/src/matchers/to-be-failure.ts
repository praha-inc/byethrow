import { R } from '@praha/byethrow';

import type { MatcherReturnType, MatcherState } from '../types/matcher';

export type ToBeFailure<T> = (callback?: (error: [R.InferFailure<T>] extends [never] ? unknown : R.InferFailure<T>) => void) => void;

// oxlint-disable-next-line func-style
export function toBeFailure(this: MatcherState, received: unknown, callback?: (error: unknown) => void): MatcherReturnType {
  const pass = R.isResult(received) && R.isFailure(received);
  if (!this.isNot && pass && callback) {
    callback(received.error);
  }

  return {
    pass: this.isNot || pass,
    message: () => {
      return this.isNot
        ? 'Do not use .not with .toBeFailure, please use .toBeSuccess instead.'
        : ''
          + this.utils.matcherHint('.toBeFailure', 'received', '')
          + '\n\n'
          + 'Expected value to be a failure result, but received:\n'
          + `  ${this.utils.printReceived(received)}`;
    },
  };
}
