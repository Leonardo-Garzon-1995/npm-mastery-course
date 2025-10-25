#!/usr/bin/env node
/**
 * NPM Package Inspector CLI
 * Subcommands: info, versions, deps, compare
 * Flags: --json, --limit=<n>, --max=<n>
 * Uses `npm view` via child_process; no external deps.
 */

const { execSync } = require('child_process');

const args = process.argv.slice(2);
const cmd = (args[0] || 'help').toLowerCase();
const flags = parseFlags(args.slice(1));

function parseFlags(argv) {
  const out = { _: [] };
  for (const a of argv) {
    if (a.startsWith('--')) {
      const [k, v = 'true'] = a.replace(/^--/, '').split('=');
      out[k] = v;
    } else {
      out._.push(a);
    }
  }
  return out;
}

function sh(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8' }).trim();
  } catch (e) {
    return '';
  }
}

function view(pkg, field) {
  const cmd = field ? `npm view ${pkg} ${field}` : `npm view ${pkg}`;
  const out = sh(cmd);
  return out;
}

function asJson(data) {
  console.log(JSON.stringify(data, null, 2));
}

function asTable(rows) {
  if (!rows.length) return;
  const cols = Object.keys(rows[0]);
  const colWidths = cols.map(c => Math.max(c.length, ...rows.map(r => String(r[c] ?? '').length)));
  const line = () => '┌' + colWidths.map(w => '─'.repeat(w + 2)).join('┬') + '┐';
  const mid  = () => '├' + colWidths.map(w => '─'.repeat(w + 2)).join('┼') + '┤';
  const end  = () => '└' + colWidths.map(w => '─'.repeat(w + 2)).join('┴') + '┘';
  const cell = (v, w) => ' ' + String(v ?? '').padEnd(w, ' ') + ' ';

  console.log(line());
  console.log('│' + cols.map((c, i) => cell(c, colWidths[i])).join('│') + '│');
  console.log(mid());
  for (const r of rows) {
    console.log('│' + cols.map((c, i) => cell(r[c], colWidths[i])).join('│') + '│');
  }
  console.log(end());
}

function kb(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return '';
  return (v / 1024).toFixed(2);
}

function parseJsonish(str) {
  // npm may output arrays like: [ '1.0.0', '1.1.0' ]
  try {
    return JSON.parse(str.replace(/'/g, '"'));
  } catch {
    return null;
  }
}

function parseObjish(str) {
  // npm may output object-ish: { dep: '^1.0.0', x: '...' }
  try {
    const fixed = str
      .replace(/(\w+):/g, '"$1":')   // keys to "keys":
      .replace(/'/g, '"');           // single to double quotes
    return JSON.parse(fixed);
  } catch {
    return null;
  }
}

// ----- commands -------------------------------------------------------------

function cmdInfo(pkg) {
  if (!pkg) return error('Usage: info <package>');
  const data = {
    name: pkg,
    version: view(pkg, 'version'),
    license: view(pkg, 'license'),
    description: view(pkg, 'description'),
    repository: view(pkg, 'repository.url'),
    homepage: view(pkg, 'homepage'),
    unpackedSizeKB: kb(view(pkg, 'dist.unpackedSize'))
  };
  if (flags.json) return asJson({ ok: true, command: 'info', data });
  const rows = Object.entries(data).map(([field, value]) => ({ field, value }));
  asTable(rows);
}

function cmdVersions(pkg) {
  if (!pkg) return error('Usage: versions <package> [--limit=N]');
  const raw = view(pkg, 'versions');
  const arr = parseJsonish(raw) || [];
  const limit = Number(flags.limit || 5);
  const recent = arr.slice(-limit);
  if (flags.json) return asJson({ ok: true, command: 'versions', package: pkg, versions: recent });
  asTable(recent.map(v => ({ version: v })));
}

function cmdDeps(pkg) {
  if (!pkg) return error('Usage: deps <package> [--max=N]');
  const raw = view(pkg, 'dependencies');
  const obj = parseObjish(raw) || {};
  const entries = Object.entries(obj);
  const max = Number(flags.max || 10);
  const list = entries.slice(0, max).map(([name, range]) => ({ name, range }));
  if (flags.json) return asJson({ ok: true, command: 'deps', package: pkg, dependencies: list });
  if (!list.length) return console.log('(no dependencies)');
  asTable(list);
}

function cmdCompare(a, b) {
  if (!a || !b) return error('Usage: compare <pkgA> <pkgB>');
  const dataA = {
    version: view(a, 'version'),
    license: view(a, 'license'),
    depsCount: Object.keys(parseObjish(view(a, 'dependencies')) || {}).length,
    sizeKB: kb(view(a, 'dist.unpackedSize'))
  };
  const dataB = {
    version: view(b, 'version'),
    license: view(b, 'license'),
    depsCount: Object.keys(parseObjish(view(b, 'dependencies')) || {}).length,
    sizeKB: kb(view(b, 'dist.unpackedSize'))
  };
  if (flags.json) return asJson({ ok: true, command: 'compare', a: { name: a, ...dataA }, b: { name: b, ...dataB } });
  asTable([
    { field: 'version', [a]: dataA.version, [b]: dataB.version },
    { field: 'license', [a]: dataA.license, [b]: dataB.license },
    { field: 'depsCount', [a]: dataA.depsCount, [b]: dataB.depsCount },
    { field: 'size(KB)', [a]: dataA.sizeKB, [b]: dataB.sizeKB }
  ]);
}

function help() {
  console.log(`
Usage:
  npx . <command> [args] [--flags]
  or: node app.js <command> [args] [--flags]

Commands:
  info <pkg>                Show key fields (version, license, repo, size)
  versions <pkg> [--limit]  Show recent versions
  deps <pkg> [--max]        List dependencies
  compare <a> <b>           Compare two packages
Flags:
  --json                    Output JSON
  --limit=<n>               Versions limit (default 5)
  --max=<n>                 Dependencies limit (default 10)

Examples:
  npx . info express
  npx . versions react --limit=7
  npx . deps fastify --max=15
  npx . compare axios node-fetch --json
`);
}

function error(msg) {
  console.error(msg);
  process.exitCode = 1;
}

// router
const [a, b] = flags._;
switch (cmd) {
  case 'info':     cmdInfo(a); break;
  case 'versions': cmdVersions(a); break;
  case 'deps':     cmdDeps(a); break;
  case 'compare':  cmdCompare(a, b); break;
  default:         help(); break;
}
