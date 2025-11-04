# Module 11: Advanced NPM Features

[← Previous Module](10-publishing-packages.md) | [🏠 Home](../README.md) | [Next Module →](12-troubleshooting.md)

---

## Module Overview

NPM has powerful advanced features that can significantly improve your development workflow. This module covers workspaces, npx, npm link, and other advanced capabilities that professional developers use daily.

**Learning Objectives:**
- Use NPM workspaces for monorepo management
- Execute packages with npx without installation
- Link local packages for development
- Create and use package aliases
- Understand and use npm hooks
- Work with custom registries
- Use advanced configuration options


---

## 11.1 NPM Workspaces

### What are Workspaces?

**Workspaces** allow you to manage multiple packages within a single repository (monorepo).

**Benefits:**
- Manage multiple packages together
- Link local dependencies automatically
- Share dependencies across packages
- Faster installs with shared cache
- Test packages together
- Deploy as a unit

### Setting Up Workspaces

**Project structure:**
```
my-monorepo/
├── packages/
│   ├── package-a/
│   │   ├── package.json
│   │   └── index.js
│   ├── package-b/
│   │   ├── package.json
│   │   └── index.js
│   └── shared-utils/
│       ├── package.json
│       └── index.js
├── package.json          # Root package.json
└── package-lock.json
```

**Root package.json:**
```json
{
  "name": "my-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}
```

**Alternative patterns:**
```json
{
  "workspaces": [
    "packages/*",
    "apps/*"
  ]
}
```

**Or specific packages:**
```json
{
  "workspaces": [
    "packages/package-a",
    "packages/package-b"
  ]
}
```

### Creating Workspace Packages

**Create workspace structure:**
```bash
# Create root directory
mkdir my-monorepo
cd my-monorepo

# Initialize root package
npm init -y

# Create packages directory
mkdir -p packages/package-a packages/package-b

# Initialize each package
cd packages/package-a
npm init -y

cd ../package-b
npm init -y

cd ../..
```

**Configure root package.json:**
```json
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}
```

### Installing Dependencies in Workspaces

**Install dependencies for all workspaces:**
```bash
# From root directory
npm install
```

**Install dependency in specific workspace:**
```bash
# Install to specific workspace
npm install lodash --workspace=packages/package-a

# Or shorthand
npm install lodash -w packages/package-a
```

**Install in all workspaces:**
```bash
# Install in all workspaces
npm install lodash --workspaces
```

### Running Scripts in Workspaces

**Run script in specific workspace:**
```bash
# Run test in package-a
npm run test --workspace=packages/package-a

# Shorthand
npm run test -w packages/package-a
```

**Run in all workspaces:**
```bash
# Run test in all workspaces
npm run test --workspaces

# Ignore missing scripts
npm run test --workspaces --if-present
```

### Linking Workspace Dependencies

**packages/package-a/package.json:**
```json
{
  "name": "@myorg/package-a",
  "version": "1.0.0",
  "dependencies": {
    "@myorg/shared-utils": "^1.0.0"
  }
}
```

**NPM automatically links local packages:**
```bash
npm install
# @myorg/shared-utils linked from workspace
```

### Workspace Commands

**List workspaces:**
```bash
# List all workspaces
npm ls --workspaces

# Show workspace info
npm query ".workspace"
```

**Version management:**
```bash
# Update version in specific workspace
npm version patch --workspace=packages/package-a

# Update all workspaces
npm version minor --workspaces
```

---

## 11.2 NPX - Package Runner

### What is npx?

**npx** executes NPM packages without installing them globally.

**Benefits:**
- Run packages without installation
- Always use latest version
- Save disk space
- Test packages easily
- Run one-time scripts

### Basic npx Usage

**Execute package:**
```bash
# Run create-react-app without installing
npx create-react-app my-app

# Run cowsay
npx cowsay "Hello World"

# Run specific version
npx cowsay@1.5.0 "Hello"
```

**What happens:**
1. npx checks if package is in `$PATH`
2. If not found, temporarily installs it
3. Executes the package
4. Cleans up temporary installation

### Running Local Packages

**Execute local package:**
```bash
# Run locally installed package
npx eslint src/

# Instead of
./node_modules/.bin/eslint src/
```

### Using Specific Versions

**Run specific version:**
```bash
# Run specific version
npx typescript@4.9.0 --version

# Run from specific tag
npx create-react-app@latest my-app

# Run from GitHub
npx github:user/repo
```

### Interactive Package Selection

