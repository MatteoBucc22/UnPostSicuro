// vite.config.ts
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  server: {
    port: 4200,
    historyApiFallback: true // <- fa sì che tutte le rotte puntino a index.html
  }
});
