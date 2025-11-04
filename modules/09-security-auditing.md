# Module 9: Security & Auditing

[← Previous Module](08-npm-cache.md) | [🏠 Home](../README.md) | [Next Module →](10-publishing-packages.md)

---

## Module Overview

Security is critical in modern web development. This module covers how to identify, assess, and fix security vulnerabilities in your NPM dependencies, keeping your projects safe.

**Learning Objectives:**
- Understand security vulnerabilities in NPM packages
- Use npm audit to identify security issues
- Fix vulnerabilities automatically and manually
- Implement security best practices
- Monitor dependencies for security issues
- Understand the npm security ecosystem

---

## 9.1 Understanding NPM Security

### Why Security Matters

**Your dependencies can have:**
- Known vulnerabilities
- Security bugs
- Malicious code
- Outdated libraries with exploits

**Real-world impact:**
- Data breaches
- Unauthorized access
- Code injection
- Supply chain attacks

### The Dependency Chain Problem

**Your project:**
```
my-app
└── express (your dependency)
    └── body-parser (express's dependency)
        └── qs (body-parser's dependency)
            └── vulnerable-package (hidden deep)
```

**One vulnerable package deep in the tree can compromise your entire application.**

### Security Severity Levels

NPM categorizes vulnerabilities by severity:

| Severity | Description | Action |
|----------|-------------|--------|
| **Critical** | Immediate action required | Fix immediately |
| **High** | Action required soon | Fix within days |
| **Moderate** | Review and fix | Fix within weeks |
| **Low** | Monitor and fix when convenient | Fix when possible |

### Common Vulnerability Types

**1. Cross-Site Scripting (XSS)**
```javascript
// Vulnerable code
app.get('/search', (req, res) => {
  res.send(`Results for: ${req.query.q}`); // ❌ No sanitization
});
```

**2. SQL Injection**
```javascript
// Vulnerable code
db.query(`SELECT * FROM users WHERE id = ${userId}`); // ❌ No parameterization
```

**3. Prototype Pollution**
```javascript
// Vulnerable code
function merge(target, source) {
  for (let key in source) {
    target[key] = source[key]; // ❌ Can pollute prototype
  }
}
```

**4. Denial of Service (DoS)**
```javascript
// Vulnerable regular expression
/^(a+)+$/  // ❌ Can cause catastrophic backtracking
```

**5. Arbitrary Code Execution**
```javascript
// Vulnerable code
eval(userInput); // ❌ Never do this
```

---

## 9.2 Using npm audit

### Running a Security Audit

**Basic audit:**
```bash
# Check for vulnerabilities
npm audit
```

**Example output:**
```
found 3 vulnerabilities (1 low, 1 moderate, 1 high)
  run `npm audit fix` to fix 2 of them.
  1 vulnerability requires manual review. See the full report for details.
```

**Detailed output:**
```bash
# Show detailed vulnerability information
npm audit --json

# Show as parsable JSON
npm audit --json > audit-report.json
```

### Understanding Audit Reports

**Sample audit output:**
```
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ High          │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ minimatch                                                    │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=3.0.5                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ express                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ express > glob > minimatch                                   │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://npmjs.com/advisories/118                            │
└───────────────┴──────────────────────────────────────────────────────────────┘
```

**Key fields:**
- **Severity**: How critical the vulnerability is
- **Package**: Which package has the vulnerability
- **Patched in**: What version fixes the issue
- **Dependency of**: Your direct dependency that uses this package
- **Path**: Full dependency chain
- **More info**: Link to detailed advisory

### Audit in Production

**Check production dependencies only:**
```bash
# Audit only production dependencies
npm audit --omit=dev

# Or
npm audit --production
```

**Use in CI/CD:**
```bash
# Fail CI if vulnerabilities found
npm audit --audit-level=high

# Only fail on critical
npm audit --audit-level=critical
```

---

## 9.3 Fixing Vulnerabilities

### Automatic Fixes

**Fix all vulnerabilities automatically:**
```bash
# Apply available fixes
npm audit fix
```

**What it does:**
- Updates packages to patched versions
- Respects semver ranges in package.json
- Updates package-lock.json
- Safe for most cases

