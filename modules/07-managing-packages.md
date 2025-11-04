# Module 7: Managing Packages

[← Previous Module](06-npm-scripts.md) | [🏠 Home](../README.md) | [Next Module →](08-npm-cache.md)

---

## Module Overview

Managing packages is a crucial daily task for developers. This module covers updating, removing, viewing, and maintaining your project's dependencies effectively.

**Learning Objectives:**
- Update packages safely and efficiently
- Remove packages and clean up unused dependencies
- View package information and dependency trees
- Check for outdated and vulnerable packages
- Understand the difference between update commands
- Manage global and local packages effectively

---

## 7.1 Viewing Package Information

### Listing Installed Packages

**List all packages in your project:**
```bash
# List all dependencies
npm list

# List only top-level dependencies
npm list --depth=0

# Example output:
# my-project@1.0.0
# ├── express@4.18.2
# ├── mongoose@7.0.3
# └── dotenv@16.0.3
```

**List specific package:**
```bash
# Check if package is installed and its version
npm list express

# Example output:
# my-project@1.0.0
# └── express@4.18.2
```

**List global packages:**
```bash
# List all global packages
npm list -g --depth=0

# Example output:
# /usr/local/lib
# ├── npm@9.6.7
# ├── nodemon@2.0.22
# └── typescript@5.0.4
```

### Viewing Package Details

**Get package information from registry:**
```bash
# View package details
npm view express

# View specific field
npm view express version
npm view express description
npm view express dependencies

# View all versions
npm view express versions

# Example:
$ npm view express version
4.18.2

$ npm view express description
Fast, unopinionated, minimalist web framework
```

**Shorthand:**
```bash
# v is alias for view
npm v express version
npm v express dependencies
```

### Opening Package Documentation

```bash
# Open package homepage
npm home express

# Open package repository
npm repo express

# Open package documentation
npm docs express

# Open package issues page
npm bugs express
```

### Checking Package Info Locally

```bash
# Show package.json
npm pkg get

# Get specific field
npm pkg get name
npm pkg get version
npm pkg get dependencies

# Example:
$ npm pkg get dependencies
{
  "express": "^4.18.2",
  "mongoose": "^7.0.0"
}
```

---

## 7.2 Checking for Outdated Packages

### Using npm outdated

```bash
# Check for outdated packages
npm outdated
```

**Example output:**
```
Package     Current  Wanted  Latest  Location
express     4.18.2   4.18.2  4.19.0  node_modules/express
mongoose    7.0.3    7.0.5   7.2.0   node_modules/mongoose
jest        29.5.0   29.5.0  29.6.1  node_modules/jest
```

**Understanding the columns:**
- **Current**: Version currently installed
- **Wanted**: Maximum version satisfying semver range in package.json
- **Latest**: Latest version available in registry
- **Location**: Where the package is installed

### Interpreting Colors

NPM uses colors to indicate update urgency:
- **Red**: Major version update available (breaking changes)
- **Yellow**: Minor or patch update available (safe to update)
- **No color**: Up to date

### Checking Specific Packages

```bash
# Check specific package
npm outdated express

# Check global packages
npm outdated -g --depth=0
```

---

## 7.3 Updating Packages

### Understanding Update Strategies

**Three ways to update:**

1. **npm update** - Respects semver ranges in package.json
2. **npm install package@version** - Install specific version
3. **npm install package@latest** - Install latest version

### Using npm update

**Update all packages (respecting semver):**
```bash
# Update all packages to Wanted version
npm update

# This respects the ranges in package.json
# ^4.18.0 will update to 4.x.x but not 5.0.0
```

**Update specific package:**
```bash
# Update express only
npm update express

# Update multiple packages
npm update express mongoose
```

**Update global packages:**
```bash
# Update all global packages
npm update -g

# Update specific global package
npm update -g nodemon
```

### Updating to Latest Version

