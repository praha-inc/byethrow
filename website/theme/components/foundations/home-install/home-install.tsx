import { useI18n } from '@rspress/core/runtime';
import { useEffect, useRef, useState } from 'react';

import { HomeInstallMarkdown } from './home-install-markdown';
import styles from './home-install.module.css';

import type I18nJson from 'i18n';
import type { FC } from 'react';

const PACKAGE = '@praha/byethrow';

const MANAGERS = [
  { name: 'npm', command: 'npm install' },
  { name: 'pnpm', command: 'pnpm add' },
  { name: 'yarn', command: 'yarn add' },
  { name: 'bun', command: 'bun add' },
] as const;

export type PackageManager = (typeof MANAGERS)[number];

type Manager = PackageManager['name'];

const STORAGE_KEY = 'byethrow:package-manager';

const readStoredManager = (): Manager | undefined => {
  try {
    const stored = globalThis.localStorage?.getItem(STORAGE_KEY);
    return MANAGERS.find((manager) => manager.name === stored)?.name;
  } catch {
    return undefined;
  }
};

const CopyIcon: FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V6a2 2 0 0 1 2-2h9" />
  </svg>
);

const CheckIcon: FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export type HomeInstallProps = {
  className?: string | undefined;
};

/** A compact, copyable install command with a package manager switcher. */
export const HomeInstall: FC<HomeInstallProps> = ({ className }) => {
  const t = useI18n<typeof I18nJson>();
  const [manager, setManager] = useState<Manager>('npm');
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const stored = readStoredManager();
    if (stored) setManager(stored);
    return () => clearTimeout(timer.current);
  }, []);

  if (import.meta.env.SSG_MD) {
    return <HomeInstallMarkdown packageName={PACKAGE} managers={MANAGERS} />;
  }

  const select = (name: Manager) => {
    setManager(name);
    try {
      globalThis.localStorage?.setItem(STORAGE_KEY, name);
    } catch {
      // Storage may be unavailable (private mode); the choice just won't persist.
    }
  };

  const command = `${MANAGERS.find((item) => item.name === manager)!.command} ${PACKAGE}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard access can be denied; nothing sensible to do.
    }
  };

  return (
    <div className={[styles['install'], className].filter(Boolean).join(' ')}>
      <div className={styles['managers']} role="tablist" aria-label={t('hero.managers')}>
        {MANAGERS.map(({ name }) => (
          <button
            key={name}
            type="button"
            role="tab"
            aria-selected={manager === name}
            className={styles['manager']}
            onClick={() => select(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <div className={styles['command']}>
        <span className={styles['prompt']} aria-hidden="true">$</span>
        <code className={styles['text']}>{command}</code>
        <button
          type="button"
          className={styles['copy']}
          data-copied={copied}
          aria-label={copied ? t('hero.copied') : t('hero.copy')}
          title={copied ? t('hero.copied') : t('hero.copy')}
          onClick={copy}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
    </div>
  );
};
