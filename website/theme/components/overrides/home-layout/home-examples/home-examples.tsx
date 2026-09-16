import { useI18n } from '@rspress/core/runtime';
import { Link } from '@rspress/core/theme-original';
import { useEffect, useId, useRef, useState } from 'react';

import { HomeExamplesMarkdown } from './home-examples-markdown';
import styles from './home-examples.module.css';
import Combine from './snippets/combine.mdx';
import Compose from './snippets/compose.mdx';
import Handle from './snippets/handle.mdx';
import Validate from './snippets/validate.mdx';
import Wrap from './snippets/wrap.mdx';
import { HomeHeading } from '../../../foundations/home-heading';

import type I18nJson from 'i18n';
import type { FC, KeyboardEvent } from 'react';

type ExampleKey = 'wrap' | 'validate' | 'compose' | 'combine' | 'handle';

export type Example = {
  key: ExampleKey;
  file: string;
  /** Functions used in the snippet, linked to their API reference. */
  apis: readonly string[];
  guide: string;
  Snippet: FC;
};

const EXAMPLES: readonly Example[] = [
  { key: 'wrap', file: 'fetch-user.ts', apis: ['fn'], guide: './guide/tutorial/basics/wrapping-functions', Snippet: Wrap },
  { key: 'validate', file: 'sign-up.ts', apis: ['parse'], guide: './api/functions/Result.parse', Snippet: Validate },
  { key: 'compose', file: 'welcome.ts', apis: ['pipe', 'andThen', 'andThrough', 'map'], guide: './guide/tutorial/chaining/pipe-basics', Snippet: Compose },
  { key: 'combine', file: 'dashboard.ts', apis: ['collect', 'isFailure'], guide: './guide/tutorial/combining/aggregating-results', Snippet: Combine },
  { key: 'handle', file: 'delete-post.ts', apis: ['inspect', 'inspectError'], guide: './guide/best-practices/pattern-matching', Snippet: Handle },
];

const CopyIcon: FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V6a2 2 0 0 1 2-2h9" />
  </svg>
);

const CheckIcon: FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const ArrowIcon: FC = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

/** Text of a rendered snippet without the Twoslash popups. */
const readCode = (root: HTMLElement | null): string => {
  const pre = root?.querySelector('pre');
  if (!pre) return '';
  const clone = pre.cloneNode(true) as HTMLElement;
  for (const element of clone.querySelectorAll('.rp-copy-ignore')) element.remove();
  return (clone.textContent ?? '').replace(/\n+$/, '\n');
};

/** Type-checked snippets of common tasks, one visible at a time. */
export const HomeExamples: FC = () => {
  const t = useI18n<typeof I18nJson>();
  const id = useId();
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const pane = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  if (import.meta.env.SSG_MD) {
    return <HomeExamplesMarkdown examples={EXAMPLES} />;
  }

  const example = EXAMPLES[active]!;
  const { Snippet } = example;

  const select = (index: number) => {
    setActive(index);
    setCopied(false);
  };

  // Roving focus between tabs, as described in the WAI-ARIA tabs pattern.
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = EXAMPLES.length - 1;
    const next = {
      ArrowDown: active + 1,
      ArrowRight: active + 1,
      ArrowUp: active - 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const index = next > last ? 0 : (next < 0 ? last : next);
    select(index);
    tabs.current[index]?.focus();
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(readCode(pane.current));
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard access can be denied; nothing sensible to do.
    }
  };

  return (
    <section className={styles['section']}>
      <HomeHeading
        eyebrow={t('examples.eyebrow')}
        title={t('examples.title')}
        description={t('examples.description')}
      />
      <div className={styles['layout']}>
        <div className={styles['tabs']} role="tablist" aria-label={t('examples.tabs')} aria-orientation="vertical">
          {EXAMPLES.map(({ key }, index) => (
            <button
              key={key}
              ref={(element) => {
                tabs.current[index] = element;
              }}
              id={`${id}-tab-${key}`}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-controls={`${id}-panel`}
              tabIndex={index === active ? 0 : -1}
              className={styles['tab']}
              onClick={() => select(index)}
              onKeyDown={onKeyDown}
            >
              <span className={styles['tab-index']}>{String(index + 1).padStart(2, '0')}</span>
              <span className={styles['tab-body']}>
                <span className={styles['tab-title']}>{t(`examples.${key}.title`)}</span>
                <span className={styles['tab-description']}>{t(`examples.${key}.description`)}</span>
              </span>
            </button>
          ))}
        </div>
        <p className={styles['caption']}>{t(`examples.${example.key}.description`)}</p>
        <div className={styles['window']}>
          <div className={styles['bar']}>
            <span className={styles['file']}>
              <i className={styles['file-dot']} />
              {example.file}
            </span>
            <span className={styles['hint']}>{t('examples.hint')}</span>
            <button
              type="button"
              className={styles['copy']}
              data-copied={copied}
              aria-label={copied ? t('examples.copied') : t('examples.copy')}
              title={copied ? t('examples.copied') : t('examples.copy')}
              onClick={copy}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
          {/* Only the active snippet is mounted: Twoslash portals its always-visible popups to <body>. */}
          <div
            key={example.key}
            ref={pane}
            id={`${id}-panel`}
            role="tabpanel"
            aria-labelledby={`${id}-tab-${example.key}`}
            className={styles['pane']}
          >
            <Snippet />
          </div>
          <div className={styles['footer']}>
            <span className={styles['apis']}>
              {example.apis.map((api) => (
                <Link key={api} href={`./api/functions/Result.${api}`} className={styles['api'] ?? ''}>
                  {api}
                </Link>
              ))}
            </span>
            <Link href={example.guide} className={styles['guide'] ?? ''}>
              {t('examples.guide')}
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
