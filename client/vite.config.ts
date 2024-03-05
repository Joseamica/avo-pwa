import * as path from 'path'
//NOTE - Cambie de react a react-swc para ver si funciona y carga mas rapido
// import react from '@vitejs/plugin-react'
import react from '@vitejs/plugin-react-swc'

import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

import manifest from './manifest.json'

const getCache = ({ name, pattern }: any) => ({
  urlPattern: pattern,
  handler: 'CacheFirst' as const,
  options: {
    cacheName: name,
    expiration: {
      maxEntries: 500,
      maxAgeSeconds: 60 * 60 * 24 * 365 * 2, // 2 years
    },
    cacheableResponse: {
      statuses: [200],
    },
  },
})

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
        runtimeCaching: [
          getCache({
            pattern: /^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/avoqado-d0a24\.appspot\.com\/o\//,

            name: 'restaurant-images',
          }),
          getCache({
            pattern:
              /^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/avoqado-d0a24\.appspot\.com\/o\/1\.%20Madre%20Cafecito%2F.*\.(png|jpg|jpeg)$/,
            name: 'local-images2',
          }),
        ],
        globPatterns: ['**/*.{js,css,html}', '**/*.{svg,png,jpg,gif}'],
      },
    }),
  ],
  server: {
    // port: 5173,
    proxy: {
      '/socket.io': {
        // target: 'http://localhost:5000/',
        target: 'https://avo-pwa.onrender.com/',

        ws: true,
      },
      '/api': {
        target: 'http://localhost:5000/',
        //         target: 'https://avo-pwa.onrender.com/',

        changeOrigin: true,
        secure: false,
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
