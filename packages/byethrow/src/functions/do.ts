import { succeed } from './succeed';

/**
 * Alias for `succeed({})`. Commonly used as a neutral base value in functional chains or monadic pipelines.
 *
 * @example
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.do();
 * // Result.Result<{}, never>
 * ```
 *
 * @category Creators
 */
function do_() {
  return succeed({});
}

export { do_ as do };
