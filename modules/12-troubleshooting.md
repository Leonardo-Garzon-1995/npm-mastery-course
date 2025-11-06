# Module 12: Troubleshooting & Best Practices

[← Previous Module](11-advanced-features.md) | [🏠 Home](../README.md) | [Next Module →](13-real-world-project.md)

---

## Module Overview

Even experienced developers encounter NPM issues. This module covers common problems, their solutions, and professional best practices to help you work efficiently and avoid issues altogether.

**Learning Objectives:**
- Diagnose and fix common NPM errors
- Understand error messages and logs
- Resolve dependency conflicts
- Fix installation and permission issues
- Follow industry best practices
- Optimize your NPM workflow
- Prevent common problems

---

## 12.1 Common NPM Errors

### Error: EACCES - Permission Denied

**Symptoms:**
```
npm ERR! code EACCES
npm ERR! syscall access
npm ERR! path /usr/local/lib/node_modules
npm ERR! errno -13
npm ERR! Error: EACCES: permission denied
```

**Causes:**
- Installing global packages without permission
- NPM installed with sudo
- Incorrect directory permissions

**Solutions:**

**Solution 1: Configure NPM to use different directory (Best)**
```bash
# Create directory for global packages
mkdir ~/.npm-global

# Configure NPM
npm config set prefix '~/.npm-global'

# Add to PATH (add to ~/.bashrc or ~/.zshrc)
export PATH=~/.npm-global/bin:$PATH

# Reload shell
source ~/.bashrc  # or source ~/.zshrc

# Now install without sudo
npm install -g package-name
```

**Solution 2: Fix directory ownership (Alternative)**
```bash
# Find npm directory
npm config get prefix

# Change ownership (use your username)
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
```

**❌ Never do this:**
```bash
sudo npm install -g package-name  # Don't use sudo!
```

### Error: ENOENT - No Such File or Directory

**Symptoms:**
```
npm ERR! code ENOENT
npm ERR! syscall open
npm ERR! path /path/to/package.json
npm ERR! errno -2
npm ERR! enoent ENOENT: no such file or directory
```

**Causes:**
- Running npm command in wrong directory
- Missing package.json
- Corrupted node_modules

**Solutions:**

**Solution 1: Verify location**
```bash
# Check if package.json exists
ls package.json

# If not, you're in wrong directory or need to init
npm init -y
```

**Solution 2: Clean install**
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Error: ERESOLVE - Dependency Conflict

**Symptoms:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
npm ERR! Found: react@18.2.0
npm ERR! Could not resolve dependency:
npm ERR! peer react@"^17.0.0" from react-router-dom@6.0.0
```

**Causes:**
- Incompatible package versions
- Peer dependency conflicts
- Breaking changes in dependencies

**Solutions:**

**Solution 1: Use legacy peer deps**
```bash
# Skip peer dependency resolution
npm install --legacy-peer-deps
```

**Solution 2: Force install**
```bash
# Force install (less safe)
npm install --force
```

**Solution 3: Update conflicting package**
```bash
# Update to compatible version
npm install react-router-dom@latest
```

**Solution 4: Use overrides (npm 8.3+)**
```json
{
  "overrides": {
    "react": "^18.0.0"
  }
}
```

### Error: npm ERR! 404 Not Found

**Symptoms:**
```
npm ERR! code E404
npm ERR! 404 Not Found - GET https://registry.npmjs.org/package-name
npm ERR! 404 'package-name@1.0.0' is not in this registry
```

**Causes:**
- Package name misspelled
- Package doesn't exist
- Package unpublished
- Wrong registry

**Solutions:**

**Solution 1: Check spelling**
```bash
# Search for correct name
npm search similar-name

# Check on npmjs.com
```

**Solution 2: Check registry**
```bash
# View current registry
npm config get registry

# Reset to default
npm config set registry https://registry.npmjs.org/
```

**Solution 3: Check if package was unpublished**
```bash
# View package versions
npm view package-name versions

# Check package page on npmjs.com
```

### Error: Integrity Check Failed

**Symptoms:**
```
npm ERR! code EINTEGRITY
npm ERR! sha512-xxx integrity checksum failed
npm ERR! Expected: sha512-abc...
npm ERR! Actual:   sha512-xyz...
```

**Causes:**
- Corrupted cache
- Network issues during download
- Registry problems

**Solutions:**

**Solution 1: Clear cache and reinstall**
```bash
# Clear cache
npm cache clean --force

