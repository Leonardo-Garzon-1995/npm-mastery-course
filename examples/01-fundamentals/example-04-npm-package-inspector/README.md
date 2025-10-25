# Module 1 – Example 04: NPM Package Inspector (CLI)

## Overview
This example teaches how to build and use a **real CLI** for exploring NPM packages **before installing** them.  
You can:
- Print key **package info** (version, license, repo, homepage, size)
- List recent **versions**
- Inspect **dependencies**
- **Compare** two packages side-by-side  
All results can be shown as a **pretty table** (default) or **JSON** (`--json`).

## Folder Structure
```
examples/
└── module-01/
    └── example-04-npm-package-inspector/
        ├── README.md
        ├── package.json
        └── app.js
```

## Files Content (High Level)

- **README.md** — this guide
- **package.json** — declares `bin`, npm scripts, metadata (so you can run via `npx .`)
- **app.js** — CLI source (subcommands: `info`, `versions`, `deps`, `compare`)

> Note: This example shells out to `npm view` under the hood; no external dependencies are required.

---

## What You'll Learn

- Using **`npm view`** to read package metadata without installing
- Building a **single-file CLI** that supports:
  - **Subcommands** (`info`, `versions`, `deps`, `compare`)
  - **Flags** (`--json`, `--limit`, `--max`)
  - **Readable tables** and **machine-friendly JSON**
  - **Exit codes** (0 success, 1 error) suitable for CI

---

## Prerequisites

- Node.js **18+** and NPM **9+**
- Internet connectivity (for `npm view`)

---

## Commands Demonstrated

### Manual `npm view`
```bash
npm view <pkg>
npm view <pkg> version
npm view <pkg> license
npm view <pkg> dependencies
npm view <pkg> dist.unpackedSize
npm view <pkg> versions
npm docs <pkg>
npm repo <pkg>
```

### package.json
```json
{
  "name": "example-04-npm-package-inspector",
  "version": "1.0.0",
  "description": "Single-folder CLI that inspects npm packages via `npm view`: info, versions, deps, compare; table and JSON output.",
  "main": "app.js",
  "bin": {
    "npminspect": "./app.js"
  },
  "scripts": {
    "info": "node app.js info",
    "versions": "node app.js versions",
    "deps": "node app.js deps",
    "compare": "node app.js compare"
  },
  "keywords": [
    "npm",
    "cli",
    "npx",
    "npm view",
    "metadata"
  ],
  "author": "NPM Mastery Course",
  "license": "MIT",
  "type": "commonjs",
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

### app.js

```javascript
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
```

## run via node
```bash
node app.js info express
```

## run as a real CLI via bin+npx (no global install)
```bash
npx . info express
```

## Running the Example

### Step 1: Navigate
```bash
cd examples/01-fundamentals/example-04-npm-package-inspector
```

### Step 2: Install (optional; creates lockfile)
```bash
npm install
```

### Step 3: Try the CLI

### 1. Info
```bash
npx . info express
npx . info axios --json
```
### 2. Versions
```bash
npx . versions express --limit=5
npx . versions react --json
```
### 3. Dependencies
``` bash
npx . deps express --max=10
npx . deps fastify --json
```
### 4. Compare
```bash
npx . compare express fastify
npx . compare axios node-fetch --json
```

---

## Expected Output

### 1. info express
```
┌───────────────┬───────────────────────────────────────────────────────────────┐
│ field         │ value                                                         │
├───────────────┼───────────────────────────────────────────────────────────────┤
│ name          │ express                                                       │
│ version       │ 4.18.x                                                        │
│ license       │ MIT                                                           │
│ description   │ Fast, unopinionated, minimalist web framework                 │
│ repository    │ https://github.com/expressjs/express                          │
│ homepage      │ http://expressjs.com/                                         │
│ unpackedSize  │ 208.45 KB                                                     │
└───────────────┴───────────────────────────────────────────────────────────────┘
```

### 2. compare express fastify
```
┌────────────┬───────────┬───────────┐
│ field      │ express   │ fastify   │
├────────────┼───────────┼───────────┤
│ version    │ 4.18.x    │ 4.xx.x    │
│ license    │ MIT       │ MIT       │
│ depsCount  │ 3x        │ 1x        │
│ size(KB)   │ 208.45    │ 97.12     │
└────────────┴───────────┴───────────┘
```
Numbers will vary as packages evolve.

## Learning Points

### Research Before Installing
- **Always check**: Use npm view to inspect metadata, size, and dependencies without pulling code.
- **Compare Alternatives**: Check recent versions, maintenance, and dependency counts to pick the right library.
- **Human vs Machine Output**: Tables are easy to read; `--json ` makes it easy to automate checks in CI.
- **Safe Scripting**: Proper exit codes let you fail pipelines when a check doesn’t pass.

## Practice Exercises

### Exercise 1 — Investigate a UI library
1. npx . info react
2. npx . versions react --limit=8
3. npx . deps react --json
What do you learn about stability and dependencies?

### Exercise 2 — HTTP clients showdown
1. npx . compare axios node-fetch
2. npx . compare got undici --json
Which would you choose and why?

### Exercise 3 — Size & deps sensitivity
1. Pick any 3 packages you frequently use.
2. Record `unpackedSize` and `depsCount`. Do you still want all three?

## Common Questions

**Q: Why not use an HTTP library to call the registry?**

A: To keep the example dependency-free and cross-platform, we use npm view. In real tools, you can switch to the official registry API.

**Q: Why do table widths look different on my terminal?**
A: Terminals render monospace differently; the table generator keeps it readable in common shells (Windows/macOS/Linux).

**Q: Can I add more fields?** 
A: Yes — modify app.js and include, for example:
```
npm view <pkg> engines.node
npm view <pkg> deprecated
npm view <pkg> maintainers
```

## Troubleshooting
- npm view returns empty
- Likely a typo or network issue:
```bash
npm search <keyword>
npm config get registry
```
- Windows quoting issues
- Prefer double quotes around arguments:
```bash
npx . versions "react" --limit=7
```
- Slow responses
- npm view queries the registry; try again or check your connection.

## Next Steps

- Add a `--field=<path>` flag to print any arbitrary npm view field
- Export results to a file for audits (e.g., `--out=report.json`)
- Wire into CI to fail builds if certain conditions are met (e.g., deprecated package)

---