**When multiple versions exist:**
```bash
npx cowsay

# If package name is ambiguous:
# ? Need to install the following packages:
#   cowsay
# Ok to proceed? (y)
```

### Common npx Use Cases

**1. Project scaffolding:**
```bash
# Create React app
npx create-react-app my-app

# Create Next.js app
npx create-next-app my-nextjs-app

# Create Vue app
npx create-vue my-vue-app

# Create Express generator
npx express-generator my-express-app
```

**2. Code formatting/linting:**
```bash
# Run Prettier
npx prettier --write .

# Run ESLint
npx eslint src/

# Run TypeScript compiler
npx tsc
```

**3. Development servers:**
```bash
# Start HTTP server
npx http-server

# Start JSON server
npx json-server db.json

# Live Server
npx live-server
```

**4. Testing tools:**
```bash
# Run Jest
npx jest

# Run Cypress
npx cypress open

# Run Playwright
npx playwright test
```

**5. Package utilities:**
```bash
# Check outdated packages
npx npm-check-updates

# Analyze bundle size
npx webpack-bundle-analyzer

# Check license compliance
npx license-checker
```

### npx Options

**Common flags:**
```bash
# Disable prompt
npx -y cowsay "Hello"

# Force install (ignore cache)
npx --ignore-existing cowsay "Hello"

# Specify package location
npx -p package-name command

# Execute from specific path
npx --package=package-name command

# Set shell
npx --shell=/bin/bash command
```

### Creating Executable Packages

**Make your package executable with npx:**

**package.json:**
```json
{
  "name": "my-cli-tool",
  "version": "1.0.0",
  "bin": {
    "my-tool": "./bin/cli.js"
  }
}
```

**bin/cli.js:**
```javascript
#!/usr/bin/env node

console.log('Hello from my CLI tool!');
```

**Make executable:**
```bash
chmod +x bin/cli.js
```

**Users can run with npx:**
```bash
npx my-cli-tool
```

---

## 11.3 NPM Link

### What is npm link?

**npm link** creates symbolic links between packages for local development.

**Use cases:**
- 🔧 Develop packages locally
- 🧪 Test changes without publishing
- 🔗 Link dependencies during development
- 🚀 Test package in real projects

### Basic Link Usage

**Link a package globally:**
```bash
# In your package directory
cd my-package
npm link

# Creates global symlink
```

**Link to a project:**
```bash
# In your project directory
cd my-project
npm link my-package

# Creates local symlink
```

**Complete workflow:**
```bash
# Step 1: Link package globally
cd ~/projects/my-package
npm link

# Step 2: Link in project
cd ~/projects/my-app
npm link my-package

# Step 3: Develop and test
# Changes in my-package reflect immediately in my-app
```

### Unlinking Packages

**Unlink from project:**
```bash
# In project directory
npm unlink my-package

# Reinstall from registry
npm install my-package
```

**Unlink globally:**
```bash
# In package directory
npm unlink

# Or from anywhere
npm unlink -g my-package
```

### Link Multiple Packages

**Working with dependencies:**
```bash
# Link dependency first
cd ~/projects/shared-utils
npm link

# Link main package
cd ~/projects/my-package
npm link shared-utils
npm link

# Link in project
cd ~/projects/my-app
npm link my-package
# shared-utils automatically linked
```

### Checking Links

**View linked packages:**
```bash
# List globally linked packages
npm ls -g --depth=0 --link=true

# Check links in project
npm ls --link=true
```

### Link vs npx vs install

| Feature | npm link | npx | npm install |
|---------|----------|-----|-------------|
| Purpose | Local dev | One-time execution | Permanent install |
| Speed | Instant | Downloads each time | One-time download |
| Disk usage | Minimal | Temporary | Permanent |
| Updates | Real-time | Always latest | Manual update |
| Use case | Development | Quick tasks | Production |

---

## 11.4 Package Aliases

### What are Aliases?

**Aliases** allow you to install packages under different names.

**Use cases:**
- Use multiple versions simultaneously
- Migrate between packages gradually
- Rename packages for clarity
- Test different versions

### Creating Aliases

**Install with alias:**
```bash
# Syntax: npm install <alias>@npm:<package>@<version>
npm install jquery2@npm:jquery@2.2.4
npm install jquery3@npm:jquery@3.6.0
```

**In package.json:**
```json
{
  "dependencies": {
    "jquery2": "npm:jquery@2.2.4",
    "jquery3": "npm:jquery@3.6.0"
  }
}
```

