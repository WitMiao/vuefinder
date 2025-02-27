import vue3 from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export const viteVue3Config = defineConfig({
  plugins: [vue3()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://tech.int.hypergryph.com/api/api',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(new RegExp(`^/api`), ''),
      },
      '/uploads': {
        target: 'https://tech.int.hypergryph.com/uploads',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(new RegExp(`^/uploads`), ''),
      },
    },
  },
});

export default viteVue3Config;
