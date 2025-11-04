# Module 6: NPM Scripts

[← Previous Module](05-package-lock.md) | [🏠 Home](../README.md) | [Next Module →](07-managing-packages.md)

---

## Module Overview

NPM scripts are one of the most powerful features of NPM, allowing you to automate tasks and create efficient development workflows. This module covers everything from basic scripts to advanced automation techniques.

**Learning Objectives:**
- Understand what NPM scripts are and why they're useful
- Create and run custom scripts
- Use pre and post hooks
- Pass arguments to scripts
- Chain multiple scripts together
- Access environment variables in scripts
- Create cross-platform compatible scripts

---

## 6.1 Understanding NPM Scripts

### What Are NPM Scripts?

NPM scripts are shell commands defined in the `scripts` section of package.json. They allow you to:
- Automate repetitive tasks
- Create consistent commands across your team
- Run build tools, linters, and test frameworks
- Create custom workflows

### Basic Example

**package.json:**
```json
{
  "name": "my-app",
  "scripts": {
    "start": "node server.js",
    "test": "jest",
    "build": "webpack"
  }
}
```

**Running scripts:**
```bash
npm start        # Runs: node server.js
npm test         # Runs: jest
npm run build    # Runs: webpack
```

### Why Use NPM Scripts?

**Instead of typing long commands in your terminal**
```bash
# Typing this every time:
node server.js
nodemon --watch src --exec "node server.js"
webpack --mode production --config webpack.prod.js
jest --coverage --watch
```

**You can just do this instead:**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon --watch src --exec \"node server.js\"",
    "build": "webpack --mode production --config webpack.prod.js",
    "test:watch": "jest --coverage --watch"
  }
}
```

```bash
# Simple, memorable commands:
npm start
npm run dev
npm run build
npm run test:watch
```

**Benefits:**
- Shorter, easier to remember commands
- Consistent across team members
- Works on any platform
- Easy to document
- Can be chained and automated

---

## 6.2 Creating and Running Scripts

### Built-in Scripts

Some scripts can be run without `npm run`:

```json
{
  "scripts": {
    "start": "node server.js",
    "test": "jest",
    "stop": "kill-port 3000",
    "restart": "npm stop && npm start"
  }
}
```

**Special scripts (no `run` needed):**
```bash
npm start      # ✅ Works
npm test       # ✅ Works
npm stop       # ✅ Works
npm restart    # ✅ Works
```

### Custom Scripts

All other scripts need `npm run`:

```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "build": "webpack",
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

**Running custom scripts:**
```bash
npm run dev        # ✅ Correct
npm run build      # ✅ Correct
npm run lint       # ✅ Correct

npm dev            # ❌ Won't work
npm build          # ❌ Won't work (this is a different command!)
```

### Listing Available Scripts

```bash
# List all scripts
npm run

# Example output:
# Scripts available via `npm run-script`:
#   dev
#     nodemon server.js
#   build
#     webpack
#   lint
#     eslint .
```

---

## 6.3 Common Script Patterns

### Development Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "dev:watch": "nodemon --watch src server.js",
    "dev:debug": "nodemon --inspect server.js"
  }
}
```

**Usage:**
```bash
npm start           # Production start
npm run dev         # Development with auto-restart
npm run dev:watch   # Watch specific directory
npm run dev:debug   # Start with debugger
```

### Testing Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration",
    "test:e2e": "cypress run"
  }
}
```

**Usage:**
```bash
npm test                    # Run all tests once
npm run test:watch          # Run tests in watch mode
npm run test:coverage       # Run with coverage report
npm run test:unit           # Run only unit tests
```

### Build Scripts

```json
{
  "scripts": {
    "build": "webpack --mode production",
    "build:dev": "webpack --mode development",
    "build:watch": "webpack --watch",
    "build:analyze": "webpack --mode production --analyze"
  }
}
```

