# Hands-On Exercises

[← Previous Exercise](13-real-world-project-exer.md) | [🏠 Home](../README.md) | [Back to module 14](/modules/14-ci-cd.md) | [Next Exercise →](14-ci-cd-exer.md)

## Exercise 14.1: Set Up GitHub Actions

**Objective:** Create a basic CI pipeline.

**Steps:**
1. Create `.github/workflows/ci.yml`
2. Add steps for:
   - Checkout code
   - Install dependencies
   - Run tests
   - Run linter
3. Push to GitHub
4. Check Actions tab
5. Fix any failures

**Expected Outcome:** Working CI pipeline.

## Exercise 14.2: Add Multiple Node Versions

**Objective:** Test across Node versions.

**Steps:**
1. Add matrix strategy
2. Test Node 16, 18, 20
3. Verify all pass
4. Add badge to README

**Expected Outcome:** Tests running on multiple versions.

## Exercise 14.3: Implement Caching

**Objective:** Speed up builds with caching.

**Steps:**
1. Add npm cache to workflow
2. Run workflow twice
3. Compare build times
4. Document improvement

**Expected Outcome:** Faster subsequent builds.

## Exercise 14.4: Add Security Scanning

**Objective:** Implement security checks.

**Steps:**
1. Add npm audit step
2. Add Snyk scanning (optional)
3. Set audit level to moderate
4. Fix any vulnerabilities found

**Expected Outcome:** Automated security scanning.

## Exercise 14.5: Set Up Deployment

**Objective:** Automate deployment process.

**Steps:**
1. Choose platform (Heroku/Vercel/Netlify)
2. Add deployment workflow
3. Configure secrets
4. Deploy to staging
5. Test deployment

**Expected Outcome:** Automated deployments on push.

---

# Common Pitfalls

## Pitfall 1: Using npm install in CI

**Problem:**
```yaml
- run: npm install  # ❌ Slower, less reliable
```

**Solution:**
```yaml
- run: npm ci  # ✅ Faster, more reliable
```

## Pitfall 2: Not Caching Dependencies

**Problem:**
```yaml
# No caching - slow builds
- run: npm ci
```

**Solution:**
```yaml
- uses: actions/setup-node@v3
  with:
    cache: 'npm'  # ✅ Cache dependencies
```

### Pitfall 3: Exposing Secrets

**Problem:**
```yaml
env:
  API_KEY: abc123  # ❌ Hardcoded secret
```

**Solution:**
```yaml
env:
  API_KEY: ${{ secrets.API_KEY }}  # ✅ Use GitHub secrets
```

## Pitfall 4: Not Testing Before Deploy

**Problem:**
```yaml
deploy:
  # No tests - deploys broken code
```

**Solution:**
```yaml
deploy:
  needs: [test, lint, security]  # ✅ Test first
```

## Pitfall 5: Ignoring Failed Builds

**Problem:**
```yaml
- run: npm test
  continue-on-error: true  # ❌ Ignores failures
```

**Solution:**
```yaml
- run: npm test  # ✅ Fail on test failures
```