# Module 4: Semantic Versioning

[← Previous Module](03-installing-packages.md) | [🏠 Home](../README.md) | [Next Module →](05-package-lock.md)

---

## Module Overview

Understanding semantic versioning (semver) is crucial for managing dependencies effectively. This module explains version numbers, version ranges, and how NPM resolves dependencies.

**Learning Objectives:**
- Understand semantic versioning format (MAJOR.MINOR.PATCH)
- Master version symbols (^, ~, *, etc.)
- Specify version ranges correctly
- Understand how NPM resolves versions


---

## 4.1 Understanding Semantic Versioning

### What is Semantic Versioning?

Semantic Versioning (semver) is a versioning scheme that uses three numbers separated by dots:

```
MAJOR.MINOR.PATCH
  2  .  4  .  1
```

**Example:** `2.4.1`
- **MAJOR** = 2
- **MINOR** = 4
- **PATCH** = 1

### The Three Numbers Explained

#### MAJOR Version (Breaking Changes)

Increment when you make **incompatible API changes**.

**Examples:**
- Removing a function
- Changing function parameters
- Renaming methods
- Changing behavior in a breaking way

```javascript
// Version 1.x.x
function greet(name) {
  return `Hello ${name}`;
}

// Version 2.0.0 (MAJOR change - breaks existing code)
function greet(firstName, lastName) {
  return `Hello ${firstName} ${lastName}`;
}
```

#### MINOR Version (New Features)

Increment when you add **new functionality** that's **backward compatible**.

**Examples:**
- Adding new functions
- Adding optional parameters
- New features that don't break existing code

```javascript
// Version 1.0.0
function greet(name) {
  return `Hello ${name}`;
}

// Version 1.1.0 (MINOR change - backward compatible)
function greet(name) {
  return `Hello ${name}`;
}

function goodbye(name) {  // New function added
  return `Goodbye ${name}`;
}
```

#### PATCH Version (Bug Fixes)

Increment when you make **backward-compatible bug fixes**.

**Examples:**
- Fixing a bug
- Security patches
- Performance improvements
- Documentation updates

```javascript
// Version 1.1.0
function calculateDiscount(price, percent) {
  return price * percent / 100;  // Bug: should subtract!
}

// Version 1.1.1 (PATCH - bug fix)
function calculateDiscount(price, percent) {
  return price - (price * percent / 100);  // Fixed
}
```

### Version Lifecycle

```
0.1.0 → Initial development (unstable)
0.2.0 → More features added
0.9.0 → Getting ready for release
1.0.0 → First stable release
1.1.0 → New feature added
1.1.1 → Bug fix
1.2.0 → Another feature
2.0.0 → Breaking change (a totally new version, backward incompatible)
```

### Pre-release Versions

You can add labels for pre-release versions:

```
1.0.0-alpha    → Alpha version
1.0.0-alpha.1  → Alpha version 1
1.0.0-beta     → Beta version
1.0.0-beta.2   → Beta version 2
1.0.0-rc.1     → Release candidate 1
1.0.0          → Stable release
```

**Examples:**
```json
{
  "dependencies": {
    "react": "18.0.0-rc.0",
    "vue": "3.3.0-beta.1"
  }
}
```

---

## 4.2 Version Symbols and Ranges

NPM uses symbols to specify version ranges in package.json.

### Caret (^) - Compatible Changes

The **caret (^)** allows changes that do **not modify the left-most non-zero digit**.

**Rule:** Updates MINOR and PATCH versions, but not MAJOR.

```json
{
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

**What versions are allowed?**
- ✅ `4.18.2` → Exact version specified
- ✅ `4.18.3` → Patch update
- ✅ `4.19.0` → Minor update
- ✅ `4.20.5` → Minor and patch updates
- ❌ `5.0.0` → Major update (not allowed)
- ❌ `3.9.9` → Lower version (not allowed)

**More examples:**
```json
{
  "^1.2.3" : ">=1.2.3 <2.0.0",    // 1.2.3 to 1.x.x
  "^0.2.3" : ">=0.2.3 <0.3.0",    // 0.2.3 to 0.2.x
  "^0.0.3" : ">=0.0.3 <0.0.4",    // Only 0.0.3
  "^1.0.0" : ">=1.0.0 <2.0.0"     // 1.0.0 to 1.x.x
}
```

### Tilde (~) - Patch-Level Changes

The **tilde (~)** allows **PATCH updates only**.

**Rule:** Updates PATCH version only, keeps MAJOR and MINOR.

```json
{
  "dependencies": {
    "lodash": "~4.17.0"
  }
}
```

**What versions are allowed?**
- ✅ `4.17.0` → Exact version
- ✅ `4.17.1` → Patch update
- ✅ `4.17.21` → Patch update
- ❌ `4.18.0` → Minor update (not allowed)
- ❌ `5.0.0` → Major update (not allowed)

**More examples:**
```json
{
  "~1.2.3" : ">=1.2.3 <1.3.0",    // 1.2.3 to 1.2.x
  "~1.2"   : ">=1.2.0 <1.3.0",    // 1.2.0 to 1.2.x
  "~1"     : ">=1.0.0 <2.0.0",    // 1.0.0 to 1.x.x
  "~0.2.3" : ">=0.2.3 <0.3.0"     // 0.2.3 to 0.2.x
}
```

### Comparison: Caret vs Tilde

| Version | Caret (^) Allows | Tilde (~) Allows |
|---------|------------------|------------------|
| 1.2.3 | 1.2.3 to 1.x.x | 1.2.3 to 1.2.x |
| 0.2.3 | 0.2.3 to 0.2.x | 0.2.3 to 0.2.x |
| 0.0.3 | 0.0.3 only | 0.0.3 only |

**Visual example:**
```
^4.18.2
  ↓
