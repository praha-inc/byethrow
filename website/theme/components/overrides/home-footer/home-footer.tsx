import { useI18n, useSite, withBase } from '@rspress/core/runtime';
import { Link, renderHtmlOrText } from '@rspress/core/theme-original';

import styles from './home-footer.module.css';
import { Wordmark } from '../../foundations/wordmark';

import type I18nJson from 'i18n';
import type { FC } from 'react';

const REPOSITORY = 'https://github.com/praha-inc/byethrow';

type Column = {
  title: string;
  links: ReadonlyArray<{ text: string; href: string }>;
};

const GitHubIcon: FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z" />
  </svg>
);

/** Site map shown at the bottom of the home page. */
export const HomeFooter: FC = () => {
  const t = useI18n<typeof I18nJson>();
  const { site } = useSite();
  const message = site.themeConfig.footer?.message;
  const logo = typeof site.logo === 'string' ? site.logo : site.logo?.light;

  const columns: readonly Column[] = [
    {
      title: t('footer.docs'),
      links: [
        { text: t('footer.introduction'), href: './guide/start/introduction' },
        { text: t('footer.quickStart'), href: './guide/start/quick' },
        { text: t('footer.examples'), href: './examples/parse-package-json' },
        { text: t('footer.api'), href: './api/modules/Result' },
      ],
    },
    {
      title: t('footer.ecosystem'),
      links: [
        { text: t('footer.linter'), href: './guide/ecosystem/linter' },
        { text: t('footer.testing'), href: './guide/ecosystem/testing' },
        { text: t('footer.llm'), href: './guide/ecosystem/llm-integration' },
      ],
    },
    {
      title: t('footer.community'),
      links: [
        { text: 'GitHub', href: REPOSITORY },
        { text: 'npm', href: 'https://www.npmjs.com/package/@praha/byethrow' },
        { text: t('footer.releases'), href: `${REPOSITORY}/releases` },
        { text: t('footer.issues'), href: `${REPOSITORY}/issues` },
      ],
    },
  ];

  return (
    <footer className={styles['footer']}>
      <div className={styles['container']}>
        <div className={styles['top']}>
          <div className={styles['brand']}>
            <span className={styles['name']}>
              {logo && <img className={styles['logo']} src={withBase(logo)} alt="" width={24} height={24} />}
              <Wordmark />
            </span>
            <p className={styles['tagline']}>{t('footer.tagline')}</p>
          </div>
          <nav className={styles['columns']}>
            {columns.map((column) => (
              <div key={column.title} className={styles['column']}>
                <h2 className={styles['column-title']}>{column.title}</h2>
                <ul className={styles['links']}>
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={styles['link'] ?? ''}>{link.text}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className={styles['bottom']}>
          <p className={styles['legal']}>
            {message && <span {...renderHtmlOrText(message)} />}
            {message && <span aria-hidden="true">·</span>}
            <Link href={`${REPOSITORY}/blob/main/LICENSE`} className={styles['legal-link'] ?? ''}>
              {t('footer.license')}
            </Link>
          </p>
          <Link href={REPOSITORY} className={styles['social'] ?? ''} aria-label="GitHub">
            <GitHubIcon />
          </Link>
        </div>
      </div>
    </footer>
  );
};