**Force major version updates:**
```bash
# Fix vulnerabilities with breaking changes
npm audit fix --force
```

**Warning:** `--force` can introduce breaking changes!

**Dry run (see what would be fixed):**
```bash
# Preview fixes without applying
npm audit fix --dry-run
```

### Manual Fixes

**When automatic fixes don't work:**

**1. Update the direct dependency:**
```bash
# If the vulnerable package is a direct dependency
npm update vulnerable-package

# Or install specific version
npm install vulnerable-package@latest
```

**2. Update parent package:**
```bash
# If it's a sub-dependency
npm update express  # Updates express and its dependencies
```

**3. Use npm overrides (npm 8.3+):**

**In package.json:**
```json
{
  "overrides": {
    "minimatch": "^5.0.0"
  }
}
```

Then:
```bash
npm install
```

**4. Wait for upstream fix:**
```bash
# If no fix available, monitor and wait
# Check package repository for updates
npm repo vulnerable-package
```

### Dealing with Unfixable Vulnerabilities

**Sometimes you can't fix immediately because:**
- No patch available yet
- Breaking changes too extensive
- Dependency abandoned

**Options:**

**1. Accept the risk temporarily:**
```bash
# Document why you're accepting risk
# Set reminder to check again later
```

**2. Find alternative package:**
```bash
# Replace with secure alternative
npm uninstall vulnerable-package
npm install secure-alternative
```

**3. Remove unnecessary dependency:**
```bash
# If you don't really need it
npm uninstall optional-package
```

**4. Use security exceptions (not recommended):**
```json
{
  "scripts": {
    "audit": "npm audit --audit-level=high"
  }
}
```

---

## 9.4 Security Best Practices

### 1. Regular Security Audits

**Weekly checks:**
```bash
# Check for new vulnerabilities
npm audit
```

**Automated in CI/CD:**
```yaml
# .github/workflows/security.yml
name: Security Audit
on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly
  push:
    branches: [main]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm audit --audit-level=moderate
```

### 2. Keep Dependencies Updated

**Regular updates:**
```bash
# Check for updates
npm outdated

# Update packages
npm update

# Audit after updates
npm audit
```

**Use automated tools:**
```bash
# Dependabot (GitHub)
# Renovate Bot
# Snyk
```

### 3. Minimize Dependencies

**Before installing:**
```bash
# Ask yourself:
# - Do I really need this package?
# - Can I use native JavaScript?
# - Is this package well-maintained?
# - How many dependencies does it have?

# Check package dependencies
npm view package-name dependencies

# Check package size
npm view package-name dist.unpackedSize
```

**Remove unused dependencies:**
```bash
# Find unused packages
npm install -g depcheck
depcheck

# Remove unused
npm uninstall unused-package
```

### 4. Use Lock Files

**Always commit package-lock.json:**
```bash
git add package-lock.json
git commit -m "Lock dependency versions"
```

**Benefits:**
- Ensures consistent versions
- Prevents surprise updates
- Security teams can audit exact versions

### 5. Verify Package Integrity

**NPM verifies integrity automatically:**
```json
// package-lock.json
{
  "dependencies": {
    "express": {
      "version": "4.18.2",
      "integrity": "sha512-5/PsL6iGPdfQ/..."  // ← Cryptographic hash
    }
  }
}
```

**Manual verification:**
```bash
# Verify all packages
npm ci  # Uses integrity checks from lock file
```

### 6. Use Two-Factor Authentication

**Enable 2FA for npm account:**
```bash
# Enable 2FA
npm profile enable-2fa auth-and-writes

# Check 2FA status
npm profile get
```

**Why it matters:**
- Prevents account takeover
- Protects your published packages
- Required for popular packages

### 7. Review Package Before Installing

**Check package reputation:**
```bash
# View package info
npm view package-name

# Check weekly downloads
npm view package-name dist.downloads

# Check last publish date
npm view package-name time.modified

# Open repository
npm repo package-name
```

**Red flags:**
- Very few downloads
- No recent updates
- No tests
- No repository
- Suspicious code in repository

---

## 9.5 Advanced Security Tools

### Snyk

