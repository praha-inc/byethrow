import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { makeTimeout, TimeoutError } from './make-timeout.js';

describe('makeTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return a failed result with TimeoutError after specified milliseconds', async () => {
    const timeoutMs = 100;
    const timeout = makeTimeout(timeoutMs);

    vi.advanceTimersByTime(timeoutMs);
    const result = await timeout;

    expect(result).toBeFailure((error) => {
      expect(error).toBeInstanceOf(TimeoutError);
    });
  });

  it('should not resolve before the specified timeout', async () => {
    // Arrange
    const timeoutMs = 100;
    const timeout = makeTimeout(timeoutMs);

    vi.advanceTimersByTime(timeoutMs - 1);
    const raceResult = await Promise.race([
      timeout.then(() => 'resolved'),
      Promise.resolve('not-resolved'),
    ]);

    expect(raceResult).toBe('not-resolved');

    vi.advanceTimersByTime(1);
    const finalResult = await timeout;

    expect(finalResult).toBeFailure((error) => {
      expect(error).toBeInstanceOf(TimeoutError);
    });
  });
});
