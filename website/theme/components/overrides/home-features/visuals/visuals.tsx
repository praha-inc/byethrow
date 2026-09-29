import { useI18n } from '@rspress/core/runtime';

import styles from './visuals.module.css';

import type I18nJson from 'i18n';
import type { FC } from 'react';

const cx = (...names: Array<string | undefined | false>): string => names.filter(Boolean).join(' ');

/** Result<T, E> branching into Success and Failure. */
export const ResultVisual: FC = () => (
  <div className={styles['result']}>
    <svg className={styles['svg']} viewBox="0 0 360 150" role="presentation">
      <path className={cx(styles['rail'], styles['rail--ok'])} d="M112 75 C 160 75, 160 36, 212 36" />
      <path className={cx(styles['rail'], styles['rail--err'])} d="M112 75 C 160 75, 160 114, 212 114" />
      <g className={cx(styles['node'], styles['node--neutral'])}>
        <rect x="8" y="58" width="104" height="34" rx="10" />
        <text x="60" y="80" textAnchor="middle">Result&lt;T, E&gt;</text>
      </g>
      <g className={cx(styles['node'], styles['node--ok'])}>
        <rect x="212" y="19" width="140" height="34" rx="10" />
        <text x="282" y="41" textAnchor="middle">Success {'{ value: T }'}</text>
      </g>
      <g className={cx(styles['node'], styles['node--err'])}>
        <rect x="212" y="97" width="140" height="34" rx="10" />
        <text x="282" y="119" textAnchor="middle">Failure {'{ error: E }'}</text>
      </g>
      <circle className={cx(styles['dot'], styles['dot--ok'])} r="4">
        <animateMotion dur="2.6s" repeatCount="indefinite" path="M112 75 C 160 75, 160 36, 212 36" />
      </circle>
      <circle className={cx(styles['dot'], styles['dot--err'])} r="4">
        <animateMotion dur="2.6s" begin="1.3s" repeatCount="indefinite" path="M112 75 C 160 75, 160 114, 212 114" />
      </circle>
    </svg>
  </div>
);

/** The two object shapes a Result can take, printed like log output. */
export const ObjectsVisual: FC = () => (
  <div className={styles['objects']}>
    <div className={styles['literals']}>
      <div className={cx(styles['literal'], styles['literal--ok'])}>
        <i className={styles['literal-dot']} />
        <code className={styles['literal-code']}>
          <span className={styles['pn']}>{'{ '}</span>
          <span className={styles['key']}>type</span>
          <span className={styles['pn']}>: </span>
          <span className={styles['str']}>'Success'</span>
          <span className={styles['pn']}>, </span>
          <span className={styles['key']}>value</span>
          <span className={styles['pn']}>: </span>
          <span className={styles['num']}>42</span>
          <span className={styles['pn']}>{' }'}</span>
        </code>
      </div>
      <div className={cx(styles['literal'], styles['literal--err'])}>
        <i className={styles['literal-dot']} />
        <code className={styles['literal-code']}>
          <span className={styles['pn']}>{'{ '}</span>
          <span className={styles['key']}>type</span>
          <span className={styles['pn']}>: </span>
          <span className={styles['str']}>'Failure'</span>
          <span className={styles['pn']}>, </span>
          <span className={styles['key']}>error</span>
          <span className={styles['pn']}>: </span>
          <span className={styles['cls']}>NotFound</span>
          <span className={styles['pn']}>{' }'}</span>
        </code>
      </div>
    </div>
    <div className={styles['tags']}>
      <span className={styles['tag']}>JSON.stringify ✓</span>
      <span className={styles['tag']}>structuredClone ✓</span>
      <span className={styles['tag']}>no instanceof</span>
    </div>
  </div>
);

const PIPELINE_STEPS: ReadonlyArray<{ name: string; args: string }> = [
  { name: 'succeed', args: '(id)' },
  { name: 'andThen', args: '(findUser)' },
  { name: 'map', args: '(toDto)' },
  { name: 'unwrap', args: '()' },
];

/** Steps of a pipe, with a success run and a failure that bypasses the rest. */
export const PipelineVisual: FC = () => {
  const t = useI18n<typeof I18nJson>();

  return (
    <div className={styles['pipeline']}>
      <div className={styles['steps']}>
        {PIPELINE_STEPS.map(({ name, args }, index) => (
          <span key={name} className={styles['step']} style={{ animationDelay: `${index * 0.9}s` }}>
            {name}
            <span className={styles['step-args']}>{args}</span>
          </span>
        ))}
      </div>
      <div className={styles['tracks']}>
        <div className={cx(styles['track'], styles['track--ok'])}>
          <i className={cx(styles['runner'], styles['runner--ok'])} />
        </div>
        <div className={cx(styles['track'], styles['track--err'])}>
          <i className={cx(styles['runner'], styles['runner--err'])} />
        </div>
      </div>
      <p className={styles['caption']}>
        <i className={cx(styles['legend-dot'], styles['legend-dot--err'])} />
        {t('features.pipeline.caption')}
      </p>
    </div>
  );
};

