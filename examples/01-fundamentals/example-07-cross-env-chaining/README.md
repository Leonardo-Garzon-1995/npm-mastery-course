# Module 1 - Example 7: Cross-Platform Build Pipeline

## Overview
This is the final example for Module 1. It shows how to automate a **build process** by safely chaining tasks and setting environment variables (Dev vs. Prod) that work reliably on any operating system.

## Folder Structure
```
examples/
└── module-01/
    └── example-07-cross-env-chaining
        ├── README.md
        ├── package.json
        ├── .gitignore
        └── build-script.js
```

## Files Content

## What You'll Learn

- **Reliable Chaining:** Running multiple commands sequentially using `&&`.
- **Cross-Platform Env Vars:** Using `cross-env` to set the `NODE_ENV` variable.
- **Dynamic Scripts:** Reading `process.env` in Node.js to change build behavior.
- **Sequential Output:** Creating professional, step-by-step progress logs.Production.

## Commands Demonstrated

Type these commands in the terminal:

```bash
# Set environment to 'development' and run the full pipeline
npm run build:dev

# Set environment to 'production' and run the full pipeline
npm run build:prod

# Run the cleanup step only
npm run clean

# Run the set-env step only (Will only show task 2)
npm run set-env
```

## Running the Example

```bash
# Navigate to the example folder
cd examples/module-01/example-07-cross-env-chaining

# Install necessary dependencies (chalk and minimist)
npm install
```

### package.json

```json
{
  "name": "example-07-cross-env-chaining",
  "version": "1.0.1",
  "description": "Demonstrates cross-platform script chaining and environment variables (Beginner-Friendly).",
  "main": "build-script.js",
  "scripts": {
    "clean": "node build-script.js --task=cleanup",
    "set-env": "cross-env NODE_ENV=development node build-script.js --task=setenv",
    "compile": "node build-script.js --task=compile",
    "build:pipeline": "node build-script.js --task=pipeline",
    "build:dev": "cross-env NODE_ENV=development npm run build:pipeline",
    "build:prod": "cross-env NODE_ENV=production npm run build:pipeline",
    "build:all": "npm run clean && npm run set-env && npm run compile",
    "build:report": "npm run build:prod -- --report"
  },
  "keywords": ["npm", "cross-env", "chaining", "build"],
  "author": "NPM Mastery Course",
  "license": "MIT",
  "dependencies": {
    "chalk": "^4.1.2",
    "minimist": "^1.2.8"
  },
  "devDependencies": {
    "cross-env": "^7.0.3"
  }
}
```

### .gitignore
```
# Dependencies
node_modules/

# Build output
dist/
build/

# Environment variables
.env
.env.local

# Logs
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
```

### build-script.js

```javascript
#!/usr/bin/env node
/**
 * Module 1 - Example 7: Build Pipeline Script
 * Cross-platform, single-process pipeline or per-task execution.
 */

const chalk = require('chalk');
const minimist = require('minimist');

// --- Parse args robustly ---
const argv = minimist(process.argv.slice(2)); // e.g., --task=cleanup --report
const task = argv.task || null;

const env = process.env.NODE_ENV || 'undefined';
const isProd = env === 'production';
const wantsReport = Boolean(argv.report);

// --- Helpers ---
const log = console.log;
const divider = chalk.gray('='.repeat(54));
const subDivider = chalk.gray('-'.repeat(38));

function printHeader() {
  log(divider);
  log(chalk.yellow.bold(`✨ STARTING BUILD PIPELINE (Module 1 Final) ✨`));
  log(divider);
}

function printFooter() {
  const time = (Math.random() * 0.5 + 0.4).toFixed(1);
  const finalEnv = isProd ? chalk.red.bold('PRODUCTION') : chalk.green.bold('DEVELOPMENT');
  log(divider);
  log(chalk.green.bold(`✅ BUILD FINISHED! Time: ${time}s (Mode: ${finalEnv})`));
  log(divider);
}

// --- Tasks ---
function runCleanup(step = 1) {
  log(chalk.cyan(`\n[${step}/3] 🧹 CLEANING...`));
  log(chalk.green(`- Old build artifacts deleted successfully.`));
  log(subDivider);
  // To simulate failure for the exercise, uncomment:
  // process.exit(1);
}

function runSetEnv(step = 2) {
  log(chalk.cyan(`\n[${step}/3] ⚙️ CONFIGURING ENVIRONMENT...`));
  const modeText = isProd
    ? chalk.red.bold('PRODUCTION (Minified Output)')
    : chalk.green.bold('DEVELOPMENT (Source Maps)');
  log(`- Detected Mode: ${modeText}`);
  log(chalk.white('- Environment variable (NODE_ENV) set via cross-env (if using build:dev/prod).'));
  log(subDivider);
}

function runCompile(step = 3) {
  log(chalk.cyan(`\n[${step}/3] 📦 COMPILING ASSETS...`));
  log(chalk.yellow('- Running build simulation (Webpack/Rollup)...'));

  if (isProd) {
    log(chalk.white('- Starting Optimization...')); // Conditional example for PRODUCTION
  }

  if (wantsReport && isProd) {
    log(chalk.white('- Generating Build Report...')); // Exercise 2
  }

  log(chalk.green(`- Success! Final bundle generated.`));
  log(subDivider);
}

// --- Orchestrator ---
function runPipeline() {
  printHeader();
  runCleanup(1);
  runSetEnv(2);
  runCompile(3);
  printFooter();
}

// --- Execution ---
if (!task || task === 'pipeline') {
  // Default: run full pipeline in one process (single header, single footer)
  runPipeline();
} else {
  // Individual task mode (for teaching granularity)
  printHeader();
  switch (task) {
    case 'cleanup':
      runCleanup(1);
      break;
    case 'setenv':
      runSetEnv(2);
      break;
    case 'compile':
      runCompile(3);
      break;
    default:
      console.error(chalk.red(`Unknown task: ${task}`));
      process.exit(1);
  }
  // Only show footer for compile if you want to mimic original behavior:
  if (task === 'compile') printFooter();
}
```

