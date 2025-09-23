import { HomeLayout as BaseHomeLayout, PackageManagerTabs } from '@rspress/core/theme';

import type { FC } from 'react';

export const HomeLayout: FC = () => {
  return (
    <BaseHomeLayout
      afterHeroActions={(
        <div className="rp-doc" style={{ width: '100%', maxWidth: 400 }}>
          <PackageManagerTabs command="install @praha/byethrow" />
        </div>
      )}
    />
  );
};
