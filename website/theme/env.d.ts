declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.mdx' {
  import type { FC } from 'react';

  const MDXContent: FC;
  export default MDXContent;
}

declare module '*.mdx?raw' {
  const source: string;
  export default source;
}

interface ImportMetaEnv {
  readonly SSG_MD: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