/** Result and Promise<Result> flowing through the same function. */
export const AsyncVisual: FC = () => (
  <div className={styles['async']}>
    <svg className={styles['svg']} viewBox="0 0 360 130" role="presentation">
      <path className={cx(styles['rail'], styles['rail--ok'])} d="M128 28 C 154 28, 154 65, 180 65" />
      <path className={cx(styles['rail'], styles['rail--teal'])} d="M128 102 C 154 102, 154 65, 180 65" />
      <path className={cx(styles['rail'], styles['rail--ok'])} d="M250 65 C 280 65, 280 28, 310 28" />
      <path className={cx(styles['rail'], styles['rail--teal'])} d="M250 65 C 280 65, 280 102, 310 102" />
      <g className={cx(styles['node'], styles['node--ok'])}>
        <rect x="4" y="11" width="124" height="34" rx="10" />
        <text x="66" y="33" textAnchor="middle">Result&lt;T, E&gt;</text>
      </g>
      <g className={cx(styles['node'], styles['node--teal'])}>
        <rect x="4" y="85" width="124" height="34" rx="10" />
        <text x="66" y="107" textAnchor="middle">ResultAsync&lt;T, E&gt;</text>
      </g>
      <g className={cx(styles['node'], styles['node--brand'])}>
        <rect x="180" y="46" width="70" height="38" rx="12" />
        <text x="215" y="70" textAnchor="middle">map(fn)</text>
      </g>
      <g className={cx(styles['node'], styles['node--ok'])}>
        <rect x="310" y="11" width="44" height="34" rx="10" />
        <text x="332" y="33" textAnchor="middle">U</text>
      </g>
      <g className={cx(styles['node'], styles['node--teal'])}>
        <rect x="310" y="85" width="44" height="34" rx="10" />
        <text x="332" y="107" textAnchor="middle">U</text>
      </g>
      <circle className={cx(styles['dot'], styles['dot--ok'])} r="4">
        <animateMotion dur="3s" repeatCount="indefinite" path="M128 28 C 154 28, 154 65, 180 65 L 250 65 C 280 65, 280 28, 310 28" />
      </circle>
      <circle className={cx(styles['dot'], styles['dot--teal'])} r="4">
        <animateMotion dur="3s" begin="1.5s" repeatCount="indefinite" path="M128 102 C 154 102, 154 65, 180 65 L 250 65 C 280 65, 280 102, 310 102" />
      </circle>
    </svg>
  </div>
);

const FUNCTIONS: ReadonlyArray<{ name: string; used: boolean }> = [
  { name: 'pipe', used: true },
  { name: 'succeed', used: false },
  { name: 'fail', used: false },
  { name: 'map', used: true },
  { name: 'andThen', used: true },
  { name: 'orElse', used: false },
  { name: 'try', used: false },
  { name: 'fn', used: false },
  { name: 'collect', used: false },
  { name: 'unwrap', used: true },
  { name: 'sequence', used: false },
  { name: 'parse', used: false },
];

/** Only the imported functions survive tree shaking. */
export const TreeshakeVisual: FC = () => {
  const t = useI18n<typeof I18nJson>();

  return (
    <div className={styles['treeshake']}>
      <div className={styles['fns']}>
        {FUNCTIONS.map(({ name, used }, index) => (
          <span
            key={name}
            className={cx(styles['fn'], used && styles['fn--used'])}
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            {name}
          </span>
        ))}
      </div>
      <div className={styles['legend']}>
        <span className={styles['legend-item']}>
          <i className={cx(styles['legend-dot'], styles['legend-dot--ok'])} />
          {t('features.treeshake.bundled')}
        </span>
        <span className={styles['legend-item']}>
          <i className={cx(styles['legend-dot'], styles['legend-dot--off'])} />
          {t('features.treeshake.dropped')}
        </span>
      </div>
    </div>
  );
};

const ShieldIcon: FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const FlaskIcon: FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3h6M10 3v6l-5.5 9A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3L14 9V3" />
    <path d="M7.5 15h9" />
  </svg>
);

const SparkIcon: FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3z" />
    <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
  </svg>
);

/** Linter, test matchers and LLM docs. */
export const EcosystemVisual: FC = () => {
  const t = useI18n<typeof I18nJson>();

  const rows = [
    { icon: <ShieldIcon />, label: t('features.ecosystem.lint'), code: 'no-throw-in-callback' },
    { icon: <FlaskIcon />, label: t('features.ecosystem.test'), code: 'expect(result).toBeSuccess()' },
    { icon: <SparkIcon />, label: t('features.ecosystem.ai'), code: 'byethrow-docs init claude' },
  ];

  return (
    <div className={styles['ecosystem']}>
      {rows.map((row) => (
        <div key={row.code} className={styles['tool']}>
          <span className={styles['tool-icon']}>{row.icon}</span>
          <span className={styles['tool-body']}>
            <span className={styles['tool-label']}>{row.label}</span>
            <code className={styles['tool-code']}>{row.code}</code>
          </span>
        </div>
      ))}
    </div>
  );
};
