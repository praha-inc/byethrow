import { useI18n } from '@rspress/core/runtime';

import styles from './code-card.module.css';

import type I18nJson from 'i18n';
import type { FC, ReactNode } from 'react';

type Token = 'kw' | 'fn' | 'str' | 'const' | 'cm' | 'pn' | 'param' | 'type' | 'warn';

const T: FC<{ t: Token; children: ReactNode }> = ({ t, children }) => (
  <span className={styles[`tk-${t}`]}>{children}</span>
);

const BEFORE: ReactNode[] = [
  <><T t="kw">const</T> <T t="const">parseJson</T> <T t="pn">=</T> <T t="pn">(</T><T t="param">text</T><T t="pn">:</T> <T t="type">string</T><T t="pn">)</T> <T t="kw">=&gt;</T> <T t="pn">{'{'}</T></>,
  <>  <T t="kw">return</T> <T t="const">JSON</T><T t="pn">.</T><T t="fn">parse</T><T t="pn">(</T>text<T t="pn">);</T> <T t="warn">// may throw, but the type won't say</T></>,
  <><T t="pn">{'};'}</T></>,
  null,
  <><T t="kw">try</T> <T t="pn">{'{'}</T></>,
  <>  <T t="kw">const</T> <T t="const">data</T> <T t="pn">=</T> <T t="fn">parseJson</T><T t="pn">(</T><T t="str">{'\'{ "answer": 21 }\''}</T><T t="pn">);</T></>,
  <>  <T t="const">console</T><T t="pn">.</T><T t="fn">log</T><T t="pn">(</T>data<T t="pn">.</T>answer <T t="pn">*</T> <T t="const">2</T><T t="pn">);</T> <T t="cm">// data: any</T></>,
  <><T t="pn">{'}'}</T> <T t="kw">catch</T> <T t="pn">(</T><T t="param">error</T><T t="pn">)</T> <T t="pn">{'{'}</T></>,
  <>  <T t="cm">// error: unknown. What could it be?</T></>,
  <><T t="pn">{'}'}</T></>,
];

const AFTER: ReactNode[] = [
  <><T t="kw">import</T> <T t="pn">{'{ '}</T><T t="const">Result</T><T t="pn">{' }'}</T> <T t="kw">from</T> <T t="str">'@praha/byethrow'</T><T t="pn">;</T></>,
  null,
  <><T t="kw">const</T> <T t="const">parseJson</T> <T t="pn">=</T> <T t="const">Result</T><T t="pn">.</T><T t="fn">fn</T><T t="pn">{'({'}</T></>,
  <>  <T t="param">try</T><T t="pn">:</T> <T t="pn">(</T><T t="param">text</T><T t="pn">:</T> <T t="type">string</T><T t="pn">)</T> <T t="kw">=&gt;</T> <T t="const">JSON</T><T t="pn">.</T><T t="fn">parse</T><T t="pn">(</T>text<T t="pn">),</T></>,
  <>  <T t="param">catch</T><T t="pn">:</T> <T t="pn">(</T><T t="param">error</T><T t="pn">)</T> <T t="kw">=&gt;</T> <T t="kw">new</T> <T t="type">Error</T><T t="pn">(</T><T t="str">'Invalid JSON'</T><T t="pn">, {'{ '}</T>cause<T t="pn">:</T> error<T t="pn">{' }),'}</T></>,
  <><T t="pn">{'});'}</T></>,
  null,
  <><T t="kw">const</T> <T t="const">result</T> <T t="pn">=</T> <T t="const">Result</T><T t="pn">.</T><T t="fn">pipe</T><T t="pn">(</T></>,
  <>  <T t="fn">parseJson</T><T t="pn">(</T><T t="str">{'\'{ "answer": 21 }\''}</T><T t="pn">),</T></>,
  <>  <T t="const">Result</T><T t="pn">.</T><T t="fn">map</T><T t="pn">((</T><T t="param">data</T><T t="pn">)</T> <T t="kw">=&gt;</T> data<T t="pn">.</T>answer <T t="pn">*</T> <T t="const">2</T><T t="pn">),</T></>,
  <><T t="pn">);</T></>,
  null,
  <><T t="kw">if</T> <T t="pn">(</T><T t="const">Result</T><T t="pn">.</T><T t="fn">isSuccess</T><T t="pn">(</T>result<T t="pn">))</T> <T t="pn">{'{'}</T></>,
  <>  <T t="const">console</T><T t="pn">.</T><T t="fn">log</T><T t="pn">(</T>result<T t="pn">.</T>value<T t="pn">);</T> <T t="cm">// 42</T></>,
  <><T t="pn">{'}'}</T></>,
];

export type CodeCardTab = 'before' | 'after';

const TABS: ReadonlyArray<{ key: CodeCardTab; file: string }> = [
  { key: 'before', file: 'throw.ts' },
  { key: 'after', file: 'byethrow.ts' },
];

const Code: FC<{ lines: ReactNode[]; active: boolean }> = ({ lines, active }) => (
  <pre className={styles['code']} data-active={active} aria-hidden={!active}>
    <code>
      {lines.map((line, index) => (
        <span key={index} className={styles['line']}>
          <span className={styles['line-number']}>{index + 1}</span>
          <span className={styles['line-content']}>{line ?? ' '}</span>
        </span>
      ))}
    </code>
  </pre>
);

export type CodeCardProps = {
  tab: CodeCardTab;
  onTabChange: (tab: CodeCardTab) => void;
};

/** Compares the same code written with `throw` and with byethrow. */
export const CodeCard: FC<CodeCardProps> = ({ tab, onTabChange }) => {
  const t = useI18n<typeof I18nJson>();

  return (
    <div className={styles['card']} data-tab={tab}>
      <div className={styles['bar']}>
        <div className={styles['tabs']} role="tablist" aria-label={t('hero.tabs')}>
          {TABS.map(({ key, file }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              className={styles['tab']}
              data-kind={key}
              onClick={() => onTabChange(key)}
            >
              <i className={styles['tab-dot']} />
              {file}
            </button>
          ))}
        </div>
        <span className={styles['type']}>
          {tab === 'after' ? 'Result<number, Error>' : 'any'}
        </span>
      </div>
      <div className={styles['panes']}>
        <Code lines={BEFORE} active={tab === 'before'} />
        <Code lines={AFTER} active={tab === 'after'} />
      </div>
      <div key={tab} className={styles['output']}>
        {tab === 'after' ? (
          <>
            <span className={styles['output-label']}>
              <i className={styles['output-dot']} />
              Success
            </span>
            <span className={styles['output-value']}>
              <T t="pn">{'{ '}</T>value<T t="pn">:</T> <T t="const">42</T><T t="pn">{' }'}</T>
            </span>
          </>
        ) : (
          <>
            <span className={styles['output-label']}>
              <i className={styles['output-dot']} />
              Unchecked
            </span>
            <span className={styles['output-value']}>{t('hero.before.output')}</span>
          </>
        )}
      </div>
    </div>
  );
};
