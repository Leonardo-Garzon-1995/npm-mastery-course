# Module 5: Package-lock.json

[← Previous Module](04-semantic-versioning.md) | [🏠 Home](../README.md) | [Next Module →](06-npm-scripts.md)

---

## Module Overview

The package-lock.json file is crucial for reproducible installations. This module explains what it is, why it exists, how it works, and best practices for managing it.

**Learning Objectives:**
- Understand the purpose of package-lock.json
- Learn how NPM uses it to ensure reproducible installs
- Know when to commit, update, or delete it
- Understand the difference between package.json and package-lock.json
- Master troubleshooting lock file issues

---

## 5.1 What is Package-lock.json?

### The Problem It Solves

Imagine this scenario:

**Monday - You install packages:**
```bash
npm install express  # Installs express@4.18.2
```

**Friday - Your teammate installs the same project:**
```bash
npm install  # Installs express@4.19.0 (newer version released)
```

**Problem:** You're running different versions!

### The Solution: package-lock.json

When you run `npm install`, NPM creates `package-lock.json` that:
- **Locks** exact versions of every package
- **Records** the entire dependency tree
- **Ensures** everyone gets identical installations
- **Speeds up** subsequent installs

### Key Differences

| File | Purpose | Contains |
|------|---------|----------|
| package.json | Define requirements | Version ranges (^, ~) |
| package-lock.json | Lock exact versions | Exact versions installed |

**Example:**

**package.json:**
```json
{
  "dependencies": {
    "express": "^4.18.2"    // Range: 4.18.2 to <5.0.0
  }
}
```

**package-lock.json:**
```json
{
  "dependencies": {
    "express": {
      "version": "4.18.2",         // Exact version
      "resolved": "https://registry.npmjs.org/express/-/express-4.18.2.tgz",
      "integrity": "sha512-...",
      "requires": {                // Express's dependencies
        "body-parser": "1.20.1",
        "cookie": "0.5.0"
      }
    }
  }
}
```

---

## 5.2 How Package-lock.json Works

### Automatic Generation

Package-lock.json is created/updated automatically:

```bash
# First install - creates package-lock.json
npm install express

# Installing more packages - updates package-lock.json
npm install mongoose

# Installing all dependencies - uses existing lock file
npm install
```

### Structure of Package-lock.json

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "my-project",
      "version": "1.0.0",
      "dependencies": {
        "express": "^4.18.2"
      }
    },
    "node_modules/express": {
      "version": "4.18.2",
      "resolved": "https://registry.npmjs.org/express/-/express-4.18.2.tgz",
      "integrity": "sha512-5/PsL6iGPdfQ/lKM1UuielYgv3BUoJfz1aUwU9vHZ+J7gyvwdQXFEBIEIaxeGf0GIcreATNyBExtalisDbuMqQ==",
      "dependencies": {
        "accepts": "~1.3.8",
        "array-flatten": "1.1.1",
        "body-parser": "1.20.1"
        // ... more dependencies
      },
      "engines": {
        "node": ">= 0.10.0"
      }
    },
    "node_modules/body-parser": {
      "version": "1.20.1",
      // ... package details
    }
    // ... all other packages in the tree
  }
}
```

### Key Fields Explained

#### version
The exact version that was installed:
```json
"version": "4.18.2"
```

#### resolved
The URL from which the package was downloaded:
```json
"resolved": "https://registry.npmjs.org/express/-/express-4.18.2.tgz"
```

#### integrity
A cryptographic hash to verify package integrity:
```json
"integrity": "sha512-5/PsL6iGPdfQ/..."
```

This ensures the package hasn't been tampered with.

#### requires/dependencies
Lists what this package depends on:
```json
"requires": {
  "body-parser": "1.20.1",
  "cookie": "0.5.0"
}
```

---

## 5.3 How NPM Uses Package-lock.json

### Installation Process

**When package-lock.json exists:**

```bash
npm install
```

**NPM:**
1. ✅ Reads package-lock.json
2. ✅ Installs exact versions specified
3. ✅ Uses cached packages when available
4. ✅ Verifies integrity hashes
5. ✅ Fast and reproducible

**When package-lock.json doesn't exist:**

```bash
npm install
```

**NPM:**
1. Reads package.json
2. Resolves version ranges
3. Downloads latest compatible versions
4. Creates package-lock.json

### npm install vs npm ci

| Command | Uses | Modifies | Speed | Use Case |
|---------|------|----------|-------|----------|
| npm install | package.json + lock file | Can update lock | Slower | Development |
| npm ci | Only lock file | Never updates | Faster | CI/CD, Production |

**npm ci (Clean Install):**
```bash
npm ci
```

**What it does:**
1. Deletes node_modules completely
2. Installs ONLY from package-lock.json
3. Fails if package.json and lock don't match
4. Faster and more reliable

**Use npm ci when:**
- ✅ In CI/CD pipelines
- ✅ Deploying to production
- ✅ You want reproducible builds
- ✅ Starting fresh

---

## 5.4 Managing Package-lock.json

### Should You Commit It to Git?

**YES! Always commit package-lock.json to Git.** 

```bash
git add package-lock.json
git commit -m "Add/update dependencies"
```

**Why commit it:**
- Team gets same versions
- CI/CD gets same versions
- Production gets tested versions
- Faster installs for everyone
- Security - verified packages

### When It Updates

Package-lock.json updates when you:

```bash
# Installing new packages
npm install express              # ✅ Updates lock

