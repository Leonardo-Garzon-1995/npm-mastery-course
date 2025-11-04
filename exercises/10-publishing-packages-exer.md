#  Hands-On Exercises

[← Previous Exercise](09-security-auditing-exer.md) | [🏠 Home](../README.md) | [Back to module 10](/modules/10-publishing-packages.md) | [Next Exercise →](11-advanced-features-exer.md)

## Exercise 10.1: Create Your First Package

**Objective:** Create and prepare a simple package for publishing.

**Steps:**
1. Create a new directory:
   ```bash
   mkdir my-first-package
   cd my-first-package
   ```

2. Initialize npm:
   ```bash
   npm init
   ```

3. Fill in the details:
   - Name: Choose a unique name (check with `npm view`)
   - Version: 1.0.0
   - Description: Something descriptive
   - Entry point: lib/index.js
   - Author: Your name

4. Create the package structure:
   ```bash
   mkdir lib test
   touch lib/index.js
   touch test/index.test.js
   touch README.md
   touch LICENSE
   ```

5. Write a simple function in lib/index.js

6. Document it in README.md

7. Add MIT license

**Expected Outcome:** A complete package structure ready for publishing.

## Exercise 10.2: Test Package Locally

**Objective:** Test your package before publishing.

**Steps:**
1. In your package directory:
   ```bash
   npm link
   ```

2. Create a test project:
   ```bash
   cd ..
   mkdir test-my-package
   cd test-my-package
   npm init -y
   ```

3. Link your package:
   ```bash
   npm link my-first-package
   ```

4. Create test file:
   ```javascript
   // test.js
   const myPkg = require('my-first-package');
   console.log(myPkg);
   ```

5. Run and verify:
   ```bash
   node test.js
   ```

**Expected Outcome:** Your package works locally.

## Exercise 10.3: Dry Run Publish

**Objective:** See what will be published without actually publishing.

**Steps:**
1. In your package directory:
   ```bash
   npm publish --dry-run
   ```

2. Review the output:
   - What files are included?
   - What's the package size?
   - Is everything correct?

3. Create .npmignore to exclude test files:
   ```
   test/
   *.test.js
   ```

4. Run dry-run again and compare

**Expected Outcome:** Understanding what gets published.

## Exercise 10.4: Publish to NPM (Optional)

**Objective:** Publish your first package to NPM.

**Prerequisites:**
- NPM account created
- Logged in with `npm login`
- Unique package name

**Steps:**
1. Final checklist:
   - [ ] Tests pass
   - [ ] README complete
   - [ ] LICENSE added
   - [ ] Version is 1.0.0
   - [ ] .npmignore configured

2. Publish:
   ```bash
   npm publish
   ```

3. Verify:
   ```bash
   npm view your-package-name
   ```

4. Install in a test project:
   ```bash
   npm install your-package-name
   ```

**Expected Outcome:** Your package is live on NPM!

## Exercise 10.5: Update Published Package

**Objective:** Practice updating and republishing.

**Steps:**
1. Make a change to your package:
   ```javascript
   // Add a new function
   ```

2. Run tests:
   ```bash
   npm test
   ```

3. Update version:
   ```bash
   npm version patch
   ```

4. Publish update:
   ```bash
   npm publish
   ```

5. Verify new version:
   ```bash
   npm view your-package-name version
   ```

**Expected Outcome:** Successfully published an update.

---

# Common Pitfalls

## Pitfall 1: Publishing Without Testing

**Problem:**
```bash
# Make changes
# Skip testing
npm publish
# Broken package!
```

**Why it's bad:**
- Users get broken code
- Damages reputation
- Need to unpublish/fix quickly

**Solution:**
```bash
# Always test first
npm test
npm link  # Test locally
npm publish --dry-run  # Preview
npm publish  # Then publish
```

## Pitfall 2: Wrong Version Bump

**Problem:**
```bash
# Add new feature
npm version patch  # ❌ Should be minor!
```

**Why it's bad:**
- Confuses users
- Doesn't follow semver
- Can break automated tools

**Solution:**
```bash
# Bug fix → patch
npm version patch

# New feature → minor
npm version minor

# Breaking change → major
npm version major
```

## Pitfall 3: Including Sensitive Files

**Problem:**
```bash
npm publish
# Accidentally publishes .env with API keys!
```

**Why it's bad:**
- Security breach
- Exposed credentials
- Potential account compromise

**Solution:**
```
# .npmignore
.env
.env.*
*.key
*.pem
config/secrets.json
```

## Pitfall 4: Not Using .npmignore

**Problem:**
```bash
# Publishes test/, coverage/, etc.
# Package is huge!
```

**Why it's bad:**
- Large package size
- Slow downloads
- Unnecessary files

**Solution:**
```
# .npmignore
test/
coverage/
*.test.js
.github/
docs/
```

## Pitfall 5: Forgetting to Push Tags

**Problem:**
```bash
npm version patch
npm publish
# Forget to push tags
# GitHub out of sync with NPM
```

**Why it's bad:**
- Version mismatch
- Confuses contributors
- Can't track releases

**Solution:**
```bash
npm version patch
git push
git push --tags  # Don't forget!
npm publish
```