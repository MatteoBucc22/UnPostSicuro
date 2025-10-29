#!/usr/bin/env node
/* eslint-disable no-console */
const express = require('express');
// Ensure JIT compiler is available for any runtime compilation needs
require('@angular/compiler');
const { join } = require('node:path');
const { existsSync } = require('node:fs');
const ssrNode = require('@angular/ssr/node');
const { AngularNodeAppEngine, writeResponseToNodeResponse } = ssrNode || {};
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

// Angular SSR request handler - initialize before server starts
const serverMainPath = join(serverDir, 'main.js');
const serverBundlePath = join(serverDir, 'server.js');

// If SSR bundle is missing, fall back to static hosting of the browser build
if (!existsSync(serverMainPath) && !existsSync(serverBundlePath)) {
  console.warn('SSR bundle not found. Falling back to static hosting from browser output.');
  if (existsSync(browserDir)) {
    app.use(express.static(browserDir, { index: false, maxAge: '1y' }));
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
  } else {
    app.use((req, res) => res.status(500).send('Browser build not found.'));
  }

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Serving static build from ${browserDir} on port ${port}`);
  });
  // Stop SSR-specific initialization here
  return;
}

// Try multiple methods to initialize SSR handler
let nodeHandler;

// Method 1: Load reqHandler from server.js bundle (most reliable)
if (existsSync(serverBundlePath)) {
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const serverExports = require(serverBundlePath);
    nodeHandler = serverExports.reqHandler;
    if (nodeHandler && typeof nodeHandler === 'function') {
      console.log('SSR handler loaded from server.js reqHandler export');
    } else {
      nodeHandler = serverExports.default || serverExports.handle;
      if (nodeHandler && typeof nodeHandler === 'function') {
        console.log('SSR handler loaded from server.js other exports');
      } else {
        nodeHandler = null;
      }
    }
  } catch (err) {
    console.warn('Failed to load server.js:', err.message);
  }
}

// Method 2: Use AngularNodeAppEngine directly
if (!nodeHandler && AngularNodeAppEngine && writeResponseToNodeResponse) {
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const bootstrapModule = require(serverMainPath);
    const bootstrap = bootstrapModule.default || bootstrapModule;

    if (typeof bootstrap === 'function') {
      const angularApp = new AngularNodeAppEngine();
      
      nodeHandler = async (req, res, next) => {
        try {
          const response = await angularApp.handle(req);
          if (response) {
            writeResponseToNodeResponse(response, res);
          } else {
            next();
          }
        } catch (err) {
          next(err);
        }
      };
      console.log('SSR handler created using AngularNodeAppEngine');
    }
  } catch (err) {
    console.warn('AngularNodeAppEngine initialization failed:', err.message);
  }
}

// Method 3: Try createNodeRequestHandler (async - set up route later)
if (!nodeHandler && typeof createNodeRequestHandler === 'function') {
  (async () => {
    try {
      // Try with path directly
      const handler = await createNodeRequestHandler(serverMainPath);
      if (handler && typeof handler === 'function') {
        nodeHandler = handler;
        console.log('SSR handler created using createNodeRequestHandler(path)');
        
        // Replace existing handler if needed
        app._ssrHandler = handler;
      }
    } catch (err) {
      console.warn('createNodeRequestHandler(path) failed:', err.message);
      // Try with options
      try {
        const handler = await createNodeRequestHandler({
          bootstrap: serverMainPath,
          documentFilePath: join(browserDir, 'index.html'),
        });
        if (handler && typeof handler === 'function') {
          nodeHandler = handler;
          console.log('SSR handler created using createNodeRequestHandler(options)');
          
          app._ssrHandler = handler;
        }
      } catch (err2) {
        console.warn('createNodeRequestHandler(options) failed:', err2.message);
      }
    }
  })();
}

// Set up route handler with already-loaded handler, or use lazy loading
if (nodeHandler && typeof nodeHandler === 'function') {
  app.use((req, res, next) => {
    const handler = app._ssrHandler || nodeHandler;
    if (handler && typeof handler === 'function') {
      handler(req, res, next).catch(next);
    } else {
      next(new Error('SSR handler not available'));
    }
  });
  console.log('SSR route handler configured');
} else {
  console.warn('SSR handler not ready at startup. Will attempt lazy initialization.');
  // Lazy initialization on first request
  app.use(async (req, res, next) => {
    if (app._ssrHandler && typeof app._ssrHandler === 'function') {
      return app._ssrHandler(req, res, next).catch(next);
    }
    if (nodeHandler && typeof nodeHandler === 'function') {
      return nodeHandler(req, res, next).catch(next);
    }
    next(new Error('SSR handler not available'));
  });
}

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Angular SSR server listening on port ${port}`);
});


