# Module 3: Installing Packages

[← Previous Module](02-package-json.md) | [🏠 Home](../README.md) | [Next Module →](04-semantic-versioning.md)

---

##  Module Overview

Installing packages is at the core of using NPM. This module covers everything you need to know about installing dependencies, from basic installations to advanced options and global packages.

**Learning Objectives:**
- Install packages as dependencies and devDependencies
- Understand the difference between local and global installations
- Use various installation flags and options
- Install packages from different sources (NPM, GitHub, local)
- Manage multiple packages efficiently

---

## 3.1 Installing Dependencies

### Basic Installation

The most common NPM command you'll use:

```bash
# Install a package and save to dependencies
npm install express

# Shorthand
npm i express
```

**What happens:**
1. NPM downloads the package from the registry
2. Installs it in `node_modules/` folder
3. Adds it to `dependencies` in package.json
4. Creates/updates package-lock.json

**Result in package.json:**
```json
{
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

### Installing Multiple Packages

Install several packages at once:

```bash
# Install multiple packages
npm install express mongoose dotenv

# Or
npm i express mongoose dotenv
```

**Result:**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "dotenv": "^16.0.3"
  }
}
```

### Installing All Dependencies

When you clone a project, install all dependencies from package.json:

```bash
# Install everything in package.json
npm install

# Shorthand
npm i
```

This reads package.json and installs:
- All `dependencies`
- All `devDependencies`
- Based on versions in package-lock.json (if present)

---

## 3.2 Development Dependencies

### What Are DevDependencies?

DevDependencies are packages needed only during development, not in production:
- Testing frameworks (Jest, Mocha)
- Build tools (Webpack, Babel)
- Linters (ESLint, Prettier)
- Development servers (Nodemon)

### Installing as DevDependency

```bash
# Install as devDependency
npm install --save-dev nodemon

# Shorthand
npm i -D nodemon

# Multiple devDependencies
npm i -D nodemon jest eslint
```

**Result in package.json:**
```json
{
  "devDependencies": {
    "nodemon": "^2.0.22",
    "jest": "^29.5.0",
    "eslint": "^8.42.0"
  }
}
```

### Production vs Development

**Installing only production dependencies:**
```bash
# Skip devDependencies (useful in production)
npm install --omit=dev

# Or (older syntax)
npm install --production
```

**Example use case:**
```bash
# In your Dockerfile or production server
npm ci --omit=dev
```

---

## 3.3 Global Packages

### What Are Global Packages?

Global packages are installed system-wide and available as command-line tools:
- `create-react-app`
- `nodemon`
- `typescript`
- `npm` itself

when you install a package globally, it means you can use it from anywhere on your system.

### Installing Globally

```bash
# Install globally
npm install -g <package-name>

# Or
npm install --global <package-name>

# Multiple global packages
npm i -g create-react-app typescript
```

**Where it installs:**
- **Mac/Linux:** `/usr/local/lib/node_modules/`
- **Windows:** `%AppData%\npm\node_modules\`

### Viewing Global Packages

```bash
# List all global packages
npm list -g --depth=0

# Example output:
# /usr/local/lib/node_modules
# ├── nodemon@2.0.22
# ├── npm@9.6.7
# └── typescript@5.0.4
```

### Finding Global Installation Path

```bash
# Get global installation directory
npm config get prefix

# Example output: /usr/local
```

### When to Install Globally

**Install globally when:**
- ✅ It's a CLI tool you use across projects
- ✅ You need it available system-wide
- ✅ It's a development tool (like `typescript` compiler)

**Don't install globally when:**
- ❌ It's a project dependency
- ❌ Different projects need different versions
- ❌ You're working in a team (use local instead)

**Better alternative to global:** Use `npx` (covered in [Module 11](11-advanced-features.md))

```bash
# Instead of installing globally
npm install -g create-react-app
create-react-app my-app

# Use npx (no global install needed)
npx create-react-app my-app
```

---

## 3.4 Installation Flags

### Common Installation Flags

#### --save-exact

Install exact version (no ^ or ~):

```bash
npm install --save-exact express
npm i -E express
```

**Result:**
```json
{
  "dependencies": {
    "express": "4.18.2"  // No ^ symbol
  }
}
```

**Use when:** You want to lock to a specific version.

#### --no-save

Install without adding to package.json:

```bash
npm install --no-save express
```

Package is installed in node_modules but NOT added to package.json.

**Use when:** Testing a package temporarily.

#### --legacy-peer-deps

Skip peer dependency resolution (useful for compatibility issues):

```bash
npm install --legacy-peer-deps
```

**Use when:** Facing peer dependency conflicts.

#### --force

Force install even if there are conflicts:

```bash
npm install --force
```

**Use with caution:** Can cause issues. Better to resolve conflicts properly.

### Installing Specific Versions

```bash
# Install specific version
npm install express@4.17.1

