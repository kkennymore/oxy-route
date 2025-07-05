#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const [, , command, ...args] = process.argv;

const help = () => {
  console.log(`
Usage: oxy-route <command>

Commands:
  create <name>         Create a new oxy-route project in <name> folder
  test                  Run test suite
  bench                 Run benchmark on basic route
  version               Show package version
  help                  Show this help message
`);
};

switch (command) {
  case 'create': {
    const target = args[0];
    if (!target) {
      console.error('❌ Please specify a project name.');
      process.exit(1);
    }

    const templateDir = path.join(__dirname, '../template');
    const destDir = path.resolve(process.cwd(), target);

    if (!fs.existsSync(templateDir)) {
      console.error('❌ No template folder found.');
      process.exit(1);
    }

    fs.cpSync(templateDir, destDir, { recursive: true });
    console.log(`✅ Project created at ./${target}`);
    break;
  }

  case 'test': {
    execSync('npx jest', { stdio: 'inherit' });
    break;
  }

  case 'bench': {
    execSync('node tests/benchmark/route.bench.js', { stdio: 'inherit' });
    break;
  }

  case 'version': {
    const pkg = require('../package.json');
    console.log(`oxy-route v${pkg.version}`);
    break;
  }

  case 'help':
  default:
    help();
    break;
}
