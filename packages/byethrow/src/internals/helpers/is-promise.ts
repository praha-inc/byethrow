/**
 * Determines whether a given value is a `Promise`.
 *
 * @typeParam T - The value type.
 *
 * @param value - A value that might be a `Promise`.
 * @returns `true` if the value is a `Promise`, otherwise `false`.
 */
export const isPromise = <T>(value: T | Promise<T>): value is Promise<T> => {
  return (
    typeof value === 'object'
    && value !== null
    && 'then' in value
    && typeof value.then === 'function'
    && 'catch' in value
    && typeof value.catch === 'function'
  );
};