**Using aliased packages:**
```javascript
// Import different versions
const jquery2 = require('jquery2');
const jquery3 = require('jquery3');
```

### Common Alias Patterns

**1. Multiple versions:**
```json
{
  "dependencies": {
    "react-16": "npm:react@^16.14.0",
    "react-17": "npm:react@^17.0.2",
    "react-18": "npm:react@^18.2.0"
  }
}
```

**2. Package migration:**
```json
{
  "dependencies": {
    "old-lib": "npm:deprecated-package@1.0.0",
    "new-lib": "npm:modern-package@2.0.0"
  }
}
```

**3. Alternative implementations:**
```json
{
  "dependencies": {
    "fast-json": "npm:fast-json-stringify@2.7.0",
    "safe-json": "npm:json-stringify-safe@5.0.1"
  }
}
```

### Scoped Aliases

**Alias scoped packages:**
```bash
npm install my-lodash@npm:lodash@4.17.21
```

```json
{
  "dependencies": {
    "my-lodash": "npm:lodash@4.17.21",
    "@my-scope/lodash": "npm:lodash@4.17.21"
  }
}
```

---

## 11.5 Custom NPM Registries

### What are Custom Registries?

**Custom registries** are alternative sources for NPM packages.

**Use cases:**
- Private company packages
- Security scanning
- Package caching/mirroring
- Regional mirrors
- Testing registry

### Setting Registry

**Set registry globally:**
```bash
# Set custom registry
npm config set registry https://registry.company.com/

# Reset to default
npm config set registry https://registry.npmjs.org/
```

**Set for specific project:**
```bash
# Create .npmrc in project
echo "registry=https://registry.company.com/" > .npmrc
```

**Set for scoped packages:**
```bash
# Scope-specific registry
npm config set @mycompany:registry https://registry.company.com/
```

### Project .npmrc

**Create .npmrc file:**
```
registry=https://registry.npmjs.org/
@mycompany:registry=https://registry.company.com/
//registry.company.com/:_authToken=${COMPANY_NPM_TOKEN}
```

**Hierarchy:**
```
1. Per-project (.npmrc in project)
2. Per-user (~/.npmrc)
3. Global ($PREFIX/etc/npmrc)
4. Built-in (npm defaults)
```

### Using Multiple Registries

**Mix public and private:**
```
# .npmrc
registry=https://registry.npmjs.org/

# Private scoped packages
@mycompany:registry=https://registry.company.com/
@internal:registry=https://npm.internal.company.com/
```

**Install from different registries:**
```bash
# Public package
npm install express

# Private package
npm install @mycompany/private-pkg
```

### Popular Registry Alternatives

**1. Verdaccio (Private registry):**
```bash
# Install Verdaccio
npm install -g verdaccio

# Start server
verdaccio

# Configure
npm set registry http://localhost:4873/
```

