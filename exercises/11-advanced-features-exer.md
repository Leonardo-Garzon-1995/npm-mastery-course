# Hands-On Exercises

[← Previous Exercise](10-publishing-packages-exer.md) | [🏠 Home](../README.md) | [Back to module 11](/modules/11-advanced-features.md) | [Next Exercise →](12-troubleshooting-exer.md)

## Exercise 11.1: Create a Workspace

**Objective:** Set up a monorepo with workspaces.

**Steps:**
1. Create monorepo structure:
   ```bash
   mkdir my-workspace
   cd my-workspace
   npm init -y
   ```

2. Configure workspaces:
   ```json
   {
     "name": "my-workspace",
     "private": true,
     "workspaces": ["packages/*"]
   }
   ```

3. Create packages:
   ```bash
   mkdir -p packages/utils packages/app
   cd packages/utils && npm init -y
   cd ../app && npm init -y
   ```

4. Link packages:
   ```json
   // packages/app/package.json
   {
     "dependencies": {
       "utils": "^1.0.0"
     }
   }
   ```

5. Install and test:
   ```bash
   cd ../../
   npm install
   ```

**Expected Outcome:** Working workspace with linked packages.

## Exercise 11.2: Use npx

**Objective:** Practice using npx for different tasks.

**Tasks:**
1. Create a React app:
   ```bash
   npx create-react-app test-app
   ```

2. Run a dev server:
   ```bash
   npx http-server
   ```

3. Check package versions:
   ```bash
   npx npm-check-updates
   ```

4. Run Prettier:
   ```bash
   npx prettier --write "**/*.js"
   ```

**Expected Outcome:** Understanding npx capabilities.

## Exercise 11.3: Practice npm link

**Objective:** Link packages for local development.

**Steps:**
1. Create a package:
   ```bash
   mkdir my-lib
   cd my-lib
   npm init -y
   ```

2. Add code:
   ```javascript
   // index.js
   module.exports = {
     hello: () => 'Hello from my-lib'
   };
   ```

3. Link globally:
   ```bash
   npm link
   ```

4. Create test project:
   ```bash
   cd ..
   mkdir test-project
   cd test-project
   npm init -y
   npm link my-lib
   ```

5. Test:
   ```javascript
   // test.js
   const lib = require('my-lib');
   console.log(lib.hello());
   ```

**Expected Outcome:** Successfully using linked package.

## Exercise 11.4: Package Aliases

**Objective:** Use aliases for multiple package versions.

**Steps:**
1. Create a project:
   ```bash
   mkdir alias-test
   cd alias-test
   npm init -y
   ```

2. Install multiple versions with aliases:
   ```bash
   npm install lodash3@npm:lodash@3.10.1
   npm install lodash4@npm:lodash@4.17.21
   ```

3. Use both versions:
   ```javascript
   const lodash3 = require('lodash3');
   const lodash4 = require('lodash4');
   
   console.log('Lodash 3:', lodash3.VERSION);
   console.log('Lodash 4:', lodash4.VERSION);
   ```

**Expected Outcome:** Both versions working side by side.

## Exercise 11.5: Lifecycle Scripts

**Objective:** Implement lifecycle hooks.

**Steps:**
1. Create a package:
   ```bash
   mkdir lifecycle-demo
   cd lifecycle-demo
   npm init -y
   ```

2. Add lifecycle scripts:
   ```json
   {
     "scripts": {
       "preinstall": "echo 'About to install'",
       "postinstall": "echo 'Installed successfully'",
       "pretest": "echo 'Preparing tests'",
       "test": "echo 'Running tests'",
       "posttest": "echo 'Tests complete'"
     }
   }
   ```

3. Run and observe:
   ```bash
   npm install
   npm test
   ```

**Expected Outcome:** Understanding hook execution order.

---

# Common Pitfalls

## Pitfall 1: Forgetting to Make Workspaces Private

**Problem:**
```json
{
  "name": "my-workspace",
  "workspaces": ["packages/*"]
  // Missing "private": true
}
```

**Why it's bad:**
- Might accidentally publish workspace root
- Workspace root shouldn't be published

**Solution:**
```json
{
  "name": "my-workspace",
  "private": true,
  "workspaces": ["packages/*"]
}
```

## Pitfall 2: npm link Confusion

**Problem:**
```bash
# Linking in wrong directory
cd my-app
npm link my-package  # Package not linked globally first!
```

**Why it's bad:**
- Link fails
- Installs from registry instead

**Solution:**
```bash
# Correct order:
# 1. Link package globally
cd my-package
npm link

# 2. Link in project
cd my-app
npm link my-package
```

## Pitfall 3: Workspace Version Conflicts

**Problem:**
```json
// package-a depends on lodash@4
// package-b depends on lodash@3
// Conflict!
```

**Why it's bad:**
- Can't satisfy both
- Build fails

**Solution:**
```bash
# Use aliases or update dependencies
npm install lodash3@npm:lodash@3 -w package-b
npm install lodash4@npm:lodash@4 -w package-a
```

## Pitfall 4: npx Version Issues

**Problem:**
```bash
npx create-react-app my-app
# Uses cached old version
```

**Why it's bad:**
- Outdated scaffolding
- Missing new features

**Solution:**
```bash
# Force latest
npx create-react-app@latest my-app

# Or clear npx cache
npm cache clean --force
```

## Pitfall 5: Custom Registry Token Exposure

**Problem:**
```
# .npmrc committed to Git
//registry.company.com/:_authToken=secret-token-123
```

**Why it's bad:**
- Security breach
- Exposed credentials

**Solution:**
```
# Use environment variable
//registry.company.com/:_authToken=${COMPANY_NPM_TOKEN}
```
