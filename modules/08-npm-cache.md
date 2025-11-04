# Module 8: NPM Cache

[← Previous Module](07-managing-packages.md) | [🏠 Home](../README.md) | [Next Module →](09-security-auditing.md)

---

## Module Overview

NPM's cache system is a powerful feature that speeds up installations and provides offline capabilities. Understanding and managing the cache effectively can significantly improve your development workflow.

**Learning Objectives:**
- Understand how NPM's cache works
- Learn where the cache is stored
- Verify and manage cache integrity
- Clean the cache when needed
- Optimize cache for better performance
- Troubleshoot cache-related issues

---

## 8.1 Understanding NPM Cache

### What is the NPM Cache?

The NPM cache is a local storage where NPM keeps copies of downloaded packages. When you install a package, NPM:
1. Checks if it's in the cache
2. If yes, uses the cached version (fast!)
3. If no, downloads from registry and adds to cache

**Benefits:**
- Faster installations
- Offline package installation
- Integrity verification
- Reduced network usage
- Works when registry is down

### How the Cache Works

**First installation (package not cached):**
```
npm install express
  ↓
Check cache → Not found
  ↓
Download from registry
  ↓
Add to cache
  ↓
Install to node_modules
```

**Subsequent installations (package cached):**
```
npm install express
  ↓
Check cache → Found!
  ↓
Copy from cache (fast!)
  ↓
Install to node_modules
```

### Cache vs Registry

```
┌─────────────────────────────────┐
│      NPM Registry               │
│   (registry.npmjs.org)          │
│   - Source of truth             │
│   - Always up to date           │
└─────────────────────────────────┘
              ↓ Download
┌─────────────────────────────────┐
│      NPM Cache                  │
│   (Local storage)               │
│   - Copies of packages          │
│   - Faster access               │
└─────────────────────────────────┘
              ↓ Copy
┌─────────────────────────────────┐
│      node_modules               │
│   (Your project)                │
│   - Installed packages          │
└─────────────────────────────────┘
```

---

## 8.2 Cache Location

### Finding Cache Directory

**Get cache path:**
```bash
# Show cache directory
npm config get cache

# Example outputs:
# Mac/Linux: /Users/username/.npm
# Windows: C:\Users\username\AppData\Local\npm-cache
```

**View cache info:**
```bash
# Show cache location and size
npm cache verify
```

**Example output:**
```
Cache verified and compressed (~/.npm/_cacache)
Content verified: 1523 (341.2 MB)
Index entries: 1523
Finished in 8.234s
```

### Cache Directory Structure

**Inside the cache directory:**
```
~/.npm/
├── _cacache/
│   ├── content-v2/      # Actual package data
│   ├── index-v5/        # Index of cached packages
│   └── tmp/             # Temporary files
├── _logs/               # NPM operation logs
└── anonymous-cli-metrics.json
```

**The cache is content-addressable:**
- Packages stored by hash, not name
- Ensures integrity
- Prevents conflicts

---

## 8.3 Viewing Cache Information

### Listing Cache Contents

**Note:** The cache structure is not meant to be browsed directly, but you can get info:

```bash
# Verify and show cache info
npm cache verify

# Example output:
# Cache verified and compressed (~/.npm/_cacache)
# Content verified: 1523 (341.2 MB)
# Content garbage-collected: 0 (0 B)
# Missing content: 0
# Index entries: 1523
# Finished in 8.234s
```

### Checking Cache Size

```bash
# On Mac/Linux
du -sh ~/.npm

# On Windows (PowerShell)
(Get-ChildItem -Path $env:APPDATA\npm-cache -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB

# Or using npm
npm cache verify
```

**Typical cache sizes:**
- Small project: 50-200 MB
- Medium project: 200-500 MB
- Large project: 500 MB - 2 GB
- Multiple projects: 2-10 GB

---

## 8.4 Managing the Cache

### Verifying Cache Integrity

**Check cache integrity:**
```bash
# Verify all cached packages
npm cache verify
```

**What it does:**
- Checks all packages in cache
- Verifies integrity hashes
- Removes corrupted data
- Compacts cache storage
- Shows statistics

**When to verify:**
- After system crash
- When getting strange errors
- Before important deployments
- Periodically (monthly)

### Cleaning the Cache

**Clear entire cache:**
```bash
# Delete all cached packages
npm cache clean --force

# Note: --force is required in npm 5+
```