## How to Use This Example

### 1. Go to the folder
```bash
cd examples/module-01/example-07-cross-env-chaining
```

### 2. Install deps declared in package.json (chalk, minimist, cross-env)
```bash
npm install
```

### 3. Development build (single-process, one header/footer)
```bash
npm run build:dev
```

### 4. Production build (shows PRODUCTION mode + Optimization line)
```bash
npm run build:prod
```

### 5. Optional: build with report flag (Exercise 2)
```bash
npm run build:report
# You'll see: "Generating Build Report..." because NODE_ENV=production and --report passed through.
```

### 6. Run individual steps (granular teaching mode)
```bash
npm run clean
npm run set-env    
# prints with NODE_ENV=development due to cross-env in this script
npm run compile
```

### 7 Demonstrate short-circuit chaining with &&
```bash
npm run build:all
# If you uncomment process.exit(1) inside runCleanup(), the chain will stop after clean.
```

## Expected Output

When you run `npm run build:dev`, you will see a professional, sequential, and color-coded progress log:

```
======================================================
✨ STARTING BUILD PIPELINE (Module 1 Final) ✨
======================================================

[1/3] 🧹 CLEANING... 
- Old build artifacts deleted successfully.
--------------------------------------

[2/3] ⚙️ CONFIGURING ENVIRONMENT...
- Detected Mode: DEVELOPMENT (Source Maps)  <-- 🟢 DEVELOPMENT mode
- Environment variable (NODE_ENV) set via cross-env.
--------------------------------------

[3/3] 📦 COMPILING ASSETS...
- Running build simulation (Webpack/Rollup)...
- Success! Final bundle generated.

======================================================
✅ BUILD FINISHED! Time: 0.7s (Mode: DEVELOPMENT)
======================================================
```

When you run `npm run build:prod`, you will see a professional, sequential, and color-coded progress log:

```
======================================================
✨ STARTING BUILD PIPELINE (Module 1 Final) ✨
======================================================

[1/3] 🧹 CLEANING... 
- Old build artifacts deleted successfully.
--------------------------------------

[2/3] ⚙️ CONFIGURING ENVIRONMENT...
- Detected Mode: 🔴 PRODUCTION (Minified Output)
- Environment variable (NODE_ENV) set via cross-env.
--------------------------------------

[3/3] 📦 COMPILING ASSETS...
- Running build simulation (Webpack/Rollup)...
- Success! Final bundle generated.

======================================================
✅ BUILD FINISHED! Time: 0.9s (Mode: PRODUCTION)
======================================================
```

## Learning Points

### 1. Scripting Reliability (The && Operator)
- **Sequential Flow**: The `&&` operator is used in `"build:all": "npm run clean && npm run set-env && npm run compile"`.
- **Error Handling**: This ensures the pipeline stops immediately if the first task (`clean`) fails, preventing broken code from being processed further.

### 2. Cross-Platform Variables Solved
- **The Problem**: Setting environment variables directly in NPM scripts is inconsistent across Windows (CMD/PowerShell) and Linux/Mac (Bash).
- **The Solution**: The `cross-env` package standardizes this, making your `NODE_ENV=production` setting work everywhere.

