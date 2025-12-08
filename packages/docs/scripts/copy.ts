import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import type { Dirent } from 'node:fs';

const walkDirectory = (directory: string, callback: (dirent: Dirent<string>) => void): void => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') continue;
      walkDirectory(path.join(entry.parentPath, entry.name), callback);
    } else if (entry.isFile()) {
      callback(entry);
    }
  }
};

const copyFiles = (source: string, destination: string, filter?: (dirent: Dirent<string>) => boolean): void => {
  walkDirectory(source, (dirent) => {
    if (filter && !filter(dirent)) return;
    const sourcePath = path.join(dirent.parentPath, dirent.name);
    const relativePath = path.relative(source, sourcePath);
    const targetPath = path.join(destination, relativePath);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`Copied: ${targetPath}`);
  });
};

const patchLinks = (documentPath: string) => {
  walkDirectory(documentPath, (dirent) => {
    const filePath = path.join(dirent.parentPath, dirent.name);
    const content = fs.readFileSync(filePath, { encoding: 'utf8' });
    const newContent = content
      .replaceAll(/\s*<SourceCode[^>]*\/>/g, '')
      .replaceAll(/(\/examples\/)([^)]+?)\.md\)/g, '$1$2/README.md)')
      .replaceAll(
        /\[([^\]]+)\]\((\/[^)]+)\)/g,
        (_, label: string, link: string) => {
          const patched = path.relative(
            path.dirname(filePath),
            path.join(distributionPath, link.replace(/^\/byethrow/, '')),
          );
          return `[${label}](${patched.replace(/^(?=[A-Za-z])/, './')})`;
        },
      );

    fs.writeFileSync(filePath, newContent, { encoding: 'utf8' });
    console.log(`Patched links in: ${filePath}`);
  });
};

const checkDeadLinks = (documentPath: string) => {
  const deadLinks: { path: string; link: string; target: string }[] = [];
  walkDirectory(documentPath, (dirent) => {
    if (!dirent.name.endsWith('.md')) return;

    const filePath = path.join(dirent.parentPath, dirent.name);
    const content = fs.readFileSync(filePath, { encoding: 'utf8' });
    for (const [, link] of content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      if (link!.startsWith('http')) {
        continue;
      }

      const targetPath = path.join(path.dirname(filePath), link!.replace(/#.*/, ''));
      if (!fs.existsSync(targetPath)) {
        deadLinks.push({ path: filePath, link: link!, target: targetPath });
      }
    }
  });

  if (deadLinks.length <= 0) {
    console.log('No dead links found.');
  } else {
    throw new Error(
      `Total dead links found: ${deadLinks.length}\n`
      + deadLinks.map(({ path, link, target }) => {
        return `- In file: ${path}, ${link} (resolved to ${target})`;
      }).join('\n'),
    );
  }
};

const documentPath = path.dirname(url.fileURLToPath(import.meta.resolve('@praha/byethrow-website/doc_build')));
const distributionPath = path.join(import.meta.dirname, '../docs');

console.group('Cleaning distribution directory...');
if (fs.existsSync(distributionPath)) {
  console.log('Removing existing distribution directory...');
  fs.rmSync(distributionPath, { recursive: true, force: true });
} else {
  console.log('Distribution directory does not exist. Skipping removal.');
}
console.groupEnd();

console.group('Copying markdown files...');
copyFiles(documentPath, distributionPath, (dirent) => dirent.name.endsWith('.md'));
fs.copyFileSync(path.join(documentPath, 'llms.txt'), path.join(distributionPath, 'index.md'));
console.groupEnd();

console.group('Patching markdown links...');
patchLinks(distributionPath);
console.groupEnd();

console.group('Copying examples directory...');
fs.rmSync(path.join(distributionPath, 'examples'), { recursive: true, force: true });
copyFiles(path.join(import.meta.dirname, '../../../examples'), path.join(distributionPath, 'examples'));
console.groupEnd();

console.group('Checking for dead links...');
checkDeadLinks(distributionPath);
console.groupEnd();

console.log('Done!');