**2. GitHub Packages:**
```
# .npmrc
@username:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

**3. GitLab Package Registry:**
```
# .npmrc
@mygroup:registry=https://gitlab.com/api/v4/packages/npm/
//gitlab.com/api/v4/packages/npm/:_authToken=${GITLAB_TOKEN}
```

**4. JFrog Artifactory:**
```
# .npmrc
registry=https://artifactory.company.com/artifactory/api/npm/npm/
```

---

## 11.6 Package Scripts Hooks

### Lifecycle Scripts

**NPM runs scripts at specific lifecycle events:**

```json
{
  "scripts": {
    "preinstall": "echo 'Before install'",
    "install": "echo 'During install'",
    "postinstall": "echo 'After install'",
    
    "prepack": "echo 'Before pack'",
    "prepare": "echo 'After install, before pack'",
    "prepublishOnly": "echo 'Before publish'",
    
    "preversion": "npm test",
    "version": "git add -A",
    "postversion": "git push && git push --tags"
  }
}
```

### Complete Lifecycle Order

**Installation lifecycle:**
```
1. preinstall
2. install
3. postinstall
4. prepublish (deprecated)
5. preprepare
6. prepare
7. postprepare
```

**Publishing lifecycle:**
```
1. prepublishOnly
2. prepack
3. prepare
4. postpack
5. publish
6. postpublish
```

**Version lifecycle:**
```
1. preversion
2. version
3. postversion
```

### Using Prepare Hook

**Common use: Build before publish:**
```json
{
  "scripts": {
    "prepare": "npm run build",
    "build": "tsc"
  }
}
```

**What it does:**
- Runs after `npm install`
- Runs before `npm publish`
- Useful for building packages

### Using prepublishOnly

**Ensure quality before publish:**
```json
{
  "scripts": {
    "prepublishOnly": "npm run lint && npm test && npm run build"
  }
}
```

**Only runs before `npm publish`, not `npm install`.**

---

## 11.7 Advanced Package.json Features

### Exports Field

**Control package entry points:**
```json
{
  "exports": {
    ".": "./lib/index.js",
    "./utils": "./lib/utils.js",
    "./package.json": "./package.json"
  }
}
```

**Users can import:**
```javascript
import pkg from 'my-package';           // ./lib/index.js
import utils from 'my-package/utils';   // ./lib/utils.js
```

**Conditional exports:**
```json
{
  "exports": {
    ".": {
      "import": "./lib/index.mjs",
      "require": "./lib/index.cjs",
      "default": "./lib/index.js"
    }
  }
}
```

### Module Type

**Specify module system:**
```json
{
  "type": "module"  // Use ES modules
}
```

**Or:**
```json
{
  "type": "commonjs"  // Use CommonJS (default)
}
```

**File extensions matter:**
- `.mjs` - Always ES module
- `.cjs` - Always CommonJS
- `.js` - Depends on "type" field

### Imports Field

**Define internal imports:**
```json
{
  "imports": {
    "#utils": "./src/utils/index.js",
    "#config": "./src/config.js"
  }
}
```

**Usage:**
```javascript
import utils from '#utils';
import config from '#config';
```

### Funding Field

**Show funding information:**
```json
{
  "funding": {
    "type": "github",
    "url": "https://github.com/sponsors/username"
  }
}
```

**Or multiple sources:**
```json
{
  "funding": [
    {
      "type": "github",
      "url": "https://github.com/sponsors/username"
    },
    {
      "type": "patreon",
      "url": "https://patreon.com/username"
    }
  ]
}
```

### Package Manager Field

**Specify package manager:**
```json
{
  "packageManager": "npm@9.6.7"
}
```

**Or:**
```json
{
  "packageManager": "pnpm@8.6.0",
  "packageManager": "yarn@3.6.0"
}
```

---

## 11.8 Advanced Installation Options

### Install from Git

**Install from Git repository:**
```bash
# From GitHub
npm install user/repo

# Specific branch
npm install user/repo#branch-name

# Specific commit
npm install user/repo#commit-hash

# Specific tag
npm install user/repo#v1.0.0
```

**In package.json:**
```json
{
  "dependencies": {
    "my-package": "github:user/repo#v1.0.0",
    "another-pkg": "git+https://github.com/user/repo.git",
    "private-pkg": "git+ssh://git@github.com:user/repo.git"
  }
}
```

### Install from Tarball

**Install from URL:**
```bash
npm install https://example.com/package.tgz
```

**Install from local tarball:**
```bash
npm install ./package-1.0.0.tgz
```

### Install from Folder

**Install from local directory:**
```bash
# Absolute path
npm install /path/to/package

# Relative path
npm install ../my-package

# In package.json
{
  "dependencies": {
    "my-local-pkg": "file:../my-package"
  }
}
```

### Peer Dependencies

**Define peer dependencies:**
```json
{
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "peerDependenciesMeta": {
    "react-dom": {
      "optional": true
    }
  }
}
```

**Purpose:**
- Specify expected environment
- Avoid duplicate installations
- Common for plugins

---

## 11.9 Real-World Examples

### Example 1: Monorepo with Workspaces

**Structure:**
```
my-app/
├── packages/
│   ├── ui-components/
│   │   ├── package.json
│   │   └── src/
│   ├── api-client/
│   │   ├── package.json
│   │   └── src/
│   └── utils/
│       ├── package.json
│       └── src/
├── apps/
│   ├── web/
│   │   ├── package.json
│   │   └── src/
│   └── mobile/
│       ├── package.json
│       └── src/
└── package.json
```

**Root package.json:**
```json
{
  "name": "my-app",
  "private": true,
  "workspaces": [
    "packages/*",
    "apps/*"
  ],
  "scripts": {
    "build": "npm run build --workspaces",
    "test": "npm run test --workspaces --if-present",
    "lint": "npm run lint --workspaces"
  }
}
```

**packages/ui-components/package.json:**
```json
{
  "name": "@myapp/ui-components",
  "version": "1.0.0",
  "dependencies": {
    "@myapp/utils": "^1.0.0"
  }
}
```

**apps/web/package.json:**
```json
{
  "name": "@myapp/web",
  "version": "1.0.0",
  "dependencies": {
    "@myapp/ui-components": "^1.0.0",
    "@myapp/api-client": "^1.0.0"
  }
}
```

### Example 2: Development with npm link

**Scenario:** Developing a React component library

```bash
# Step 1: Link component library
cd ~/projects/my-component-lib
npm link