# Remove node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

**Solution 2: Verify cache**
```bash
# Verify and clean corrupted items
npm cache verify
```

### Error: ELIFECYCLE - Script Failed

**Symptoms:**
```
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! my-package@1.0.0 test: `jest`
npm ERR! Exit status 1
```

**Causes:**
- Script command failed
- Missing dependency for script
- Syntax error in code

**Solutions:**

**Solution 1: Run script directly**
```bash
# Run command directly to see error
jest

# Or with verbose output
npm run test --verbose
```

**Solution 2: Check script syntax**
```json
{
  "scripts": {
    "test": "jest",  // Verify command is correct
    "build": "webpack"
  }
}
```

**Solution 3: Install missing dependencies**
```bash
# If jest is missing
npm install --save-dev jest
```

---

## 12.2 Dependency Conflicts

### Understanding Dependency Trees

**View dependency tree:**
```bash
# Full tree
npm list

# Specific depth
npm list --depth=1

# Specific package
npm list package-name

# Why is package installed?
npm explain package-name
```

### Resolving Version Conflicts

**Scenario: Two packages need different versions**

```
my-app
├── package-a (needs lodash@4.17.0)
└── package-b (needs lodash@4.17.21)
```

**Solution 1: Update to compatible versions**
```bash
# Update both packages
npm update package-a package-b
```

**Solution 2: Use overrides**
```json
{
  "overrides": {
    "lodash": "4.17.21"
  }
}
```

**Solution 3: Deduplicate**
```bash
# Remove duplicate packages
npm dedupe
```

### Peer Dependency Issues

**Understanding peer dependencies:**
```
Plugin requires React 18, but you have React 17
```

**Check peer dependencies:**
```bash
# View peer dependencies
npm view package-name peerDependencies

# Check what's installed
npm list react
```

**Solutions:**

**Option 1: Update peer dependency**
```bash
# Update to required version
npm install react@18
```

**Option 2: Use legacy peer deps**
```bash
# Install ignoring peer deps
npm install --legacy-peer-deps
```

**Option 3: Find compatible version**
```bash
# Find version that works with React 17
npm view package-name versions
npm install package-name@older-version
```

---

## 12.3 Installation Issues

### Slow Installation

**Symptoms:**
- npm install takes very long
- Downloads are slow

**Solutions:**

**Solution 1: Use different registry**
```bash
# Try different registry mirror
npm config set registry https://registry.npmmirror.com

# Or use proxy
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080
```

**Solution 2: Use npm ci**
```bash
# Faster clean install
rm -rf node_modules
npm ci
```

**Solution 3: Check network**
```bash
# Test registry connection
curl https://registry.npmjs.org/

# Check DNS
nslookup registry.npmjs.org
```

### Installation Hangs

**Symptoms:**
- npm install freezes
- No progress for long time

**Solutions:**

**Solution 1: Increase timeout**
```bash
# Set longer timeout
npm config set fetch-timeout 60000

# Or in command
npm install --fetch-timeout=60000
```

**Solution 2: Disable progress bar**
```bash
# Install without progress
npm install --no-progress
```

**Solution 3: Clean and retry**
```bash
# Clear cache
npm cache clean --force

# Remove and retry
rm -rf node_modules package-lock.json
npm install
```

### Package-lock.json Conflicts

**Symptoms:**
- Merge conflicts in package-lock.json
- npm install fails after git pull

**Solution:**

```bash
# Don't manually resolve - regenerate
rm package-lock.json
npm install

# Commit new lock file
git add package-lock.json
git commit -m "Regenerate package-lock.json"
```

**Prevention:**
```bash
# Always use npm ci in CI/CD
npm ci

# Don't manually edit package-lock.json
```

---

## 12.4 Build and Runtime Issues

### Module Not Found

**Symptoms:**
```javascript
Error: Cannot find module 'express'
```

**Causes:**
- Package not installed
- Wrong import path
- Case sensitivity issues

**Solutions:**

**Solution 1: Install package**
```bash
# Check if installed
npm list express

# If not, install
npm install express
```

**Solution 2: Check import path**
```javascript
// ❌ Wrong
const express = require('Express');

// ✅ Correct
const express = require('express');
```

**Solution 3: Verify node_modules**
```bash
# Check if package exists
ls node_modules/express

# If missing, reinstall
npm install
```

