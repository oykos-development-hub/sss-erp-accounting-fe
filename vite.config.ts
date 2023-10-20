import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default ({mode}) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  return defineConfig({
    base: '/',
    plugins: [],
    server: {
      port: process.env.VITE_PORT,
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: 'assets/main.js',
          chunkFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name].[ext]',
          manualChunks: undefined, // Disable manual chunks
        },
      },
    },
  });
};
