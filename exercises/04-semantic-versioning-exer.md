# Hands-On Exercises

[← Previous Exercise](03-installing-packages-exer.md) | [🏠 Home](../README.md) | [Back to module 03](/modules/04-semantic-versioning.md) | [Next Exercise →](05-package-lock-exer.md)

## Exercise 4.1: Understanding Version Numbers

**Objective:** Identify what type of change each version bump represents.

**Given these version changes, identify if they're MAJOR, MINOR, or PATCH:**

1. `1.0.0` → `1.0.1` = ?
2. `1.5.3` → `1.6.0` = ?
3. `2.9.9` → `3.0.0` = ?
4. `0.1.0` → `0.1.1` = ?
5. `1.0.0` → `1.1.0` = ?
6. `5.2.1` → `6.0.0` = ?

**Answers:**
1. PATCH (bug fix)
2. MINOR (new feature)
3. MAJOR (breaking change)
4. PATCH (bug fix)
5. MINOR (new feature)
6. MAJOR (breaking change)

## Exercise 4.2: Version Ranges Practice

**Objective:** Understand what versions are allowed by different symbols.

**For each version specifier, list what versions would be allowed:**

1. `^4.18.2` - Allows: ?
2. `~4.18.2` - Allows: ?
3. `4.18.2` - Allows: ?
4. `>=4.18.2 <5.0.0` - Allows: ?

**Create a project and test:**
```bash
mkdir version-practice
cd version-practice
npm init -y
```

Try installing with different specifiers:
```bash
npm install express@^4.18.0
npm list express

npm install lodash@~4.17.20
npm list lodash
```

## Exercise 4.3: Comparing Caret vs Tilde

**Objective:** See the practical difference between ^ and ~.

**Steps:**
1. Create two projects
2. In project A: `npm install express@^4.17.0`
3. In project B: `npm install express@~4.17.0`
4. Compare what versions got installed
5. Examine package.json and package-lock.json in both

**Questions:**
- Which allowed a newer version?
- What's in package.json for each?
- What's the actual installed version?

## Exercise 4.4: Real-World Scenario

**Objective:** Choose appropriate version strategies.

**Scenario:** You're building an e-commerce application. Choose version strategies for:

1. React (your main UI library) - Use ^ or ~ or exact?
2. A payment processing library - Use ^ or ~ or exact?
3. ESLint (development tool) - Use ^ or ~ or exact?
4. Express (your backend framework) - Use ^ or ~ or exact?

**Discuss:**
- Why did you choose each strategy?
- What are the tradeoffs?
- When would you change your strategy?

---

# Common Pitfalls

## Pitfall 1: Using * (Asterisk)

**Problem:**
```json
{
  "dependencies": {
    "lodash": "*"    // ❌ Dangerous!
  }
}
```

**Why it's bad:**
- Could install ANY version
- Breaking changes without warning
- Unpredictable behavior

**Solution:**
```json
{
  "dependencies": {
    "lodash": "^4.17.21"    // ✅ Predictable behavior
  }
}
```

## Pitfall 2: Not Understanding ^

**Problem:** Thinking `^4.18.2` means "exactly 4.18.2"

**Reality:**
- Installs 4.18.2 or higher
- Up to (but not including) 5.0.0
- Could be 4.99.99

**Solution:** Understand what you're allowing:
- Use `^` for regular dependencies (get updates)
- Use exact versions for critical stability

## Pitfall 3: Mixing Strategies

**Problem:**
```json
{
  "dependencies": {
    "package-a": "^1.0.0",
    "package-b": "~2.0.0",
    "package-c": "3.0.0",
    "package-d": "*"
  }
}
```

**Why confusing:**
- No consistent strategy
- Hard to maintain
- Unpredictable updates

**Solution:** Pick a strategy and stick to it:
```json
{
  "dependencies": {
    "package-a": "^1.0.0",
    "package-b": "^2.0.0",
    "package-c": "^3.0.0"
  }
}
```

## Pitfall 4: Ignoring Pre-release Versions

**Problem:** Using pre-release in production:
```json
{
  "dependencies": {
    "react": "18.3.0-next.1"    // ❌ Beta in production!
  }
}
```

**Solution:** Use stable versions in production:
```json
{
  "dependencies": {
    "react": "^18.2.0"    // ✅ Stable release
  }
}
```
---