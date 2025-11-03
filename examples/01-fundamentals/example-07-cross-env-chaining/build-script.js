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
