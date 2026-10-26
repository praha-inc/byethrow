import { useI18n } from '@rspress/core/runtime';

import { formatErrors, TRACES } from './traces';

import type { ErrorTypeTraceProps } from './error-type-trace';
import type I18nJson from 'i18n';
import type { FC } from 'react';

/** The error type after each step as a list item, standing in for the trace that markdown can't hold. */
export const ErrorTypeTraceMarkdown: FC<ErrorTypeTraceProps> = ({ name }) => {
  const t = useI18n<typeof I18nJson>();

  return (
    <>
      <p>{`${t('errorTypeTrace.caption')}:`}</p>
      <ul>
        {TRACES[name].map((step) => (
          <li key={step.code}>
            <code>{step.code.replace(/,$/, '')}</code>
            {': '}
            <code>{formatErrors(step.errors)}</code>
          </li>
        ))}
      </ul>
    </>
  );
};
