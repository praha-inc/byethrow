import { R } from '@praha/byethrow';

import type { MatcherReturnType, MatcherState } from '../types/matcher';

export type ToBeSuccess<T> = (callback?: (value: [R.InferSuccess<T>] extends [never] ? unknown : R.InferSuccess<T>) => void) => void;

// oxlint-disable-next-line func-style
export function toBeSuccess(this: MatcherState, received: unknown, callback?: (value: unknown) => void): MatcherReturnType {
  const pass = R.isResult(received) && R.isSuccess(received);
  if (!this.isNot && pass && callback) {
    callback(received.value);
  }

  return {
    pass: this.isNot || pass,
    message: () => {
      return this.isNot
        ? 'Do not use .not with .toBeSuccess, please use .toBeFailure instead.'
        : ''
          + this.utils.matcherHint('.toBeSuccess', 'received', '')
          + '\n\n'
          + 'Expected value to be a success result, but received:\n'
          + `  ${this.utils.printReceived(received)}`;
    },
  };
}
