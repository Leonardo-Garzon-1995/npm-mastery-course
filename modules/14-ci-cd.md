# Module 14: CI/CD with NPM

[← Previous Module](13-real-world-project.md) | [🏠 Home](../README.md) | [Next Module →](15-final-project.md)

---

## Module Overview

Continuous Integration and Continuous Deployment (CI/CD) automate your development workflow. This module covers how to integrate NPM into popular CI/CD platforms and create automated pipelines.

**Learning Objectives:**
- Understand CI/CD concepts and benefits
- Set up GitHub Actions workflows
- Configure GitLab CI pipelines
- Implement automated testing
- Set up automatic deployments
- Cache dependencies for faster builds
- Handle environment variables securely
- Deploy to various platforms

---

## 14.1 Understanding CI/CD

### What is CI/CD?

**Continuous Integration (CI):**
- Automatically test code on every commit
- Catch bugs early
- Ensure code quality
- Validate builds

**Continuous Deployment (CD):**
- Automatically deploy passing code
- Deploy to staging/production
- Reduce manual work
- Faster releases

### CI/CD Workflow

```
Developer → Push Code → CI Server
                          ↓
                    Run Tests
                          ↓
                    Build Project
                          ↓
                    Run Audits
                          ↓
                   Deploy (if passing)
                          ↓
                    Production
```

### Benefits

- Faster feedback
- Catch bugs early
- Consistent quality
- Automated deployments
- Build history
- Team collaboration

---

## 14.2 GitHub Actions

### Setting Up GitHub Actions

**Create workflow directory:**
```bash
mkdir -p .github/workflows
```

### Basic Workflow

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
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

### Caching Dependencies

**Faster builds with caching:**
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v3
  with:
    node-version: '18'
    cache: 'npm'  # ← Automatic caching

- name: Install dependencies
  run: npm ci
```

**Manual cache configuration:**
```yaml
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-

- name: Install dependencies
  run: npm ci
```

### Environment Variables

**Using secrets:**
```yaml
steps:
  - name: Run tests
    env:
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
      JWT_SECRET: ${{ secrets.JWT_SECRET }}
    run: npm test
```

**Setting in GitHub:**
1. Go to repository Settings
2. Click Secrets and variables → Actions
3. Click New repository secret
4. Add your secrets

### Matrix Testing

**Test multiple Node versions:**
```yaml
strategy:
  matrix:
    node-version: [16.x, 18.x, 20.x]
    os: [ubuntu-latest, windows-latest, macos-latest]

steps:
  - uses: actions/setup-node@v3
    with:
      node-version: ${{ matrix.node-version }}
```

### Complete CI Workflow

**.github/workflows/ci.yml:**
```yaml
name: CI Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  lint:
    name: Lint Code
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Check formatting
        run: npm run format:check

  test:
    name: Test
    runs-on: ubuntu-latest
    needs: lint

    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --coverage

      - name: Upload coverage
        if: matrix.node-version == '18.x'
        uses: codecov/codecov-action@v3

  security:
    name: Security Audit
    runs-on: ubuntu-latest
    needs: lint

    steps:
      - name: Checkout
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

      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [test, security]

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: dist/
```

---

## 14.3 GitLab CI

### GitLab CI Configuration

**.gitlab-ci.yml:**
```yaml
image: node:18

stages:
  - install
  - lint
  - test
  - build
  - deploy

cache:
  key:
    files:
      - package-lock.json
  paths:
    - node_modules/
    - .npm/

variables:
  npm_config_cache: "$CI_PROJECT_DIR/.npm"

install:
  stage: install
  script:
    - npm ci --cache .npm --prefer-offline
  artifacts:
    expire_in: 1 hour
    paths:
      - node_modules/

lint:
  stage: lint
  dependencies:
    - install
  script:
    - npm run lint
    - npm run format:check

test:
  stage: test
  dependencies:
    - install
  script:
    - npm test -- --coverage
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

security:
  stage: test
  dependencies:
    - install
  script:
    - npm audit --audit-level=moderate
  allow_failure: true

build:
  stage: build
  dependencies:
    - install
  script:
    - npm run build
  artifacts:
    expire_in: 1 week
    paths:
      - dist/

deploy:staging:
  stage: deploy
  dependencies:
    - build
  script:
    - npm run deploy:staging
  environment:
    name: staging
    url: https://staging.example.com
  only:
    - develop

deploy:production:
  stage: deploy
  dependencies:
    - build
  script:
    - npm run deploy:production
  environment:
    name: production
    url: https://example.com
  only:
    - main
  when: manual
