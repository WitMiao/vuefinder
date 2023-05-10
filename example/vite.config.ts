import vue3 from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export const viteVue3Config = defineConfig({
  plugins: [vue3()],
  server: {
    port: 3000,
    proxy: {
      '/uploads': {
        target: 'http://10.154.0.59:8888/uploads',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(new RegExp(`^/uploads`), ''),
      },
    },
  },
});

export default viteVue3Config;
