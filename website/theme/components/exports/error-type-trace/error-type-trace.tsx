import { useI18n } from '@rspress/core/runtime';
import { useEffect, useRef, useState } from 'react';

import { ErrorTypeTraceMarkdown } from './error-type-trace-markdown';
import styles from './error-type-trace.module.css';
import { membersAt, TRACES } from './traces';
import { usePlaying } from '../../../hooks/use-playing';

import type { ErrorMember, TraceName, TraceStep } from './traces';
import type I18nJson from 'i18n';
import type { FC } from 'react';

const cx = (...names: Array<string | undefined | false>): string => names.filter(Boolean).join(' ');

const STEP_MS = 900;
const HOLD_MS = 2000;

const Member: FC<ErrorMember> = ({ name, change }) => {
  const className = cx(styles['member'], styles[`member--${change}`]);
  if (change === 'added') return <ins className={className}>{name}</ins>;
  if (change === 'removed') return <del className={className}>{name}</del>;
  return <span className={className}>{name}</span>;
};

export type ErrorTypeTraceProps = {
  /** The pipeline to trace. */
  name: TraceName;
};

/**
 * The error type after each step of a pipeline, member by member. The steps light up
 * one after another, each showing the members it adds to the type and the ones it
 * removes from it.
 */
export const ErrorTypeTrace: FC<ErrorTypeTraceProps> = ({ name }) => {
  const t = useI18n<typeof I18nJson>();
  const steps: readonly TraceStep[] = TRACES[name];
  const figureRef = useRef<HTMLElement>(null);
  const playing = usePlaying(figureRef);
  /** The last step whose error type is shown, which is every step while nothing plays. */
  const [reached, setReached] = useState(steps.length - 1);

  useEffect(() => {
    if (!playing) {
      setReached(steps.length - 1);
      return;
    }

    const travelMs = steps.length * STEP_MS;
    let start: number | undefined;
    let frame = 0;

    const tick = (now: number) => {
      start ??= now;
      const elapsed = (now - start) % (travelMs + HOLD_MS);
      setReached(Math.min(Math.floor(elapsed / STEP_MS), steps.length - 1));
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, steps.length]);

  if (import.meta.env.SSG_MD) {
    return <ErrorTypeTraceMarkdown name={name} />;
  }

  return (
    <figure ref={figureRef} className={cx('rp-not-doc', styles['figure'])}>
      <figcaption className={styles['header']}>
        <span className={styles['caption']}>{t('errorTypeTrace.caption')}</span>
        <span className={styles['legend']}>
          <span className={styles['legend-added']}>{t('errorTypeTrace.added')}</span>
          <span className={styles['legend-removed']}>{t('errorTypeTrace.removed')}</span>
        </span>
      </figcaption>
      <ol className={styles['steps']}>
        {steps.map((step, index) => (
          <li
            key={step.code}
            className={cx(styles['step'], index > reached && styles['step--pending'], playing && index === reached && styles['step--active'])}
          >
            <code className={styles['code']}>{step.code}</code>
            <span className={styles['type']}>
              {membersAt(steps, index).map((member) => <Member key={member.name} {...member} />)}
              {step.errors.length === 0 && <span className={cx(styles['member'], styles['member--never'])}>never</span>}
            </span>
          </li>
        ))}
      </ol>
    </figure>
  );
};
