# Module 15: Final Project - Create & Publish Your Package

[← Previous Module](14-ci-cd.md) | [🏠 Home](../README.md)

---

## Module Overview

This is your capstone project! You'll create, test, document, and publish your own NPM package, applying everything you've learned throughout this course. This module guides you through building a real package that others can use.

**Learning Objectives:**
- Plan and design an NPM package
- Implement a complete package from scratch
- Write comprehensive tests
- Create professional documentation
- Set up CI/CD for your package
- Publish to NPM registry
- Maintain and version your package
- Handle user feedback and contributions

---

## 15.1 Project Selection

### Package Ideas

**Choose one of these or create your own:**

**1. String Utilities Library**
- String manipulation functions
- Text transformations
- Validation helpers

**2. Date Formatter**
- Human-readable date formatting
- Relative time ("2 hours ago")
- Timezone support

**3. Array Utilities**
- Advanced array operations
- Grouping and filtering helpers
- Statistical functions

**4. Validation Library**
- Input validation
- Type checking
- Custom validators

**5. CLI Tool**
- Command-line utility
- File processing
- Task automation

**6. API Client**
- Wrapper for a public API
- Error handling
- Rate limiting

### Project Requirements

Your package must include:
- Clear purpose and functionality
- Comprehensive tests (>80% coverage)
- Complete documentation
- TypeScript definitions (optional but recommended)
- CI/CD pipeline
- Semantic versioning
- MIT or similar license
- Professional README

---

## 15.2 Project Setup

### Step 1: Initialize Project

**Create project structure:**
```bash
# Create directory
mkdir my-npm-package
cd my-npm-package

# Initialize Git
git init

# Initialize NPM
npm init

# Answer prompts carefully:
# - Choose unique package name
# - Write clear description
# - Set entry point (lib/index.js)
# - Add keywords
# - Choose license (MIT recommended)
```

### Step 2: Create Directory Structure

```bash
# Create directories
mkdir -p lib test docs examples

# Create essential files
touch lib/index.js
touch test/index.test.js
touch README.md
touch LICENSE
touch .gitignore
touch .npmignore
touch .eslintrc.js
touch .prettierrc
touch jest.config.js
```

**Final structure:**
```
my-npm-package/
├── lib/
│   └── index.js
├── test/
│   └── index.test.js
├── docs/
│   └── API.md
├── examples/
│   └── basic-usage.js
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── publish.yml
├── .gitignore
├── .npmignore
├── .eslintrc.js
├── .prettierrc
├── jest.config.js
├── LICENSE
├── README.md
└── package.json
```

### Step 3: Configure package.json

**Complete package.json:**
```json
{
  "name": "@yourusername/my-npm-package",
  "version": "1.0.0",
  "description": "Brief description of what your package does",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "files": [
    "lib",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint lib test",
    "lint:fix": "eslint lib test --fix",
    "format": "prettier --write \"**/*.js\"",
    "format:check": "prettier --check \"**/*.js\"",
    "prepublishOnly": "npm run lint && npm test"
  },
  "keywords": [
    "utility",
    "helper",
    "tool"
  ],
  "author": "Your Name <your@email.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/my-npm-package.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/my-npm-package/issues"
  },
  "homepage": "https://github.com/yourusername/my-npm-package#readme",
  "engines": {
    "node": ">=14.0.0"
  },
  "devDependencies": {
    "jest": "^29.6.0",
    "eslint": "^8.49.0",
    "prettier": "^3.0.0"
  }
}
```

### Step 4: Install Dependencies

```bash
# Install dev dependencies
npm install --save-dev jest eslint prettier

# If using TypeScript
npm install --save-dev typescript @types/node
```

### Step 5: Configure Tools

**.gitignore:**
```
node_modules/
coverage/
dist/
*.log
.env
.DS_Store
.idea/
.vscode/
```

**.npmignore:**
```
test/
coverage/
examples/
docs/
.github/
.eslintrc.js
.prettierrc
jest.config.js
*.test.js
*.spec.js
.env
.DS_Store
```

**.eslintrc.js:**
```javascript
module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-console': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
```

**.prettierrc:**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

**jest.config.js:**
```javascript
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['lib/**/*.js'],
  testMatch: ['**/test/**/*.test.js'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

---

## 15.3 Example Project: String Utils

### Let's build a complete example package

### Implementation

**lib/index.js:**
```javascript
/**
 * String Utilities Package
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
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts string to camelCase
 * @param {string} str - The string to convert
 * @returns {string} The camelCase string
 * @example
 * camelCase('hello world') // 'helloWorld'
 * camelCase('hello-world') // 'helloWorld'
 */