### Linting and Formatting Scripts

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "style": "npm run lint && npm run format"
  }
}
```

### Cleaning Scripts

```json
{
  "scripts": {
    "clean": "rm -rf dist",
    "clean:modules": "rm -rf node_modules",
    "clean:all": "npm run clean && npm run clean:modules"
  }
}
```

---

## 6.4 Pre and Post Hooks

### Automatic Hooks

NPM automatically runs scripts before and after certain scripts:

```json
{
  "scripts": {
    "prebuild": "npm run clean",
    "build": "webpack",
    "postbuild": "npm run test",
    
    "pretest": "npm run lint",
    "test": "jest",
    "posttest": "echo 'Tests completed!'"
  }
}
```

**When you run `npm run build`:**
```
1. prebuild  → npm run clean
2. build     → webpack
3. postbuild → npm run test
```

**When you run `npm test`:**
```
1. pretest  → npm run lint
2. test     → jest
3. posttest → echo 'Tests completed!'
```

### Common Hook Patterns

**Build process:**
```json
{
  "scripts": {
    "prebuild": "npm run clean && npm run lint",
    "build": "webpack --mode production",
    "postbuild": "npm run test:unit"
  }
}
```

**Testing:**
```json
{
  "scripts": {
    "pretest": "npm run lint",
    "test": "jest",
    "posttest": "npm run test:coverage"
  }
}
```

**Installation:**
```json
{
  "scripts": {
    "preinstall": "echo 'Installing dependencies...'",
    "postinstall": "npm run build"
  }
}
```

### Available Hooks

You can create pre/post hooks for any script:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "firebase deploy",
    "postdeploy": "echo 'Deployed successfully!'",
    
    "prestart": "npm run setup",
    "start": "node server.js",
    "poststart": "echo 'Server started on port 3000'"
  }
}
```

---

## 6.5 Chaining Scripts

### Sequential Execution (&&)

Run scripts one after another - stops if any fails:

```json
{
  "scripts": {
    "build": "npm run clean && npm run compile && npm run bundle",
    "deploy": "npm run test && npm run build && npm run upload"
  }
}
```

**How it works:**
```bash
npm run build
# 1. Runs clean
# 2. If clean succeeds, runs compile
# 3. If compile succeeds, runs bundle
# If any step fails, stops immediately
```

### Parallel Execution (npm-run-all)

Install `npm-run-all` for parallel execution:

```bash
npm install --save-dev npm-run-all
```

```json
{
  "scripts": {
    "lint:js": "eslint .",
    "lint:css": "stylelint '**/*.css'",
    "lint:all": "npm-run-all --parallel lint:*",
    
    "watch:js": "webpack --watch",
    "watch:css": "sass --watch",
    "watch": "npm-run-all --parallel watch:*"
  }
}
```

**Usage:**
```bash
npm run lint:all    # Runs both linters in parallel
npm run watch       # Watches both JS and CSS simultaneously
```

### Using (&) for Background Tasks

Run tasks in the background (Unix-based systems):

```json
{
  "scripts": {
    "start:server": "node server.js &",
    "start:client": "npm run start:server && webpack-dev-server"
  }
}
```

**Note:** The `&` operator is not cross-platform. Use `npm-run-all` for better compatibility.

---

## 6.6 Passing Arguments to Scripts

### Basic Arguments

Pass arguments using `--`:

```json
{
  "scripts": {
    "test": "jest",
    "start": "node server.js"
  }
}
```

**Passing arguments:**
```bash
# Pass arguments to jest
npm test -- --watch
# Runs: jest --watch

npm test -- --coverage --verbose
# Runs: jest --coverage --verbose

# Pass arguments to node
npm start -- --port=4000
# Runs: node server.js --port=4000
```

### Accessing Arguments in Scripts

**Using environment variables:**
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

**In server.js:**
```javascript
// Access arguments
const args = process.argv.slice(2);
console.log('Arguments:', args);

// Parse specific arguments
const port = process.env.PORT || 3000;
```

**Run with arguments:**
```bash
PORT=4000 npm start
# Or
npm start -- --port=4000
```

### Using Variables in Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "start:dev": "PORT=3000 npm start",
    "start:prod": "PORT=8080 npm start"
  }
}
```

---

## 6.7 Environment Variables

### Setting Environment Variables

**In package.json:**
```json
{
  "scripts": {
    "start:dev": "NODE_ENV=development node server.js",
    "start:prod": "NODE_ENV=production node server.js"
  }
}
```

**In code (server.js):**
```javascript
const env = process.env.NODE_ENV || 'development';
console.log(`Running in ${env} mode`);

if (env === 'production') {
  // Production config
} else {
  // Development config
}
```

### Cross-Platform Environment Variables

**Problem:** Setting env vars differs on Windows vs Unix.

**Unix (Mac/Linux):**
```bash
NODE_ENV=production npm start
```

**Windows:**
```bash
set NODE_ENV=production && npm start
```

**Solution: Use cross-env**

```bash
npm install --save-dev cross-env
```

```json
{
  "scripts": {
    "start:dev": "cross-env NODE_ENV=development node server.js",
    "start:prod": "cross-env NODE_ENV=production node server.js"
  }
}
```

**Now works on all platforms:**
```bash
npm run start:dev    # Works on Mac, Linux, Windows
npm run start:prod   # Works everywhere
```

### NPM-Provided Environment Variables

NPM provides useful environment variables:

```javascript
// Access package.json fields
console.log(process.env.npm_package_name);
console.log(process.env.npm_package_version);
console.log(process.env.npm_package_description);

