import { useEffect } from 'react';

import type { FC } from 'react';

const register = async () => {
  const {
    TwoslashPopupPortal,
    TwoslashPopupTrigger,
    TwoslashPopupContainer,
  } = await import ('./popup');

  customElements.define(TwoslashPopupPortal.NAME, TwoslashPopupPortal);
  customElements.define(TwoslashPopupTrigger.NAME, TwoslashPopupTrigger);
  customElements.define(TwoslashPopupContainer.NAME, TwoslashPopupContainer);
};

const RegisterTwoSlashPopup: FC = () => {
  useEffect(() => {
    void register();
  }, []);

  return null;
};

export default RegisterTwoSlashPopup;
