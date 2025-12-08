/* eslint-disable import-x/export */
import { getCustomMDXComponent as baseGetCustomMDXComponent } from '@rspress/core/theme-original';
import { LlmsContainer, LlmsCopyButton, LlmsViewOptions } from '@rspress/plugin-llms/runtime';

export * from '@rspress/core/theme-original';

export * from './components/stackblitz';
export { HomeLayout } from './layouts/home-layout';

export const getCustomMDXComponent = (): ReturnType<typeof baseGetCustomMDXComponent> => {
  const { h1: H1, ...components } = baseGetCustomMDXComponent();
  return {
    ...components,
    h1: (props) => {
      return (
        <>
          <H1 {...props} />
          <LlmsContainer>
            <LlmsCopyButton />
            <LlmsViewOptions />
          </LlmsContainer>
        </>
      );
    },
  };
};
