# Module 10: Publishing Packages

[← Previous Module](09-security-auditing.md) | [🏠 Home](../README.md) | [Next Module →](11-advanced-features.md)

---

## Module Overview

Publishing your own NPM packages allows you to share your code with the world and contribute to the JavaScript ecosystem. This module covers everything you need to know about creating, publishing, and maintaining NPM packages.

**Learning Objectives:**
- Create a publishable NPM package
- Set up package metadata correctly
- Publish packages to the NPM registry
- Manage package versions and releases
- Update and deprecate published packages
- Understand package naming and scopes
- Follow best practices for package publishing

---

## 10.1 Preparing to Publish

### Creating an NPM Account

**Sign up for NPM:**
1. Visit [npmjs.com](https://www.npmjs.com/)
2. Click "Sign Up"
3. Create account with username, email, password (verify your email)

**Or via CLI:**
```bash
# Create account from command line
npm adduser

# You'll be prompted for:
# - Username
# - Password
# - Email (public)
```

**Login to existing account:**
```bash
# Login to NPM
npm login

# Verify you're logged in
npm whoami

# Example output:
# yourusername
```

**Enable Two-Factor Authentication:**
```bash
# Enable 2FA (highly recommended)
npm profile enable-2fa auth-and-writes

# Check 2FA status
npm profile get

# Disable 2FA (not recommended)
npm profile disable-2fa
```

### Choosing a Package Name

**Package name rules:**
- Must be lowercase
- No spaces (use hyphens)
- No special characters except hyphens and underscores
- Max 214 characters
- Must be unique on NPM registry

**Check if name is available:**
```bash
# Search for package name
npm search package-name

# View package (404 if doesn't exist)
npm view package-name
```

**Good package names examples:**
```
✅ my-awesome-package
✅ string-utils
✅ react-component-library
✅ @username/my-package (scoped)
```

**Bad package names examples:**
```
❌ My Package (spaces, uppercase)
❌ my_package! (special characters)
❌ express (already taken)
```

### Scoped Packages

**What are scoped packages?**

Scoped packages are published under a namespace. They start with a `@` symbol.
```
@scope/package-name
```

**Benefits:**
- Namespace your packages
- Avoid name conflicts
- Group related packages
- Can be private (paid feature)

**Using your username as scope:**
```bash
# Your packages can be:
@yourusername/package-one
@yourusername/package-two
```

**Organization scopes:**
```bash
# Organization packages:
@mycompany/api-client
@mycompany/ui-components
```

---

## 10.2 Creating a Package

### Package Structure

**Basic package structure:**
```
my-package/
├── lib/                  # Source code
│   └── index.js
├── test/                 # Tests
│   └── index.test.js
├── .gitignore
├── .npmignore            # Files to exclude from NPM
├── LICENSE
├── README.md
└── package.json
```

### Setting Up package.json

**Essential fields for publishing:**
```json
{
  "name": "my-awesome-package",
  "version": "1.0.0",
  "description": "A concise description of what your package does",
  "main": "lib/index.js",
  "scripts": {
    "test": "jest"
  },
  "keywords": [
    "javascript",
    "utility",
    "helper"
  ],
  "author": "Your Name <your@email.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/my-awesome-package.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/my-awesome-package/issues"
  },
  "homepage": "https://github.com/yourusername/my-awesome-package#readme"
}
```

**Important fields explained:**

**name:**
```json
{
  "name": "my-package"           // Unscoped
  "name": "@username/my-package" // Scoped
}
```

**version:**
```json
{
  "version": "1.0.0"  // MAJOR.MINOR.PATCH
}
```

**main:**
```json
{
  "main": "lib/index.js"  // Entry point
}
```

**files:**
```json
{
  "files": [
    "lib/",      // Include lib directory
    "README.md",
    "LICENSE"
  ]
}
```

**engines:**
```json
{
  "engines": {
    "node": ">=14.0.0",
    "npm": ">=6.0.0"
  }
}
```

### Creating the Main File

**lib/index.js:**
```javascript
/**
 * Capitalizes the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} The capitalized string
 */
function capitalize(str) {
  if (typeof str !== 'string' || str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Reverses a string
 * @param {string} str - The string to reverse
 * @returns {string} The reversed string
 */
function reverseStr(str) {
  if (typeof str !== 'string') {
    return str;
  }
  return str.split('').reverse().join('');
}

module.exports = {
  capitalize,
  reverseStr
};
```

### Creating README.md

**Essential README sections:**
```markdown
# My Awesome Package

> A concise description of your package

## Installation

```bash
npm install my-awesome-package
```

## Usage

```javascript
const { capitalize, reverseStr } = require('my-awesome-package');

console.log(capitalize('hello')); // 'Hello'
console.log(reverseStr('hello'));    // 'olleh'
```

## API

### capitalize(str)

Capitalizes the first letter of a string.

- **str** (string): The string to capitalize
- **Returns**: (string) The capitalized string

### reverse(str)

Reverses a string.

- **str** (string): The string to reverse
- **Returns**: (string) The reversed string

## License

MIT © Your Name
```

### Creating LICENSE

**MIT License (most common):**
```
MIT License

Copyright (c) 2024 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Creating .npmignore

**Exclude files from published package:**

```
  #.npmignore
  node_modules/
  test/
  coverage/
  .git/
  .github/
  .vscode/
  *.test.js
  *.spec.js
  .eslintrc.js
  .prettierrc
  .env
  .DS_Store
```

**Note:** If `.npmignore` doesn't exist, NPM uses `.gitignore`.

---

## 10.3 Testing Before Publishing

### Local Testing

**Test your package locally:**

**1. Using npm link:**
```bash
# In your package directory
npm link

# In a test project
npm link my-awesome-package

# Use the package
node
> const pkg = require('my-awesome-package')
> pkg.capitalize('hello')
'Hello'
```

**2. Using local path:**
```bash
# In a test project
npm install /path/to/my-awesome-package

# Or relative path
npm install ../my-awesome-package
```

**3. Using npm pack:**
```bash
# In your package directory
npm pack

# Creates: my-awesome-package-1.0.0.tgz

# In a test project
npm install /path/to/my-awesome-package-1.0.0.tgz
```

### Validating Package Contents

**See what will be published:**
```bash
# Dry run - shows what would be published
npm publish --dry-run

# Example output:
# npm notice
# npm notice 📦  my-awesome-package@1.0.0
# npm notice === Tarball Contents ===
# npm notice 1.1kB LICENSE
# npm notice 523B  README.md
# npm notice 1.2kB lib/index.js
# npm notice 847B  package.json
# npm notice === Tarball Details ===
# npm notice name:          my-awesome-package
# npm notice version:       1.0.0
# npm notice package size:  2.1 kB
# npm notice unpacked size: 3.7 kB
# npm notice total files:   4
```

**Extract and inspect package:**
```bash
# Create tarball
npm pack

# Extract it
tar -xzf my-awesome-package-1.0.0.tgz

# Inspect contents
cd package
ls -la
```

### Pre-publish Checklist

**Before publishing, ensure:**

- ✅ Package name is available
- ✅ Version number follows semver
- ✅ All code is tested
- ✅ README is complete and clear
- ✅ LICENSE file is included
- ✅ .npmignore excludes unnecessary files
- ✅ package.json fields are correct
- ✅ You're logged in to NPM
- ✅ 2FA is enabled
- ✅ Repository is linked
- ✅ Keywords are relevant

---

## 10.4 Publishing Your Package

### First Publish

**Publish to NPM registry:**
```bash
# Publish public package
npm publish

# Publish scoped package as public
npm publish --access public
```

**What happens:**
1. NPM creates tarball of your package
2. Uploads to registry
3. Package is now available for install
4. Confirmation message shown

**Example output:**
```
npm notice
npm notice 📦  my-awesome-package@1.0.0
npm notice === Tarball Contents ===
npm notice 1.1kB LICENSE
npm notice 523B  README.md
npm notice 1.2kB lib/index.js
npm notice 847B  package.json
npm notice === Tarball Details ===
npm notice name:          my-awesome-package
npm notice version:       1.0.0
npm notice package size:  2.1 kB
npm notice unpacked size: 3.7 kB
npm notice total files:   4
npm notice
+ my-awesome-package@1.0.0
```

### Publishing Scoped Packages

**Scoped packages are private by default:**
```bash
# This fails (requires paid account)
npm publish

# Publish as public
npm publish --access public
```

**Or set in package.json:**
```json
{
  "publishConfig": {
    "access": "public"
  }
}
```

### Publishing with 2FA

**If 2FA is enabled:**
```bash
npm publish

# You'll be prompted:
# This operation requires a one-time password.
# Enter OTP: ______
```

**Use authenticator app (Google Authenticator, Authy, etc.) to get OTP.**

### Verify Publication

**Check your package:**
```bash
# View on NPM
npm view my-awesome-package

# Install to test
npm install my-awesome-package

# Check on website
# https://www.npmjs.com/package/my-awesome-package
```

---

## 10.5 Versioning and Updates

### Semantic Versioning Review

**Version format: MAJOR.MINOR.PATCH**

>Review [module 04](04-semantic-versioning.md) for more details on versioning.

```
1.0.0 → 1.0.1  (Patch - bug fixes)
1.0.1 → 1.1.0  (Minor - new features)
1.1.0 → 2.0.0  (Major - breaking changes)
```

### Updating Version Number

**Manual update:**
```json
{
  "version": "1.0.0"  // Change to 1.0.1
}
```

**Using npm version:**
```bash
# Patch version (1.0.0 → 1.0.1)
npm version patch

# Minor version (1.0.0 → 1.1.0)
npm version minor

# Major version (1.0.0 → 2.0.0)
npm version major

# Specific version
npm version 1.2.3
```

**What npm version does:**
1. Updates version in package.json
2. Creates git commit
3. Creates git tag
4. Returns new version number

**Example:**
```bash
$ npm version patch
v1.0.1

$ git log --oneline -1
a1b2c3d 1.0.1

$ git tag
v1.0.0
v1.0.1
```

### Publishing Updates

**Complete update workflow:**
```bash
# 1. Make changes to your code
# Edit lib/index.js

# 2. Update version
npm version patch

# 3. Push to git
git push
git push --tags

# 4. Publish to NPM
npm publish
```

### Pre-release Versions

**For beta/alpha releases:**
```bash
# Create pre-release version
npm version prerelease
# 1.0.0 → 1.0.1-0

npm version premajor
# 1.0.0 → 2.0.0-0

npm version preminor
# 1.0.0 → 1.1.0-0

npm version prepatch
# 1.0.0 → 1.0.1-0

# Custom pre-release
npm version 2.0.0-beta.1
```

**Publish with tag:**
```bash
# Publish as beta (not latest)
npm publish --tag beta

# Users install with:
npm install my-package@beta
```

---

## 10.6 Managing Published Packages

### Viewing Package Information

```bash
# View your package
npm view my-awesome-package

# View specific version
npm view my-awesome-package@1.0.0

# View all versions
npm view my-awesome-package versions

# View download stats
npm view my-awesome-package dist.downloads
```

### Unpublishing Packages

**Unpublish specific version:**
```bash
# Remove a version (within 72 hours of publish)
npm unpublish my-awesome-package@1.0.0
```

**Unpublish entire package:**
```bash
# Remove entire package (within 72 hours)
npm unpublish my-awesome-package --force
```

**Unpublishing restrictions:**
- Can only unpublish within 72 hours
- Can't unpublish if package has dependents
- Can't reuse version numbers
- Not recommended for public packages

**Better alternative: Deprecate**

### Deprecating Packages

**Mark version as deprecated:**
```bash
# Deprecate specific version
npm deprecate my-awesome-package@1.0.0 "Please use version 2.0.0+"

# Deprecate all versions
npm deprecate my-awesome-package "Package no longer maintained"
```

**What happens:**
- Package still installable
- Warning shown when installing
- Encourages users to update
- Doesn't break existing users

**Example warning:**
```
npm WARN deprecated my-awesome-package@1.0.0: Please use version 2.0.0+
```

### Transferring Package Ownership

**Add collaborator:**
```bash
# Add user as owner
npm owner add username my-awesome-package

# List owners
npm owner ls my-awesome-package

# Remove owner
npm owner rm username my-awesome-package
```

### Managing Access

**For scoped packages:**
```bash
# Grant access
npm access grant read-write username @scope/package

# Revoke access
npm access revoke username @scope/package

# List access
npm access ls-packages
```

---

## 10.7 Distribution Tags

### Understanding Tags

**Tags are aliases for versions:**
- `latest` - Default, installed with `npm install package`
- `next` - Upcoming release
- `beta` - Beta version
- `stable` - Stable release
- Custom tags

### Working with Tags

**Publish with tag:**
```bash
# Publish as beta
npm publish --tag beta

# Publish as next
npm publish --tag next
```

**Add tag to existing version:**
```bash
# Tag version 2.0.0 as latest
npm dist-tag add my-package@2.0.0 latest

# Tag as stable
npm dist-tag add my-package@1.5.0 stable
```

**List tags:**
```bash
# View all tags
npm dist-tag ls my-package

# Example output:
# latest: 2.0.0
# next: 2.1.0-beta.1
# stable: 1.5.0
```

**Remove tag:**
```bash
npm dist-tag rm my-package beta
```

**Install specific tag:**
```bash
# Install latest (default)
npm install my-package

# Install beta
npm install my-package@beta

# Install next
npm install my-package@next
```

---

## 10.8 Package Maintenance

### Keeping Dependencies Updated

**Regular maintenance:**
```bash
# Check for outdated dependencies
npm outdated

# Update dependencies
npm update

# Audit for vulnerabilities
npm audit
npm audit fix
```

### Responding to Issues

**When users report issues:**

1. **Reproduce the issue**
2. **Fix in a branch**
3. **Write tests**
4. **Update version appropriately**
5. **Publish update**
6. **Close issue with release notes**

**Example workflow:**
```bash
# Create fix branch
git checkout -b fix-issue-123

# Make changes and test
npm test

# Commit
git commit -am "fix: resolve issue #123"

# Update version
npm version patch

# Push
git push origin fix-issue-123

# Merge and publish
git checkout main
git merge fix-issue-123
git push
git push --tags
npm publish
```

### Documentation Updates

**Keep documentation current:**
```bash
# After adding features
# 1. Update README.md
# 2. Update API documentation
# 3. Update changelog
# 4. Update version
npm version minor
# 5. Publish
npm publish
```

### Changelog

**Maintain CHANGELOG.md:**
```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2024-01-15

### Added
- New `transform` function
- Support for arrays

### Changed
- **BREAKING**: Changed API for `capitalize`

### Fixed
- Bug in reverse function with special characters

## [1.1.0] - 2023-12-01

### Added
- New `reverse` function

### Fixed
- TypeError in capitalize with empty strings

## [1.0.0] - 2023-11-15

### Added
- Initial release
- `capitalize` function
```

---

## 10.9 Best Practices

### 1. Semantic Versioning

**Follow semver strictly:**
```bash
# Bug fixes
npm version patch

# New features (backward compatible)
npm version minor

# Breaking changes
npm version major
```

### 2. Write Good Documentation

**README should include:**
- Clear description
- Installation instructions
- Usage examples
- API documentation
- Contributing guidelines
- License information

### 3. Test Thoroughly

**Before publishing:**
```bash
# Run all tests
npm test

# Test locally
npm link

# Test in real project
npm pack && npm install ./package.tgz
```

### 4. Use .npmignore

**Exclude unnecessary files:**
```
test/
coverage/
.github/
*.test.js
.env
```

### 5. Add Badges to README

**Show package status:**
```markdown
![npm version](https://img.shields.io/npm/v/my-package.svg)
![downloads](https://img.shields.io/npm/dm/my-package.svg)
![license](https://img.shields.io/npm/l/my-package.svg)
```

### 6. Keep It Simple

**Good packages:**
- Do one thing well
- Have clear API
- Are well-documented
- Have tests
- Follow conventions

### 7. Respond to Community

**Be responsive:**
- Answer issues promptly
- Review pull requests
- Accept contributions
- Maintain code of conduct

### 8. Security

**Security best practices:**
```bash
# Enable 2FA
npm profile enable-2fa

# Regular audits
npm audit

# Keep dependencies updated
npm update
```

### 9. Version Strategically

**Version guidelines:**
- Start with 0.1.0 for development
- Use 1.0.0 for first stable release
- Increment appropriately for changes
- Use pre-release versions for betas

### 10. Plan for Deprecation

**If package is no longer maintained:**
```bash
# Deprecate
npm deprecate my-package "No longer maintained. Use alternative-package instead."

# Add to README
```

---

## 10.10 Real-World Example

### Complete Package: string-utilities

**Directory structure:**
```
string-utilities/
├── lib/
│   └── index.js
├── test/
│   └── index.test.js
├── .gitignore
├── .npmignore
├── LICENSE
├── README.md
├── CHANGELOG.md
└── package.json
```

**package.json:**
```json
{
  "name": "string-utilities",
  "version": "1.0.0",
  "description": "Simple string manipulation utilities",
  "main": "lib/index.js",
  "scripts": {
    "test": "jest",
    "prepublishOnly": "npm test"
  },
  "keywords": [
    "string",
    "utility",
    "helper",
    "text"
  ],
  "author": "Your Name <your@email.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/string-utilities.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/string-utilities/issues"
  },
  "homepage": "https://github.com/yourusername/string-utilities#readme",
  "engines": {
    "node": ">=14.0.0"
  },
  "devDependencies": {
    "jest": "^29.5.0"
  }
}
```

**lib/index.js:**
```javascript
/**
 * String Utilities
 * A collection of useful string manipulation functions
 */

/**
 * Capitalizes the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} The capitalized string
 * @example
 * capitalize('hello world') // 'Hello world'
 */
function capitalize(str) {
  if (typeof str !== 'string' || str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Reverses a string
 * @param {string} str - The string to reverse
 * @returns {string} The reversed string
 * @example
 * reverse('hello') // 'olleh'
 */
function reverseStr(str) {
  if (typeof str !== 'string') {
    return str;
  }
  return str.split('').reverse().join('');
}

/**
 * Converts string to title case
 * @param {string} str - The string to convert
 * @returns {string} The title cased string
 * @example
 * titleCase('hello world') // 'Hello World'
 */
function titleCase(str) {
  if (typeof str !== 'string' || str.length === 0) {
    return str;
  }
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

module.exports = {
  capitalize,
  reverseStr,
  titleCase
};
```

**test/index.test.js:**
```javascript
const { capitalize, reverseStr, titleCase } = require('../lib/index');

describe('String Utilities', () => {
  describe('capitalize', () => {
    test('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    test('handles empty string', () => {
      expect(capitalize('')).toBe('');
    });

    test('handles non-string input', () => {
      expect(capitalize(null)).toBe(null);
    });
  });

  describe('reverse', () => {
    test('reverses string', () => {
      expect(reverse('hello')).toBe('olleh');
    });

    test('handles empty string', () => {
      expect(reverse('')).toBe('');
    });
  });

  describe('titleCase', () => {
    test('converts to title case', () => {
      expect(titleCase('hello world')).toBe('Hello World');
    });

    test('handles single word', () => {
      expect(titleCase('hello')).toBe('Hello');
    });
  });
});
```

**Publishing workflow:**
```bash
# 1. Develop and test
npm test

# 2. Update version
npm version minor

# 3. Push to GitHub
git push
git push --tags

# 4. Publish to NPM
npm publish
```

---

## Hands-On Exercises

>Go to the [exercises](/exercises/10-publishing-packages-exer.md) for this section for the full instructions on how to complete each exercise.

### Exercise 10.1: Create Your First Package

**Objective:** Create and prepare a simple package for publishing.

### Exercise 10.2: Test Package Locally

**Objective:** Test your package before publishing.

### Exercise 10.3: Dry Run Publish

**Objective:** See what will be published without actually publishing.

### Exercise 10.4: Publish to NPM (Optional)

**Objective:** Publish your first package to NPM.

### Exercise 10.5: Update Published Package

**Objective:** Practice updating and republishing.

---

## Best Practices Summary

### Before Publishing

1. **Test thoroughly** - All tests must pass
2. **Check package contents** - Use `npm publish --dry-run`
3. **Write good README** - Clear installation and usage
4. **Add LICENSE** - Choose appropriate license
5. **Configure .npmignore** - Exclude unnecessary files
6. **Enable 2FA** - Secure your account
7. **Check name availability** - Ensure name is unique

### During Development

1. **Follow semver** - Version appropriately
2. **Write tests** - Maintain good coverage
3. **Document changes** - Keep changelog updated
4. **Use git tags** - Tag releases
5. **Respond to issues** - Help your users

### After Publishing

1. **Monitor downloads** - Track usage
2. **Fix bugs promptly** - Maintain quality
3. **Update dependencies** - Keep secure
4. **Deprecate properly** - Don't break users
5. **Version carefully** - Plan releases

---

## Summary

In this module, you learned:

✅ How to create an NPM account and login  
✅ Choosing good package names and using scopes  
✅ Creating a publishable package structure  
✅ Testing packages locally before publishing  
✅ Publishing packages to the NPM registry  
✅ Managing versions with semantic versioning  
✅ Updating and maintaining published packages  
✅ Using distribution tags effectively  
✅ Best practices for package publishing  

### Key Takeaways

- **Test before publishing** - Always verify locally first
- **Follow semver** - MAJOR.MINOR.PATCH for versions
- **Write good docs** - README is critical for adoption
- **Use .npmignore** - Control what gets published
- **Enable 2FA** - Protect your packages
- **Respond to community** - Maintain your packages
- **Version strategically** - Plan your releases
- **Deprecate don't unpublish** - Don't break users

---

## Next Steps

Congratulations on learning how to publish packages! Now you're ready to explore advanced NPM features like workspaces, npx, and npm link that will take your package development to the next level.

**Continue to:** [Module 11: Advanced NPM Features →](11-advanced-features.md)

---

## Additional Resources

- [NPM Publishing Documentation](https://docs.npmjs.com/cli/v9/commands/npm-publish)
- [NPM Package Naming Rules](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#name)
- [Semantic Versioning Specification](https://semver.org/)
- [Creating and Publishing Scoped Packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages)
- [NPM Two-Factor Authentication](https://docs.npmjs.com/configuring-two-factor-authentication)
- [Choose a License](https://choosealicense.com/)
- [Keep a Changelog](https://keepachangelog.com/)

---

## Discussion

Have questions about publishing packages? Join the discussion:
- [GitHub Discussions](https://github.com/Leonardo-Garzon-1995/npm-mastery-course/discussions)
- Found an error? [Open an issue](https://github.com/Leonardo-Garzon-1995/npm-mastery-course/issues)

---

[← Previous Module](09-security-auditing.md) | [🏠 Home](../README.md) | [Next Module →](11-advanced-features.md)