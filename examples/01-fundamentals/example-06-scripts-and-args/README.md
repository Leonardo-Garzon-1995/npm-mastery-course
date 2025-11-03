# Module 1 - Example 6: Mastering NPM Scripts and CLI Arguments

## Overview
This example demonstrates how to create powerful, reusable NPM scripts in `package.json` and how to pass command-line arguments to those scripts for flexible and dynamic execution.

## Folder Structure
```
examples/
└── module-01/
    └── example-06-scripts-and-args/
        ├── README.md 
        ├── package.json
        ├── script-runner.js
        └── .gitignore
```

## What You'll Learn

- Creating custom NPM scripts for common tasks (e.g., `start`, `dev`).
- The role of the `npm run` command and the underlying shell environment.
- Passing positional arguments and named arguments to Node.js scripts.
- Understanding and using the `--` separator correctly.
- Accessing and parsing CLI arguments inside a JavaScript file using the popular `minimist` library.

## Commands Demonstrated

Type these commands in the terminal:

```bash
# 1. Run the simple greetings script
npm run greet
# 2. Pass a positional argument (your name) using the crucial '--' separator
npm run greet -- JohnDoe
# 3. Run the development script with default port (3000)
npm run dev
# 4. Override the default port using a named argument
npm run start-dev -- --port=8080
# 5. Complex configuration using key-value arguments
npm run configure-env -- --env=production --no-debug
```

## Running the Example

```bash
# Navigate to the example folder
cd examples/module-01/example-06-scripts-and-args

# Install necessary dependencies (chalk and minimist)
npm install
```

### package.json

```json
{
  "name": "example-06-scripts-and-args",
  "version": "1.0.0",
  "description": "Example demonstrating the creation and execution of custom NPM scripts and passing CLI arguments.",
  "main": "script-runner.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "greet": "node script-runner.js --task=greet",
    "greet-name": "npm run greet --",  
    "start-dev": "node script-runner.js --task=start",
    "configure-env": "node script-runner.js --task=configure",
    "dev": "npm run start-dev -- --port=3000",
    "prod": "npm run configure-env -- --env=production --no-debug",
    "cleanup": "echo 'Running cleanup...' && rm -f *.temp *.log"
  },
  "keywords": [
    "npm",
    "scripts",
    "arguments",
    "cli",
    "tutorial"
  ],
  "author": "NPM Mastery Course",
  "license": "MIT",
  "dependencies": {
    "chalk": "^4.1.2", 
    "minimist": "^1.2.8"
  }
}
```

### .gitignore
```
# Dependencies
/node_modules

# Logs
*.log
npm-debug.log*

# OS Files
.DS_Store
Thumbs.db

# IDE Files
.vscode/
.idea/
```

### script-runner.js

