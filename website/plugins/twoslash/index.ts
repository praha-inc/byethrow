import path from 'node:path';

import { transformerTwoslash } from '@shikijs/twoslash';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { defaultHandlers, toHast } from 'mdast-util-to-hast';

import type { RspressPlugin } from '@rspress/core';
import type { ShikiTransformerContextCommon } from '@shikijs/types';
import type { Element, ElementContent } from 'hast';
import type { Code } from 'mdast';

// eslint-disable-next-line func-style
function renderMarkdown(this: ShikiTransformerContextCommon, markdown: string): ElementContent[] {
  return (toHast(
    fromMarkdown(
      markdown.replaceAll(/\{@link ([^}]*)}/g, '`$1`'),
      markdown,
      { mdastExtensions: [gfmFromMarkdown()] },
    ),
    {
      handlers: {
        code: (state, node: Code) => {
          const lang = node.lang || '';
          if (lang) {
            return <Element>{
              type: 'element',
              tagName: 'code',
              properties: {},
              children: this.codeToHast(
                node.value,
                {
                  ...this.options,
                  transformers: [],
                  lang,
                  structure: node.value.trim().includes('\n') ? 'classic' : 'inline',
                },
              ).children,
            };
          }
          return defaultHandlers.code(state, node);
        },
      },
    },
  ) as Element).children;
}

// eslint-disable-next-line func-style
function renderMarkdownInline(this: ShikiTransformerContextCommon, md: string): ElementContent[] {
  const children = renderMarkdown.call(this, md.replace(/^([\w$-]+)/, '`$1` '));
  if (children.length === 1 && children[0]!.type === 'element' && children[0]!.tagName === 'p') {
    return children[0]!.children;
  }
  return children;
}

export const pluginTwoslash = (): RspressPlugin => {
  return {
    name: '@praha/twoslash',
    globalUIComponents: [
      path.join(import.meta.dirname, './register.tsx'),
    ],
    config: (config) => {
      config.markdown ??= {};
      config.markdown.shiki ??= {};
      config.markdown.shiki.transformers ??= [];
      config.markdown.shiki.transformers.push(transformerTwoslash({
        rendererRich: {
          renderMarkdown,
          renderMarkdownInline,
          hast: {
            hoverToken: {
              tagName: 'twoslash-popup-trigger',
            },
            hoverPopup: {
              tagName: 'twoslash-popup-container',
              children: (elements) => [
                {
                  type: 'element',
                  tagName: 'div',
                  properties: { class: 'twoslash-popup-arrow' },
                  children: [],
                },
                {
                  type: 'element',
                  tagName: 'div',
                  properties: { class: 'twoslash-popup-inner' },
                  children: elements,
                },
              ],
            },
            queryToken: {
              tagName: 'twoslash-popup-trigger',
            },
            queryPopup: {
              tagName: 'twoslash-popup-container',
              properties: {
                'data-always': 'true',
              },
              children: (elements) => [
                elements.at(0)!,
                {
                  type: 'element',
                  tagName: 'div',
                  properties: { class: 'twoslash-popup-inner' },
                  children: elements.slice(1),
                },
              ],
            },
          },
        },
      }));
      return config;
    },
  };
};
