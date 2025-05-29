import { describe, expect, it, vi } from 'vitest';

import { greeting } from './index';

describe('greeting', () => {
  it('logs "Hello, World!" to the console', () => {
    const consoleSpy = vi.spyOn(console, 'log');

    greeting();

    expect(consoleSpy).toHaveBeenCalledWith('Hello, World!');
  });
});