### Version Mismatch

**Symptoms:**
```
TypeError: someFunction is not a function
```

**Causes:**
- Using old API
- Wrong version installed
- Cached old version

**Solutions:**

**Solution 1: Check version**
```bash
# View installed version
npm list package-name

# View available versions
npm view package-name versions

# Install specific version
npm install package-name@latest
```

**Solution 2: Clear cache**
```bash
# Clear npm cache
npm cache clean --force

# Clear node_modules
rm -rf node_modules package-lock.json
npm install
```

### Native Module Issues

**Symptoms:**
```
Error: The module was compiled against a different Node.js version
```

**Causes:**
- Node version changed
- Native modules not rebuilt
- Platform mismatch

**Solutions:**

**Solution 1: Rebuild modules**
```bash
# Rebuild all native modules
npm rebuild

# Rebuild specific package
npm rebuild node-sass
```

**Solution 2: Reinstall**
```bash
# Delete and reinstall
rm -rf node_modules
npm install
```

**Solution 3: Use correct Node version**
```bash
# Check Node version
node --version

# Use nvm to switch
nvm use 18
npm install
```

---

## 12.5 NPM Logs and Debugging

### Understanding NPM Logs

**Log location:**
```bash
# Find log location
npm config get cache

# Logs are in: ~/.npm/_logs/
```

**View recent log:**
```bash
# View last error log
npm config get logs
ls -la ~/.npm/_logs/

# View specific log
cat ~/.npm/_logs/[timestamp]-debug.log
```

### Debug Mode

**Enable verbose logging:**
```bash
# Verbose output
npm install --verbose

# Even more verbose
npm install --silly

# Specific debugging
npm install --loglevel=silly
```

**Debug specific issues:**
```bash
# Debug lifecycle scripts
npm run build --verbose

# Debug network
npm install --loglevel=http

# Debug all
npm install --loglevel=verbose
```

### Troubleshooting Workflow

**Step-by-step debugging:**

```bash
# 1. Check npm version
npm --version

# 2. Check Node version
node --version

# 3. Check current configuration
npm config list

# 4. Verify registry
npm config get registry

# 5. Clear cache
npm cache clean --force

# 6. Clean install
rm -rf node_modules package-lock.json
npm install --verbose

# 7. Check logs
npm config get logs
```

---

## 12.6 Best Practices

### Project Setup

**1. Initialize properly**
```bash
# Use init to create package.json
npm init

# Or with defaults
npm init -y

# Then customize as needed
```

**2. Use .npmrc for project settings**
```
# .npmrc
save-exact=true
engine-strict=true
```

**3. Specify Node version**
```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

### Dependency Management

**1. Keep dependencies minimal**
```bash
# Before installing, ask:
# - Do I really need this?
# - Can I use native JavaScript?
# - How many dependencies does it have?

# Check dependencies
npm view package-name dependencies
```

**2. Separate dependencies correctly**
```json
{
  "dependencies": {
    "express": "^4.18.2"  // Production dependencies
  },
  "devDependencies": {
    "jest": "^29.5.0"     // Development only
  }
}
```

**3. Use exact versions for critical packages**
```bash
# Install with exact version
npm install --save-exact react react-dom
```

**4. Regular maintenance**
```bash
# Weekly
npm outdated

# Monthly
npm update
npm audit fix

# Quarterly
npm audit
depcheck  # Find unused dependencies
```

### Version Control

**1. Commit package-lock.json**
```bash
# Always commit
git add package.json package-lock.json
git commit -m "Update dependencies"
```

**2. Use .gitignore**
```
# .gitignore
node_modules/
npm-debug.log
.npm
```

**3. Don't commit node_modules**
```bash
# If accidentally committed
git rm -r --cached node_modules
git commit -m "Remove node_modules"
```

### CI/CD Best Practices

**1. Use npm ci**
```bash
# In CI/CD, always use
npm ci

# Not
npm install
```

**2. Cache dependencies**
```yaml
# GitHub Actions
- uses: actions/setup-node@v3
  with:
    node-version: '18'
    cache: 'npm'

- run: npm ci
- run: npm test
```

**3. Specify Node version**
```yaml
# Use specific Node version
- uses: actions/setup-node@v3
  with:
    node-version: '18.16.0'
