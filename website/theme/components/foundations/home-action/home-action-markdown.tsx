import { parseInlineMarkdownText } from '@rspress/core/theme-original';

import type { HomeActionProps } from './home-action';
import type { FC } from 'react';

export type HomeActionMarkdownProps = Pick<HomeActionProps, 'text' | 'link'>;

/** The action as a plain markdown link. The button styling has no markdown equivalent. */
export const HomeActionMarkdown: FC<HomeActionMarkdownProps> = ({ text, link }) => (
  <a href={link}>{parseInlineMarkdownText(text)}</a>
);
