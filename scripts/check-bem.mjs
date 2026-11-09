import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import {
  root,
  read,
  files,
  sourceAnalysis,
  htmlAnalysis,
  bemIssues,
  cssAnalysis,
  finish,
} from './lib/project-audit.mjs';

const classes = [];
const issues = [];
for (const path of files(fileURLToPath(new URL('src/', root))).filter((p) => p.endsWith('.ts'))) {
  const source = sourceAnalysis(readFileSync(path, 'utf8'), path);
  classes.push(...source.classes);
  issues.push(...source.issues.map((issue) => `${path}: ${issue}`));
  for (const text of source.html) {
    const result = htmlAnalysis(text);
    classes.push(...result.classes);
    issues.push(...result.issues);
  }
}
const entry = htmlAnalysis(read('index.html'));
classes.push(...entry.classes);
issues.push(...entry.issues);
const css = cssAnalysis(read('src/shared/styles/main.css'));
issues.push(...css.issues, ...bemIssues([...classes, ...css.classes]));
const known = new Set(classes);
for (const name of css.classes)
  if (!known.has(name) && !['home--opening', 'reduced-motion'].includes(name))
    issues.push(`CSS class has no static HTML/className declaration: ${name}`);
finish('BEM HTML/CSS', [...new Set(issues)]);
