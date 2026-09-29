import { PackageManagerTabs } from '@rspress/core/theme-original';

import type { PackageManager } from './home-install';
import type { FC } from 'react';

export type HomeInstallMarkdownProps = {
  packageName: string;
  managers: readonly PackageManager[];
};

/** Every install command, in the same format as the docs' own `PackageManagerTabs`. */
export const HomeInstallMarkdown: FC<HomeInstallMarkdownProps> = ({ packageName, managers }) => (
  <PackageManagerTabs
    command={Object.fromEntries(managers.map(({ name, command }) => [name, `${command} ${packageName}`]))}
  />
);
