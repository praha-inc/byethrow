import { getCustomMDXComponent, HomeLayout as BaseHomeLayout } from '@rspress/core/theme';

import type { FC } from 'react';

export const HomeLayout: FC = () => {
  const { pre: PreWithCodeButtonGroup, code: Code } = getCustomMDXComponent();
  return (
    <BaseHomeLayout
      afterHeroActions={(
        <div
          className="rspress-doc"
          style={{ minHeight: 'auto', width: '100%', maxWidth: 400 }}
        >
          <PreWithCodeButtonGroup
            containerElementClassName="language-bash"
            codeButtonGroupProps={{ showCodeWrapButton: false }}
          >
            <Code className="language-bash" style={{ textAlign: 'center' }}>
              npm install @praha/byethrow
            </Code>
          </PreWithCodeButtonGroup>
        </div>
      )}
    />
  );
};