```

### GitLab CI Best Practices

**1. Use cache wisely:**
```yaml
cache:
  key:
    files:
      - package-lock.json
  paths:
    - node_modules/
    - .npm/
```

**2. Parallel jobs:**
```yaml
test:unit:
  stage: test
  script:
    - npm run test:unit

test:integration:
  stage: test
  script:
    - npm run test:integration
```

**3. Artifacts for builds:**
```yaml
build:
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week
```

---

## 14.4 Other CI/CD Platforms

### CircleCI

**.circleci/config.yml:**
```yaml
version: 2.1

orbs:
  node: circleci/node@5.1.0

jobs:
  test:
    docker:
      - image: cimg/node:18.16
    steps:
      - checkout
      - node/install-packages:
          pkg-manager: npm
      - run:
          name: Run tests
          command: npm test

  build:
    docker:
      - image: cimg/node:18.16
    steps:
      - checkout
      - node/install-packages:
          pkg-manager: npm
      - run:
          name: Build
          command: npm run build
      - persist_to_workspace:
          root: .
          paths:
            - dist

workflows:
  test-and-build:
    jobs:
      - test
      - build:
          requires:
            - test
```

### Travis CI

**.travis.yml:**
```yaml
language: node_js

node_js:
  - 16
  - 18
  - 20

cache:
  directories:
    - node_modules

install:
  - npm ci

script:
  - npm run lint
  - npm test
  - npm run build

after_success:
  - npm run coverage

deploy:
  provider: heroku
  api_key: $HEROKU_API_KEY
  app: your-app-name
  on:
    branch: main
```

### Jenkins

**Jenkinsfile:**
```groovy
pipeline {
    agent {
        docker {
            image 'node:18'
        }
    }

    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh 'npm run deploy'
            }
        }
    }

    post {
        always {
            junit 'test-results/**/*.xml'
            publishHTML([
                reportDir: 'coverage',
                reportFiles: 'index.html',
                reportName: 'Coverage Report'
            ])
        }
    }
}
```

---

## 14.5 Deployment Strategies

### Deploy to Heroku

**Install Heroku CLI:**
```bash
npm install -g heroku
```

**Login and create app:**
```bash
heroku login
heroku create your-app-name
```

**Add Procfile:**
```
web: npm start
```

**Deploy via GitHub Actions:**
```yaml
deploy:
  name: Deploy to Heroku
  runs-on: ubuntu-latest
  needs: build
  if: github.ref == 'refs/heads/main'

  steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.14
      with:
        heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
        heroku_app_name: "your-app-name"
        heroku_email: "your@email.com"
```

### Deploy to Vercel

**Install Vercel CLI:**
```bash
npm install -g vercel
```

**Deploy via GitHub Actions:**
```yaml
deploy:
  name: Deploy to Vercel
  runs-on: ubuntu-latest
  needs: build

  steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Install Vercel CLI
      run: npm install --global vercel@latest

    - name: Pull Vercel Environment
      run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

    - name: Build Project
      run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

    - name: Deploy to Vercel
      run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### Deploy to Netlify

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Deploy via GitHub Actions:**
```yaml
deploy:
  name: Deploy to Netlify
  runs-on: ubuntu-latest
  needs: build

  steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm ci

    - name: Build
      run: npm run build

    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2.0
      with:
        publish-dir: './dist'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### Deploy to AWS

**Deploy via GitHub Actions:**
```yaml
deploy:
  name: Deploy to AWS
  runs-on: ubuntu-latest
  needs: build

  steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm ci

    - name: Build
      run: npm run build

    - name: Deploy to S3
      run: |
        aws s3 sync ./dist s3://your-bucket-name --delete

    - name: Invalidate CloudFront
      run: |
        aws cloudfront create-invalidation \
          --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
          --paths "/*"
