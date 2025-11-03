# Module 2 - Example 1: package.json Essentials

## Overview
This example teaches the anatomy of `package.json`, how to read and mutate fields safely, and how to enforce conventions via a tiny Node CLI (no dependencies). You’ll also practice `npm pkg set|get|delete`, version bumps, and `exports`/`type` gotchas.

## Folder Structure
```
examples/
└── module-02/
    └── example-01-package-json-essentials/
        ├── README.md
        ├── package.json
        ├── .gitignore
        ├── inspect-package-json.js
        └── sample.env
```

## Files Content

### README.md
```markdown
# package.json Essentials

Understand, inspect, and evolve your `package.json` like a pro.

## What You'll Learn

- Core fields: `name`, `version`, `description`, `license`, `author`
- Runtime + module system: `type`, `main`, `module`, `exports`
- Script design patterns and cross-platform safety
- Safe mutations with `npm pkg set|get|delete`
- Guardrails: engines, private, sideEffects, packageManager
- Versioning flows and automated bumps (patch/minor/major)

## Commands Demonstrated

```bash
# Quick init and inspection
npm init -y
cat package.json
npm pkg get name version type

# Set / get / delete fields
npm pkg set type="module"
npm pkg set engines.node=">=18"
npm pkg get engines
npm pkg delete module

# Scripts & execution
npm run inspect
npm run bump:patch
npm run bump:minor
npm run bump:major

# Validate (custom CLI)
node inspect-package-json.js validate

# Show which entrypoints you'll publish/resolve
node inspect-package-json.js entries
```

## Running the Example

```bash
# 1) install nothing (zero deps), just run:
npm run inspect

# 2) try validations
npm run validate

# 3) try version bumps
npm run bump:patch
npm run bump:minor
npm run bump:major
```

### package.json

```json
{
  "name": "package-json-essentials",
  "version": "1.0.0",
  "description": "Example demonstrating package.json structure, safe mutations, and validation.",
  "private": true,
  "type": "module",
  "main": "dist/index.cjs",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  },
  "scripts": {
    "inspect": "node inspect-package-json.js",
    "validate": "node inspect-package-json.js validate",
    "entries": "node inspect-package-json.js entries",
    "bump:patch": "node inspect-package-json.js bump patch",
    "bump:minor": "node inspect-package-json.js bump minor",
    "bump:major": "node inspect-package-json.js bump major"
  },
  "keywords": [
    "npm",
    "package.json",
    "scripts",
    "exports",
    "semver"
  ],
  "author": "NPM Mastery Course",
  "license": "MIT",
  "engines": {
    "node": ">=18"
  },
  "sideEffects": false,
  "packageManager": "npm@10.9.0",
  "repository": {
    "type": "git",
    "url": "https://example.com/your/repo.git"
  },
  "bugs": {
    "url": "https://example.com/your/repo/issues"
  },
  "homepage": "https://example.com/your/repo#readme"
}
```

### .gitignore
```
# Dependencies
node_modules/

# Builds
dist/
coverage/

# Env / secrets
.env
.env.*
!.env.example
sample.env

# Logs
*.log
npm-debug.log*
yarn-error.log

# OS / Editor
.DS_Store
Thumbs.db
.vscode/
.idea/
```

### inspect-package-json.js

```javascript
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
```

## How to Use This Example

### Step 1: Navigate
```bash
cd examples/module-02/example-01-package-json-essentials
```

### Step 2: Inspect & Validate
```bash
npm run inspect
npm run validate
npm run entries
```

### Step 3: Mutate Fields with npm
```bash
npm pkg set private=true
npm pkg set engines.node=">=18"
npm pkg set type="module"
npm pkg get private engines type
```

### Step 4: Bump Versions
```bash
npm run bump:patch   # 1.0.0 -> 1.0.1
npm run bump:minor   # 1.0.1 -> 1.1.0
npm run bump:major   # 1.1.0 -> 2.0.0
```

## Expected Output

```
╔────────────────────────────────────────────────────────────────╗
║ Quick Overview                                                 ║
╠────────────────────────────────────────────────────────────────╣
║ 📦  package-json-essentials                                    ║
║ • Version        1.0.0                                         ║
║ • Type           module                                        ║
║ • Private        true                                          ║
║ • Engines        node >=18                                     ║
║ • Exports Map    present                                       ║
║ • Main Entry     dist/index.cjs                                ║
╚────────────────────────────────────────────────────────────────╝

