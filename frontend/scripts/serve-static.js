#!/usr/bin/env node
/* eslint-disable no-console */
const express = require('express');
const { join } = require('node:path');
const { existsSync } = require('node:fs');

const projectRoot = __dirname ? join(__dirname, '..') : process.cwd();
const browserDir = join(projectRoot, 'dist', 'frontend', 'browser');

if (!existsSync(browserDir)) {
  console.error('Static browser directory not found:', browserDir);
  process.exit(1);
}

const app = express();
app.use(express.static(browserDir, { index: false, maxAge: '1y' }));

// SPA fallback to index.html or index.csr.html (pathless middleware avoids path-to-regexp)
app.use((req, res) => {
  const indexHtml = existsSync(join(browserDir, 'index.html'))
    ? 'index.html'
    : (existsSync(join(browserDir, 'index.csr.html')) ? 'index.csr.html' : null);
  if (!indexHtml) {
    res.status(500).send('index.html not found in browser output');
    return;
  }
  res.sendFile(join(browserDir, indexHtml));
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Serving static build from ${browserDir} on port ${port}`);
});


