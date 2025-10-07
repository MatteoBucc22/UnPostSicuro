// vite.config.ts
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  server: {
    port: 4200,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // backend
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '') // rimuove il prefisso /api
      }
    }
  }
});
