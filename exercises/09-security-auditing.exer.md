#  Hands-On Exercises

[← Previous Exercise](08-npm-cache-exer.md) | [🏠 Home](../README.md) | [Back to module 09](/modules/09-security-auditing.md) | [Next Exercise →](10-publishing-packages-exer.md)

## Exercise 9.1: Running Your First Audit

**Objective:** Learn to run and interpret npm audit.

**Steps:**
1. Create a project with known vulnerabilities:
   ```bash
   mkdir security-practice
   cd security-practice
   npm init -y
   npm install express@4.16.0  # Older version with vulnerabilities
   ```

2. Run an audit:
   ```bash
   npm audit
   ```

3. Examine the output:
   - How many vulnerabilities were found?
   - What severity levels?
   - Which packages are affected?

4. Get detailed JSON output:
   ```bash
   npm audit --json > audit.json
   ```

**Expected Outcome:** Understanding how to read audit reports.

## Exercise 9.2: Fixing Vulnerabilities

**Objective:** Practice fixing security issues.

**Steps:**
1. Using the project from Exercise 9.1, attempt automatic fix:
   ```bash
   npm audit fix
   ```

2. Check if issues remain:
   ```bash
   npm audit
   ```

3. Try dry-run to preview changes:
   ```bash
   npm audit fix --dry-run
   ```

4. If needed, force major updates:
   ```bash
   npm audit fix --force
   ```

5. Verify application still works:
   ```bash
   npm test
   # Or run your app
   ```

**Expected Outcome:** Successfully fixing vulnerabilities.

## Exercise 9.3: Security in CI/CD

**Objective:** Add security checks to CI/CD pipeline.

**Steps:**
1. Create a GitHub Actions workflow:
   ```yaml
   # .github/workflows/security.yml
   name: Security
   on: [push]
   jobs:
     audit:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
         - run: npm ci
         - run: npm audit --audit-level=moderate
   ```

2. Commit and push:
   ```bash
   git add .github/workflows/security.yml
   git commit -m "Add security checks"
   git push
   ```

3. Check the workflow run in GitHub Actions

**Expected Outcome:** Automated security checks in pipeline.

## Exercise 9.4: Manual Vulnerability Assessment

**Objective:** Practice assessing vulnerabilities manually.

**Steps:**
1. Install a package with known issues:
   ```bash
   npm install lodash@4.17.20
   ```

2. Run audit and note vulnerability details

3. Research the vulnerability:
   - Visit the advisory link
   - Read about the issue
   - Understand the impact

4. Decide on action:
   - Is it exploitable in your use case?
   - Do you use the vulnerable function?
   - Should you update or accept risk?

5. Document your decision

**Expected Outcome:** Understanding risk assessment process.

## Exercise 9.5: Create Security Monitoring

**Objective:** Set up automated security monitoring.

**Steps:**
1. Create a weekly security check script:
   ```bash
   #!/bin/bash
   # weekly-security.sh
   npm audit
   npm outdated
   # Save results
   ```

2. Set up Dependabot (if using GitHub):
   ```yaml
   # .github/dependabot.yml
   version: 2
   updates:
     - package-ecosystem: "npm"
       directory: "/"
       schedule:
         interval: "weekly"
   ```

3. Configure notifications for security updates

4. Document the monitoring process in README

**Expected Outcome:** Automated security monitoring in place.

---

#  Common Pitfalls

## Pitfall 1: Ignoring Low Severity Vulnerabilities

**Problem:**
```bash
npm audit
# 5 low severity vulnerabilities found
# Ignoring them...
```

**Why it's bad:**
- Low severity can still be exploited
- Multiple low issues can compound
- May become high severity in future

**Solution:**
```bash
# Fix all vulnerabilities, including low
npm audit fix

# If unable to fix, document why
# Create GitHub issue to track
```

## Pitfall 2: Using --force Without Testing

**Problem:**
```bash
npm audit fix --force
# Breaks the application
git commit -am "Fix security issues"
# Pushes broken code
```

**Why it's bad:**
- Breaking changes not tested
- Application fails in production
- Rollback needed

**Solution:**
```bash
# Create branch
git checkout -b security-fixes

# Fix vulnerabilities
npm audit fix --force

# Test thoroughly
npm test
npm run build
# Manual testing

# If tests pass, merge
git checkout main
git merge security-fixes
```

## Pitfall 3: Not Committing Lock File Changes

**Problem:**
```bash
npm audit fix
# Changes package-lock.json
git commit -am "Fix security" package.json
# Doesn't commit lock file!
```

**Why it's bad:**
- Team doesn't get fixed versions
- CI/CD uses old vulnerable versions
- Defeats purpose of fix

**Solution:**
```bash
npm audit fix
git add package.json package-lock.json
git commit -m "fix: security vulnerabilities"
```

## Pitfall 4: Accepting All Vulnerabilities

**Problem:**
```json
{
  "scripts": {
    "audit": "npm audit || true"  //  Ignores all vulnerabilities
  }
}
```

**Why it's bad:**
- No visibility of issues
- Vulnerabilities accumulate
- Security debt grows

**Solution:**
```json
{
  "scripts": {
    "audit": "npm audit --audit-level=moderate",
    "audit:check": "npm audit"
  }
}
```

## Pitfall 5: Not Verifying After Fixing

**Problem:**
```bash
npm audit fix
# Assumes everything is fixed
# Doesn't run audit again
```

**Why it's bad:**
- Some issues may not be fixable
- Manual intervention needed
- False sense of security

**Solution:**
```bash
npm audit fix
npm audit  # Verify what remains
# Address unfixed issues
```