**Install latest version (ignoring semver range):**
```bash
# Update to latest version
npm install express@latest

# This changes package.json and package-lock.json
```

**Example:**
```bash
# Before: package.json has "express": "^4.18.2"
npm install express@latest

# After: package.json has "express": "^4.19.0"
# And package-lock.json has exact version 4.19.0
```

### Interactive Updates (npm-check-updates)

**Install npm-check-updates:**
```bash
npm install -g npm-check-updates
```

**Check for updates:**
```bash
# Check what would be updated
ncu

# Example output:
# express  ^4.18.2  →  ^4.19.0
# mongoose ^7.0.3   →  ^7.2.0
# jest     ^29.5.0  →  ^29.6.1
```

**Update package.json:**
```bash
# Update package.json to latest versions
ncu -u

# Then install
npm install
```

**Interactive mode:**
```bash
# Choose which packages to update
ncu -i
```

---

## 7.4 Removing Packages

### Uninstalling Local Packages

**Remove a package:**
```bash
# Uninstall package
npm uninstall express

# Shorthand
npm un express
npm remove express
npm rm express

# Remove multiple packages
npm uninstall express mongoose dotenv
```

**What happens:**
1. Package removed from node_modules
2. Removed from package.json dependencies
3. package-lock.json updated

**Remove dev dependency:**
```bash
# Same command works for devDependencies
npm uninstall nodemon
```

### Uninstalling Global Packages

```bash
# Uninstall global package
npm uninstall -g nodemon

# Shorthand
npm un -g nodemon
```

### Removing Without Updating package.json

```bash
# Remove from node_modules but keep in package.json
npm uninstall --no-save express
```

**Use case:** Temporarily removing a package to test.

---

## 7.5 Cleaning Up Dependencies

### Removing Unused Packages (npm prune)

**Remove packages not in package.json:**
```bash
# Remove extraneous packages
npm prune
```

**What it does:**
- Removes packages in node_modules that aren't in package.json
- Useful after manually editing package.json

**Example scenario:**
```bash
# You manually removed "lodash" from package.json
# But it's still in node_modules

npm prune
# Now lodash is removed from node_modules
```

**Remove dev dependencies:**
```bash
# Remove devDependencies from node_modules
npm prune --production
```

**Use case:** Preparing for production deployment.

### Deduplicating Packages (npm dedupe)

**Reduce duplicate packages:**
```bash
# Deduplicate dependencies
npm dedupe

# Shorthand
npm ddp
```

**What it does:**
- Finds duplicate packages at different nesting levels
- Moves them to top level when possible
- Reduces node_modules size

**Example:**
```
Before dedupe:
node_modules/
├── package-a/
│   └── node_modules/
│       └── lodash@4.17.21
└── package-b/
    └── node_modules/
        └── lodash@4.17.21

After dedupe:
node_modules/
├── lodash@4.17.21          (shared by both)
├── package-a/
└── package-b/
```

---

## 7.6 Viewing Dependency Trees

### Understanding Dependency Trees

**View full dependency tree:**
```bash
# Show all dependencies and their dependencies
npm list

# Example output:
# my-project@1.0.0
# ├─┬ express@4.18.2
# │ ├── accepts@1.3.8
# │ ├── array-flatten@1.1.1
# │ ├─┬ body-parser@1.20.1
# │ │ ├── bytes@3.1.2
# │ │ └── http-errors@2.0.0
# │ └── ... more dependencies
# └─┬ mongoose@7.0.3
#   ├── bson@5.2.0
#   └── ... more dependencies
```

### Limiting Depth

```bash
# Show only top-level dependencies
npm list --depth=0

# Show two levels deep
npm list --depth=2
```

### Viewing Specific Package Tree

```bash
# Show dependency tree for specific package
npm list express

# Example:
# my-project@1.0.0
# └─┬ express@4.18.2
#   ├── accepts@1.3.8
#   ├── array-flatten@1.1.1
#   └── body-parser@1.20.1
```

