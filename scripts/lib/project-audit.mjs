import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';
import { parseFragment } from 'parse5';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';
import { gzipSync } from 'node:zlib';

export const root = new URL('../../', import.meta.url);
export const read = (file) => readFileSync(new URL(file, root), 'utf8');
export function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}

export function sourceAnalysis(text, filename = 'source.ts') {
  const tree = ts.createSourceFile(filename, text, ts.ScriptTarget.Latest, true);
  const constants = new Map();
  const visit = (node, callback) => {
    callback(node);
    ts.forEachChild(node, (child) => visit(child, callback));
  };
  visit(tree, (node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      constants.set(node.name.text, node.initializer);
    }
  });
  // Interpret only literal strings, template interpolation and local arrow helpers.
  // Never execute application code to inspect its HTML.
  function literal(node, scope = new Map(), depth = 0) {
    if (!node || depth > 30) throw new Error('Non-static HTML expression');
    const next = (value, bindings = scope) => literal(value, bindings, depth + 1);
    if (ts.isStringLiteralLike(node)) return node.text;
    if (ts.isIdentifier(node)) {
      if (scope.has(node.text)) return scope.get(node.text);
      return next(constants.get(node.text));
    }
    if (ts.isTemplateExpression(node)) {
      return (
        node.head.text +
        node.templateSpans.map((span) => next(span.expression) + span.literal.text).join('')
      );
    }
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
      const helper = constants.get(node.expression.text);
      if (helper && ts.isArrowFunction(helper) && !ts.isBlock(helper.body)) {
        const bindings = new Map(scope);
        helper.parameters.forEach((param, index) =>
          bindings.set(param.name.getText(tree), next(node.arguments[index])),
        );
        return next(helper.body, bindings);
      }
    }
    throw new Error('Non-static HTML expression');
  }
  const html = [];
  const classes = [];
  const issues = [];
  visit(tree, (node) => {
    if (
      ts.isBinaryExpression(node) &&
      node.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
      ts.isPropertyAccessExpression(node.left)
    ) {
      if (node.left.name.text === 'innerHTML' || node.left.name.text === 'outerHTML') {
        try {
          html.push(literal(node.right));
        } catch {
          issues.push('Dynamic HTML assignment: use textContent or explicit DOM creation.');
        }
      }
      if (node.left.name.text === 'className') {
        try {
          classes.push(...literal(node.right).split(/\s+/));
        } catch {
          issues.push('Unresolved dynamic className: add explicit validation.');
        }
      }
    }
    if (ts.isCallExpression(node)) {
      const call = node.expression.getText(tree);
      if (
        call === 'eval' ||
        call === 'Function' ||
        /\.(?:write|writeln|insertAdjacentHTML)$/.test(call)
      )
        issues.push(`Unsafe code/HTML sink: ${call}`);
    }
    if (ts.isNewExpression(node) && node.expression.getText(tree) === 'Function')
      issues.push('Dynamic Function constructor.');
  });
  return { html, classes, issues };
}

export function htmlAnalysis(text) {
  const classes = [];
  const issues = [];
  const ids = new Set();
  function walk(node) {
    const attrs = new Map((node.attrs ?? []).map((attr) => [attr.name, attr.value]));
    if (attrs.has('id')) {
      if (ids.has(attrs.get('id'))) issues.push(`Duplicate HTML id: ${attrs.get('id')}`);
      ids.add(attrs.get('id'));
    }
    const names = (attrs.get('class') ?? '').split(/\s+/).filter(Boolean);
    classes.push(...names);
    for (const name of names) {
      if (name.includes('--') && !names.includes(name.split('--')[0]))
        issues.push(`Modifier missing its base class: ${name}`);
    }
    for (const [name, value] of attrs) {
      if (/^on/i.test(name)) issues.push(`Inline event handler: ${name}`);
      if (
        ['href', 'src', 'action', 'xlink:href'].includes(name) &&
        /^(?:javascript|vbscript):/i.test(
          [...value].filter((char) => char.codePointAt(0) > 32).join(''),
        )
      )
        issues.push(`Unsafe URL in ${name}`);
    }
    if (attrs.get('target') === '_blank' && !/\bnoopener\b/.test(attrs.get('rel') ?? ''))
      issues.push('External window link requires rel=noopener.');
    for (const child of node.childNodes ?? []) walk(child);
    if (node.content) walk(node.content);
  }
  walk(parseFragment(text));
  return { classes, issues };
}

export function bemIssues(classes) {
  const pattern =
    /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__[a-z0-9]+(?:-[a-z0-9]+)*)?(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?$/;
  return [...new Set(classes)]
    .filter((name) => !pattern.test(name))
    .map((name) => `Invalid BEM class: ${name}`);
}

export function cssAnalysis(text) {
  const classes = [];
  const issues = [];
  postcss.parse(text).walkRules((rule) => {
    selectorParser((selectors) => {
      selectors.walkClasses((node) => classes.push(node.value));
      selectors.walkIds((node) =>
        issues.push(`Use a class instead of CSS id selector: #${node.value}`),
      );
    }).processSync(rule.selector);
  });
  return { classes, issues };
}

export function forbiddenArtifact(file) {
  return (
    /(?:^|[/\\])(?:art|scripts|tests|node_modules|\.git|\.qa|\.cache)(?:[/\\]|$)/.test(file) ||
    /(?:\.blend\d*|\.py|\.ts|\.map|\.pem|\.key|\.env(?:\..*)?)$/i.test(file)
  );
}

export function budgetIssues(assets, budgets) {
  const issues = [];
  let total = 0;
  for (const asset of assets) {
    total += asset.bytes;
    const extension = asset.name.split('.').pop();
    const limit = budgets.perFileBytes[extension];
    if (limit && asset.bytes > limit)
      issues.push(`${asset.name}: ${asset.bytes} bytes exceeds ${limit}`);
    if (extension === 'js' && asset.gzip > budgets.jsGzipBytes)
      issues.push(`${asset.name}: gzip budget exceeded`);
  }
  if (total > budgets.totalBytes)
    issues.push(`Total artifact ${total} bytes exceeds ${budgets.totalBytes}`);
  return issues;
}

export function artifactSizes(directory) {
  return files(directory).map((path) => ({
    name: path.slice(directory.length + 1),
    bytes: statSync(path).size,
    gzip: path.endsWith('.js') ? gzipSync(readFileSync(path)).length : 0,
  }));
}

export function finish(label, issues) {
  for (const issue of issues) console.error(`[${label}] ${issue}`);
  if (issues.length) process.exitCode = 1;
  else console.log(`[${label}] Passed within the documented static scope.`);
}