```javascript
#!/usr/bin/env node

/**
 * NPM Script Runner and CLI Argument Parser (V2 - Clean Output)
 * Demonstrates how to handle arguments passed via 'npm run <script> -- ...'
 */

const chalk = require('chalk');
const minimist = require('minimist');
console.log('Booting script-runner.js...'); // temporary debug

// Custom argument parser: slice(2) removes 'node' and 'script-runner.js'
// We use 'boolean' to handle --no-debug and 'alias' for shorter arguments
const args = minimist(process.argv.slice(2), {
    alias: {
        env: 'environment', // --env will be treated as --environment
        l: 'log-level'      // -l will be treated as --log-level
    },
    boolean: ['debug'],     // Arguments like --debug, --no-debug will be treated as boolean
    default: {
        environment: 'development',
        'log-level': 'debug',
        debug: true
    }
}); 

// --- Color and Style Configuration ---
const log = console.log;
const error = chalk.bold.red;
const success = chalk.green;
const info = chalk.yellow;
const header = chalk.bgBlue.white.bold;
const divider = chalk.cyan('='.repeat(60));
const subDivider = chalk.gray('-'.repeat(60));


/**
 * Prints a clean, structured header for the output.
 */
function printHeader(taskName) {
    log(divider);
    log(header(' ⚙️  NPM SCRIPTS & ARGUMENTS MASTER 🚀 ').padEnd(65, ' '));
    log(divider);
    log(success(`\n✅ RUNNING TASK: ${taskName.toUpperCase()}\n`));
    log(subDivider);
}

/**
 * Executes a specific task based on the '--task' argument.
 */
function runTask(taskName) {
    printHeader(taskName);

    // Get the raw arguments passed after the script name for better display
    // process.argv.slice(3) contains all arguments after 'node' and 'script-runner.js' and the first argument (which is usually --task=...)
    const rawArgs = process.argv.slice(3).join(' '); 
    log(info('✨ RAW ARGUMENTS PASSED:'));
    log(chalk.white(rawArgs || chalk.italic('No custom arguments passed.')));

    log(subDivider);

    switch (taskName) {
        case 'greet':
            handleGreet();
            break;
        case 'start':
            handleStart();
            break;
        case 'configure':
            handleConfigure();
            break;
        default:
            log(error(`❌ ERROR: Unknown task '${taskName}'.`));
            break;
    }
    
    log(divider);
}

/**
 * Handles the 'greet' script (Positional Argument focus).
 */
function handleGreet() {
    // Positional arguments are in args._
    const name = args._[0] || 'NPM Master'; 
    const message = `👋 Welcome, ${chalk.magenta.bold(name)}!`;
    
    log(chalk.bold.yellow('🚀 GREETING STATUS:'));
    log(`- Message: ${success(message)}`);
    
    log(`\n${info('💡 TIP:')} Pass your name using: ${chalk.white('npm run greet -- "Your Name"')}`);
}

/**
 * Handles the 'start' script (Named Argument focus).
 */
function handleStart() {
    const port = args.port || 3000;
    const env = args.env;
    
    log(chalk.bold.yellow('🚀 SERVER START CONFIG:'));
    log(`- Environment: ${env === 'production' ? chalk.red('🔴 PRODUCTION') : chalk.cyan(env.toUpperCase())}`);
    log(`- Port:        ${chalk.magenta.bold(port)}`);
    log(`- Debug:       ${args.debug ? chalk.green('True') : chalk.red('False')}`);
    
    log(`\n${info('💡 TIP:')} Change port using: ${chalk.white('npm run start-dev -- --port=8080')}`);
}

/**
 * Handles the 'configure' script (Complex Configuration focus).
 */
function handleConfigure() {
    const env = args.env;
    const logLevel = args['log-level'].toUpperCase();
    const isDebug = args.debug;
    
    log(chalk.bold.yellow('🔍 PARSED CONFIGURATION:'));
    log(`- Environment: ${env === 'testing' ? chalk.yellow('🟡 TESTING') : env === 'production' ? chalk.red('🔴 ' + env.toUpperCase()) : chalk.cyan(env.toUpperCase())}`);
    log(`- Log Level:   ${chalk.white.bgHex('#FF8C00')(' ' + logLevel + ' ')}`);
    log(`- Debug Mode:  ${isDebug ? chalk.green('✅ Enabled') : chalk.red('❌ Disabled')}` + ' ' + chalk.gray(`(Default: ${args.debug ? 'Enabled' : 'Disabled'})`));

    log(`\n${info('💡 TIP:')} To enable production mode, use ${chalk.white('--env=production')}.`);
    log(`       To disable debug mode, use ${chalk.white('--no-debug')}.`);
}

// --- Main Execution ---
const task = args.task;

if (!task) {
    log(error(`\nFatal Error: Missing required argument '--task'.`));
    log(info(`Usage: npm run <script-name> -- --task=<task-name>`));
    log(divider);
} else {
    runTask(task);
}

// Add final footer for cleanliness
log(divider);
```

## How to Use This Example

### Step 1: Navigate and Install Dependencies
```bash
# Navigate to the example folder
cd examples/module-01/example-06-scripts-and-args

# Install necessary dependencies (chalk and minimist)
npm install
```

### Step 2: Run the Scripts and Observe the Output
```bash
# Run the simple greet script with default values
npm run greet

# Run the development start script with default port (3000)
npm run dev
```

### Step 3: Pass Positional and Named Arguments
```bash
# Pass a Positional Argument (Name)
npm run greet -- 'Sara Connor'

# Pass a Named Argument (Port)
npm run start-dev -- --port=4000
```

### Step 4: Configure Complex Environments
```bash
# Run configuration for the testing environment
npm run configure-env -- --env=testing --log-level=info

# Run the production configuration script (uses multiple arguments)
npm run prod
```

## Expected Output Preview

When you run `npm run configure-env -- --env=testing --log-level=info`, you'll see a structured and colorful log:

```
============================================================
⚙️  NPM SCRIPTS & ARGUMENTS MASTER 🚀
============================================================

✅ RUNNING TASK: CONFIGURE

------------------------------------------------------------
✨ RAW ARGUMENTS PASSED:
--env=testing --log-level=info

------------------------------------------------------------
🔍 PARSED CONFIGURATION:
- Environment: 🟡 TESTING
- Log Level:   INFO
- Debug Mode:  ✅ Enabled (Default)

------------------------------------------------------------
💡 TIP: To enable production mode, use '--env=production'.
       To disable debug mode, use '--no-debug'.
============================================================
```

## Learning Points

### 1. The Power of `npm run`
- **Shell Execution**: `npm run <script-name>` executes the command defined in `package.json` using the project's shell (e.g., `sh` or `cmd`).
- **PATH Injection**: NPM automatically adds the local `node_modules/.bin` directory to the system's PATH variable just for that script's execution. This lets you call local binaries (like `eslint`, `webpack`, or `nodemon`) directly by name, without specifying their full path.
- **Sequential Commands**: Use the shell's operators (`&&` for success, `&` for parallel) to chain multiple commands within one script (e.g., `"build:full": "npm run clean && npm run build"`).