```

### Security Best Practices

**1. Regular security audits**
```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Weekly in CI/CD
npm audit --audit-level=high
```

**2. Keep dependencies updated**
```bash
# Check outdated
npm outdated

# Update carefully
npm update
npm test  # Always test after updating
```

**3. Enable 2FA**
```bash
# For your npm account
npm profile enable-2fa auth-and-writes
```

**4. Review dependencies before installing**
```bash
# Check package
npm view package-name
npm view package-name repository
npm view package-name maintainers

# Check weekly downloads
# Visit npmjs.com/package/package-name
```

### Performance Best Practices

**1. Use .npmignore**
```
# Exclude unnecessary files from publish
test/
coverage/
.github/
*.test.js
docs/
examples/
```

**2. Optimize scripts**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest --maxWorkers=2"  // Limit workers
  }
}
```

**3. Use npm ci in production**
```bash
# Production deployment
npm ci --only=production

# Or
npm ci --omit=dev
```

---

## 12.7 Professional Workflows

### Daily Development Workflow

**Morning routine:**
```bash
# Pull latest changes
git pull

# Check for conflicts in package-lock.json
git status

# If package-lock.json changed
npm ci  # Clean install

# Start development
npm run dev
```

**Before committing:**
```bash
# Run tests
npm test

# Run linting
npm run lint

# Check for issues
npm audit

# Commit
git add .
git commit -m "feat: add new feature"
```

### Team Collaboration

**1. Document NPM usage**
```markdown
# README.md

## Setup
```bash
npm install
```

## Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server
- `npm test` - Run tests
- `npm run build` - Build for production

## Node Version
This project requires Node.js 18.x or higher
```

**2. Use npm scripts for consistency**
```json
{
  "scripts": {
    "setup": "npm install && npm run build",
    "clean": "rm -rf node_modules dist",
    "reset": "npm run clean && npm install"
  }
}
```

**3. Share configuration**
```
# .npmrc (commit to repo)
save-exact=true
engine-strict=true
```

### Release Workflow

**Complete release process:**
```bash
# 1. Ensure clean state
git status

# 2. Run full test suite
npm test

# 3. Run audit
npm audit

# 4. Build
npm run build

# 5. Update version
npm version patch  # or minor, or major

# 6. Push changes and tags
git push
git push --tags

# 7. Publish (if library)
npm publish

# 8. Create GitHub release
gh release create v1.0.1
```

---

## 12.8 Optimization Tips

### Speed Up Installation

**1. Use npm ci for clean installs**
```bash
# Much faster than npm install
npm ci
```

**2. Use offline mode**
```bash
# If packages are cached
npm install --prefer-offline
```

**3. Configure cache location**
```bash
# Move cache to faster drive
npm config set cache /path/to/fast/drive/.npm
```

**4. Limit concurrent downloads**
```bash
# If network is unstable
npm config set maxsockets 5
```

### Reduce Package Size

**1. Use production install**
```bash
# Exclude devDependencies
npm install --production

# Or
npm ci --omit=dev
```

**2. Check bundle size**
```bash
# Install bundle analyzer
npm install -g cost-of-modules

# Analyze
cost-of-modules

# Or
du -sh node_modules/*
```

**3. Remove unused dependencies**
```bash
# Install depcheck
npm install -g depcheck

# Find unused
depcheck

# Remove unused
npm uninstall unused-package
```

### Improve Reliability

**1. Lock to specific versions**
```json
{
  "dependencies": {
    "react": "18.2.0",  // No ^ or ~
    "react-dom": "18.2.0"
  }
}
```

**2. Use package-lock.json**
```bash
# Always commit it
git add package-lock.json
```

**3. Regular updates**
```bash
# Update and test regularly
npm update
npm test
git commit -am "chore: update dependencies"
```

---

## 12.9 Debugging Checklist

### When Installation Fails

```
☐ Check npm and Node versions
  npm --version && node --version

☐ Clear cache
  npm cache clean --force

☐ Remove node_modules and lock file
  rm -rf node_modules package-lock.json

☐ Check registry
  npm config get registry

☐ Try verbose install
  npm install --verbose

☐ Check for permission issues
  ls -la node_modules

☐ Verify package.json syntax
  cat package.json | json_pp

☐ Check npm logs
  cat ~/.npm/_logs/*-debug.log
```

### When Scripts Fail

