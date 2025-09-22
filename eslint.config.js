import { common } from '@praha/eslint-config-common';
import { define } from '@praha/eslint-config-definer';
import { javascript } from '@praha/eslint-config-javascript';
import { style } from '@praha/eslint-config-style';
import { typescript } from '@praha/eslint-config-typescript';
import { vitest } from '@praha/eslint-config-vitest';

export const config = define([
  common,
  javascript,
  typescript,
  vitest,
  style,
]);

export default config({
  tsconfigPath: './tsconfig.json',
});
