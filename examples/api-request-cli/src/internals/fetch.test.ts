import { Result } from '@praha/byethrow';
import { afterEach, beforeEach, describe, vi, it, expect } from 'vitest';

import { fetch, FetchHttpError, FetchNetworkError, FetchTimeoutError } from './fetch';

describe('fetch', () => {
  describe('when making a successful request', () => {
    beforeEach(() => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{"result":"success"}', {
        status: 200,
        statusText: 'OK',
      }));
    });

    it('should return a successful response for valid URL', async () => {
      const result = await Result.unwrap(fetch('https://api.example.com/success'));

      expect(result).toEqual({ result: 'success' });
    });

    it('should cache responses correctly', async () => {
      await fetch('https://api.example.com/cached');
      await fetch('https://api.example.com/cached');

      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('when request fails with HTTP error', () => {
    beforeEach(() => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('Not Found', {
        status: 404,
        statusText: 'Not Found',
      }));
    });

    it('should return FetchHttpError for 404 response', async () => {
      const result = await Result.unwrapError(fetch('https://api.example.com/notfound'));

      expect(result).toBeInstanceOf(FetchHttpError);
      expect((result as FetchHttpError).status).toBe(404);
      expect(globalThis.fetch).toHaveBeenCalledTimes(3);
    });

    it('should not cache failed HTTP responses', async () => {
      await fetch('https://api.example.com/notfound');
      await fetch('https://api.example.com/notfound');

      expect(globalThis.fetch).toHaveBeenCalledTimes(6);
    });
  });

  describe('when request fails with network error', () => {
    beforeEach(() => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'));
    });

    it('should return FetchNetworkError for network failure', async () => {
      const result = await Result.unwrapError(fetch('https://api.example.com/error'));

      expect(result).toBeInstanceOf(FetchNetworkError);
      expect(globalThis.fetch).toHaveBeenCalledTimes(3);
    });

    it('should not cache failed network responses', async () => {
      await fetch('https://api.example.com/error');
      await fetch('https://api.example.com/error');

      expect(globalThis.fetch).toHaveBeenCalledTimes(6);
    });
  });

  describe('when request times out', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise((resolve) => {
        setTimeout(() => {
          resolve(new Response('slow response', { status: 200 }));
        }, 2000);
      }));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return FetchTimeoutError for slow responses', async () => {
      const resultPromise = fetch('https://api.example.com/slow');
      await vi.advanceTimersByTimeAsync(5000);
      const result = await Result.unwrapError(resultPromise);

      expect(result).toBeInstanceOf(FetchTimeoutError);
    });
  });
});
