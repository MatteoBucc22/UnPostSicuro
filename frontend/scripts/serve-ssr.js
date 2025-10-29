#!/usr/bin/env node
/* eslint-disable no-console */
const express = require('express');
// Ensure JIT compiler is available for any runtime compilation needs
require('@angular/compiler');
const { join } = require('node:path');
const { existsSync } = require('node:fs');
const ssrNode = require('@angular/ssr/node');
const createNodeRequestHandler = ssrNode && (ssrNode.createNodeRequestHandler || ssrNode.default || ssrNode);

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

// Angular SSR request handler (pathless middleware to avoid path-to-regexp issues)
let nodeHandler;
app.use(async (req, res, next) => {
  try {
    if (!nodeHandler) {
      // Try to construct the handler using @angular/ssr helper first
      if (typeof createNodeRequestHandler === 'function') {
        const created = await createNodeRequestHandler({ buildPath: serverDir });
        nodeHandler = created;
      } else {
        // Fallback: attempt to import the built server bundle directly
        // Common export shapes seen across Angular versions
        const serverBundlePath = join(serverDir, 'main.js');
        // eslint-disable-next-line global-require, import/no-dynamic-require
        const serverExports = require(serverBundlePath);
        nodeHandler = serverExports.default
          || serverExports.handle
          || serverExports.handler
          || serverExports.app
          || serverExports;
      }
    }

    if (typeof nodeHandler === 'function') {
      return nodeHandler(req, res, next);
    }
    if (nodeHandler && typeof nodeHandler.handle === 'function') {
      return nodeHandler.handle(req, res, next);
    }
    if (nodeHandler && typeof nodeHandler.handler === 'function') {
      return nodeHandler.handler(req, res, next);
    }
    if (nodeHandler && typeof nodeHandler.app === 'function') {
      return nodeHandler.app(req, res, next);
    }

    throw new TypeError('Invalid SSR handler returned; expected function or { handle }');
  } catch (err) {
    next(err);
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Angular SSR server listening on port ${port}`);
});


