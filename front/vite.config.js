// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:4000',
                changeOrigin: true,
                secure: false,
              }
        }
    },
    build: {
        outDir: path.resolve(__dirname, 'dist'),
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
                manifest: path.resolve(__dirname, 'public/manifest.json'),
            },
        },
    },
});