function camelCase(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
}

/**
 * Converts string to kebab-case
 * @param {string} str - The string to convert
 * @returns {string} The kebab-case string
 * @example
 * kebabCase('hello world') // 'hello-world'
 * kebabCase('helloWorld') // 'hello-world'
 */
function kebabCase(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Converts string to snake_case
 * @param {string} str - The string to convert
 * @returns {string} The snake_case string
 * @example
 * snakeCase('hello world') // 'hello_world'
 * snakeCase('helloWorld') // 'hello_world'
 */
function snakeCase(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

/**
 * Truncates string to specified length
 * @param {string} str - The string to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} The truncated string
 * @example
 * truncate('hello world', 8) // 'hello...'
 */
function truncate(str, length, suffix = '...') {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  if (typeof length !== 'number' || length < 0) {
    throw new TypeError('Length must be a positive number');
  }
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}

/**
 * Reverses a string
 * @param {string} str - The string to reverse
 * @returns {string} The reversed string
 * @example
 * reverse('hello') // 'olleh'
 */
function reverse(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str.split('').reverse().join('');
}

/**
 * Counts words in a string
 * @param {string} str - The string to count words in
 * @returns {number} Number of words
 * @example
 * wordCount('hello world') // 2
 */
function wordCount(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Checks if string is palindrome
 * @param {string} str - The string to check
 * @returns {boolean} True if palindrome
 * @example
 * isPalindrome('racecar') // true
 * isPalindrome('hello') // false
 */
function isPalindrome(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

module.exports = {
  capitalize,
  camelCase,
  kebabCase,
  snakeCase,
  truncate,
  reverse,
  wordCount,
  isPalindrome,
};
```

### Tests

**test/index.test.js:**
```javascript
const {
  capitalize,
  camelCase,
  kebabCase,
  snakeCase,
  truncate,
  reverse,
  wordCount,
  isPalindrome,
} = require('../lib/index');

describe('String Utils', () => {
  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('world')).toBe('World');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle already capitalized', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });

    it('should throw on non-string', () => {
      expect(() => capitalize(123)).toThrow(TypeError);
      expect(() => capitalize(null)).toThrow(TypeError);
    });
  });

  describe('camelCase', () => {
    it('should convert to camelCase', () => {
      expect(camelCase('hello world')).toBe('helloWorld');
      expect(camelCase('hello-world')).toBe('helloWorld');
      expect(camelCase('hello_world')).toBe('helloWorld');
    });

    it('should handle already camelCase', () => {
      expect(camelCase('helloWorld')).toBe('helloworld');
    });

    it('should throw on non-string', () => {
      expect(() => camelCase(123)).toThrow(TypeError);
    });
  });

  describe('kebabCase', () => {
    it('should convert to kebab-case', () => {
      expect(kebabCase('hello world')).toBe('hello-world');
      expect(kebabCase('helloWorld')).toBe('hello-world');
      expect(kebabCase('hello_world')).toBe('hello-world');
    });

    it('should handle already kebab-case', () => {
      expect(kebabCase('hello-world')).toBe('hello-world');
    });

    it('should throw on non-string', () => {
      expect(() => kebabCase(123)).toThrow(TypeError);
    });
  });

  describe('snakeCase', () => {
    it('should convert to snake_case', () => {
      expect(snakeCase('hello world')).toBe('hello_world');
      expect(snakeCase('helloWorld')).toBe('hello_world');
      expect(snakeCase('hello-world')).toBe('hello_world');
    });

    it('should handle already snake_case', () => {
      expect(snakeCase('hello_world')).toBe('hello_world');
    });

    it('should throw on non-string', () => {
      expect(() => snakeCase(123)).toThrow(TypeError);
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(truncate('hello world', 8)).toBe('hello...');
      expect(truncate('hello world', 5)).toBe('he...');
    });

    it('should not truncate short strings', () => {
      expect(truncate('hello', 10)).toBe('hello');
    });

    it('should use custom suffix', () => {
      expect(truncate('hello world', 8, '…')).toBe('hello w…');
    });

    it('should throw on non-string', () => {
      expect(() => truncate(123, 5)).toThrow(TypeError);
    });

    it('should throw on invalid length', () => {
      expect(() => truncate('hello', -1)).toThrow(TypeError);
      expect(() => truncate('hello', 'invalid')).toThrow(TypeError);
    });
  });

  describe('reverse', () => {
    it('should reverse string', () => {
      expect(reverse('hello')).toBe('olleh');
      expect(reverse('world')).toBe('dlrow');
    });

    it('should handle empty string', () => {
      expect(reverse('')).toBe('');
    });

    it('should throw on non-string', () => {
      expect(() => reverse(123)).toThrow(TypeError);
    });
  });

  describe('wordCount', () => {
    it('should count words', () => {
      expect(wordCount('hello world')).toBe(2);
      expect(wordCount('one two three')).toBe(3);
    });

    it('should handle multiple spaces', () => {
      expect(wordCount('hello  world')).toBe(2);
      expect(wordCount('  hello world  ')).toBe(2);
    });

    it('should handle empty string', () => {
      expect(wordCount('')).toBe(0);
      expect(wordCount('   ')).toBe(0);
    });

    it('should throw on non-string', () => {
      expect(() => wordCount(123)).toThrow(TypeError);
    });
  });

  describe('isPalindrome', () => {
    it('should detect palindromes', () => {
      expect(isPalindrome('racecar')).toBe(true);
      expect(isPalindrome('A man a plan a canal Panama')).toBe(true);
    });

    it('should detect non-palindromes', () => {
      expect(isPalindrome('hello')).toBe(false);
      expect(isPalindrome('world')).toBe(false);
    });

    it('should handle empty string', () => {
      expect(isPalindrome('')).toBe(true);
    });

    it('should throw on non-string', () => {
      expect(() => isPalindrome(123)).toThrow(TypeError);
    });
  });
});
```

### Documentation

**README.md:**
```markdown
# String Utils

> A lightweight, zero-dependency string manipulation library for JavaScript

[![NPM Version](https://img.shields.io/npm/v/@yourusername/string-utils.svg)](https://www.npmjs.com/package/@yourusername/string-utils)
[![Build Status](https://github.com/yourusername/string-utils/workflows/CI/badge.svg)](https://github.com/yourusername/string-utils/actions)
[![Coverage Status](https://codecov.io/gh/yourusername/string-utils/branch/main/graph/badge.svg)](https://codecov.io/gh/yourusername/string-utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- Zero dependencies
- Lightweight (~2KB)
- Fully tested (100% coverage)
- Well documented
- TypeScript support
- Works in Node.js and browsers

## Installation

```bash
npm install @yourusername/string-utils
```

## Quick Start

```javascript
const { capitalize, camelCase, kebabCase } = require('@yourusername/string-utils');

capitalize('hello world');  // 'Hello world'
camelCase('hello world');   // 'helloWorld'
kebabCase('hello world');   // 'hello-world'
```

## API

### capitalize(str)

Capitalizes the first letter of a string.

```javascript
capitalize('hello world');  // 'Hello world'
capitalize('HELLO');        // 'HELLO'
```

### camelCase(str)

Converts a string to camelCase.

```javascript
camelCase('hello world');   // 'helloWorld'
camelCase('hello-world');   // 'helloWorld'
camelCase('hello_world');   // 'helloWorld'
```

### kebabCase(str)

Converts a string to kebab-case.

```javascript
kebabCase('hello world');   // 'hello-world'
kebabCase('helloWorld');    // 'hello-world'
kebabCase('hello_world');   // 'hello-world'
```

### snakeCase(str)

Converts a string to snake_case.

```javascript
snakeCase('hello world');   // 'hello_world'
snakeCase('helloWorld');    // 'hello_world'
snakeCase('hello-world');   // 'hello_world'
```

### truncate(str, length, [suffix='...'])

Truncates a string to a specified length.

```javascript
truncate('hello world', 8);           // 'hello...'
truncate('hello world', 8, '…');      // 'hello w…'
```

### reverse(str)

Reverses a string.

```javascript
reverse('hello');  // 'olleh'
reverse('world');  // 'dlrow'
```

### wordCount(str)

Counts the number of words in a string.

```javascript
wordCount('hello world');        // 2
wordCount('one two three');      // 3
```

### isPalindrome(str)

Checks if a string is a palindrome.

```javascript
isPalindrome('racecar');                        // true
isPalindrome('A man a plan a canal Panama');   // true
isPalindrome('hello');                          // false
```

## Browser Usage

```html
<script src="https://unpkg.com/@yourusername/string-utils"></script>
<script>
  const { capitalize } = stringUtils;
  console.log(capitalize('hello'));  // 'Hello'
</script>
```

## TypeScript

This package includes TypeScript definitions.

```typescript
import { capitalize, camelCase } from '@yourusername/string-utils';

const result: string = capitalize('hello');
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Running Tests

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## License

MIT © [Your Name](https://github.com/yourusername)

## Links

- [NPM Package](https://www.npmjs.com/package/@yourusername/string-utils)
- [GitHub Repository](https://github.com/yourusername/string-utils)
- [Issue Tracker](https://github.com/yourusername/string-utils/issues)
- [Changelog](CHANGELOG.md)
```

**LICENSE (MIT):**
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

---

## 15.4 Setting Up CI/CD

**.github/workflows/ci.yml:**
```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm run test:coverage

      - name: Upload coverage
        if: matrix.node-version == '18.x'
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

**.github/workflows/publish.yml:**
```yaml
name: Publish Package

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Publish to NPM
        run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## 15.5 Publishing Your Package

### Step 1: Final Checks

**Pre-publish checklist:**
```bash
# Run all tests
npm test

# Check coverage
npm run test:coverage
# Should be >80%

# Run linter
npm run lint

# Format code
npm run format

# Build (if needed)
npm run build

# Test installation locally
npm pack
npm install ./your-package-1.0.0.tgz
```

### Step 2: Test Package Locally

```bash
# Create tarball
npm pack

# In a test project
npm install /path/to/your-package-1.0.0.tgz

# Test it works
node
> const utils = require('@yourusername/string-utils')
> utils.capitalize('hello')
'Hello'
```

### Step 3: Update Version

```bash
# For first release
npm version 1.0.0

# For updates
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
```

### Step 4: Publish

```bash
# Login to NPM
npm login

# Publish (scoped packages need --access public)
npm publish --access public

# Verify
npm view @yourusername/string-utils
```

### Step 5: Create GitHub Release

```bash
# Push tags
git push
git push --tags

# Create release on GitHub
# Go to: https://github.com/yourusername/repo/releases/new
# - Tag: v1.0.0
# - Title: Version 1.0.0
# - Description: Initial release
```

---

## 15.6 Post-Publishing

### Add Badges to README

```markdown
[![NPM Version](https://img.shields.io/npm/v/@yourusername/package.svg)](https://npmjs.com/package/@yourusername/package)
[![Downloads](https://img.shields.io/npm/dm/@yourusername/package.svg)](https://npmjs.com/package/@yourusername/package)
[![Build Status](https://github.com/yourusername/package/workflows/CI/badge.svg)](https://github.com/yourusername/package/actions)
[![Coverage](https://codecov.io/gh/yourusername/package/branch/main/graph/badge.svg)](https://codecov.io/gh/yourusername/package)
```

### Create CHANGELOG.md

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added
- Initial release
- capitalize function
- camelCase function
- kebabCase function
- snakeCase function
- truncate function
- reverse function
- wordCount function
- isPalindrome function

[1.0.0]: https://github.com/yourusername/package/releases/tag/v1.0.0
```

### Monitor Package

```bash
# Check package page
open https://www.npmjs.com/package/@yourusername/string-utils

# Monitor downloads
npm view @yourusername/string-utils dist.downloads

# Check issues
open https://github.com/yourusername/string-utils/issues
```

---

## 15.7 Maintaining Your Package

### Responding to Issues

**When users report issues:**

1. **Acknowledge quickly**
   ```markdown
   Thanks for reporting! I'll look into this.
   ```

2. **Reproduce the issue**
   ```bash
   # Create test case
   # Fix the bug
   # Add test to prevent regression
   ```

3. **Fix and release**
   ```bash
   # Fix code
   git commit -m "fix: resolve issue #123"
   
   # Update version
   npm version patch
   
   # Publish
   npm publish
   
   # Close issue with release notes
   ```

### Accepting Pull Requests

**Review process:**

1. **Review code quality**
   - Follows project style
   - Has tests
   - Documentation updated

2. **Test locally**
   ```bash
   git checkout pr-branch
   npm install
   npm test
   ```

3. **Merge and release**
   ```bash
   git merge pr-branch
   npm version minor
   npm publish
   ```

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Test everything
npm test

# Commit and publish
git commit -am "chore: update dependencies"
npm version patch
npm publish
```

For this last module, there will not be more Hand-On Exercises Section. 

You have made, you got this far! Congratulations!

> If you think you can add some value to this course, please consider [contributing](CONTRIBUTING.md) to it.

---