### 2. Passing Arguments Correctly
- **The `--` Separator**: This is critical. Arguments passed after the `--` separator are intended for the underlying script (e.g., your `script-runner.js`), not for NPM itself.
```bash
npm run start -- --port=3000   # --port goes to script.js
npm run start --port=3000     # --port is misinterpreted by NPM (often ignored)
```
- **Argument Types**: NPM scripts can handle Positional, Named, and Boolean arguments, which are then read by the Node.js process.

### 3. Argument Handling in Node.js
- **`process.argv`**: This global array holds all command-line arguments. The first two elements are always the Node executable path and the script file path. Your custom arguments start from index 2.
- **Parsing Libraries**: Directly parsing `process.argv` is complex. Libraries like `minimist` or `yargs` are used to quickly convert the raw argument array into a clean, structured JavaScript object for easy access (e.g., `--port=3000` becomes `args.port`).
- **Boolean Syntax**: For feature toggles, use --flag (which minimizes to true) and --no-flag (which minimizes to false).

### 4. Nested Scripts and Environment Variables
- **Nesting**: NPM scripts can easily call other NPM scripts (e.g., `"test:ci": "npm run lint && npm run test"`). This allows for modular and reusable workflow definitions.
- **Environment Variables**: Variables can be set directly within the script command (e.g., `"start:prod": "NODE_ENV=production node server.js"`). These are accessed in the script via `process.env.NODE_ENV`.

## Practice Exercises

### Exercise 1: Create a Lint and Fix Script
1. Install a local linter (e.g., `npm install eslint --save-dev`).
2. Add a `lint:check` script and a `lint:fix` script to `package.json`:
```json
"lint:check": "eslint .",
"lint:fix": "eslint . --fix"
```
3. Run the fix script: npm run lint:fix.


### Exercise 2: Chaining Commands
Create a single `deploy` script that ensures the project is clean, built, and tested successfully before echoing a success message:
```bash
# Script should run cleanup, build, and test sequentially
npm run deploy
```
(Hint: Use `&&`)

### Exercise 3: Passing Environment-Specific Config
Create a script that uses a **named argument** to define a build target, which is then accessed in the script:
```bash
# Run the build script targeting Staging
npm run build -- --target=staging
```

Which property in the `minimist` object holds the value `'staging'`?

## Common Questions

**Q: Why do I need to use `npm run`? Why not just call `node script.js`?** 
A: Calling `node script.js` only works for simple scripts. You need `npm run` for two main reasons:
- It resolves local binary paths (`node_modules/.bin`), allowing you to run tools like `jest` or `webpack`.
- It allows you to use the powerful shell syntax (`&&`, `&`) for complex, sequential tasks, which is essential for modern workflows.

**Q: What is the difference between `npm run start` and `npm start`? A: `npm start`, `npm test`, `npm stop`, and `npm restart` are reserved lifecycle scripts.**
- `npm start` is a built-in alias for `npm run start`.
- For custom scripts (like `greet` or `dev`), you must use `npm run <script-name>`.

**Q: My script works on Mac/Linux but fails on Windows. Why?** A: This often happens when you use shell-specific syntax like setting environment variables directly (`"script": "NODE_ENV=production node app.js"`).
- **Solution**: Use a cross-platform package like `cross-env` to set environment variables consistently across all operating systems.

## Troubleshooting

### Problem: npm run fails with "command not found" for a tool.
**Cause**: The tool is installed, but the script is not using `npm run`, or the tool is missing from `node_modules/.bin`. 
**Solution**: Ensure you are using npm run <script-name>. If the tool is missing, run `npm install <tool-name> --save-dev`

### Problem: Positional arguments (values) are not showing up in `args._`.
**Cause**: The script uses a named argument with no value (e.g., `--watch`) which consumes the positional space, or the `--` separator is missing. **Solution**: Double-check the command is `npm run script -- value` and ensure the argument is truly positional.

### Problem: Environment variables set in the script are not available.
**Cause**: Using the wrong syntax for the operating system. **Solution**: Install `cross-env` (`npm install cross-env --save-dev`) and prefix your script command: `"script": "cross-env NODE_ENV=production node app.js"`.

## Related Resources

- **Module 1.5**: Deterministic Builds (`package-lock.json` and `npm ci`)
- **Module 6**: Advanced NPM Scripts and Task Automation
- **Exercise 1.6**: Running Local Binaries and Tools
- **External Tool**: Read the documentation for `minimist` or `yargs` to master complex argument parsing.

## Next Steps

After mastering scripts and arguments:

1. Learn about Semantic Versioning (Module 4) to control dependency updates.
2. Dive into Advanced Scripting (Module 6) to automate build and testing workflows.
3. Understand Dependency Types (`dependencies` vs `devDependencies`) (Module 7).