**Install and use Snyk:**
```bash
# Install globally
npm install -g snyk

# Authenticate
snyk auth

# Test for vulnerabilities
snyk test

# Monitor project
snyk monitor
```

**Features:**
- More detailed vulnerability info
- Automated pull requests for fixes
- Continuous monitoring
- License compliance checking

### npm-audit-resolver

**Interactive vulnerability resolution:**
```bash
# Install
npm install -g npm-audit-resolver

# Run interactive audit
npm-audit-resolver
```

**Features:**
- Interactive fixes
- Mark vulnerabilities as reviewed
- Generate audit resolution file

### Socket.dev

**Detect supply chain attacks:**
```bash
# Install
npm install -g @socketsecurity/cli

# Scan package
socket npm install express
```

**Features:**
- Detects suspicious packages
- Identifies supply chain risks
- Real-time alerts

### retire.js

**Find outdated and vulnerable JS libraries:**
```bash
# Install
npm install -g retire

# Scan project
retire
```

---

## 9.6 Security in CI/CD

### GitHub Actions Example

**Complete security workflow:**
```yaml
# .github/workflows/security.yml
name: Security Checks

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 1'  # Weekly on Monday

jobs:
  audit:
    name: NPM Audit
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run npm audit
        run: npm audit --audit-level=moderate
      
      - name: Run Snyk test
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
```

### GitLab CI Example

```yaml
# .gitlab-ci.yml
security:audit:
  image: node:18
  stage: test
  script:
    - npm ci
    - npm audit --audit-level=moderate
  only:
    - merge_requests
    - main
  allow_failure: false

security:snyk:
  image: node:18
  stage: test
  script:
    - npm install -g snyk
    - snyk test --severity-threshold=high
  only:
    - merge_requests
    - main
```

### Fail Build on Vulnerabilities

**Strict mode:**
```bash
# Fail on any vulnerability
npm audit --audit-level=low

# Fail on moderate and above
npm audit --audit-level=moderate

# Fail on high and critical only
npm audit --audit-level=high
```

**In package.json scripts:**
```json
{
  "scripts": {
    "audit:check": "npm audit --audit-level=moderate",
    "pretest": "npm run audit:check",
    "test": "jest"
  }
}
```

---

## 9.7 Handling Security Advisories

### Understanding Advisories

**NPM Security Advisory:**
- Unique ID (e.g., GHSA-xxxx-xxxx-xxxx)
- Affected package and versions
- Severity level
- Description of vulnerability
- Patched versions
- Recommended action

### Viewing Advisories

```bash
# View detailed advisory
npm audit

# Get JSON output
npm audit --json

# View specific advisory online
# https://github.com/advisories/GHSA-xxxx-xxxx-xxxx
```

### Reporting Vulnerabilities

**If you find a vulnerability:**

**1. Don't publish publicly:**
- Contact package maintainer privately
- Use security@package-domain.com
- Use GitHub Security Advisory

**2. Provide details:**
- Description of vulnerability
- Steps to reproduce
- Proof of concept (if applicable)
- Suggested fix

**3. Follow responsible disclosure:**
- Give maintainers time to fix (30-90 days)
- Don't exploit vulnerability
- Help with fix if possible

**Example email:**
```
Subject: Security Vulnerability in package-name

Hello,

I've discovered a potential security vulnerability in package-name.

Vulnerability: XSS in user input handling
Affected versions: All versions up to 2.5.0
Severity: High

Details:
The package doesn't sanitize user input in the render() function,
allowing attackers to inject malicious scripts.

Steps to reproduce:
1. Install package-name@2.5.0
2. Call render() with: <script>alert('XSS')</script>
3. Script executes without sanitization

Suggested fix:
Add input sanitization using DOMPurify or similar.

I'm happy to provide more information or help with a fix.

Best regards,
[Your name]
```

---

## 9.8 Security Monitoring

### Automated Monitoring Tools

**1. Dependabot (GitHub):**
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "security-team"
    labels:
      - "security"
      - "dependencies"
```

**2. Snyk:**
```bash
# Set up continuous monitoring
snyk monitor