### JSON Output

```bash
# Output as JSON
npm list --json

# Output specific package as JSON
npm list express --json

# Save to file
npm list --json > dependencies.json
```

### Viewing Production Dependencies Only

```bash
# List only production dependencies
npm list --production

# Exclude devDependencies
npm list --omit=dev
```

---

## 7.7 Managing Global Packages

### Listing Global Packages

```bash
# List global packages
npm list -g --depth=0

# Get global installation path
npm root -g

# Example output:
# /usr/local/lib/node_modules
```

### Updating Global Packages

```bash
# Update all global packages
npm update -g

# Update specific global package
npm update -g npm
npm update -g nodemon
```

### Removing Global Packages

```bash
# Remove global package
npm uninstall -g create-react-app

# Remove multiple global packages
npm uninstall -g typescript nodemon
```

### Finding Global Package Location

```bash
# Find where global packages are installed
npm config get prefix

# Example output:
# /usr/local

# Actual packages are in:
# /usr/local/lib/node_modules
```

---

## 7.8 Checking Package Versions

### Viewing Installed Version

```bash
# Check version of installed package
npm list express

# Check version from package.json
npm pkg get dependencies.express

# Example:
$ npm list express
my-project@1.0.0
└── express@4.18.2

$ npm pkg get dependencies.express
"^4.18.2"
```

### Viewing Available Versions

```bash
# View all available versions
npm view express versions

# View latest version
npm view express version

# View versions with tag
npm view express dist-tags

# Example:
$ npm view express dist-tags
{
  latest: '4.18.2',
  next: '5.0.0-beta.1'
}
```

### Viewing Version History

```bash
# View version with dates
npm view express time

# Example output:
{
  '4.18.0': '2022-04-25T14:04:09.505Z',
  '4.18.1': '2022-04-29T14:28:35.160Z',
  '4.18.2': '2022-10-08T14:35:01.799Z'
}
```

---

## 7.9 Working with package.json

### Adding Dependencies Manually

**Edit package.json:**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0"
  }
}
```

**Then install:**
```bash
npm install
```

### Setting Specific Versions

```json
{
  "dependencies": {
    "react": "18.2.0",        // Exact version
    "vue": "^3.3.0",          // Caret (minor updates)
    "angular": "~16.1.0",     // Tilde (patch updates)
    "lodash": ">=4.17.0"      // Greater than or equal
  }
}
```

### Using npm pkg Commands

**Set dependency:**
```bash
# Add dependency to package.json
npm pkg set dependencies.express="^4.18.2"

# Add devDependency
npm pkg set devDependencies.jest="^29.5.0"
```

**Remove dependency:**
```bash
# Remove from package.json
npm pkg delete dependencies.express
```

**Get information:**
```bash
# Get all dependencies
npm pkg get dependencies

# Get specific dependency
npm pkg get dependencies.express
```

---

## 7.10 Practical Workflows

### Workflow 1: Updating Dependencies Safely

**Step-by-step update process:**

```bash
# 1. Check what's outdated
npm outdated

# 2. Update to wanted versions (safe)
npm update

# 3. Run tests
npm test

# 4. If tests pass, commit
git add package.json package-lock.json
git commit -m "Update dependencies"

# 5. For major updates, do one at a time
npm install express@latest
npm test
git commit -am "Update express to v5"
```

### Workflow 2: Cleaning Up Project

**Clean and optimize dependencies:**

```bash
# 1. Remove unused packages
npm prune

# 2. Deduplicate to reduce size
npm dedupe

# 3. Check for outdated
npm outdated

# 4. Reinstall everything fresh
rm -rf node_modules package-lock.json
npm install

# 5. Verify everything works
npm test
```

### Workflow 3: Dependency Audit

**Regular dependency maintenance:**

```bash
# 1. List all dependencies
npm list --depth=0

