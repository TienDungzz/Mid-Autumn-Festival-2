import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { root, read, artifactSizes, budgetIssues, finish } from './lib/project-audit.mjs';

const directory = fileURLToPath(new URL('dist/', root));
if (!existsSync(directory)) {
  console.error('[performance] Missing dist: run npm run build first.');
  process.exitCode = 1;
} else {
  const assets = artifactSizes(directory);
  console.log(
    `[performance] ${assets.length} files, ${assets.reduce((sum, a) => sum + a.bytes, 0)} bytes.`,
  );
  finish('performance', budgetIssues(assets, JSON.parse(read('scripts/performance-budgets.json'))));
}