# Configure in snyk.io dashboard
# - Enable automatic PRs
# - Set severity threshold
# - Configure notifications
```

**3. WhiteSource Renovate:**
```json
// renovate.json
{
  "extends": ["config:base"],
  "vulnerabilityAlerts": {
    "enabled": true
  },
  "packageRules": [
    {
      "matchUpdateTypes": ["patch"],
      "automerge": true
    }
  ]
}
```

### Manual Monitoring

**Weekly routine:**
```bash
#!/bin/bash
# weekly-security-check.sh

echo "Weekly Security Check"
echo "======================="

# Run audit
echo -e "\n Running npm audit..."
npm audit

# Check for updates
echo -e "\n Checking for updates..."
npm outdated

# Generate report
echo -e "\n Generating report..."
npm audit --json > security-report-$(date +%Y%m%d).json

echo -e "\n Security check complete!"
```

---

## 9.9 Real-World Examples

### Example 1: Complete Security Workflow

```bash
#!/bin/bash
# security-workflow.sh

set -e

echo "Security Workflow Starting..."

# Step 1: Check for vulnerabilities
echo -e "\n1️ Checking for vulnerabilities..."
npm audit

# Step 2: Try automatic fixes
echo -e "\n2️ Attempting automatic fixes..."
npm audit fix

# Step 3: Check if issues remain
echo -e "\n3️ Checking remaining issues..."
REMAINING=$(npm audit --json | grep -c '"severity"' || echo "0")

if [ "$REMAINING" -gt "0" ]; then
  echo "$REMAINING vulnerabilities remain"
  echo "Manual review required"
  npm audit
  exit 1
else
  echo " All vulnerabilities fixed!"
fi

# Step 4: Run tests
echo -e "\n4️ Running tests..."
npm test

# Step 5: Commit if successful
echo -e "\n5️ Committing security fixes..."
git add package.json package-lock.json
git commit -m "fix: security vulnerabilities

- Fixed $(npm audit --json | grep -c '"severity"') vulnerabilities
- All tests passing"

echo -e "\n Security workflow complete!"
```

### Example 2: Pre-commit Security Check

```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "Running pre-commit security check..."

# Check for high/critical vulnerabilities
AUDIT_RESULT=$(npm audit --audit-level=high 2>&1)

if [ $? -ne 0 ]; then
  echo "Security vulnerabilities found!"
  echo "$AUDIT_RESULT"
  echo ""
  echo "Please fix vulnerabilities before committing:"
  echo "  npm audit fix"
  echo ""
  echo "Or bypass this check (not recommended):"
  echo "  git commit --no-verify"
  exit 1
fi

echo "No high/critical vulnerabilities"
exit 0
```

### Example 3: Security Report Generator

```javascript
// generate-security-report.js
const { execSync } = require('child_process');
const fs = require('fs');

function generateReport() {
  console.log(' Generating Security Report...\n');
  
  // Run audit
  const audit = execSync('npm audit --json', { encoding: 'utf-8' });
  const auditData = JSON.parse(audit);
  
  // Generate report
  const report = {
    date: new Date().toISOString(),
    summary: {
      total: auditData.metadata.vulnerabilities.total,
      critical: auditData.metadata.vulnerabilities.critical,
      high: auditData.metadata.vulnerabilities.high,
      moderate: auditData.metadata.vulnerabilities.moderate,
      low: auditData.metadata.vulnerabilities.low
    },
    vulnerabilities: auditData.vulnerabilities
  };
  
  // Save report
  const filename = `security-report-${Date.now()}.json`;
  fs.writeFileSync(filename, JSON.stringify(report, null, 2));
  
  console.log(` Report saved: ${filename}`);
  console.log('\nSummary:');
  console.log(`  Critical: ${report.summary.critical}`);
  console.log(`  High: ${report.summary.high}`);
  console.log(`  Moderate: ${report.summary.moderate}`);
  console.log(`  Low: ${report.summary.low}`);
  
  // Exit with error if critical vulnerabilities
  if (report.summary.critical > 0) {
    console.log('\n Critical vulnerabilities found!');
    process.exit(1);
  }
}

