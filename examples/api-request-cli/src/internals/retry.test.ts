import { Result } from '@praha/byethrow';
import { describe, expect, it, vi } from 'vitest';

import { retry } from './retry.js';

type Fn = () => Result.ResultAsync<string, string>;

describe('retry', () => {
  it('should return success result immediately when function succeeds on first attempt', async () => {
    const mockFn = vi.fn<Fn>().mockResolvedValue(Result.succeed('success'));
    const retryFn = retry(2)(mockFn);

    const result = await Result.unwrap(retryFn());

    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should retry when function fails and eventually succeed', async () => {
    const mockFn = vi.fn<Fn>()
      .mockResolvedValueOnce(Result.fail('failure'))
      .mockResolvedValueOnce(Result.fail('failure'))
      .mockResolvedValueOnce(Result.succeed('success'));
    const retryFn = retry(2)(mockFn);

    const result = await Result.unwrap(retryFn());

    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  it('should stop retrying after maximum attempts and return last failure', async () => {
    const mockFn = vi.fn<Fn>().mockResolvedValue(Result.fail('failure'));
    const retryFn = retry(2)(mockFn);

    const result = await Result.unwrapError(retryFn());

    expect(result).toBe('failure');
    expect(mockFn).toHaveBeenCalledTimes(3);
  });
});
