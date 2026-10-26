import { Fragment } from 'react';

import type { ReactNode } from 'react';

/** Splits a translation at its `{placeholders}` and puts the given nodes in their place. */
export const fillTemplate = (template: string, values: Readonly<Record<string, ReactNode>>): ReactNode[] => {
  return template
    .split(/(\{\w+\})/)
    .map((part) => {
      const name = /^\{(\w+)\}$/.exec(part)?.[1];
      const value = name === undefined ? undefined : values[name];
      return value === undefined ? part : <Fragment key={part}>{value}</Fragment>;
    });
};