// Access config
console.log(process.env.npm_config_port);

// Current script name
console.log(process.env.npm_lifecycle_event);
```

**Example usage:**
```json
{
  "name": "my-app",
  "version": "1.0.0",
  "config": {
    "port": "3000"
  },
  "scripts": {
    "start": "node server.js"
  }
}
```

**In server.js:**
```javascript
const port = process.env.npm_package_config_port;
const version = process.env.npm_package_version;

console.log(`${process.env.npm_package_name} v${version}`);
console.log(`Starting server on port ${port}`);
```

---

## 6.8 Advanced Script Techniques

### Conditional Scripts

**Using node scripts for logic:**

**scripts/conditional-build.js:**
```javascript
const env = process.env.NODE_ENV;

if (env === 'production') {
  console.log('Running production build...');
  // Run production commands
} else {
  console.log('Running development build...');
  // Run development commands
}
```

**In package.json:**
```json
{
  "scripts": {
    "build": "node scripts/conditional-build.js"
  }
}
```

### Complex Workflows

```json
{
  "scripts": {
    "clean": "rm -rf dist",
    "lint": "eslint src",
    "test": "jest",
    "compile": "babel src -d dist",
    "bundle": "webpack",
    
    "prebuild": "npm run clean && npm run lint",
    "build": "npm run compile && npm run bundle",
    "postbuild": "npm run test",
    
    "predeploy": "npm run build",
    "deploy": "firebase deploy",
    "postdeploy": "echo '✅ Deployment complete!'"
  }
}
```

**Running `npm run deploy`:**
```
1. predeploy → npm run build
   - prebuild → clean, lint
   - build → compile, bundle
   - postbuild → test
2. deploy → firebase deploy
3. postdeploy → success message
```

### Silent Scripts

Suppress output with `--silent` or `-s`:

```json
{
  "scripts": {
    "quiet": "npm run build --silent",
    "build": "webpack"
  }
}
```

```bash
npm run quiet    # No NPM output, only webpack output
```

### Script Comments

**Use echo for documentation:**
```json
{
  "scripts": {
    "info": "echo 'Available scripts: dev, build, test'",
    "build": "echo ' Building...' && webpack",
    "test": "echo ' Testing...' && jest"
  }
}
```

**Or use a help script:**
```json
{
  "scripts": {
    "help": "echo 'dev - Start development server\nbuild - Build for production\ntest - Run tests'"
  }
}
```

---

## 6.9 Real-World Examples

### Example 1: Full Stack Development

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    
    "client:dev": "cd client && npm run dev",
    "server:dev": "nodemon server.js",
    "dev:all": "npm-run-all --parallel server:dev client:dev",
    
    "build:client": "cd client && npm run build",
    "build:server": "babel server -d dist",
    "build": "npm run build:server && npm run build:client",
    
    "test:client": "cd client && npm test",
    "test:server": "jest",
    "test:all": "npm run test:server && npm run test:client",
    
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    
    "clean": "rm -rf dist client/build",
    "deploy": "npm run build && firebase deploy"
  }
}
```

### Example 2: React Application

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    
    "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint src --ext .js,.jsx,.ts,.tsx --fix",
    
    "format": "prettier --write 'src/**/*.{js,jsx,ts,tsx,css,md}'",
    "format:check": "prettier --check 'src/**/*.{js,jsx,ts,tsx,css,md}'",
    
    "test:coverage": "npm test -- --coverage --watchAll=false",
    "test:ci": "CI=true npm test -- --coverage",
    
    "analyze": "source-map-explorer 'build/static/js/*.js'",
    
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

### Example 3: Node.js API

```json
{
  "scripts": {
    "start": "node dist/server.js",
    "dev": "nodemon --exec babel-node src/server.js",
    
    "build": "babel src -d dist",
    "prebuild": "npm run clean",
    "postbuild": "npm run copy:assets",
    
    "copy:assets": "cp -r src/public dist/",
    
    "test": "jest --forceExit --detectOpenHandles",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    
    "lint": "eslint src",
    "lint:fix": "eslint src --fix",
    
    "clean": "rm -rf dist",
    
    "db:migrate": "sequelize-cli db:migrate",
    "db:seed": "sequelize-cli db:seed:all",
    "db:reset": "sequelize-cli db:migrate:undo:all && npm run db:migrate && npm run db:seed",
    
    "docker:build": "docker build -t my-api .",
    "docker:run": "docker run -p 3000:3000 my-api"
  }
}
```

### Example 4: TypeScript Project

