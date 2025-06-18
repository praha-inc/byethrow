// @ts-check

import { MarkdownPageEvent } from 'typedoc-plugin-markdown';

/**
 * @param {import('typedoc-plugin-markdown').MarkdownApplication} app
 */
export const load = (app) => {
  app.renderer.on(MarkdownPageEvent.END, (page) => {
    page.contents = page.contents
      .replaceAll(/Defined in: \[[^\]]+]\([^)]+\)\s*/g, '')
      .replaceAll(/\[(`?)(.+?)\1]\([^)]+\)/g, (_match, _quote, label) => `\`${label}\``);
  });
};
