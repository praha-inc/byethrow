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

    const result1 = await Result.unwrap(cachedFn('arg'));
    expect(result1).toBe('result1');
    expect(mockFn).toHaveBeenCalledTimes(1);

    const result2 = await Result.unwrap(cachedFn('arg'));
    expect(result2).toBe('result1');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should not cache failed results', async () => {
    const mockFn = vi.fn<Fn>()
      .mockResolvedValueOnce(Result.fail('result1'))
      .mockResolvedValueOnce(Result.fail('result2'));
    const cachedFn = cache(2)(mockFn);

    const result1 = await Result.unwrapError(cachedFn('arg'));
    expect(result1).toBe('result1');
    expect(mockFn).toHaveBeenCalledTimes(1);

    const result2 = await Result.unwrapError(cachedFn('arg'));
    expect(result2).toBe('result2');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('should cache results for different arguments separately', async () => {
    const mockFn = vi.fn<Fn>()
      .mockResolvedValueOnce(Result.succeed('result1'))
      .mockResolvedValueOnce(Result.succeed('result2'));
    const cachedFn = cache(2)(mockFn);

    const result1 = await Result.unwrap(cachedFn('arg1'));
    const result2 = await Result.unwrap(cachedFn('arg2'));

    expect(result1).toBe('result1');
    expect(result2).toBe('result2');
    expect(mockFn).toHaveBeenCalledTimes(2);

    const result1Cached = await Result.unwrap(cachedFn('arg1'));
    const result2Cached = await Result.unwrap(cachedFn('arg2'));

    expect(result1Cached).toBe('result1');
    expect(result2Cached).toBe('result2');
    expect(mockFn).toHaveBeenCalledTimes(2);
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

    const result1 = await Result.unwrap(cachedFn('arg1'));
    expect(result1).toBe('result4');
    expect(mockFn).toHaveBeenCalledTimes(4);

    const result3 = await Result.unwrap(cachedFn('arg3'));
    expect(result3).toBe('result3');
    expect(mockFn).toHaveBeenCalledTimes(4);
  });
});