```json
{
  "scripts": {
    "start": "node dist/index.js",
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    
    "build": "tsc",
    "build:watch": "tsc --watch",
    "prebuild": "npm run clean && npm run lint",
    
    "clean": "rm -rf dist",
    
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    
    "format": "prettier --write 'src/**/*.ts'",
    "format:check": "prettier --check 'src/**/*.ts'"
  }
}
```

---

## Hands-On Exercises

>Go to the [exercises](/exercises/06-npm-scripts-exer.md) for this section

### Exercise 6.1: Basic Scripts

**Objective:** Create and run basic NPM scripts.

### Exercise 6.2: Pre and Post Hooks

**Objective:** Use pre and post hooks to create a workflow.

### Exercise 6.3: Chaining Scripts

**Objective:** Create complex workflows by chaining scripts.

### Exercise 6.4: Environment Variables

**Objective:** Use environment variables in scripts.

### Exercise 6.5: Real-World Project

**Objective:** Create a complete script workflow for a project.

---

## Best Practices

### 1. Use Meaningful Names

**Bad:**
```json
{
  "scripts": {
    "s": "node server.js",
    "b": "webpack",
    "t": "jest"
  }
}
```

**Good:**
```json
{
  "scripts": {
    "start": "node server.js",
    "build": "webpack",
    "test": "jest"
  }
}
```

### 2. Use Colons for Variants

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest unit",
    "test:integration": "jest integration"
  }
}
```

### 3. Document Your Scripts

In README.md:
```markdown
## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with hot reload
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run build` - Build for production
- `npm run lint` - Check code style
- `npm run lint:fix` - Fix code style issues
```

### 4. Use Pre/Post Hooks Wisely

```json
{
  "scripts": {
    "prebuild": "npm run clean && npm run lint",
    "build": "webpack",
    "postbuild": "npm run test"
  }
}
```

### 5. Make Scripts Cross-Platform

```bash
# Install cross-platform tools
npm install --save-dev cross-env rimraf npm-run-all
```

```json
{
  "scripts": {
    "clean": "rimraf dist",
    "start:dev": "cross-env NODE_ENV=development node server.js",
    "test:all": "npm-run-all test:unit test:integration"
  }
}
```

### 6. Keep Scripts Simple

If a script is too complex, move it to a separate file:

**scripts/deploy.js:**
```javascript
// Complex deployment logic here
console.log('Deploying...');
// ...
```

**package.json:**
```json
{
  "scripts": {
    "deploy": "node scripts/deploy.js"
  }
}
```

### 7. Use Exit Codes

```javascript
// test-script.js
if (testsPass) {
  console.log('✅ Tests passed!');
  process.exit(0);  // Success
} else {
  console.error('❌ Tests failed!');
  process.exit(1);  // Failure
}
```

---

## Summary

In this module, you learned:

✅ What NPM scripts are and why they're useful  
✅ How to create and run custom scripts  
✅ Using pre and post hooks for automation  
✅ Chaining scripts with && and npm-run-all  
✅ Passing arguments to scripts  
✅ Working with environment variables  
✅ Creating cross-platform scripts  
✅ Real-world script patterns and workflows  

### Key Takeaways

- **NPM scripts automate workflows** - Save time and ensure consistency
- **Use npm run for custom scripts** - Only start, test, stop, restart work without it
- **Pre/post hooks** - Automate before and after tasks
- **Chain with &&** - Run scripts in sequence
- **Use cross-env and rimraf** - Make scripts work on all platforms
- **Document your scripts** - Help your team understand what's available
- **Keep scripts simple** - Break complex workflows into smaller scripts

---

## Next Steps

Now that you've mastered NPM scripts, you're ready to learn about managing packages effectively - updating, removing, and viewing package information.

**Continue to:** [Module 7: Managing Packages →](07-managing-packages.md)

---

## Additional Resources

- [NPM Scripts Documentation](https://docs.npmjs.com/cli/v9/using-npm/scripts)
- [npm-run-all Package](https://www.npmjs.com/package/npm-run-all)
- [cross-env Package](https://www.npmjs.com/package/cross-env)
- [rimraf Package](https://www.npmjs.com/package/rimraf)
- [List of NPM Lifecycle Scripts](https://docs.npmjs.com/cli/v9/using-npm/scripts#life-cycle-scripts)

---

## Discussion

Have questions about NPM scripts? Join the discussion:
- [GitHub Discussions](https://github.com/Leonardo-Garzon-1995/npm-mastery-course/discussions)
- Found an error? [Open an issue](https://github.com/Leonardo-Garzon-1995/npm-mastery-course/issues)

---

[← Previous Module](05-package-lock.md) | [🏠 Home](../README.md) | [Next Module →](07-managing-packages.md)