# Removing packages
npm uninstall express            # ✅ Updates lock

# Updating packages
npm update                       # ✅ Updates lock

# Installing from package.json
npm install                      # ✅ May update lock
```

### When to Delete It

You might delete package-lock.json when:

**1. Resolving conflicts:**
```bash
# After merge conflicts in lock file
rm package-lock.json
npm install
```

**2. Starting fresh:**
```bash
# Clean slate
rm -rf node_modules package-lock.json
npm install
```

**3. Fixing corruption:**
```bash
# If lock file is corrupted
rm package-lock.json
npm install
```

** Warning:** Always commit the new lock file after recreating it!

---

## 5.5 Common Scenarios

### Scenario 1: Cloning a Repository

**You clone a project with package-lock.json:**

```bash
git clone https://github.com/user/project.git
cd project

# You see package.json and package-lock.json
npm install
```

**What happens:**
- NPM uses package-lock.json
- Installs exact versions
- Fast installation
- Identical to other developers

### Scenario 2: Adding a New Package

**You install a new package:**

```bash
npm install axios
```

**What happens:**
- Axios added to package.json
- Exact version added to package-lock.json
- All of axios's dependencies added to lock
- Lock file updated
- Commit both files

### Scenario 3: Updating Packages

**You want to update packages:**

```bash
# Check what's outdated
npm outdated

# Update all packages
npm update
```

**What happens:**
- package.json ranges respected
- Packages updated within ranges
- package-lock.json updated with new versions
- Commit updated lock file

### Scenario 4: Merge Conflicts

**You get conflicts in package-lock.json after git pull:**

```
<<<<<<< HEAD
"version": "4.18.2"
=======
"version": "4.19.0"
>>>>>>> branch
```

**Solution:**
```bash
# Don't manually resolve - regenerate
rm package-lock.json
npm install
git add package-lock.json
git commit -m "Regenerate package-lock.json"
```

### Scenario 5: Different Team Member Versions

**Problem:** Team member has different versions installed.

**Solution:**
```bash
# Delete everything and reinstall from lock
rm -rf node_modules
npm ci

# Or use npm ci directly (it deletes node_modules automatically)
npm ci
```

---

## 5.6 Package-lock.json vs package.json

### What Goes Where?

| Information | package.json | package-lock.json |
|-------------|--------------|-------------------|
| Package names | ✅ | ✅ |
| Version ranges | ✅ | ❌ |
| Exact versions | ❌ | ✅ |
| Dev dependencies | ✅ | ✅ |
| Dependencies of dependencies | ❌ | ✅ |
| Download URLs | ❌ | ✅ |
| Integrity hashes | ❌ | ✅ |
| Scripts | ✅ | ❌ |
| Metadata | ✅ | ❌ |

### Example Comparison

**package.json (human-readable, version ranges):**
```json
{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0"
  }
}
```

**package-lock.json (machine-readable, exact versions):**
```json
{
  "name": "my-app",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "packages": {
    "node_modules/express": {
      "version": "4.18.2",
      "resolved": "https://...",
      "integrity": "sha512...",
      "dependencies": {
        "accepts": "~1.3.8",
        "body-parser": "1.20.1"
        // 20+ more dependencies
      }
    },
    "node_modules/mongoose": {
      "version": "7.0.3",
      "resolved": "https://...",
      "integrity": "sha512...",
      "dependencies": {
        "bson": "^5.2.0",
        "kareem": "2.5.1"
        // 15+ more dependencies
      }
    },
    "node_modules/accepts": {
      "version": "1.3.8",
      // ... details
    }
    // ... 100+ more packages
  }
}
```

### Why Both Files?

**package.json:**
- Human-editable
- Defines what you want
- Flexible version ranges
- Readable and maintainable

**package-lock.json:**
- Auto-generated
- Defines what you got
- Exact versions
- Reproducible installs

---

## 5.7 Troubleshooting

### Problem 1: Lock File Out of Sync

**Error:**
```
npm ERR! code ENOLOCK
npm ERR! The package-lock.json file was created with an old version of npm
```

**Solution:**
```bash
# Update npm
npm install -g npm@latest

