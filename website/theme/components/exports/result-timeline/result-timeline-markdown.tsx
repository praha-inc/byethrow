import { useI18n } from '@rspress/core/runtime';
import { Fragment } from 'react';

import { AGGREGATORS, DEFAULT_FAILING, OPERATIONS, scheduleOf } from './timelines';
import { fillTemplate } from '../../../utils/fill-template';
import { laneLabel } from '../result-flow/flows';

import type { ResultTimelineProps } from './result-timeline';
import type I18nJson from 'i18n';
import type { FC } from 'react';

/** The schedules with the default failing operation as a list per function, standing in for the timeline that markdown can't hold. */
export const ResultTimelineMarkdown: FC<ResultTimelineProps> = ({ mode }) => {
  const t = useI18n<typeof I18nJson>();
  const operations = OPERATIONS[mode];

  return (
    <>
      <p>
        {`${t('resultTimeline.failing')}: `}
        <code>{operations[DEFAULT_FAILING]?.label}</code>
      </p>
      {AGGREGATORS.map((aggregator) => {
        const { bars, returnsAt, output } = scheduleOf(aggregator, mode, DEFAULT_FAILING);
        return (
          <Fragment key={aggregator}>
            <p>
              <code>{aggregator}</code>
              {': '}
              {fillTemplate(t('resultTimeline.returnsAt'), {
                value: <code>{`${laneLabel(output.track)}(${output.value})`}</code>,
                time: String(returnsAt),
              })}
            </p>
            <ul>
              {bars.map((bar, index) => {
                const label = operations[index]?.label ?? '';
                if (bar.status === 'notStarted') {
                  return <li key={label}><code>{label}</code>{`: ${t('resultTimeline.notStarted')}`}</li>;
                }
                const ignored = bar.status === 'ignored' ? `, ${t('resultTimeline.ignored')}` : '';
                return <li key={label}><code>{label}</code>{`: ${bar.start}–${bar.end} (${laneLabel(bar.outcome)}${ignored})`}</li>;
              })}
            </ul>
          </Fragment>
        );
      })}
    </>
  );
};
