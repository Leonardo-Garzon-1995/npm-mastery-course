#  Hands-On Exercises

[← Previous Exercise](11-advanced-features-exer.md) | [🏠 Home](../README.md) | [Back to module 12](/modules/12-troubleshooting.md) | [Next Exercise →](13-real-world-project-exer.md)

## Exercise 12.1: Simulate and Fix Permission Error

**Objective:** Understand and fix EACCES errors.

**Steps:**
1. Check current npm prefix:
   ```bash
   npm config get prefix
   ```

2. Try to install global package (might fail):
   ```bash
   npm install -g cowsay
   ```

3. If error, fix with proper configuration:
   ```bash
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   export PATH=~/.npm-global/bin:$PATH
   ```

4. Retry installation:
   ```bash
   npm install -g cowsay
   cowsay "Success!"
   ```

**Expected Outcome:** Successfully install global packages without sudo.

## Exercise 12.2: Resolve Dependency Conflict

**Objective:** Practice resolving version conflicts.

**Steps:**
1. Create test project:
   ```bash
   mkdir conflict-test
   cd conflict-test
   npm init -y
   ```

2. Install conflicting packages:
   ```bash
   npm install react@17.0.0
   npm install react-router-dom@6.0.0
   # Will likely cause conflict
   ```

3. Try different solutions:
   ```bash
   # Solution 1
   npm install --legacy-peer-deps

   # Solution 2
   npm install react@18.0.0

   # Solution 3 - Use overrides
   ```

**Expected Outcome:** Understanding conflict resolution strategies.

## Exercise 12.3: Debug Installation Issue

**Objective:** Practice debugging with verbose mode.

**Steps:**
1. Create project and intentionally break it:
   ```bash
   mkdir debug-test
   cd debug-test
   npm init -y
   ```

2. Create invalid package.json:
   ```json
   {
     "name": "debug-test",
     "dependencies": {
       "non-existent-package-12345": "^1.0.0"
     }
   }
   ```

3. Try to install with verbose:
   ```bash
   npm install --verbose
   ```

4. Read error message and fix

**Expected Outcome:** Understanding npm error messages.

## Exercise 12.4: Clean Install Workflow

**Objective:** Practice the complete clean install process.

**Steps:**
1. Create project with dependencies:
   ```bash
   mkdir clean-install-test
   cd clean-install-test
   npm init -y
   npm install express lodash
   ```

2. Simulate corruption:
   ```bash
   rm -rf node_modules/express
   ```

3. Try normal install (won't fix):
   ```bash
   npm install
   ```

4. Do clean install:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

5. Verify everything works

**Expected Outcome:** Understanding when clean install is needed.

## Exercise 12.5: Create Troubleshooting Script

**Objective:** Build a diagnostic script.

**Tasks:**
Create a script that checks:
- npm and Node versions
- Registry configuration
- Cache integrity
- Common issues

**Example:**
```bash
#!/bin/bash
# diagnose.sh

echo "NPM Diagnostics"
echo "==============="

echo "npm version: $(npm --version)"
echo "Node version: $(node --version)"
echo "Registry: $(npm config get registry)"
echo "Cache location: $(npm config get cache)"

echo -e "\nRunning cache verify..."
npm cache verify

echo -e "\nChecking for permission issues..."
ls -la $(npm config get prefix)/lib/node_modules | head -5

echo -e "\nDiagnostics complete"
```

**Expected Outcome:** Reusable diagnostic tool.

---

#  Common Pitfalls Summary

## Top 10 Mistakes to Avoid

**1. Using sudo with npm**
```bash
# ❌ Never do this
sudo npm install -g package

# ✅ Configure proper permissions
npm config set prefix '~/.npm-global'
```

**2. Not committing package-lock.json**
```bash
# ❌ Adding to .gitignore
echo "package-lock.json" >> .gitignore

# ✅ Always commit
git add package-lock.json
```

**3. Manually editing package-lock.json**
```bash
# ❌ Editing lock file
# vi package-lock.json

# ✅ Use npm commands
npm install package@version
```

**4. Using npm install in CI/CD**
```bash
# ❌ In CI/CD
npm install

# ✅ Use npm ci
npm ci
```

**5. Not specifying Node version**
```json
// ❌ No engine specification
{
  "name": "my-app"
}

// ✅ Specify version
{
  "name": "my-app",
  "engines": {
    "node": ">=18.0.0"
  }
}
```

**6. Installing everything as dependencies**
```bash
# ❌ Test tools in dependencies
npm install jest

# ✅ Use devDependencies
npm install --save-dev jest
```

**7. Not cleaning cache when needed**
```bash
# ❌ Ignoring corruption errors
npm install  # Fails, tries again

# ✅ Clean cache first
npm cache clean --force
npm install
```

**8. Not testing after updates**
```bash
# ❌ Update and commit
npm update
git commit -am "Update deps"

# ✅ Update, test, then commit
npm update
npm test
git commit -am "Update deps"
```

**9. Using * for versions**
```json
// ❌ Any version
{
  "dependencies": {
    "lodash": "*"
  }
}

// ✅ Specific range
{
  "dependencies": {
    "lodash": "^4.17.21"
  }
}
```

**10. Not reviewing package before installing**
```bash
# ❌ Install without checking
npm install random-package

# ✅ Review first
npm view random-package
npm view random-package repository
# Check npmjs.com page
npm install random-package
```