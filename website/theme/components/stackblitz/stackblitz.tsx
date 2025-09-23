import sdk from '@stackblitz/sdk';
import { useEffect, useId } from 'react';

import type { EmbedOptions } from '@stackblitz/sdk';
import type { FC } from 'react';

export type StackblitzProps = {
  repository: string;
  options?: EmbedOptions;
};

export const Stackblitz: FC<StackblitzProps> = ({
  repository,
  options,
}) => {
  const id = useId();

  useEffect(() => {
    void sdk.embedGithubProject(id, repository, {
      height: '500',
      ...options,
    });
  }, []);

  return (
    <div id={id}>Embed Stackblitz editor</div>
  );
};