generateReport();
```

---

## Hands-On Exercises

>Go to the [exercises](/exercises/09-security-auditing-exer.md) for this section

### Exercise 9.1: Running Your First Audit

**Objective:** Learn to run and interpret npm audit.

### Exercise 9.2: Fixing Vulnerabilities

**Objective:** Practice fixing security issues.

### Exercise 9.3: Security in CI/CD

**Objective:** Add security checks to CI/CD pipeline.

### Exercise 9.4: Manual Vulnerability Assessment

**Objective:** Practice assessing vulnerabilities manually.

### Exercise 9.5: Create Security Monitoring

**Objective:** Set up automated security monitoring.

---

## Best Practices

### 1. Run Audits Regularly

**Schedule:**
```bash
# Daily (in CI/CD)
npm audit --audit-level=high

# Weekly (manual review)
npm audit

# Monthly (full security review)
npm audit --json > monthly-audit.json
```

### 2. Fix Vulnerabilities Promptly

**Priority order:**
```bash
# 1. Critical - fix immediately
npm audit fix

# 2. High - fix within 24-48 hours
npm audit fix --force  # If needed

# 3. Moderate - fix within a week
npm update

# 4. Low - fix in next sprint
# Document and track
```

### 3. Test After Fixing

**Always test:**
```bash
# Fix vulnerabilities
npm audit fix

# Run all tests
npm test
npm run build
npm run lint

# Manual testing
npm start
# Test critical features
```

### 4. Keep Dependencies Minimal

**Before adding:**
```bash
# Check package
npm view package-name
npm view package-name dependencies

# Consider:
# - Do I really need this?
# - Is it well-maintained?
# - Are there alternatives?
# - Can I write this myself?
```

### 5. Use Automation

**Automate security:**
```yaml
# Dependabot
# Snyk
# WhiteSource Renovate
# GitHub Security Alerts
```

### 6. Document Security Decisions

**In your project:**
```markdown
# Security Policy

## Vulnerability Management
- Weekly audits
- Fix critical/high within 48 hours
- Monthly security review

## Known Issues
- lodash@4.17.20 - Low severity XSS
  - Accepted: Not exploitable in our use case
  - Tracking: Issue #123
  - Review: 2024-06-01
```

### 7. Stay Informed

**Follow security news:**
- NPM Security Advisories
- GitHub Security Lab
- Node.js Security WG
- Security mailing lists

---

## Summary

In this module, you learned:

✅ Why NPM security matters and common threats  
✅ How to use npm audit to find vulnerabilities  
✅ Fixing vulnerabilities automatically and manually  
✅ Security best practices for NPM projects  
✅ Using advanced security tools (Snyk, etc.)  
✅ Implementing security in CI/CD pipelines  
✅ Monitoring and responding to security advisories  

### Key Takeaways

- **npm audit** - Primary tool for finding vulnerabilities
- **npm audit fix** - Automatic fix for many issues
- **Test after fixing** - Always verify fixes don't break code
- **Regular audits** - Make security checks routine
- **Minimize dependencies** - Less code = less risk
- **Use automation** - Let tools monitor for you
- **Stay updated** - Keep dependencies current
- **Document decisions** - Track known issues

---

## Next Steps

Now that you understand how to keep your projects secure, you're ready to learn about publishing your own packages to NPM and sharing your code with the world!

**Continue to:** [Module 10: Publishing Packages →](10-publishing-packages.md)

---

## Additional Resources

- [NPM Audit Documentation](https://docs.npmjs.com/cli/v9/commands/npm-audit)
- [GitHub Security Advisories](https://github.com/advisories)
- [Node.js Security Working Group](https://github.com/nodejs/security-wg)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Snyk Vulnerability Database](https://snyk.io/vuln/)
- [NPM Security Best Practices](https://docs.npmjs.com/auditing-package-dependencies-for-security-vulnerabilities)

---

## Discussion

Have questions about NPM security? Join the discussion:
- [GitHub Discussions](https://github.com/Leonardo-Garzon-1995/npm-mastery-course/discussions)
- Found an error? [Open an issue](https://github.com/Leonardo-Garzon-1995/npm-mastery-course/issues)

---

[← Previous Module](08-npm-cache.md) | [🏠 Home](../README.md) | [Next Module →](10-publishing-packages.md)