# Regenerate lock file
rm package-lock.json
npm install
```

### Problem 2: Integrity Check Failed

**Error:**
```
npm ERR! Integrity check failed
npm ERR! sha512-... integrity checksum failed
```

**Solution:**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Problem 3: Lock File Too Large

**Issue:** package-lock.json is huge (multiple MB)

**Causes:**
- Too many dependencies
- Deep dependency trees
- Duplicate packages

**Solutions:**
```bash
# Remove unused dependencies
npm prune

# Update to deduplicate
npm dedupe

# Audit and remove unnecessary packages
npm outdated
npm uninstall unused-package
```

### Problem 4: Can't Install from Lock File

**Error:**
```
npm ERR! 404 Not Found - GET https://registry.npmjs.org/package/-/package-1.0.0.tgz
```

**Solution:**
```bash
# Package was unpublished or moved
# Regenerate lock file
rm package-lock.json
npm install
```

### Problem 5: CI/CD Failing

**Error in CI/CD:**
```
npm ERR! `npm ci` can only install packages when your package.json and package-lock.json are in sync
```

**Solution:**
```bash
# Locally, make sure they match
npm install

# Commit the updated lock file
git add package-lock.json
git commit -m "Update package-lock.json"
git push
```

---

## Hands-On Exercises

>Go to the [exercises](/exercises/05-package-lock-exer.md) for this section

### Exercise 5.1: Understanding Lock Files

**Objective:** See how package-lock.json is created and used.

### Exercise 5.2: npm install vs npm ci

**Objective:** Compare the behavior of npm install and npm ci.

### Exercise 5.3: Resolving Lock File Conflicts

**Objective:** Practice handling lock file merge conflicts.

### Exercise 5.4: Lock File Verification

**Objective:** Understand integrity checking.

---

## Best Practices

### 1. Always Commit package-lock.json

```bash
# In .gitignore
node_modules/
# DON'T add package-lock.json here!
```

### 2. Use npm ci in CI/CD

**In your CI/CD pipeline:**
```yaml
# GitHub Actions
- name: Install dependencies
  run: npm ci

# GitLab CI
install:
  script:
    - npm ci
```

### 3. Keep Lock File in Sync

```bash
# After any dependency change
npm install  # Updates lock file
git add package.json package-lock.json
git commit -m "Update dependencies"
```

### 4. Regenerate on Conflicts

```bash
# Don't manually resolve conflicts
rm package-lock.json
npm install
git add package-lock.json
```

### 5. Use npm ci for Clean Installs

```bash
# When you want a fresh start
npm ci

# Instead of
rm -rf node_modules
npm install
```

### 6. Update Regularly

```bash
# Check for updates weekly
npm outdated

# Update and test
npm update
npm test

# Commit updated lock file
git add package-lock.json
git commit -m "Update dependencies"
```

### 7. Verify Integrity

```bash
# If you suspect tampering
npm cache clean --force
npm ci
```

---

## Summary

In this module, you learned:

✅ What package-lock.json is and why it exists  
✅ How it ensures reproducible installations  
✅ The difference between package.json and package-lock.json  
✅ When to commit, update, or delete the lock file  
✅ How to use npm ci for clean installs  
✅ Common issues and how to troubleshoot them  

### Key Takeaways

- **Always commit package-lock.json** - Everyone gets same versions
- **Use npm ci in CI/CD** - Faster and reproducible
- **Never manually edit lock file** - Use npm commands
- **Regenerate on conflicts** - Don't resolve manually
- **Lock file = security** - Integrity hashes protect you
- **package.json = what you want, lock file = what you got**

---

## Next Steps

Now that you understand how NPM manages and locks dependencies, you're ready to learn about one of NPM's most powerful features: scripts! NPM scripts allow you to automate tasks and create efficient development workflows.

**Continue to:** [Module 6: NPM Scripts →](06-npm-scripts.md)

---

## Additional Resources

- [NPM package-lock.json Documentation](https://docs.npmjs.com/cli/v9/configuring-npm/package-lock-json)
- [NPM ci Documentation](https://docs.npmjs.com/cli/v9/commands/npm-ci)
- [About Semantic Versioning](https://docs.npmjs.com/about-semantic-versioning)
- [NPM Lock File Version 3](https://github.com/npm/rfcs/blob/main/implemented/0019-lockfile-version-3.md)

---

## Discussion

Have questions about package-lock.json? Join the discussion:
- [GitHub Discussions](https://github.com/Leonardo-Garzon-1995/npm-mastery-course/discussions)
- Found an error? [Open an issue](https://github.com/Leonardo-Garzon-1995/npm-mastery-course/issues)

---

[← Previous Module](04-semantic-versioning.md) | [🏠 Home](../README.md) | [Next Module →](06-npm-scripts.md)
