import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);

function tool(packageName, binaryName, args) {
  const manifestPath = require.resolve(`${packageName}/package.json`);
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const binary = typeof manifest.bin === 'string' ? manifest.bin : manifest.bin?.[binaryName];
  if (!binary) throw new Error(`Missing local executable: ${packageName}/${binaryName}`);
  return [join(dirname(manifestPath), binary), ...args];
}

function run(label, args) {
  console.log(`\n[check] ${label}`);
  // Invoke local tools through Node, without shell quoting or global executables.
  const result = spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.signal) throw new Error(`${label} interrupted by ${result.signal}`);
  if (result.status !== 0) process.exit(result.status ?? 1);
}

try {
  run('TypeScript', tool('typescript', 'tsc', ['--noEmit']));
  run(
    'ESLint',
    tool('eslint', 'eslint', ['src', 'tests', 'scripts/**/*.mjs', '*.js', '--max-warnings', '0']),
  );
  run('Stylelint', tool('stylelint', 'stylelint', ['src/**/*.css', '--max-warnings', '0']));
  run('BEM HTML/CSS', [join(root, 'scripts/check-bem.mjs')]);
  run('Prettier', tool('prettier', 'prettier', ['--check', '.']));
  const tests = readdirSync(join(root, 'tests'))
    .filter((name) => /\.test\.(?:ts|mjs)$/.test(name))
    .sort()
    .map((name) => join(root, 'tests', name));
  if (!tests.length) throw new Error('No unit tests found.');
  run('Unit tests', ['--experimental-strip-types', '--test', ...tests]);
  run('Production build', tool('vite', 'vite', ['build']));
  run('Performance budgets', [join(root, 'scripts/check-performance.mjs')]);
  run('Security static checks', [join(root, 'scripts/check-security.mjs')]);
  console.log('\n[check] All checks passed.');
} catch (error) {
  console.error(`[check] ${error.message}`);
  process.exitCode = 1;
}
