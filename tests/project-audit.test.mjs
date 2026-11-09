import assert from 'node:assert/strict';
import test from 'node:test';
import {
  bemIssues,
  htmlAnalysis,
  cssAnalysis,
  sourceAnalysis,
  forbiddenArtifact,
  budgetIssues,
} from '../scripts/lib/project-audit.mjs';

test('BEM validates class syntax and requires modifiers to share a base class', () => {
  assert.deepEqual(bemIssues(['card', 'card__title', 'card__title--large']), []);
  assert.equal(bemIssues(['card__title__icon', 'BadClass']).length, 2);
  assert.match(htmlAnalysis('<div class="card--open"></div>').issues.join(), /base class/);
  assert.deepEqual(htmlAnalysis('<div class="card card--open"></div>').issues, []);
});

test('HTML checker catches duplicate ids, event handlers and executable URLs', () => {
  const result = htmlAnalysis(
    '<div id="x"></div><a id="x" onclick="bad()" href="java&#x73;cript:bad()">x</a>',
  );
  assert.equal(result.issues.length, 3);
});

test('CSS parser finds classes including escaped names and rejects id selectors', () => {
  const result = cssAnalysis('.card:hover, #dialog .card__title { color: red; }');
  assert.deepEqual(result.classes, ['card', 'card__title']);
  assert.equal(result.issues.length, 1);
  assert.equal(cssAnalysis('.card { color: #abcdef; }').issues.length, 0);
});

test('static templates resolve literal helpers without executing application code', () => {
  const result = sourceAnalysis(
    'const door = (side: string) => `<div class="home__door home__door--${side}"></div>`; app.innerHTML = `${door("left")}`;',
  );
  assert.deepEqual(result.issues, []);
  assert.match(result.html[0], /home__door--left/);
  assert.deepEqual(htmlAnalysis(result.html[0]).issues, []);
});

test('security rejects dynamic HTML and runtime code execution', () => {
  assert.equal(
    sourceAnalysis('el.innerHTML = userInput; eval(userInput); new Function(userInput);').issues
      .length,
    3,
  );
  assert.deepEqual(
    sourceAnalysis('el.textContent = userInput; el.innerHTML = "<span>safe</span>";').issues,
    [],
  );
});

test('artifact checks distinguish forbidden sources from runtime models', () => {
  for (const file of [
    'model.blend',
    'file.py',
    '.env.local',
    'code.js.map',
    'art/source.png',
    '.git/config',
  ])
    assert.equal(forbiddenArtifact(file), true, file);
  for (const file of ['models/character.glb', 'assets/main.js', 'branding/logo.png'])
    assert.equal(forbiddenArtifact(file), false, file);
});

test('performance gates enforce raw gzip per-file and total budgets', () => {
  const limits = { perFileBytes: { js: 100 }, jsGzipBytes: 40, totalBytes: 150 };
  assert.deepEqual(budgetIssues([{ name: 'a.js', bytes: 100, gzip: 40 }], limits), []);
  assert.equal(budgetIssues([{ name: 'a.js', bytes: 151, gzip: 41 }], limits).length, 3);
});