**What it does:**
- Deletes everything in cache
- Frees up disk space
- Next installs will be slower
- Downloads all packages fresh

**Warning:** Only clean cache when troubleshooting!

### When to Clean the Cache

**Good reasons to clean:**
- ✅ Persistent installation errors
- ✅ Corrupted cache (verify fails)
- ✅ Strange behavior after updates
- ✅ Disk space critically low
- ✅ Switching between npm versions

**Bad reasons to clean:**
- ❌ As part of regular workflow
- ❌ Before every install
- ❌ "Just because"
- ❌ To "speed up" npm (it does opposite!)

### Partial Cache Management

**NPM manages cache automatically:**
- Old packages are removed over time
- Corrupted packages are removed
- Cache is compacted during verify

**You don't need to manually manage:**
```bash
# ❌ Don't do this regularly
npm cache clean --force

# ✅ Let NPM manage it
npm cache verify
```

---

## 8.5 Cache and Installation Commands

### How Different Commands Use Cache

**npm install:**
```bash
npm install express
```
- Checks cache first
- Downloads if not cached
- Adds to cache
- Uses cache on reinstall

**npm ci:**
```bash
npm ci
```
- Uses cache when available
- Validates against package-lock.json
- Faster than npm install
- Recommended for CI/CD

**npm cache add:**
```bash
# Manually add package to cache (rarely needed)
npm cache add express
```

### Installing from Cache Offline

**When offline, NPM can still install cached packages:**

```bash
# Disconnect from internet
# Try installing a previously cached package
npm install express

# Works if express is in cache!
```

**Configure for offline use:**
```bash
# Set NPM to prefer offline
npm config set prefer-offline true

# Or force offline
npm config set offline true
```

**Revert settings:**
```bash
npm config delete prefer-offline
npm config delete offline
```

---

## 8.6 Cache Configuration

### Cache-Related Settings

**View cache settings:**
```bash
# Show cache configuration
npm config get cache
npm config get cache-min
npm config get cache-max
```

**Change cache location:**
```bash
# Set custom cache directory
npm config set cache /path/to/custom/cache

# Example: Move cache to external drive
npm config set cache /Volumes/External/.npm

# Reset to default
npm config delete cache
```

**Cache timing settings:**
```bash
# Set cache minimum time (seconds)
npm config set cache-min 9999999

# Reset
npm config delete cache-min
```

### Prefer Offline Mode

**Configure offline preference:**
```bash
# Try cache first, then network
npm config set prefer-offline true

# Install with prefer-offline
npm install --prefer-offline

# Force offline only
npm config set offline true
```

**Use cases:**
- Working on airplane/train
- Slow internet connection
- Avoiding network issues
- Testing offline scenarios

### Cache Verification Settings

```bash
# Skip cache verification (faster, less safe)
npm install --no-audit

# Skip integrity checks (not recommended)
npm install --no-integrity
```

---

## 8.7 Troubleshooting Cache Issues

### Common Cache Problems

**Problem 1: "Cache Corruption" Errors**

**Symptoms:**
```
npm ERR! cache corruption detected
npm ERR! integrity check failed
```

**Solution:**
```bash
# Step 1: Verify cache
npm cache verify

# Step 2: If verify fails, clean cache
npm cache clean --force

# Step 3: Reinstall
npm install
```

**Problem 2: "Cannot Read Property" Errors**

**Symptoms:**
```
npm ERR! Cannot read property 'name' of undefined
```

**Solution:**
```bash
# Clean cache
npm cache clean --force

# Delete node_modules and package-lock
rm -rf node_modules package-lock.json

# Fresh install
npm install
```

**Problem 3: Disk Space Issues**

**Symptoms:**
```
npm ERR! ENOSPC: no space left on device
```

**Solution:**
```bash
# Check cache size
npm cache verify

# Clean cache
npm cache clean --force

# Check disk space
df -h  # Mac/Linux
```

**Problem 4: Old Package Versions Being Used**

**Symptoms:**
- Installing package installs old cached version
- Even though newer version exists

**Solution:**
```bash
# Clear cache
npm cache clean --force

# Install latest
npm install package@latest
```

### Reset Everything

**Nuclear option when nothing else works:**

```bash
# 1. Clean cache
npm cache clean --force

# 2. Delete node_modules
rm -rf node_modules

# 3. Delete lock file
rm package-lock.json

# 4. Clear npm config
npm config list
# Review and delete problematic settings

# 5. Fresh install
npm install

# 6. Verify
npm cache verify
```

---