# Step 2: Build in watch mode
npm run build:watch

# Step 3: Link in app
cd ~/projects/my-react-app
npm link my-component-lib

# Step 4: Develop
# Changes in component library reflect immediately in app

# Step 5: When done
cd ~/projects/my-react-app
npm unlink my-component-lib
npm install
```

### Example 3: Custom Registry Setup

**Company private registry setup:**

**~/.npmrc:**
```
registry=https://registry.npmjs.org/
@mycompany:registry=https://npm.company.com/
//npm.company.com/:_authToken=${COMPANY_NPM_TOKEN}
```

**Project .npmrc:**
```
@mycompany:registry=https://npm.company.com/
```

**package.json:**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "@mycompany/internal-api": "^2.1.0",
    "@mycompany/design-system": "^1.5.0"
  }
}
```

---

## Hands-On Exercises

>Go to the [exercises](/exercises/11-advanced-features-exer.md) for this section for the full instructions on how to complete each exercise.

### Exercise 11.1: Create a Workspace

**Objective:** Set up a monorepo with workspaces.

### Exercise 11.2: Use npx

**Objective:** Practice using npx for different tasks.

### Exercise 11.3: Practice npm link

**Objective:** Link packages for local development.

### Exercise 11.4: Package Aliases

**Objective:** Use aliases for multiple package versions.

### Exercise 11.5: Lifecycle Scripts

**Objective:** Implement lifecycle hooks.

---

## Best Practices

### 1. Workspaces

- Mark workspace root as private
- Use consistent naming (@scope/package)
- Keep shared dependencies in root
- Use workspace protocols for internal deps

### 2. npx

- Use for one-time commands
- Specify versions when important
- Use `-y` flag in CI/CD
- Clear cache periodically

### 3. npm link

- Link in correct order (global first)
- Unlink when done
- Document linked packages
- Use for development only

### 4. Custom Registries

- Use environment variables for tokens
- Document registry setup
- Use .npmrc in project
- Don't commit credentials

### 5. Lifecycle Scripts

- Use for automation
- Keep scripts simple
- Test lifecycle behavior
- Document what hooks do

---

## Summary

In this module, you learned:

✅ NPM workspaces for monorepo management  
✅ Using npx to run packages without installation  
✅ Linking local packages with npm link  
✅ Creating and using package aliases  
✅ Custom NPM registries for private packages  
✅ Lifecycle scripts and hooks  
✅ Advanced package.json features  
✅ Advanced installation options  

### Key Takeaways

- **Workspaces** - Manage multiple packages efficiently
- **npx** - Execute packages without global installation
- **npm link** - Essential for local package development
- **Aliases** - Use multiple versions simultaneously
- **Custom registries** - Private package hosting
- **Lifecycle hooks** - Automate tasks at key moments
- **Exports field** - Control package entry points
- **Always unlink** - Clean up after development

---

## Next Steps

You've mastered advanced NPM features! Now you're ready to learn how to troubleshoot common NPM issues and follow professional best practices that will help you avoid problems and work more efficiently.

**Continue to:** [Module 12: Troubleshooting & Best Practices →](12-troubleshooting.md)

---

## Additional Resources

- [NPM Workspaces Documentation](https://docs.npmjs.com/cli/v9/using-npm/workspaces)
- [npx Documentation](https://docs.npmjs.com/cli/v9/commands/npx)
- [npm link Documentation](https://docs.npmjs.com/cli/v9/commands/npm-link)
- [Package.json Exports Field](https://nodejs.org/api/packages.html#package-entry-points)
- [Custom NPM Registry Guide](https://docs.npmjs.com/cli/v9/using-npm/registry)
- [Verdaccio - Private NPM Proxy](https://verdaccio.org/)
- [GitHub Packages](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)

---

## Discussion

Have questions about advanced NPM features? Join the discussion:
- [GitHub Discussions](https://github.com/Leonardo-Garzon-1995/npm-mastery-course/discussions)
- Found an error? [Open an issue](https://github.com/Leonardo-Garzon-1995/npm-mastery-course/issues)

---

[← Previous Module](10-publishing-packages.md) | [🏠 Home](../README.md) | [Next Module →](12-troubleshooting.md)