#!/usr/bin/env node
/* eslint-disable no-console */
const express = require('express');
const { join } = require('node:path');
const { existsSync } = require('node:fs');
const { createRequestHandler } = require('@angular/ssr/express');

const projectRoot = __dirname ? join(__dirname, '..') : process.cwd();
const distRoot = join(projectRoot, 'dist', 'frontend');
const browserDir = join(distRoot, 'browser');
const serverDir = join(distRoot, 'server');

if (!existsSync(serverDir)) {
  console.error('SSR server directory not found:', serverDir);
  process.exit(1);
}

const app = express();

// Serve static assets
if (existsSync(browserDir)) {
  app.use(express.static(browserDir, { index: false, maxAge: '1y' }));
}

// Angular SSR request handler
app.get('*', createRequestHandler({ buildPath: serverDir }));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Angular SSR server listening on port ${port}`);
});


