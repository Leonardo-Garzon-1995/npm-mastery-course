#!/usr/bin/env node
/**
 * package.json Inspector & Guardrails (no deps, ESM)
 * Pretty Quick Overview + Validate + Entries + Bump
 *
 * Usage:
 *   node inspect-package-json.js
 *   node inspect-package-json.js validate
 *   node inspect-package-json.js entries
 *   node inspect-package-json.js bump patch|minor|major
 *   node inspect-package-json.js --plain (disable colors/emojis)
 */

import fs from 'node:fs';
import path from 'node:path';

// ---------- CLI args / flags ----------
const args = process.argv.slice(2);
const PLAIN = args.includes('--plain');
const WIDTH = 64;

// ---------- Colors (ANSI) ----------
const rawColors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

const noColors = Object.fromEntries(Object.keys(rawColors).map(k => [k, '']));
const colors = PLAIN ? noColors : rawColors;

// ---------- Symbols / Emojis (fallback in --plain) ----------
const sym = {
  dot: PLAIN ? '-' : '•',
  ok: PLAIN ? '[OK]' : '✔',
  info: PLAIN ? '[i]' : 'ℹ',
  pkg: PLAIN ? '[pkg]' : '📦',
  gear: PLAIN ? '[cfg]' : '⚙',
  exp: PLAIN ? '[ver]' : '🧭',
};

// ---------- Small utils ----------
function hr(width = WIDTH, ch = '─') { return ch.repeat(width); }
function padRight(s, n) { return (s + ' '.repeat(n)).slice(0, n); }
function kv(label, value, labelW = 14) {
  const l = padRight(label, labelW);
  return ` ${sym.dot} ${colors.bold}${l}${colors.reset} ${value}`;
}
function box(title, body, width = WIDTH) {
  const top = `╔${hr(width)}╗`;
  const head = `║ ${padRight(title, width - 2)} ║`;
  const sep = `╠${hr(width)}╣`;
  const mid = body.split('\n').map(line => `║ ${padRight(line, width - 2)} ║`).join('\n');
  const btm = `╚${hr(width)}╝`;
  return [top, head, sep, mid, btm].join('\n');
}

function ok(msg)  { console.log(colors.green + (PLAIN ? 'OK ' : '✔ ') + msg + colors.reset); }
function warn(msg){ console.log(colors.yellow + (PLAIN ? 'WARN ' : '⚠ ') + msg + colors.reset); }
function fail(msg){ console.error(colors.red + (PLAIN ? 'ERR ' : '✖ ') + msg + colors.reset); process.exit(1); }

// ---------- package.json IO ----------
const PKG_PATH = path.resolve(process.cwd(), 'package.json');

function loadPkg() {
  if (!fs.existsSync(PKG_PATH)) fail(`package.json not found at ${PKG_PATH}`);
  try {
    return JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'));
  } catch (e) {
    fail(`Invalid JSON in package.json: ${e.message}`);
  }
}

