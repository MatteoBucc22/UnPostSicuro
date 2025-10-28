#!/usr/bin/env node
/* eslint-disable no-console */
const { existsSync } = require('node:fs');
const { join } = require('node:path');
const { spawn } = require('node:child_process');

const projectRoot = __dirname ? join(__dirname, '..') : process.cwd();
const candidates = [
  join(projectRoot, 'dist', 'frontend', 'server.mjs'),
  join(projectRoot, 'dist', 'frontend', 'server', 'server.mjs'),
  join(projectRoot, 'dist', 'frontend', 'server', 'main.mjs'),
];

const target = candidates.find((p) => existsSync(p));

if (!target) {
  console.error('SSR entry file not found. Checked:');
  candidates.forEach((p) => console.error(' -', p));
  process.exit(1);
}

console.log('Starting SSR with:', target);

const child = spawn(process.execPath, [target], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => process.exit(code ?? 0));

