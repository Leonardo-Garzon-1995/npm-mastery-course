# Hands-On Exercises

[← Previous Exercise](07-managing-packages-exer.md) | [🏠 Home](../README.md) | [Back to module 08](/modules/08-npm-cache.md) | [Next Exercise →](09-security-auditing-exer.md)

## Exercise 8.1: Exploring the Cache

**Objective:** Understand where cache is stored and what it contains.

**Steps:**
1. Find your cache directory:
   ```bash
   npm config get cache
   ```

2. Check cache size:
   ```bash
   du -sh ~/.npm
   # Or on Windows: dir %APPDATA%\npm-cache
   ```

3. Create a new project and install packages:
   ```bash
   mkdir cache-demo
   cd cache-demo
   npm init -y
   npm install express
   ```

4. Check cache again:
   ```bash
   npm cache verify
   ```

**Questions:**
- Where is your cache located?
- How big is your cache?
- How many packages are cached after installing express?

**Expected Outcome:** Understanding of cache location and contents.

## Exercise 8.2: Cache Performance Test

**Objective:** See how cache improves installation speed.

**Steps:**
1. Create a test project:
   ```bash
   mkdir speed-test
   cd speed-test
   npm init -y
   ```

2. First install (no cache):
   ```bash
   npm cache clean --force
   time npm install express mongoose lodash
   # Note the time
   ```

3. Delete node_modules and reinstall (with cache):
   ```bash
   rm -rf node_modules
   time npm install
   # Note the time - should be much faster!
   ```

4. Compare the times

**Expected Outcome:** Cached installation is significantly faster.

## Exercise 8.3: Offline Installation

**Objective:** Test installing packages without internet.

**Steps:**
1. Create a project and install packages:
   ```bash
   mkdir offline-test
   cd offline-test
   npm init -y
   npm install express axios
   ```

2. Configure for offline mode:
   ```bash
   npm config set prefer-offline true
   ```

3. Delete node_modules:
   ```bash
   rm -rf node_modules
   ```

4. Disconnect from internet (or set offline mode):
   ```bash
   npm config set offline true
   ```

5. Try installing:
   ```bash
   npm install
   # Should work with cached packages!
   ```

6. Restore settings:
   ```bash
   npm config delete prefer-offline
   npm config delete offline
   ```

**Expected Outcome:** Successful installation while offline.

## Exercise 8.4: Cache Troubleshooting

**Objective:** Practice fixing cache-related issues.

**Scenario:** Simulate a corrupted cache.

**Steps:**
1. Create a project:
   ```bash
   mkdir troubleshoot-cache
   cd troubleshoot-cache
   npm init -y
   npm install express
   ```

2. Verify cache works:
   ```bash
   npm cache verify
   ```

3. Simulate an issue by cleaning and retrying:
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

4. Verify everything works:
   ```bash
   npm cache verify
   npm list --depth=0
   ```

**Expected Outcome:** Successfully troubleshoot and fix issues.

## Exercise 8.5: Cache Maintenance Routine

**Objective:** Create a cache maintenance routine.

**Tasks:**
1. Write a script that:
   - Checks cache size
   - Verifies cache integrity
   - Cleans cache if over certain size
   - Reports statistics

2. Test the script on your system

3. Schedule it to run monthly

**Example structure:**
```bash
#!/bin/bash
# Your cache maintenance script
echo "Cache Maintenance Starting..."
# Add your commands here
```

**Expected Outcome:** A working maintenance script.

---

# Common Pitfalls

## Pitfall 1: Cleaning Cache Too Often

**Problem:**
```json
{
  "scripts": {
    "preinstall": "npm cache clean --force"
  }
}
```

**Why it's bad:**
- Defeats purpose of cache
- Slows down every install
- Wastes bandwidth
- Unnecessary

**Solution:**
```json
{
  "scripts": {
    "verify-cache": "npm cache verify"
  }
}
```

## Pitfall 2: Ignoring Cache Errors

**Problem:**
```
npm WARN cache corruption detected
# Ignoring the warning
npm install
```

**Why it's bad:**
- Can cause installation failures
- Leads to inconsistent builds
- Hard-to-debug issues

**Solution:**
```bash
# Address the warning
npm cache verify
# Or if needed
npm cache clean --force
npm install
```

## Pitfall 3: Not Using Cache in CI/CD

**Problem:**
```yaml
# Not caching npm in CI/CD
- run: npm install
```

**Why it's bad:**
- Slow builds
- Unnecessary downloads
- Higher costs

**Solution:**
```yaml
- uses: actions/setup-node@v3
  with:
    cache: 'npm'
- run: npm ci
```

## Pitfall 4: Assuming Clean Cache Fixes Everything

**Problem:**
```bash
# Any problem?
npm cache clean --force
```

**Why it's bad:**
- Cache is rarely the issue
- Wastes time
- Masks real problems

**Solution:**
```bash
# Diagnose first
npm cache verify
# Check actual error messages
# Clean cache only if cache-related
```

## Pitfall 5: Not Monitoring Cache Size

**Problem:**
```bash
# Never checking cache
# Cache grows to 20+ GB
```

**Why it's bad:**
- Wastes disk space
- Can cause disk full errors
- Slows down system

**Solution:**
```bash
# Regular checks
npm cache verify
du -sh ~/.npm

# Clean if too large
npm cache clean --force
```

---