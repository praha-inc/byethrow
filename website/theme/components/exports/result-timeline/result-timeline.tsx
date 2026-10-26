import { useI18n } from '@rspress/core/runtime';
import { Fragment, useEffect, useRef, useState } from 'react';

import { ResultTimelineMarkdown } from './result-timeline-markdown';
import styles from './result-timeline.module.css';
import { AGGREGATORS, axisOf, DEFAULT_FAILING, OPERATIONS, scheduleOf } from './timelines';
import { usePlaying } from '../../../hooks/use-playing';
import { laneLabel } from '../result-flow/flows';

import type { TimelineMode } from './timelines';
import type I18nJson from 'i18n';
import type { CSSProperties, FC } from 'react';

const cx = (...names: Array<string | undefined | false>): string => names.filter(Boolean).join(' ');

/** Custom properties for the stylesheet, which positions everything against the time `--t` on the figure. */
const customProperties = (values: Readonly<Record<string, number>>): CSSProperties => values;

const UNIT_MS = 450;
const HOLD_MS = 1600;

export type ResultTimelineProps = {
  /** Whether the operations are passed as running Results or started by a mapper. */
  mode: TimelineMode;
};

/**
 * When each operation runs under `sequence` and under `collect`, on a shared time
 * axis. The reader picks which operation fails, and a playhead sweeps the axis while
 * the bars fill in and each function returns.
 */
export const ResultTimeline: FC<ResultTimelineProps> = ({ mode }) => {
  const t = useI18n<typeof I18nJson>();
  const figureRef = useRef<HTMLElement>(null);
  const playing = usePlaying(figureRef);
  const [failing, setFailing] = useState<number | null>(DEFAULT_FAILING);
  const operations = OPERATIONS[mode];
  const axis = axisOf(mode);

  useEffect(() => {
    const figure = figureRef.current;
    if (!figure) return;
    if (!playing) {
      figure.style.setProperty('--t', String(axis));
      return;
    }

    const travelMs = axis * UNIT_MS;
    let start: number | undefined;
    let frame = 0;

    const tick = (now: number) => {
      start ??= now;
      const elapsed = (now - start) % (travelMs + HOLD_MS);
      figure.style.setProperty('--t', String(Math.min(elapsed / travelMs, 1) * axis));
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [axis, failing, playing]);

  if (import.meta.env.SSG_MD) {
    return <ResultTimelineMarkdown mode={mode} />;
  }

  return (
    <figure ref={figureRef} className={cx('rp-not-doc', styles['figure'])} style={customProperties({ '--axis': axis, '--t': axis })}>
      <figcaption className={styles['header']}>
        <span className={styles['caption']}>{t('resultTimeline.failing')}</span>
        <span className={styles['choices']} role="group" aria-label={t('resultTimeline.failing')}>
          {[null, ...operations.keys()].map((index) => (
            <button
              key={index ?? 'none'}
              type="button"
              className={styles['choice']}
              aria-pressed={failing === index}
              onClick={() => setFailing(index)}
            >
              {index === null ? t('resultTimeline.none') : operations[index]?.label}
            </button>
          ))}
        </span>
      </figcaption>
      {AGGREGATORS.map((aggregator) => {
        const { bars, returnsAt, output } = scheduleOf(aggregator, mode, failing);
        return (
          <section key={aggregator} className={styles['panel']}>
            <div className={styles['panel-header']}>
              <code className={styles['name']}>{aggregator}</code>
              <span className={styles['returns']} style={customProperties({ '--at': returnsAt })}>
                <span className={styles['arrow']} aria-hidden="true">→</span>
                <span className={cx(styles['value'], styles[`value--${output.track}`])}>
                  {`${laneLabel(output.track)}(${output.value})`}
                </span>
              </span>
            </div>
            <div className={styles['lanes']}>
              {bars.map((bar, index) => {
                const label = operations[index]?.label ?? '';
                return (
                  <Fragment key={label}>
                    <code className={styles['label']}>{label}</code>
                    <div className={styles['track']}>
                      {bar.status === 'notStarted'
                        ? (
                            <span className={styles['note']} style={customProperties({ '--start': bar.start, '--at': returnsAt })}>
                              {t('resultTimeline.notStarted')}
                            </span>
                          )
                        : (
                            <span
                              className={cx(styles['bar'], styles[`bar--${bar.outcome}`], bar.status === 'ignored' && styles['bar--ignored'])}
                              style={customProperties({ '--start': bar.start, '--end': bar.end })}
                            />
                          )}
                      {bar.status === 'ignored' && (
                        <span className={styles['note']} style={customProperties({ '--start': bar.start, '--at': returnsAt })}>
                          {t('resultTimeline.ignored')}
                        </span>
                      )}
                    </div>
                  </Fragment>
                );
              })}
              <div className={styles['overlay']} aria-hidden="true">
                <span className={styles['marker']} style={customProperties({ '--at': returnsAt })} />
                <span className={styles['playhead']} />
              </div>
            </div>
          </section>
        );
      })}
      <div className={styles['axis']} aria-hidden="true">
        <span className={styles['axis-label']}>{t('resultTimeline.time')}</span>
        <span className={styles['ticks']}>
          {Array.from({ length: axis + 1 }, (_, time) => (
            <span key={time} className={styles['tick']} style={customProperties({ '--at': time })}>{time}</span>
          ))}
        </span>
      </div>
    </figure>
  );
};