```
☐ Run script directly
  node script.js

☐ Check script syntax in package.json
  npm run

☐ Verify dependencies are installed
  npm list

☐ Run with verbose
  npm run script --verbose

☐ Check environment variables
  env | grep npm

☐ Verify file permissions
  ls -la script.js

☐ Check for syntax errors
  npm run lint
```

### When Module Not Found

```
☐ Check if installed
  npm list package-name

☐ Verify import path
  Check require/import statement

☐ Check case sensitivity
  Verify exact package name

☐ Reinstall package
  npm install package-name

☐ Clear cache and reinstall
  npm cache clean --force && npm install

☐ Check node_modules
  ls node_modules/package-name

☐ Rebuild if native module
  npm rebuild package-name
```

---

## Hands-On Exercises

>Go to the [exercises](/exercises/12-troubleshooting-exer.md) for this section for the full instructions on how to complete each exercise.

### Exercise 12.1: Simulate and Fix Permission Error

**Objective:** Understand and fix EACCES errors.

### Exercise 12.2: Resolve Dependency Conflict

**Objective:** Practice resolving version conflicts.

### Exercise 12.3: Debug Installation Issue

**Objective:** Practice debugging with verbose mode.

### Exercise 12.4: Clean Install Workflow

**Objective:** Practice the complete clean install process.

### Exercise 12.5: Create Troubleshooting Script

**Objective:** Build a diagnostic script.
---

## Best Practices Checklist

### Project Setup
- ☐ Initialize with npm init
- ☐ Create .npmrc with project settings
- ☐ Specify engines in package.json
- ☐ Create proper .gitignore
- ☐ Document setup in README

### Dependency Management
- ☐ Keep dependencies minimal
- ☐ Use correct dependency types
- ☐ Lock critical versions
- ☐ Regular audits and updates
- ☐ Remove unused packages

### Version Control
- ☐ Commit package-lock.json
- ☐ Never commit node_modules
- ☐ Use semantic versioning
- ☐ Tag releases
- ☐ Keep changelog

### Security
- ☐ Enable 2FA on npm account
- ☐ Run npm audit regularly
- ☐ Keep dependencies updated
- ☐ Review packages before installing
- ☐ Use private packages for sensitive code

### CI/CD
- ☐ Use npm ci
- ☐ Cache dependencies
- ☐ Run tests before deploy
- ☐ Audit in pipeline
- ☐ Specify Node version

---

## Summary

In this module, you learned:

✅ How to diagnose and fix common NPM errors  
✅ Resolving dependency conflicts  
✅ Fixing installation and permission issues  
✅ Using NPM logs for debugging  
✅ Industry best practices for NPM  
✅ Professional workflows for teams  
✅ Optimization tips for speed and reliability  
✅ Complete troubleshooting checklists  

### Key Takeaways

- **Never use sudo** - Configure permissions properly
- **Always commit package-lock.json** - Ensures consistent installs
- **Use npm ci in CI/CD** - Faster and more reliable
- **Clean cache when needed** - Solves many issues
- **Test after updates** - Prevent breaking changes
- **Keep dependencies minimal** - Less code, less problems
- **Regular maintenance** - Prevent issues before they occur
- **Document everything** - Help your team succeed

---

## Next Steps

Congratulations! You now have the knowledge to troubleshoot NPM issues and follow professional best practices. You're ready to apply everything you've learned in a real-world project!

**Continue to:** [Module 13: Real-World Project →](13-real-world-project.md)

---

## Additional Resources

- [NPM CLI Documentation](https://docs.npmjs.com/cli/v9)
- [NPM Error Codes](https://docs.npmjs.com/cli/v9/using-npm/errors)
- [Troubleshooting](https://docs.npmjs.com/troubleshooting/)
- [NPM Blog - Common Errors](https://blog.npmjs.org/)
- [Stack Overflow - NPM Tag](https://stackoverflow.com/questions/tagged/npm)
- [GitHub - NPM Issues](https://github.com/npm/cli/issues)

---

## Discussion

Have questions about troubleshooting? Join the discussion:
- [GitHub Discussions](https://github.com/Leonardo-Garzon-1995/npm-mastery-course/discussions)
- Found an error? [Open an issue](https://github.com/Leonardo-Garzon-1995/npm-mastery-course/issues)

---

[← Previous Module](11-advanced-features.md) | [🏠 Home](../README.md) | [Next Module →](13-real-world-project.md)