### 3. Dynamic Script Logic
- **`process.env`**: The `build-script.js` file reads the `process.env.NODE_ENV` variable to print distinct messages for Development versus Production, all within a single file.

## Try These Modifications

### 1. Add a Testing Phase
Integrate a new script, `"test": "echo '🔬 Running Unit Tests... Success!'"`, into the build:all pipeline to make it four steps long.

### 2. Test Chaining Failure
Edit the `build-script.js` file to intentionally fail the `clean` task by adding `process.exit(1);` inside the `runCleanup` function. Observe how the subsequent steps are skipped.

### 3. Conditional Output
In `build-script.js`, use the `isProd` boolean variable to conditionally log an extra message (e.g., "Starting Optimization...") only when the build is running in Production mode.

## Practice Exercises

### Exercise 1: Create a Watch Script
1. Create a new script: `"watch:dev": "cross-env NODE_ENV=development && echo 'Watching files for changes...'"`.
2. Explain why you still need `cross-env` even if the script doesn't use chaining.

### Exercise 2: Combine Arguments
Combine your learning from Example 6:
1. Add a new script: `"build:report": "npm run build:prod -- --report"`.
2. Modify `build-script.js` to print an extra message ("Generating Build Report...") if both `NODE_ENV` is `production` AND the `--report` argument is present.

### Exercise 3: Use Different Separators
Research and explain the difference in reliability and behavior between these three chaining methods:
1. `npm run task1 **&&** npm run task2`
2. `npm run task1 **;** npm run task2`
3. `npm run task1 **||** npm run task2`

## Common Questions
The focus here is on scripting and environment variables rather than package research.

**Q: Why do we use `cross-env` when Node.js can read `process.env.NODE_ENV` directly?** 
A: `cross-env` is needed because setting the environment variable in the terminal (e.g., `NODE_ENV=production`) works differently on Windows (Command Prompt/PowerShell) than on Mac/Linux (Bash/Zsh). `cross-env` makes the command cross-platform compatible.

**Q: What happens if I forget the `&&` operator in my pipeline?** 
A: If you use a single ampersand (`&`) or just a space, the commands will try to run simultaneously, and a failure in the first script will not stop the second script from running. The `&&` operator is crucial for reliability and sequential execution.

**Q: Why do we define the three tasks (`clean`, `set-env`, `compile`) as separate scripts?** 
A: Modularity: It makes the build pipeline easier to read, debug, and maintain. You can run individual tasks (e.g., `npm run clean`) without running the whole build sequence.

**Q: Is it better to use arguments (`--prod`) or environment variables (`NODE_ENV=production`) for configuration?** 
A: Environment variables (`NODE_ENV`) are the standard way to specify deployment modes (development, testing, production) because many tools (like Webpack and Node.js) automatically look for them. Arguments are better for one-off settings (like `--report` or `--dry-run`).

## Troubleshooting

### Problem: `cross-env` command not found
**Cause**: The `cross-env` package was not installed locally, or you are running the command outside of an NPM script. 
**Solution**:
```bash
# Make sure you are in the example-07 folder
npm install
# Or, if you need it globally (not recommended for projects):
npm install -g cross-env
```

### Problem: Pipeline doesn't stop when the first script fails
**Cause**: You mistakenly used a single ampersand (`&`) or a semicolon (`;`) instead of the `&&` operator in your `package.json` script. 
**Solution**:
```bash
# package.json: Verify the 'build:all' script
"build:all": "npm run clean && npm run set-env && npm run compile"
```

### Problem: Script doesn't show colors
**Cause**: Your terminal doesn't support ANSI colors, or the `chalk` dependency failed to install correctly. 
**Solution**:
```bash
# Re-install dependencies
npm install
# Or, check your terminal settings (e.g., use VS Code's integrated terminal)
```

## Related Resources

- **Module 1.5**: The `package.json` File: Scripts Section
- **Module 1.6**: Script Arguments with `minimist`
- **Module 3**: Installing `DevDependencies` (where `cross-env` belongs)
- **Module 7**: Advanced Build Management

## Next Steps

After mastering cross-platform scripting and chaining:
1. Learn to install packages (Module 3) and understand how they become available to your scripts.
2. Understand Semantic Versioning (Module 4) to manage package updates safely.
3. Use the `npm test` script (Module 5) to integrate testing into your new build pipeline.

## Additional Commands Reference

```bash
# Bash / zsh
echo $?

# PowerShell
echo $LASTEXITCODE

# Windows CMD
echo %ERRORLEVEL%
#
```
