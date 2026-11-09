import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { relative } from 'node:path';
import {
  root,
  read,
  files,
  sourceAnalysis,
  htmlAnalysis,
  forbiddenArtifact,
  finish,
} from './lib/project-audit.mjs';

const issues = [];
if (!existsSync(new URL('package-lock.json', root))) issues.push('Missing dependency lockfile.');
for (const path of files(fileURLToPath(new URL('src/', root))).filter((p) => p.endsWith('.ts'))) {
  const text = readFileSync(path, 'utf8');
  const source = sourceAnalysis(text, path);
  issues.push(...source.issues.map((issue) => `${path}: ${issue}`));
  for (const html of source.html) issues.push(...htmlAnalysis(html).issues);
}
issues.push(...htmlAnalysis(read('index.html')).issues);
for (const folder of ['public', 'dist']) {
  const directory = fileURLToPath(new URL(`${folder}/`, root));
  if (!existsSync(directory)) {
    issues.push(`Missing ${folder}: run npm run build first.`);
    continue;
  }
  for (const path of files(directory)) {
    const name = relative(directory, path);
    if (forbiddenArtifact(name)) issues.push(`Forbidden deployment file: ${folder}/${name}`);
    if (/\.(?:js|html|css|json|svg|txt)$/i.test(name)) {
      const text = readFileSync(path, 'utf8');
      if (
        /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bAKIA[0-9A-Z]{16}\b|\bghp_[A-Za-z0-9]{36}\b/.test(
          text,
        )
      )
        issues.push(`Potential credential in ${folder}/${name} (value hidden)`);
    }
  }
}
finish('security', [...new Set(issues)]);