# 2. Check sizes
npm list --long

# 3. Find outdated packages
npm outdated

# 4. Check for duplicates
npm dedupe --dry-run

# 5. Document findings
npm list --json > audit-$(date +%Y%m%d).json
```

### Workflow 4: Preparing for Production

```bash
# 1. Install only production dependencies
npm ci --omit=dev

# 2. Remove dev dependencies if present
npm prune --production

# 3. Verify no dev dependencies
npm list --production --depth=0

# 4. Check bundle size
du -sh node_modules
```

---

## 7.11 Advanced Package Management

### Finding Why a Package is Installed

```bash
# Find which packages depend on lodash
npm ls lodash

# Example output:
# my-project@1.0.0
# ├─┬ express@4.18.2
# │ └─┬ body-parser@1.20.1
# │   └─┬ qs@6.11.0
# │     └── lodash@4.17.21
# └── lodash@4.17.21
```

### Checking Package Size

```bash
# Install package-size analyzer
npm install -g cost-of-modules

# Check module sizes
cost-of-modules

# Example output:
# ┌────────────────────────┬────────────┐
# │ name                   │ size       │
# ├────────────────────────┼────────────┤
# │ mongoose               │ 5.2 MB     │
# │ express                │ 1.8 MB     │
# │ lodash                 │ 1.4 MB     │
# └────────────────────────┴────────────┘
```

### Finding Duplicate Packages

```bash
# Install duplicate checker
npm install -g npm-check

# Check for duplicates
npm-check

# Or use npm dedupe in dry-run
npm dedupe --dry-run
```

### Analyzing Dependencies

```bash
# Install dependency analyzer
npm install -g depcheck

# Find unused dependencies
depcheck

# Example output:
# Unused dependencies
# * lodash
# * moment
# 
# Unused devDependencies
# * eslint-plugin-unused
```

---

## 7.12 Real-World Examples

### Example 1: Monthly Maintenance

```bash
#!/bin/bash
# monthly-update.sh

echo " Checking for outdated packages..."
npm outdated

echo " Updating packages..."
npm update

echo " Running tests..."
npm test

echo " Cleaning up..."
npm prune
npm dedupe

echo " Maintenance complete!"
npm list --depth=0
```

### Example 2: Dependency Health Check

```bash
#!/bin/bash
# health-check.sh

echo " Dependency Health Check"
echo "========================="

echo -e "\n1. Outdated packages:"
npm outdated

echo -e "\n2. Extraneous packages:"
npm prune --dry-run

echo -e "\n3. Duplicate packages:"
npm dedupe --dry-run

echo -e "\n4. Package count:"
npm list --depth=0 | wc -l

echo -e "\n5. node_modules size:"
du -sh node_modules
```

### Example 3: Safe Update Script

```javascript
// safe-update.js
const { execSync } = require('child_process');