## 8.8 Cache Best Practices

### 1. Don't Clean Cache Regularly

**Bad practice:**
```bash
# In your scripts
"preinstall": "npm cache clean --force"
```

**Good practice:**
```bash
# Only clean when troubleshooting
npm cache verify  # Use this instead
```

### 2. Let NPM Manage Cache

**NPM automatically:**
- Removes old packages
- Compacts cache
- Manages disk space
- Validates integrity

**You should:**
- Let it do its job
- Only intervene when problems occur
- Use `verify` instead of `clean`

### 3. Periodic Verification

**Good routine:**
```bash
# Weekly or monthly
npm cache verify
```

**Add to maintenance script:**
```json
{
  "scripts": {
    "maintenance": "npm cache verify && npm outdated"
  }
}
```

### 4. Configure for Your Environment

**Slow internet:**
```bash
npm config set prefer-offline true
```

**Limited disk space:**
```bash
# Move cache to external drive
npm config set cache /path/to/external/drive/.npm
```

**CI/CD environments:**
```bash
# Use cache to speed up builds
npm ci  # Leverages cache
```

### 5. Monitor Cache Size

**Check regularly:**
```bash
# Check size
du -sh ~/.npm

# If over 5-10 GB, consider cleaning
npm cache clean --force
```

**Or use a script:**
```bash
#!/bin/bash
# check-cache.sh

SIZE=$(du -sm ~/.npm | cut -f1)
echo "Cache size: ${SIZE} MB"

if [ $SIZE -gt 5000 ]; then
  echo "Cache is large (>5GB)"
  echo "Consider running: npm cache clean --force"
fi
```

---

## 8.9 Advanced Cache Topics

### Cache and CI/CD

**Caching in GitHub Actions:**
```yaml
# .github/workflows/test.yml
name: Test
on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'  # ← Caches npm dependencies
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
```

**Benefits:**
- Faster CI/CD builds
- Reduced network usage
- More reliable builds

### Cache and Docker

**Using cache in Docker:**

```dockerfile
# Dockerfile
FROM node:18

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (layers are cached)
RUN npm ci --only=production

# Copy application code
COPY . .

CMD ["npm", "start"]
```

**Build with cache:**
```bash
# Docker caches npm install layer
docker build -t my-app .

# Subsequent builds are faster if package.json unchanged
```

### Cache and Monorepos

**In monorepo with workspaces:**
```bash
# Install all workspaces
npm install

# Cache is shared across workspaces
# Packages used by multiple workspaces cached once
```

**Benefits:**
- Shared cache across projects
- Faster installations
- Less disk usage

---

## 8.10 Real-World Examples

### Example 1: Cache Maintenance Script

```bash
#!/bin/bash
# cache-maintenance.sh

echo "NPM Cache Maintenance"
echo "======================="

# Show current cache status
echo -e "\n Current cache status:"
npm cache verify

# Get cache size
CACHE_SIZE=$(du -sm ~/.npm 2>/dev/null | cut -f1)
echo -e "\nCache size: ${CACHE_SIZE} MB"

# Check if cache is large
if [ $CACHE_SIZE -gt 5000 ]; then
  echo -e "\n  Cache is large (>5GB)"
  read -p "Clean cache? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo " Cleaning cache..."
    npm cache clean --force
    echo " Cache cleaned"
    npm cache verify
  fi
else
  echo -e "\n Cache size is reasonable"
fi

echo -e "\n Maintenance complete"
```

### Example 2: Installation with Cache Fallback

```bash
#!/bin/bash
# install-with-fallback.sh

echo " Installing dependencies..."

# Try regular install (uses cache)
if npm install; then
  echo " Installation successful"
  exit 0
fi

echo "Installation failed, trying cache clean..."

# Clean cache and retry
npm cache clean --force

if npm install; then
  echo " Installation successful after cache clean"
  exit 0
fi

echo " Installation failed even after cache clean"
exit 1
```

### Example 3: CI/CD Cache Optimization

```yaml
# .gitlab-ci.yml
variables:
  npm_config_cache: "$CI_PROJECT_DIR/.npm"
  CYPRESS_CACHE_FOLDER: "$CI_PROJECT_DIR/cache/Cypress"

cache:
  key:
    files:
      - package-lock.json
  paths:
    - .npm
    - node_modules
    - cache/Cypress

before_script:
  - npm ci --cache .npm --prefer-offline

test:
  script:
    - npm test
```

### Example 4: Offline Development Setup

