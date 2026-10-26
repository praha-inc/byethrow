import { useI18n } from '@rspress/core/runtime';

import { fillTemplate } from '../../../utils/fill-template';

import type { FlowStep } from './flows';
import type I18nJson from 'i18n';
import type { FC } from 'react';

export type FlowStepTextProps = {
  step: FlowStep;
};

/** What happens inside the box, with `{call}` and `{value}` in the translation filled in as code. */
export const FlowStepText: FC<FlowStepTextProps> = ({ step }) => {
  const t = useI18n<typeof I18nJson>();

  return fillTemplate(t(`resultFlow.${step.kind}`), {
    call: 'call' in step ? <code>{step.call}</code> : undefined,
    value: 'value' in step ? <code>{step.value}</code> : undefined,
  });
};
