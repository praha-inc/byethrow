import {
  addLeadingSlash,
  addTrailingSlash,
  normalizeImagePath,
  useLang,
  useSite,
} from '@rspress/core/runtime';
import { Link } from '@rspress/core/theme-original';

import styles from './nav-title.module.css';
import { Wordmark } from '../../foundations/wordmark';

import type { FC } from 'react';

/** Site name in the top-left of the navbar, drawn as the same wordmark as the hero title. */
export const NavTitle: FC = () => {
  const { site } = useSite();
  const lang = useLang();
  const langRoutePrefix = lang === site.lang ? '/' : addTrailingSlash(lang);
  const logo = typeof site.logo === 'string' ? site.logo : site.logo?.light;

  return (
    <div className="rp-nav__title">
      <Link href={site.logoHref || addLeadingSlash(langRoutePrefix)} className="rp-nav__title__link">
        {logo && (
          <div className="rp-nav__title__logo">
            <img src={normalizeImagePath(logo)} alt="logo" className={`rspress-logo rp-nav__title__logo-image ${styles['logo']}`} />
          </div>
        )}
        <Wordmark className={styles['wordmark']} />
      </Link>
    </div>
  );
};