```bash
#!/bin/bash
# setup-offline-dev.sh

echo " Setting up for offline development..."

# Set prefer-offline
npm config set prefer-offline true

# Cache all dependencies
echo " Caching project dependencies..."
npm install

# Cache common packages
echo " Caching common packages..."
npm cache add lodash
npm cache add express
npm cache add react
npm cache add axios

echo "Ready for offline development!"
echo "To revert: npm config delete prefer-offline"
```

---

## Hands-On Exercises

>Go to the [exercises](/exercises/08-npm-cache-exer.md) for this section

### Exercise 8.1: Exploring the Cache

**Objective:** Understand where cache is stored and what it contains.

### Exercise 8.2: Cache Performance Test

**Objective:** See how cache improves installation speed.

### Exercise 8.3: Offline Installation

**Objective:** Test installing packages without internet.

### Exercise 8.4: Cache Troubleshooting

**Objective:** Practice fixing cache-related issues.

### Exercise 8.5: Cache Maintenance Routine

**Objective:** Create a cache maintenance routine.

---

## Best Practices

### 1. Trust the Cache

**The cache is reliable:**
- NPM verifies integrity
- Packages are checked
- Corruption is rare

**Default behavior is good:**
```bash
# Just install normally
npm install
# Cache handles itself
```

### 2. Use npm cache verify

**Instead of cleaning:**
```bash
# ✅ Do this
npm cache verify

# ❌ Not this
npm cache clean --force
```

### 3. Configure for Your Environment

**Slow internet:**
```bash
npm config set prefer-offline true
```

**Limited disk space:**
```bash
# Move cache
npm config set cache /path/to/bigger/drive/.npm
```

### 4. Leverage Cache in CI/CD

**GitHub Actions:**
```yaml
- uses: actions/setup-node@v3
  with:
    cache: 'npm'
```

**GitLab CI:**
```yaml
cache:
  paths:
    - node_modules/
    - .npm/
```

### 5. Monitor but Don't Micromanage

**Periodic checks:**
```bash
# Monthly
npm cache verify
du -sh ~/.npm
```

**Let NPM manage:**
- Don't clean regularly
- Don't manually delete cache files
- Trust the system

### 6. Document Cache Location

**In project README:**
```markdown
## Cache Location

NPM cache: `~/.npm` (Mac/Linux) or `%APPDATA%\npm-cache` (Windows)

To verify cache: `npm cache verify`
To clean cache: `npm cache clean --force` (only if needed)
```

---

## Summary

In this module, you learned:

✅ How NPM cache works and its benefits  
✅ Where the cache is stored on your system  
✅ How to verify cache integrity  
✅ When and how to clean the cache  
✅ How to configure cache settings  
✅ How to use cache for offline installations  
✅ How to leverage cache in CI/CD  
✅ Best practices for cache management  

### Key Takeaways

- **Cache speeds up installations** - Significantly faster with cached packages
- **Trust the cache** - It's reliable and self-managing
- **Use npm cache verify** - Not clean (unless troubleshooting)
- **Cache enables offline work** - Install packages without internet
- **Leverage in CI/CD** - Faster builds with proper caching
- **Monitor size** - Check occasionally, clean if necessary
- **Let NPM manage** - It knows what it's doing

---

## Next Steps

Now that you understand how NPM's cache works, it's time to learn about one of the most critical aspects of package management: security and auditing. Learn how to keep your projects secure from vulnerabilities.

**Continue to:** [Module 9: Security & Auditing →](09-security-auditing.md)

---

## Additional Resources

- [NPM Cache Documentation](https://docs.npmjs.com/cli/v9/commands/npm-cache)
- [NPM Cache Verify Documentation](https://docs.npmjs.com/cli/v9/commands/npm-cache#verify)
- [Understanding the npm Cache](https://docs.npmjs.com/cli/v9/configuring-npm/folders#cache)
- [NPM Configuration](https://docs.npmjs.com/cli/v9/using-npm/config)
- [Caching Dependencies in CI/CD](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)

---

## Discussion

Have questions about NPM cache? Join the discussion:
- [GitHub Discussions](https://github.com/Leonardo-Garzon-1995/npm-mastery-course/discussions)
- Found an error? [Open an issue](https://github.com/Leonardo-Garzon-1995/npm-mastery-course/issues)

---

[← Previous Module](07-managing-packages.md) | [🏠 Home](../README.md) | [Next Module →](09-security-auditing.md)