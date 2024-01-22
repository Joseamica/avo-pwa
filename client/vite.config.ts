import * as path from 'path'
//NOTE - Cambie de react a react-swc para ver si funciona y carga mas rapido
// import react from '@vitejs/plugin-react'
import react from '@vitejs/plugin-react-swc'

import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

import manifest from './manifest.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest,
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html}', '**/*.{svg,png,jpg,gif}'],
      },
    }),
  ],
  server: {
    proxy: {
      '/socket.io': {
        target: 'http://localhost:5000/',
        ws: true,
      },
      '/api': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
