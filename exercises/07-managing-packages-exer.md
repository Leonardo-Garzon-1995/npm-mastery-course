# Hands-On Exercises

[← Previous Exercise](06-npm-scripts-exer.md) | [🏠 Home](../README.md) | [Back to module 07](/modules/07-managing-packages.md) | [Next Exercise →](08-npm-cache-exer.md)

## Exercise 7.1: Exploring Installed Packages

**Objective:** Learn to view and understand your dependencies.

**Steps:**
1. Create a project with dependencies:
   ```bash
   mkdir manage-packages
   cd manage-packages
   npm init -y
   npm install express mongoose dotenv
   npm install --save-dev jest nodemon
   ```

2. Explore the packages:
   ```bash
   npm list --depth=0
   npm list --depth=1
   npm list express
   npm view express
   ```

3. Answer these questions:
   - How many direct dependencies do you have?
   - How many total packages are installed?
   - What version of express is installed?
   - What's the latest version available?

**Expected Outcome:** Understanding of dependency structure.

## Exercise 7.2: Checking for Updates

**Objective:** Learn to identify outdated packages.

**Steps:**
1. In the same project, check for outdated packages:
   ```bash
   npm outdated
   ```

2. Install an older version of a package:
   ```bash
   npm install lodash@4.17.20
   ```

3. Check outdated again:
   ```bash
   npm outdated
   ```

4. Note the difference between Current, Wanted, and Latest

**Expected Outcome:** Understanding version update options.

## Exercise 7.3: Updating Packages

**Objective:** Practice different update methods.

**Steps:**
1. Update to wanted versions:
   ```bash
   npm update
   npm outdated
   ```

2. Update to latest version:
   ```bash
   npm install lodash@latest
   npm list lodash
   ```

3. Check package.json and package-lock.json changes

**Expected Outcome:** Understanding of update behavior.

## Exercise 7.4: Removing and Cleaning

**Objective:** Practice removing packages and cleaning up.

**Steps:**
1. Remove a package:
   ```bash
   npm uninstall lodash
   npm list --depth=0
   ```

2. Manually edit package.json to remove a dependency

3. Run prune:
   ```bash
   npm prune
   ```

4. Check what was removed

**Expected Outcome:** Understanding cleanup commands.

## Exercise 7.5: Real-World Maintenance

**Objective:** Perform a complete maintenance routine.

**Tasks:**
1. Check for outdated packages
2. Update all packages safely
3. Run tests (or create a simple test)
4. Clean up unused packages
5. Deduplicate dependencies
6. Document the before/after state

**Create a report:**
```bash
# Before
npm outdated > before.txt
npm list --depth=0 >> before.txt

# After maintenance
npm outdated > after.txt
npm list --depth=0 >> after.txt
```

**Expected Outcome:** A complete maintenance workflow.

---

# Common Pitfalls

## Pitfall 1: Updating Without Testing

**Problem:**
```bash
npm update
npm install express@latest
# No testing!
git commit -am "Update dependencies"
```

**Why it's bad:**
- Updates might break your code
- No verification before committing
- Could break production

**Solution:**
```bash
npm update
npm test              # Always test!
npm run build         # Verify build works
# If all pass, then commit
git commit -am "Update dependencies"
```

## Pitfall 2: Forgetting to Update package-lock.json

**Problem:**
```bash
# Manually edit package.json
# Forget to run npm install
git commit -am "Update dependencies"
```

**Why it's bad:**
- package.json and package-lock.json out of sync
- npm ci will fail
- Team gets errors

**Solution:**
```bash
# After editing package.json
npm install           # Updates lock file
git add package.json package-lock.json
git commit -m "Update dependencies"
```

## Pitfall 3: Removing Package from package.json Only

**Problem:**
```json
// Remove from package.json
{
  "dependencies": {
    // "lodash": "^4.17.21"  <- Deleted
  }
}
```

```bash
# But package still in node_modules!
```

**Solution:**
```bash
# Use npm uninstall
npm uninstall lodash

# Or if already removed from package.json
npm prune
```

## Pitfall 4: Not Checking Why Package is Installed

**Problem:**
```bash
npm uninstall lodash
# Error: Still installed because another package needs it!
```

**Solution:**
```bash
# Check why it's installed first
npm ls lodash

# Output shows which packages depend on it
# Don't remove if it's a sub-dependency
```

## Pitfall 5: Blindly Updating to Latest

**Problem:**
```bash
# Update everything to latest
ncu -u
npm install
# Everything breaks!
```

**Why it's bad:**
- Major version updates have breaking changes
- No time to test each update
- Hard to identify which update caused issues

**Solution:**
```bash
# Update one at a time
npm install express@latest
npm test

npm install mongoose@latest
npm test

# Or update minor/patch only
npm update
```

---
