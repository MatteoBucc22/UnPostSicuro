#!/usr/bin/env node
/* eslint-disable no-console */
const { existsSync, readdirSync, statSync } = require('node:fs');
const { join } = require('node:path');
const { spawn } = require('node:child_process');

const projectRoot = __dirname ? join(__dirname, '..') : process.cwd();
const candidates = [
  // Common Angular SSR outputs (v17+)
  join(projectRoot, 'dist', 'frontend', 'server', 'main.server.mjs'),
  join(projectRoot, 'dist', 'frontend', 'server', 'server.mjs'),
  join(projectRoot, 'dist', 'frontend', 'server', 'main.mjs'),
  join(projectRoot, 'dist', 'frontend', 'server', 'index.mjs'),
  // Legacy or alternative locations
  join(projectRoot, 'dist', 'frontend', 'main.server.mjs'),
  join(projectRoot, 'dist', 'frontend', 'server.mjs'),
  join(projectRoot, 'dist', 'frontend', 'ssr', 'server.mjs'),
  join(projectRoot, 'dist', 'frontend', 'ssr', 'main.mjs'),
  join(projectRoot, 'dist', 'frontend', 'browser', 'server.mjs'),
];

const target = candidates.find((p) => existsSync(p));

if (!target) {
  console.error('SSR entry file not found. Checked:');
  candidates.forEach((p) => console.error(' -', p));

  // Print a shallow tree of dist/frontend to help debugging on CI
  const root = join(projectRoot, 'dist', 'frontend');
  if (existsSync(root)) {
    console.error(`\nContents of ${root}:`);
    const listDir = (dir, prefix = '') => {
      let entries = [];
      try {
        entries = readdirSync(dir);
      } catch {}
      for (const name of entries) {
        const full = join(dir, name);
        let marker = 'file';
        try {
          const st = statSync(full);
          marker = st.isDirectory() ? 'dir ' : 'file';
        } catch {}
        console.error(`${prefix}${marker}: ${name}`);
        if (marker === 'dir ' && prefix.length < 4) {
          // one more level
          let subEntries = [];
          try {
            subEntries = readdirSync(full);
          } catch {}
          for (const sub of subEntries) {
            console.error(`${prefix}  - ${sub}`);
          }
        }
      }
    };
    listDir(root);
  } else {
    console.error(`\nDirectory not found: ${root}`);
  }
  console.error('\nFalling back to static server...');
  const fallback = join(projectRoot, 'scripts', 'serve-static.js');
  if (!existsSync(fallback)) {
    console.error('Fallback static server not found at', fallback);
    process.exit(1);
  }
  const child = spawn(process.execPath, [fallback], {
    stdio: 'inherit',
    env: process.env,
  });
  child.on('exit', (code) => process.exit(code ?? 0));
  return;
}

console.log('Starting SSR with:', target);

const child = spawn(process.execPath, [target], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => process.exit(code ?? 0));

