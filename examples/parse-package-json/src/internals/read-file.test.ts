import { Result } from '@praha/byethrow';
import { vol } from 'memfs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { readFile, ReadFileError } from './read-file';

import type { fs } from 'memfs';

vi.mock('node:fs/promises', async () => {
  const memfs: { fs: typeof fs } = await vi.importActual('memfs');
  return {
    default: memfs.fs.promises,
    ...memfs.fs.promises,
  };
});

describe('readFile', () => {
  afterEach(() => {
    vol.reset();
  });

  // ファイルが存在する場合
  describe('when the file exists', () => {
    const path = './test.txt';
    const content = 'Hello, World!';

    beforeEach(() => {
      vol.fromJSON({
        [path]: content,
      });
    });

    it('should read the content', async () => {
      const result = await Result.pipe(
        readFile(path),
        Result.unwrap(),
      );

      expect(result).toBe(content);
    });
  });

  describe('when the file does not exist', () => {
    const path = './non-existent.txt';

    it('should return a ReadFileError', async () => {
      const result = await Result.pipe(
        readFile(path),
        Result.unwrapError(),
      );

      expect(result).toBeInstanceOf(ReadFileError);
    });
  });
});
