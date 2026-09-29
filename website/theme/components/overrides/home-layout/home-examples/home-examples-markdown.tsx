import { useI18n } from '@rspress/core/runtime';
import { Fragment } from 'react';

import combine from './snippets/combine.mdx?raw';
import compose from './snippets/compose.mdx?raw';
import handle from './snippets/handle.mdx?raw';
import validate from './snippets/validate.mdx?raw';
import wrap from './snippets/wrap.mdx?raw';

import type { Example } from './home-examples';
import type I18nJson from 'i18n';
import type { FC } from 'react';

const SOURCES: Readonly<Record<Example['key'], string>> = { wrap, validate, compose, combine, handle };

/**
 * The code block of a snippet as the page shows it. The setup above `// ---cut---`
 * is hidden there, and `// ^?` only anchors a type popup, so both are dropped.
 */
const readCode = (source: string): { lang: string; code: string } => {
  const [, lang = '', body = ''] = /^```(\w*).*\n([\s\S]*?)\n```$/m.exec(source) ?? [];
  const lines = body.split('\n');
  const code = lines
    .slice(lines.indexOf('// ---cut---') + 1)
    .filter((line) => !/^\s*\/\/\s*\^\?\s*$/.test(line))
    .join('\n');

  return { lang, code };
};

export type HomeExamplesMarkdownProps = {
  examples: readonly Example[];
};

/** Every example as markdown, one after another instead of behind tabs. */
export const HomeExamplesMarkdown: FC<HomeExamplesMarkdownProps> = ({ examples }) => {
  const t = useI18n<typeof I18nJson>();

  return (
    <>
      <h2>{t('examples.title')}</h2>
      {examples.map(({ key, file, apis, guide }) => {
        const { lang, code } = readCode(SOURCES[key]);

        return (
          <section key={key}>
            <h3>{t(`examples.${key}.title`)}</h3>
            <p>{t(`examples.${key}.description`)}</p>
            <pre data-lang={lang} data-title={file}>
              <code>{code}</code>
            </pre>
            <p>
              {apis.map((api) => (
                <Fragment key={api}>
                  <a href={`./api/functions/Result.${api}`}><code>{`Result.${api}`}</code></a>
                  {' | '}
                </Fragment>
              ))}
              <a href={guide}>{t('examples.guide')}</a>
            </p>
          </section>
        );
      })}
    </>
  );
};
