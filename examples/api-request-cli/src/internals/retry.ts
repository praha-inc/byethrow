import { Result } from '@praha/byethrow';

export const retry = (retries: number) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <F extends (...args: any[]) => Result.ResultAsync<unknown, unknown>>(fn: F): F => {
    return ((...args: Parameters<F>) => {
      const execute = async (attempt: number): Promise<Result.Result<unknown, unknown>> => {
        const result = await fn(...args);
        if (Result.isSuccess(result)) return result;
        if (attempt >= retries) return result;

        const backoffMs = Math.random() * Math.min(Math.pow(2, attempt) * 100, 5000);
        await new Promise((resolve) => setTimeout(resolve, backoffMs));

        return execute(attempt + 1);
      };

      return execute(0);
    }) as F;
  };
};