4.18.2 → 4.18.3 → 4.19.0 → 4.20.0 → 4.99.99
         ✅        ✅        ✅        ✅
                                      
~4.18.2
  ↓
4.18.2 → 4.18.3 → 4.19.0
         ✅        ❌
```

### Exact Version (No Symbol)

Specify exact version with no flexibility:

```json
{
  "dependencies": {
    "react": "18.2.0"
  }
}
```

**Only allows:** `18.2.0` (exact version)

**Install with exact version:**
```bash
npm install --save-exact react
npm i -E react
```

### Asterisk (*) - Any Version

Matches **any version** (not recommended):

```json
{
  "dependencies": {
    "lodash": "*"
  }
}
```

**Allows:** Any version (very dangerous!)

**Don't use this** - you'll get unpredictable versions.

### Latest Tag

Install the latest version:

```json
{
  "dependencies": {
    "express": "latest"
  }
}
```

Or via command:
```bash
npm install express@latest
```

**Warning:** "latest" in package.json means it will install the latest at the time of installation, then lock to that version.

---

## 4.3 Advanced Version Ranges

### Comparison Operators

Use comparison operators for more control:

```json
{
  "dependencies": {
    "package": ">=1.0.0",        // Greater than or equal
    "package": ">1.0.0",         // Greater than
    "package": "<=2.0.0",        // Less than or equal
    "package": "<2.0.0",         // Less than
    "package": "=1.0.0"          // Exactly (same as no symbol)
  }
}
```

### Range Combinations

Combine ranges with spaces or `||`:

```json
{
  "dependencies": {
    // AND (both conditions must be true)
    "package": ">=1.0.0 <2.0.0",     // 1.x.x only
    "package": ">=1.2.7 <1.3.0",     // 1.2.7 to 1.2.x
    
    // OR (either condition can be true)
    "package": "1.0.0 || 2.0.0",     // Exactly 1.0.0 or 2.0.0
    "package": "^1.0.0 || ^2.0.0"    // 1.x.x or 2.x.x
  }
}
```

### Hyphen Ranges

Use hyphens for inclusive ranges:

```json
{
  "dependencies": {
    "package": "1.0.0 - 2.0.0",      // 1.0.0 to 2.0.0 (inclusive)
    "package": "1.2.3 - 1.5.0"       // 1.2.3 to 1.5.0 (inclusive)
  }
}
```

### X Ranges

Use `x`, `X`, or `*` as wildcard:

```json
{
  "dependencies": {
    "package": "1.x",        // Same as ^1.0.0 (1.0.0 to 1.x.x)
    "package": "1.2.x",      // Same as ~1.2.0 (1.2.0 to 1.2.x)
    "package": "*",          // Any version
    "package": "1.X.X"       // Same as 1.x
  }
}
```

---

## 4.4 Real-World Examples

### Example 1: Conservative (Exact Versions)

For **critical applications** where stability is paramount:

```json
{
  "dependencies": {
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "express": "4.18.2"
  }
}
```

**Pros:**
- ✅ Completely predictable
- ✅ No surprise updates
- ✅ Same behavior everywhere

**Cons:**
- ❌ Miss bug fixes
- ❌ Miss security patches
- ❌ Manual updates needed

### Example 2: Balanced (Caret)

For **most applications** (NPM default):

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "express": "^4.18.2"
  }
}
```

**Pros:**
- ✅ Get bug fixes automatically
- ✅ Get new features (backward compatible)
- ✅ Security patches

**Cons:**
- ❌ Potential for unexpected changes
- ❌ Need good testing

### Example 3: Flexible (Tilde)

For **libraries** or when you want only bug fixes:

```json
{
  "dependencies": {
    "lodash": "~4.17.21",
    "axios": "~1.4.0"
  }
}
```

**Pros:**
- ✅ Get bug fixes
- ✅ No new features (more stable)

**Cons:**
- ❌ Miss new features
- ❌ Still need to update for major fixes

### Example 4: Pre-release Versions

