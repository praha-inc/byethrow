import { useI18n } from '@rspress/core/runtime';
import { Fragment } from 'react';

import { PIPELINES } from './pipelines';
import { fillTemplate } from '../../../utils/fill-template';
import { laneLabel } from '../result-flow/flows';

import type { ResultPipelineProps } from './result-pipeline';
import type I18nJson from 'i18n';
import type { FC } from 'react';

/** Each step as a list item, standing in for the simulator that markdown can't hold. */
export const ResultPipelineMarkdown: FC<ResultPipelineProps> = ({ name }) => {
  const t = useI18n<typeof I18nJson>();

  return (
    <ul>
      {PIPELINES[name].map((step) => {
        const outcomes = step.outcomes.map((track, index) => (
          <Fragment key={track}>
            {index > 0 && ` ${t('resultPipeline.or')} `}
            <code>{laneLabel(track)}</code>
          </Fragment>
        ));
        const text = step.runsOn === 'start'
          ? fillTemplate(t('resultPipeline.creates'), { outcomes })
          : fillTemplate(t('resultPipeline.runsOn'), { track: <code>{laneLabel(step.runsOn)}</code>, outcomes });

        return (
          <li key={step.code}>
            <code>{step.code.replace(/,$/, '')}</code>
            {': '}
            {text}
          </li>
        );
      })}
    </ul>
  );
};
