import { parse } from 'yaml';
export function validateSource(source, slug) {
  const head = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!head || parse(head[1])?.routerMode !== 'hash')
    throw new Error(`${slug}: use routerMode: hash so shared page links work on GitHub Pages`);
}