╔────────────────────────────────────────────────────────────────╗
║ Tips                                                           ║
╠────────────────────────────────────────────────────────────────╣
║ ℹ  Try: npm run validate  •  npm run entries                    ║
║ ⚙  Mutate: npm pkg set type="module" engines.node=">=18"       ║
║ 🧭  Versioning: npm run bump:patch  •  bump:minor  •  bump:major║
╚────────────────────────────────────────────────────────────────╝
```

## Learning Points

### 1. Understand the Role of package.json
- Acts as the brain of your project
- Defines metadata, scripts, dependencies, build settings, and module format
- Ensures consistency across team, CI, and production environments

### 2. Key Fields You Must Know
- ✅ `name` & `version` – Identity + SemVer
- ✅ `private` – Prevent accidental publish
- ✅ `type` – Module system (`module` vs `commonjs`)
- ✅ `main` & `exports` – Entrypoints for consumers
- ✅ `scripts` – Automate tasks (dev, build, lint, test)
- ✅ `engines` – Minimum required Node version
- ✅ `sideEffects` – Enable tree-shaking for libraries
- ✅ `license` – Usage rights

### 3. Useful Commands
```bash
# Read any field
npm pkg get name
npm pkg get engines

# Set or update fields
npm pkg set type="module"
npm pkg set engines.node=">=18"

# Remove a field
npm pkg delete module
```

### 4. When Designing a Good package.json
- **Keep it clean**: avoid junk scripts & unknown fields
- **Organize scripts** logically (dev/build/test/release)
- **Use "private"**: true for apps — avoid `npm publish` accidents
- **Use exports map** if building a library
- **Specify engines** so deployments don’t break
- **Lock packageManager** to avoid version mismatches

## Try These Modifications

### 1. Add Script Categories
Add proper script structure to keep things clean:
```json
"scripts": {
  "dev": "node src/index.js",
  "build": "echo Building...",
  "test": "echo Running tests...",
  "lint": "eslint .",
  "format": "prettier --write ."
}
```

### 2. Add a `packageManager` Field
Locks project to a specific npm version to avoid incompatibility:
```bash
npm pkg set packageManager="npm@10.9.0"
```

### 3. Add `exports` for a Library
```json
"exports": {
  ".": {
    "import": "./dist/index.mjs",
    "require": "./dist/index.cjs"
  }
}
```

### 4. Add Node Engine Requirement
```bash
npm pkg set engines.node=">=18"
```

### 5. Add Side-Effects Optimization (Library Only)
```bash
npm pkg set sideEffects=false
```

## Practice Exercises

### Exercise 1: Convert to ESM
1. Add `"type": "module"`
2. Change a script from `require()` to `import`
3. Run `npm run validate` and confirm no warnings

### Exercise 2: Protect Your App from Publishing
1. Add `"private": true`
2. Try `npm publish` and confirm it blocks publishing

### Exercise 3: Create a Library Export Map
Make a small `utils` folder and `export` it via exports field.
Expected challenge: Node resolution differences!

### Exercise 4: Versioning Practice
Run:
```bash
npm run bump:patch
npm run bump:minor
npm run bump:major
```
Answer:
- Which version is best for bug fixes?
- Which for new features without breaking changes?
- Which for breaking API changes?

## Common Questions

**Q: Should I use `type: "module"` or stay with CommonJS?**
A: 
- If starting a new project → use ESM.
- If maintaining old Node projects → stay with CJS or provide dual exports.

**Q: Do I need both `main` and `exports`?**
A: 
- For applications → No.
- For libraries → Yes, use `exports` (preferred) + maybe `main` for older tooling.

**Q: Is `"private": true` required?**
A: 
- For apps → **Yes**.
- For libraries → **No**, unless you are not publishing.

**Q: Should I commit package-lock.json?**
A: 
- Yes for apps & most libraries.
- Helps reproducible builds.

## Troubleshooting

### Problem: Scripts not running on Windows
**Cause**: Shell scripts or wrong syntax
**Fix**: Use cross-platform commands or Node scripts.

### Problem: `"ERR_REQUIRE_ESM"` or `"Cannot use import statement"`
**Cause**: Mismatch between `type` and code syntax
**Solution**: Align:
- "type": "module" → Use import
- Remove type → Use require

### Problem: Build works locally but fails in CI
**Cause**: Node version mismatch
**Solution**:
```bash
npm pkg set engines.node=">=18"
npm pkg set packageManager="npm@10.9.0"
```

### Problem: Publishing includes unwanted files
**Fix**: Add `.npmignore` or use `files` field:
```json
"files": ["dist"]
```

## Related Resources

- **Module 2.2**: Semantic Versioning & Ranges
- **Module 2.3**: Scripts Architecture
- **Module 2.4**: Dependencies vs DevDependencies
- **Module 3**: Installing Packages & Lockfiles

## Next Steps

After mastering the `package.json` structure:
- Learn Semantic Versioning (Module 2.2)
- Build a script architecture (Module 2.3)
- Understand dependency types (Module 2.4)
- Move to installation & lockfiles (Module 3)

## Additional Commands Reference

```bash
# View entire package.json
npm pkg get

# Set multiple fields at once
npm pkg set author.name="John Doe" author.email="john@mail.com"

# Check what would publish
npm publish --dry-run

# Remove a field
npm pkg delete sideEffects

# Validate JSON correctness
node -e "JSON.parse(require('fs').readFileSync('package.json','utf8'))"
```
