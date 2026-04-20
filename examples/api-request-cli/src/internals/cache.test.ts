import { Result } from '@praha/byethrow';
import { describe, it, expect, vi } from 'vitest';

import { cache } from './cache';

type Fn = (value: string) => Result.ResultAsync<string, string>;

describe('cache', () => {
  it('should cache successful results', async () => {
    const mockFn = vi.fn<Fn>()
      .mockResolvedValueOnce(Result.succeed('result1'))
      .mockResolvedValueOnce(Result.succeed('result2'));
    const cachedFn = cache(2)(mockFn);

    const result1 = await cachedFn('arg');
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(result1).toBeSuccess((value) => {
      expect(value).toBe('result1');
    });

    const result2 = await cachedFn('arg');
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(result2).toBeSuccess((value) => {
      expect(value).toBe('result1');
    });
  });

  it('should not cache failed results', async () => {
    const mockFn = vi.fn<Fn>()
      .mockResolvedValueOnce(Result.fail('result1'))
      .mockResolvedValueOnce(Result.fail('result2'));
    const cachedFn = cache(2)(mockFn);

    const result1 = await cachedFn('arg');
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(result1).toBeFailure((error) => {
      expect(error).toBe('result1');
    });

    const result2 = await cachedFn('arg');
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(result2).toBeFailure((error) => {
      expect(error).toBe('result2');
    });
  });

  it('should cache results for different arguments separately', async () => {
    const mockFn = vi.fn<Fn>()
      .mockResolvedValueOnce(Result.succeed('result1'))
      .mockResolvedValueOnce(Result.succeed('result2'));
    const cachedFn = cache(2)(mockFn);

    const result1 = await cachedFn('arg1');
    const result2 = await cachedFn('arg2');

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(result1).toBeSuccess((value) => {
      expect(value).toBe('result1');
    });
    expect(result2).toBeSuccess((value) => {
      expect(value).toBe('result2');
    });

    const result1Cached = await cachedFn('arg1');
    const result2Cached = await cachedFn('arg2');

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(result1Cached).toBeSuccess((value) => {
      expect(value).toBe('result1');
    });
    expect(result2Cached).toBeSuccess((value) => {
      expect(value).toBe('result2');
    });
  });

  it('should evict oldest cache entry when size limit is reached', async () => {
    const mockFn = vi.fn<Fn>()
      .mockResolvedValueOnce(Result.succeed('result1'))
      .mockResolvedValueOnce(Result.succeed('result2'))
      .mockResolvedValueOnce(Result.succeed('result3'))
      .mockResolvedValueOnce(Result.succeed('result4'));
    const cachedFn = cache(2)(mockFn);

    await cachedFn('arg1');
    await cachedFn('arg2');
    await cachedFn('arg3');

    expect(mockFn).toHaveBeenCalledTimes(3);

    const result1 = await cachedFn('arg1');
    expect(mockFn).toHaveBeenCalledTimes(4);
    expect(result1).toBeSuccess((value) => {
      expect(value).toBe('result4');
    });

    const result3 = await cachedFn('arg3');
    expect(mockFn).toHaveBeenCalledTimes(4);
    expect(result3).toBeSuccess((value) => {
      expect(value).toBe('result3');
    });
  });
});