function run(command) {
  console.log(`Running: ${command}`);
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Failed: ${command}`);
    return false;
  }
}

console.log('🔄 Starting safe update process...');

// Check what's outdated
run('npm outdated');

// Update packages
if (!run('npm update')) {
  console.error('❌ Update failed!');
  process.exit(1);
}

// Run tests
if (!run('npm test')) {
  console.error('❌ Tests failed! Rolling back...');
  run('git checkout package.json package-lock.json');
  run('npm install');
  process.exit(1);
}

console.log(' Update successful!');
console.log(' Commit these changes:');
console.log(' git add package.json package-lock.json');
console.log(' git commit -m "Update dependencies"');
```

---

## Hands-On Exercises

>Go to the [exercises](/exercises/07-managing-packages-exer.md) for this section

### Exercise 7.1: Exploring Installed Packages

**Objective:** Learn to view and understand your dependencies.

### Exercise 7.2: Checking for Updates

**Objective:** Learn to identify outdated packages.

### Exercise 7.3: Updating Packages

**Objective:** Practice different update methods.

### Exercise 7.4: Removing and Cleaning

**Objective:** Practice removing packages and cleaning up.

### Exercise 7.5: Real-World Maintenance

**Objective:** Perform a complete maintenance routine.

---

## Best Practices

### 1. Regular Maintenance Schedule

**Weekly:**
```bash
# Quick check
npm outdated
```

**Monthly:**
```bash
# Full maintenance
npm outdated
npm update
npm test
npm prune
npm dedupe
```

**Quarterly:**
```bash
# Major updates
ncu
# Review and update major versions carefully
```

### 2. Update with Confidence

```bash
# Safe update workflow
git checkout -b update-dependencies
npm outdated
npm update
npm test
npm run build
# If all pass:
git commit -am "Update dependencies"
git checkout main
git merge update-dependencies
```

### 3. Document Your Dependencies

**In README.md:**
```markdown
## Dependencies

### Production
- express: Web framework
- mongoose: MongoDB ODM
- dotenv: Environment variables

### Development
- jest: Testing framework
- nodemon: Auto-restart server
- eslint: Code linting
```

### 4. Use Exact Versions for Critical Packages

```json
{
  "dependencies": {
    "react": "18.2.0",           // Exact for stability
    "express": "^4.18.2"         // Caret for updates
  }
}
```

### 5. Keep Dependencies Minimal

```bash
# Before adding a package, ask:
# - Do I really need this?
# - Can I use a smaller alternative?
# - Can I write this functionality myself?

# Check package size before installing
npm view package-name dist.unpackedSize
```

### 6. Monitor Dependency Health

```bash
# Use tools to monitor
npm audit
npm outdated
depcheck

# Set up automated checks in CI/CD
```

### 7. Document Update History

```bash
# Use conventional commits
git commit -m "chore(deps): update express to v4.19.0"
git commit -m "chore(deps): update dev dependencies"
git commit -m "chore(deps): remove unused lodash"
```

---

## Summary

In this module, you learned:

✅ How to view installed packages and their information  
✅ Checking for outdated packages with npm outdated  
✅ Updating packages safely with npm update  
✅ Removing packages with npm uninstall  
✅ Cleaning up with npm prune and npm dedupe  
✅ Viewing and understanding dependency trees  
✅ Managing global packages effectively  
✅ Real-world maintenance workflows  

### Key Takeaways

- **npm list** - View installed packages
- **npm outdated** - Check for updates
- **npm update** - Update respecting semver
- **npm uninstall** - Remove packages
- **npm prune** - Remove unused packages
- **npm dedupe** - Reduce duplicates
- **Always test after updating** - Prevent breaking changes
- **Keep dependencies minimal** - Reduce complexity and size

---

## Next Steps

Now that you know how to manage packages, it's important to understand NPM's caching system, which can significantly improve installation speed and reliability.

**Continue to:** [Module 8: NPM Cache →](08-npm-cache.md)

---

## Additional Resources

- [NPM Update Documentation](https://docs.npmjs.com/cli/v9/commands/npm-update)
- [NPM Uninstall Documentation](https://docs.npmjs.com/cli/v9/commands/npm-uninstall)
- [NPM List Documentation](https://docs.npmjs.com/cli/v9/commands/npm-list)
- [NPM Prune Documentation](https://docs.npmjs.com/cli/v9/commands/npm-prune)
- [NPM Dedupe Documentation](https://docs.npmjs.com/cli/v9/commands/npm-dedupe)
- [npm-check-updates](https://www.npmjs.com/package/npm-check-updates)

---

## Discussion

Have questions about managing packages? Join the discussion:
- [GitHub Discussions](https://github.com/yourusername/npm-mastery-course/discussions)
- Found an error? [Open an issue](https://github.com/yourusername/npm-mastery-course/issues)

---

[← Previous Module](06-npm-scripts.md) | [🏠 Home](../README.md) | [Next Module →](08-npm-cache.md)
