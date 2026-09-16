import sdk from '@stackblitz/sdk';
import { useEffect, useId, useRef } from 'react';

import { StackblitzMarkdown } from './stackblitz-markdown';

import type { EmbedOptions } from '@stackblitz/sdk';
import type { FC } from 'react';

export type StackblitzProps = {
  repository: string;
  options?: EmbedOptions | undefined;
};

export const Stackblitz: FC<StackblitzProps> = ({
  repository,
  options,
}) => {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = document.createElement('div');
    element.id = id;
    ref.current.append(element);

    void sdk.embedGithubProject(id, repository, {
      height: '500',
      ...options,
    });
  }, []);

  if (import.meta.env.SSG_MD) {
    return <StackblitzMarkdown repository={repository} options={options} />;
  }

  return (
    <div ref={ref} />
  );
};