```

### Deploy to DigitalOcean

**Deploy with SSH:**
```yaml
deploy:
  name: Deploy to DigitalOcean
  runs-on: ubuntu-latest
  needs: build

  steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Deploy to Droplet
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.DROPLET_IP }}
        username: ${{ secrets.DROPLET_USER }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd /var/www/your-app
          git pull origin main
          npm ci --production
          npm run build
          pm2 restart your-app
```

---

## 14.6 Database CI/CD

### MongoDB in CI

**Using MongoDB Memory Server:**
```yaml
test:
  runs-on: ubuntu-latest

  steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm test
      env:
        # Tests use mongodb-memory-server
        NODE_ENV: test
```

**Using MongoDB Service:**
```yaml
test:
  runs-on: ubuntu-latest

  services:
    mongodb:
      image: mongo:5.0
      ports:
        - 27017:27017
      options: >-
        --health-cmd "mongosh --eval 'db.adminCommand({ping: 1})'"
        --health-interval 10s
        --health-timeout 5s
        --health-retries 5

  steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm test
      env:
        MONGODB_URI: mongodb://localhost:27017/test
```

### PostgreSQL in CI

```yaml
test:
  runs-on: ubuntu-latest

  services:
    postgres:
      image: postgres:14
      env:
        POSTGRES_PASSWORD: postgres
        POSTGRES_DB: test
      ports:
        - 5432:5432
      options: >-
        --health-cmd pg_isready
        --health-interval 10s
        --health-timeout 5s
        --health-retries 5

  steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3

    - name: Install dependencies
      run: npm ci

    - name: Run migrations
      run: npm run migrate
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test

    - name: Run tests
      run: npm test
```

---

## 14.7 Environment Management

### Multiple Environments

**Create environment-specific scripts:**
```json
{
  "scripts": {
    "start": "node server.js",
    "start:dev": "NODE_ENV=development nodemon server.js",
    "start:staging": "NODE_ENV=staging node server.js",
    "start:prod": "NODE_ENV=production node server.js",
    "deploy:staging": "npm run build && deploy-to-staging.sh",
    "deploy:prod": "npm run build && deploy-to-production.sh"
  }
}
```

### Environment Variables in CI

**GitHub Actions:**
```yaml
jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Deploy
        env:
          DATABASE_URL: ${{ secrets.STAGING_DATABASE_URL }}
          API_KEY: ${{ secrets.STAGING_API_KEY }}
        run: npm run deploy:staging

  deploy-production:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy
        env:
          DATABASE_URL: ${{ secrets.PROD_DATABASE_URL }}
          API_KEY: ${{ secrets.PROD_API_KEY }}
        run: npm run deploy:prod
```

### Configuration Files

**.env.ci:**
```
NODE_ENV=test
DATABASE_URL=mongodb://localhost:27017/test
JWT_SECRET=test-secret
```

**Use in CI:**
```yaml
- name: Run tests
  run: |
    cp .env.ci .env
    npm test
```

---

## 14.8 Advanced CI/CD Features

### Conditional Deployments

**Deploy only on specific branches:**
```yaml
deploy:
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  steps:
    - run: npm run deploy
```

**Deploy on tags:**
```yaml
on:
  push:
    tags:
      - 'v*'

deploy:
  steps:
    - run: npm publish
```

### Parallel Jobs

**Run tests in parallel:**
```yaml
test:
  strategy:
    matrix:
      test-group: [unit, integration, e2e]

  steps:
    - run: npm run test:${{ matrix.test-group }}
```

### Build Matrix

**Test different configurations:**
```yaml
strategy:
  matrix:
    node-version: [16, 18, 20]
    os: [ubuntu-latest, windows-latest]
    include:
      - node-version: 18
        os: ubuntu-latest
        coverage: true

steps:
  - uses: actions/setup-node@v3
    with:
      node-version: ${{ matrix.node-version }}

  - run: npm test

  - if: matrix.coverage
    run: npm run coverage
```

### Notifications

**Slack notifications:**
```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Build ${{ job.status }}'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

**Email notifications:**
```yaml
- name: Send email
  if: failure()
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: Build Failed
    body: Build failed on ${{ github.sha }}
    to: team@example.com
```

---

## 14.9 Real-World CI/CD Pipeline

### Complete Production Pipeline

**.github/workflows/production.yml:**
```yaml
name: Production Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18'

jobs:
  # Quality checks
  quality:
    name: Code Quality
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Format check
        run: npm run format:check

      - name: Type check
        run: npm run type-check
        continue-on-error: true

  # Security audit
  security:
    name: Security Audit
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Audit dependencies
        run: npm audit --audit-level=high

      - name: Check for vulnerabilities
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  # Unit tests
  test-unit:
    name: Unit Tests
    runs-on: ubuntu-latest
    needs: quality

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unit

  # Integration tests
  test-integration:
    name: Integration Tests
    runs-on: ubuntu-latest
    needs: quality

    services:
      mongodb:
        image: mongo:5.0
        ports:
          - 27017:27017

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run integration tests
        run: npm run test:integration
        env:
          MONGODB_URI: mongodb://localhost:27017/test

  # Build
  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [test-unit, test-integration, security]

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist/
          retention-days: 7

  # Deploy to staging
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: build
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    environment:
      name: staging
      url: https://staging.example.com

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build
          path: dist/

      - name: Deploy to staging
        run: npm run deploy:staging
        env:
          DEPLOY_TOKEN: ${{ secrets.STAGING_DEPLOY_TOKEN }}

      - name: Run smoke tests
        run: npm run test:smoke
        env:
          BASE_URL: https://staging.example.com

  # Deploy to production
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: deploy-staging
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://example.com

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build
          path: dist/

      - name: Deploy to production
        run: npm run deploy:production
        env:
          DEPLOY_TOKEN: ${{ secrets.PROD_DEPLOY_TOKEN }}

      - name: Run smoke tests
        run: npm run test:smoke
        env:
          BASE_URL: https://example.com

      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Production deployment ${{ job.status }}'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

##  Hands-On Exercises

>Go to the [exercises](/exercises/14-ci-cd-exer.md) for this section for the full instructions on how to complete each exercise.

### Exercise 14.1: Set Up GitHub Actions

**Objective:** Create a basic CI pipeline.

### Exercise 14.2: Add Multiple Node Versions

**Objective:** Test across Node versions.

### Exercise 14.3: Implement Caching

**Objective:** Speed up builds with caching.

### Exercise 14.4: Add Security Scanning

**Objective:** Implement security checks.

### Exercise 14.5: Set Up Deployment

**Objective:** Automate deployment process.

---

##  CI/CD Best Practices

### 1. Use npm ci
```yaml
- run: npm ci  # Not npm install
```

### 2. Cache dependencies
```yaml
- uses: actions/setup-node@v3
  with:
    cache: 'npm'
```

### 3. Test before deploy
```yaml
deploy:
  needs: [test, lint]
```

### 4. Use environment secrets
```yaml
env:
  API_KEY: ${{ secrets.API_KEY }}
```

### 5. Fail fast
```yaml
strategy:
  fail-fast: true
```

### 6. Run security audits
```yaml
- run: npm audit --audit-level=high
```

### 7. Use semantic versioning
```yaml
on:
  push:
    tags:
      - 'v*'
```

### 8. Monitor deployments
```yaml
- name: Notify on failure
  if: failure()
```

### 9. Keep workflows simple
- One workflow per purpose
- Use reusable workflows
- Document complex steps

### 10. Test your workflows
- Use `act` to test locally
- Test on feature branches
- Use pull requests
---

## Summary

In this module, you learned:

✅ CI/CD concepts and benefits  
✅ Setting up GitHub Actions workflows  
✅ Configuring GitLab CI pipelines  
✅ Working with other CI platforms  
✅ Deploying to various platforms  
✅ Managing environments and secrets  
✅ Caching for faster builds  
✅ Database integration in CI  
✅ Advanced CI/CD features  
✅ Real-world production pipelines  

### Key Takeaways

- **Use npm ci in CI** - Faster and more reliable
- **Cache dependencies** - Significantly speeds up builds
- **Test before deploy** - Prevent broken deployments
- **Use secrets properly** - Never hardcode credentials
- **Matrix testing** - Test across versions and platforms
- **Fail fast** - Catch issues early
- **Automate everything** - Reduce manual errors
- **Monitor pipelines** - Know when things break

---

## Next Steps

Congratulations! You've learned how to automate your entire development workflow with CI/CD. Now you're ready for the final module where you'll create and publish your own NPM package, bringing together everything you've learned throughout this course.

**Continue to:** [Module 15: Final Project →](15-final-project.md)

---

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitLab CI/CD Documentation](https://docs.gitlab.com/ee/ci/)
- [CircleCI Documentation](https://circleci.com/docs/)
- [Travis CI Documentation](https://docs.travis-ci.com/)
- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Heroku Deployment](https://devcenter.heroku.com/categories/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [AWS Deployment Guide](https://aws.amazon.com/getting-started/)
- [Act - Test GitHub Actions Locally](https://github.com/nektos/act)

---

## Discussion

Have questions about CI/CD? Join the discussion:
- [GitHub Discussions](https://github.com/Leonardo-Garzon-1995/npm-mastery-course/discussions)
- Found an error? [Open an issue](https://github.com/Leonardo-Garzon-1995/npm-mastery-course/issues)

---

[← Previous Module](13-real-world-project.md) | [🏠 Home](../README.md) | [Next Module →](15-final-project.md)