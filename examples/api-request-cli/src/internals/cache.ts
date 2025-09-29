import { Result } from '@praha/byethrow';

export const cache = (size: number) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <F extends (...args: any[]) => Result.ResultAsync<unknown, unknown>>(fn: F): F => {
    const store = new Map<string, Result.Result<unknown, unknown>>();
    return (async (...args: Parameters<F>) => {
      const key = JSON.stringify(args);

      if (store.has(key)) {
        const value = store.get(key)!;
        store.delete(key);
        store.set(key, value);
        return value;
      }

      const result = await fn(...args);
      if (Result.isSuccess(result)) {
        if (size <= store.size) {
          const firstKey = store.keys().next().value;
          if (firstKey !== undefined) {
            store.delete(firstKey);
          }
        }

        store.set(key, result);
      }

      return result;
    }) as F;
  };
};