function savePkg(pkg) {
  fs.writeFileSync(PKG_PATH, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
}

// ---------- Validators ----------
function isValidName(name) {
  // simplified npm rules
  return typeof name === 'string'
    && name.length > 0
    && name === name.toLowerCase()
    && !/[\s]/.test(name)
    && !/^[._]/.test(name);
}

function isSemver(version) {
  // X.Y.Z only
  return /^\d+\.\d+\.\d+$/.test(version);
}

// ---------- Actions ----------
function validate(pkg) {
  console.log(colors.cyan + colors.bold + '\nValidating package.json...\n' + colors.reset);

  if (!pkg.name) fail('Missing "name"');
  if (!isValidName(pkg.name)) fail(`Invalid "name": "${pkg.name}" (lowercase, no spaces, no leading . or _)`);

  if (!pkg.version) fail('Missing "version"');
  if (!isSemver(pkg.version)) fail(`Invalid "version" (must be X.Y.Z): "${pkg.version}"`);

  if (pkg.private !== true) {
    warn('"private" is not true. For applications, set "private": true to avoid accidental publish.');
  } else {
    ok('"private" is true');
  }

  if (!pkg.engines || !pkg.engines.node) {
    warn('Missing "engines.node". Example: ">=18"');
  } else {
    ok(`engines.node set to "${pkg.engines.node}"`);
  }

  const type = pkg.type || 'commonjs';
  ok(`type: "${type}"`);

  if (pkg.exports) {
    if (typeof pkg.exports !== 'object') {
      fail('"exports" must be an object mapping subpaths to entrypoints');
    } else {
      ok('"exports" exists (modern resolution)');
      const dot = pkg.exports['.'];
      if (!dot || typeof dot !== 'object') {
        warn('Missing exports["."]; add { "import": "...", "require": "..." }');
      } else if (!dot.import && !dot.require) {
        warn('Provide at least one of "import" or "require" under exports["."]');
      }
    }
  } else {
    warn('No "exports" found. Fine for apps; recommended for libraries.');
  }

  if (pkg.sideEffects === undefined) {
    warn('Consider "sideEffects": false for libraries to enable tree-shaking.');
  }

  ok('Basic validation passed.\n');
}

function showEntries(pkg) {
  console.log(colors.cyan + colors.bold + '\nEntry Resolution Overview\n' + colors.reset);
  const type = pkg.type || 'commonjs';
  console.log(kv('Type', type));
  console.log(kv('Main', pkg.main ?? '(not set)'));
  console.log(kv('Exports', pkg.exports ? 'present' : '(not set)'));

  console.log('\nInterpretation:');
  if (pkg.exports) {
    console.log(` ${sym.dot} Node prefers "exports" over "main" for subpath imports.`);
  } else if (pkg.main) {
    console.log(` ${sym.dot} Without "exports", Node/bundlers use "main".`);
  } else {
    console.log(` ${sym.dot} No "exports" or "main": resolver may fall back to index.js by convention.`);
  }
  console.log();
}

function bumpVersion(pkg, kind) {
  if (!isSemver(pkg.version)) fail(`Cannot bump invalid version "${pkg.version}"`);
  const [maj, min, pat] = pkg.version.split('.').map(n => parseInt(n, 10));
  let next;
  switch (kind) {
    case 'patch': next = [maj, min, pat + 1]; break;
    case 'minor': next = [maj, min + 1, 0];   break;
    case 'major': next = [maj + 1, 0, 0];     break;
    default: fail(`Unknown bump kind "${kind}". Use patch|minor|major.`);
  }
  const newVersion = next.join('.');
  pkg.version = newVersion;
  savePkg(pkg);
  ok(`Bumped version to ${newVersion}`);
}

function banner() {
  if (PLAIN) return;
  console.log(colors.bold + colors.cyan);
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                 package.json Inspector                     ║');
  console.log('║            Anatomy • Mutations • Guardrails                ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(colors.reset);
}

function prettyOverview(pkg) {
  const summary = [
    `${sym.pkg}  ${colors.bold}${pkg.name}${colors.reset}`,
    kv('Version',      pkg.version ?? '(none)'),
    kv('Type',         pkg.type || 'commonjs'),
    kv('Private',      String(pkg.private ?? false)),
    kv('Engines',      pkg.engines?.node ? `node ${pkg.engines.node}` : '(not set)'),
    kv('Exports Map',  pkg.exports ? 'present' : '—'),
    kv('Main Entry',   pkg.main ?? '(not set)'),
  ].join('\n');

  const footer = [
    `${sym.info}  Try: ${colors.cyan}npm run validate${colors.reset}  ${colors.yellow}•${colors.reset}  ${colors.cyan}npm run entries${colors.reset}`,
    `${sym.gear}  Mutate: ${colors.cyan}npm pkg set type="module" engines.node=">=18"${colors.reset}`,
    `${sym.exp}  Versioning: ${colors.cyan}npm run bump:patch${colors.reset}  ${colors.yellow}•${colors.reset}  ${colors.cyan}bump:minor${colors.reset}  ${colors.yellow}•${colors.reset}  ${colors.cyan}bump:major${colors.reset}`,
  ].join('\n');

  console.log(
    colors.cyan +
    box('Quick Overview', summary, WIDTH) +
    '\n' +
    box('Tips', footer, WIDTH) +
    colors.reset +
    '\n'
  );
}

// ---------- Main ----------
function main() {
  const pkg = loadPkg();

  // remove flags from args for command parsing
  const filtered = args.filter(a => a !== '--plain');
  const cmd = filtered[0];
  const arg = filtered[1];

  banner();

  switch (cmd) {
    case 'validate':
      validate(pkg);
      break;
    case 'entries':
      showEntries(pkg);
      break;
    case 'bump':
      bumpVersion(pkg, arg);
      break;
    case undefined:
      prettyOverview(pkg);
      break;
    default:
      fail(`Unknown command "${cmd}". Try: validate | entries | bump <patch|minor|major> [--plain]`);
  }
}

main();

