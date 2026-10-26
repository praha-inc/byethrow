import { FlowStepText } from './flow-step-text';
import { caseKey, FLOWS, formatInputs, formatValue } from './flows';

import type { ResultFlowProps } from './result-flow';
import type { FC } from 'react';

/** Each case as a list item, standing in for the diagram that markdown can't hold. */
export const ResultFlowMarkdown: FC<ResultFlowProps> = ({ fn }) => (
  <ul>
    {FLOWS[fn].cases.map((flowCase) => (
      <li key={caseKey(flowCase)}>
        <code>{formatInputs(flowCase.inputs)}</code>
        {': '}
        <FlowStepText step={flowCase.step} />
        {' → '}
        <code>{formatValue(flowCase.output)}</code>
      </li>
    ))}
  </ul>
);