# Install version range
npm install express@">=4.0.0 <5.0.0"

# Install latest version
npm install express@latest

# Install with tag
npm install react@next
npm install typescript@beta
```

**Common tags:**
- `latest` - Latest stable version (default)
- `next` - Next/upcoming version
- `beta` - Beta version
- `alpha` - Alpha version

---

## 3.5 Installing from Different Sources

### From NPM Registry (Default)

```bash
npm install express
```

### From GitHub

```bash
# Install from GitHub repository
npm install user/repo

# Specific branch
npm install user/repo#branch-name

# Specific commit
npm install user/repo#commit-hash

# Specific tag
npm install user/repo#v1.0.0

# Example
npm install expressjs/express
npm install lodash/lodash#4.17.21
```

**In package.json:**
```json
{
  "dependencies": {
    "express": "github:expressjs/express#4.18.2"
  }
}
```

### From Git URL

```bash
# Via HTTPS
npm install https://github.com/user/repo.git

# Via SSH
npm install git+ssh://git@github.com:user/repo.git

# Via Git protocol
npm install git://github.com/user/repo.git
```

### From Local Path

```bash
# Install from local directory
npm install ../path/to/package

# Install from tarball
npm install ./package-1.0.0.tgz

# Example
npm install ../my-local-library
```

**Use when:** Testing local packages before publishing.

### From URL

```bash
# Install from tarball URL
npm install https://example.com/package.tgz
```

---

## 3.6 Understanding node_modules

### What is node_modules?

When you install packages, NPM creates a `node_modules/` folder containing:
- The packages you installed
- All their dependencies
- And their dependencies' dependencies (nested)

**Structure:**
```
my-project/
├── node_modules/
│   ├── express/
│   │   ├── package.json
│   │   ├── index.js
│   │   └── node_modules/    (express's dependencies)
│   ├── mongoose/
│   └── ... (many more)
├── package.json
└── package-lock.json
```

### Flat vs Nested Installation

**Modern NPM (v3+):** Attempts to flatten dependencies

```
node_modules/
├── express/
├── body-parser/     (express dependency, but at root)
├── cookie/          (express dependency, but at root)
└── mongoose/
```

**Nested when necessary:** If two packages need different versions

```
node_modules/
├── package-a/
│   └── node_modules/
│       └── lodash@4.17.21
└── package-b/
    └── node_modules/
        └── lodash@4.17.20
```

### Should You Commit node_modules?

**NO!** Never commit node_modules to Git.

**Instead:**
1. Add to .gitignore:
   ```
   node_modules/
   ```

2. Commit package.json and package-lock.json

3. Team members run `npm install` to get dependencies

**Why not commit node_modules?**
- Huge size (can be 100s of MB)
- Platform-specific binaries
- Can be regenerated from package.json
- Makes Git slow

---

## 3.7 npm ci - Clean Install

### What is npm ci?

`npm ci` (Continuous Integration) performs a clean install:

```bash
npm ci
```

**Differences from npm install:**

| Feature | npm install | npm ci |
|---------|-------------|--------|
| Uses | package.json ranges | package-lock.json exact versions |
| Modifies | package-lock.json | Never modifies lock file |
| node_modules | Updates if exists | Deletes and recreates |
| Speed | Slower | Faster |
| Use case | Development | CI/CD, production |

### When to Use npm ci

**Use npm ci when:**
- In CI/CD pipelines
- Deploying to production
- You want reproducible builds
- You want to ensure exact versions

**Use npm install when:**
- In development
- Adding new packages
- Updating packages

**Example in CI/CD:**
```yaml
# .github/workflows/test.yml
- name: Install dependencies
  run: npm ci
```

---

## 3.8 Reinstalling and Rebuilding

### Reinstalling All Packages

```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Or use npm ci for clean install
npm ci
```

### Rebuilding Native Modules

Some packages have native (C++) modules that need rebuilding:

```bash
# Rebuild all native modules
npm rebuild

# Rebuild specific package
npm rebuild package-name
```

**When to rebuild:**
- After switching Node versions
- After cloning on different OS
- Native module errors

---

## 3.9 Practical Examples

### Example 1: New Express Project

```bash
# Create project directory
mkdir my-express-app
cd my-express-app

# Initialize npm
npm init -y

# Install dependencies
npm install express dotenv

# Install dev dependencies
npm install --save-dev nodemon

# Create .gitignore
echo "node_modules/" > .gitignore
```

**Result:**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^16.0.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

### Example 2: Testing Library Installation

```bash
# Initialize project
npm init -y

# Install testing dependencies
npm i -D jest @testing-library/react @testing-library/jest-dom

# Install exact versions for stability
npm i -E react react-dom
```

### Example 3: Installing from GitHub

```bash
# Install a forked version from GitHub
npm install myusername/express#my-custom-branch

# Install specific commit
npm install lodash/lodash#4fb3b24c89f28ce58d46c715f3e8b0fc0d39f96f
```

### Example 4: Production Deployment

```bash
# In your deployment script/Dockerfile
npm ci --omit=dev

# This installs only production dependencies
# Using exact versions from package-lock.json
# Clean install (deletes existing node_modules)
```

---

## Hands-On Exercises

>Go to the [exercises](/exercises/03-installing-packages-exer.md) for this section

### Exercise 3.1: Basic Package Installation

**Objective:** Practice installing packages as dependencies and devDependencies.

### Exercise 3.2: Global vs Local Installation

**Objective:** Understand the difference between global and local installations.

### Exercise 3.3: Installing Specific Versions

**Objective:** Learn to install specific versions and understand version ranges.

### Exercise 3.4: Complete Project Setup

**Objective:** Set up a complete project with proper dependencies.

### Exercise 3.5: npm ci Practice

**Objective:** Understand the difference between npm install and npm ci.


---

## Best Practices

### 1. Always Use package-lock.json

```bash
# Generate/update lock file
npm install

# Commit it to Git
git add package-lock.json
git commit -m "Update dependencies"
```

### 2. Use npm ci in CI/CD

```bash
# In your CI/CD pipeline
npm ci --omit=dev
```

### 3. Specify Node/NPM Versions

In package.json:
```json
{
  "engines": {
    "node": ">=14.0.0",
    "npm": ">=6.0.0"
  }
}
```

### 4. Organize Dependencies Correctly

```json
{
  "dependencies": {
    // Runtime dependencies only
    "express": "^4.18.2"
  },
  "devDependencies": {
    // Development tools only
    "nodemon": "^2.0.22",
    "jest": "^29.5.0"
  }
}
```

### 5. Use Exact Versions for Critical Dependencies

```bash
# For stability-critical packages
npm install --save-exact react react-dom
```

### 6. Regular Dependency Updates

```bash
# Check for outdated packages
npm outdated

# Update carefully
npm update
```

### 7. Use .npmrc for Project Settings

Create `.npmrc` in project root:
```
save-exact=true
engine-strict=true
```

### 8. Clean Install Periodically

```bash
# Clean install to catch issues
rm -rf node_modules package-lock.json
npm install
```

---

## Summary

In this module, you learned:

✅ How to install packages as dependencies and devDependencies  
✅ The difference between local and global installations  
✅ Various installation flags and their uses  
✅ How to install packages from different sources  
✅ Understanding node_modules structure  
✅ The difference between npm install and npm ci  
✅ Common pitfalls and how to avoid them  

### Key Takeaways

- **npm install package** - Installs as dependency
- **npm install -D package** - Installs as devDependency
- **npm install -g package** - Installs globally (use sparingly!)
- **npm ci** - Clean install (use in CI/CD)
- **Never commit node_modules** - Use .gitignore
- **Always commit package-lock.json** - Ensures reproducible installs

---

## Next Steps

Now that you know how to install packages, it's crucial to understand version numbers and how NPM resolves dependencies. That's where semantic versioning comes in!

**Continue to:** [Module 4: Semantic Versioning →](04-semantic-versioning.md)

---

## Additional Resources

- [NPM Install Documentation](https://docs.npmjs.com/cli/v9/commands/npm-install)
- [NPM CI Documentation](https://docs.npmjs.com/cli/v9/commands/npm-ci)
- [Understanding node_modules](https://docs.npmjs.com/cli/v9/configuring-npm/folders)
- [NPM Configuration](https://docs.npmjs.com/cli/v9/configuring-npm/npmrc)

---

## Discussion

Have questions about installing packages? Join the discussion:
- [GitHub Discussions](https://github.com/Leonardo-Garzon-1995/npm-mastery-course/discussions)
- Found an error? [Open an issue](https://github.com/Leonardo-Garzon-1995/npm-mastery-course/issues)

---

[← Previous Module](02-package-json.md) | [🏠 Home](../README.md) | [Next Module →](04-semantic-versioning.md)