Testing **beta or alpha** versions:

```json
{
  "dependencies": {
    "react": "18.3.0-next.1",
    "typescript": "5.1.0-beta"
  }
}
```

**Use for:**
- Testing upcoming features
- Early adoption
- Contributing to projects

**Don't use in production!**

---

## 4.5 How NPM Resolves Versions

### Resolution Process

When you run `npm install`, NPM:

1. **Reads package.json** - Gets version requirements
2. **Checks package-lock.json** - Uses locked versions if present
3. **Queries registry** - Gets available versions
4. **Resolves ranges** - Finds highest compatible version
5. **Installs** - Downloads and installs packages

### Example Resolution

**package.json:**
```json
{
  "dependencies": {
    "express": "^4.18.0"
  }
}
```

**NPM thinks:**
- `^4.18.0` means `>=4.18.0 <5.0.0`
- Registry has: 4.18.0, 4.18.1, 4.18.2, 4.19.0
- Installs: `4.19.0` (highest compatible)

**package-lock.json records:**
```json
{
  "dependencies": {
    "express": {
      "version": "4.19.0"    // Exact version installed
    }
  }
}
```

### Dependency Conflicts

What if two packages need different versions?

**Example:**
```json
{
  "dependencies": {
    "package-a": "^1.0.0",  // needs lodash ^4.17.0
    "package-b": "^2.0.0"   // needs lodash ^4.17.21
  }
}
```

**NPM tries:**
1. Find a version that satisfies both (4.17.21 works)
2. If impossible, install different versions (nested)

---

## Hands-On Exercises

>Go to the [exercises](/exercises/04-semantic-versioning-exer.md) for this section

### Exercise 4.1: Understanding Version Numbers

**Objective:** Identify what type of change each version bump represents.

### Exercise 4.2: Version Ranges Practice

**Objective:** Understand what versions are allowed by different symbols.

### Exercise 4.3: Comparing Caret vs Tilde

**Objective:** See the practical difference between ^ and ~.

### Exercise 4.4: Real-World Scenario

**Objective:** Choose appropriate version strategies.

---

## Best Practices

### 1. Use Caret (^) for Most Dependencies

**Default and recommended:**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0"
  }
}
```

### 2. Use Exact Versions for Critical Dependencies

**For stability-critical packages:**
```bash
npm install --save-exact react react-dom
```

```json
{
  "dependencies": {
    "react": "18.2.0",
    "react-dom": "18.2.0"
  }
}
```

### 3. Be Consistent Within a Project

**Pick a strategy:**
- All caret: `^x.y.z`
- All tilde: `~x.y.z`
- All exact: `x.y.z`

Don't mix unless there's a good reason.

### 4. Lock Versions in package-lock.json

**Always commit package-lock.json:**
```bash
git add package-lock.json
git commit -m "Lock dependency versions"
```

### 5. Update Regularly and Test

```bash
# Check for updates
npm outdated

# Update carefully
npm update

# Test thoroughly after updating
npm test
```

### 6. Document Version Requirements

In README.md:
```markdown
## Requirements

- Node.js >= 14.0.0
- NPM >= 6.0.0
```

In package.json:
```json
{
  "engines": {
    "node": ">=14.0.0",
    "npm": ">=6.0.0"
  }
}
```

---

## Summary

In this module, you learned:

✅ Semantic versioning format (MAJOR.MINOR.PATCH)  
✅ When to increment each version number  
✅ Version symbols: ^, ~, *, and exact  
✅ The difference between caret and tilde  
✅ Advanced version ranges and operators  
✅ How NPM resolves dependency versions  
✅ Best practices for version management  

### Key Takeaways

- **MAJOR.MINOR.PATCH** - Breaking.Feature.Fix
- **Caret (^)** - Allow minor and patch updates (most common)
- **Tilde (~)** - Allow only patch updates (more conservative)
- **Exact version** - No updates (most stable)
- **package-lock.json** - Records exact installed versions
- **Update regularly** - But test thoroughly

---

## Next Steps

Understanding versions is one piece of the puzzle. Now let's dive deep into package-lock.json and learn how NPM ensures reproducible installations across different environments.

**Continue to:** [Module 5: Package-lock.json →](05-package-lock.md)

---

## Additional Resources

- [Semantic Versioning Specification](https://semver.org/)
- [NPM Semver Calculator](https://semver.npmjs.com/)
- [NPM Semver Documentation](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#dependencies)
- [Node Semver Package](https://github.com/npm/node-semver)

---

## Discussion

Have questions about semantic versioning? Join the discussion:
- [GitHub Discussions](https://github.com/Leonardo-Garzon-1995/npm-mastery-course/discussions)
- Found an error? [Open an issue](https://github.com/Leonardo-Garzon-1995/npm-mastery-course/issues)

---

[← Previous Module](03-installing-packages.md) | [🏠 Home](../README.md) | [Next Module →](05-package-lock.md)
