import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      vue(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest,json}'],
        runtimeCaching: [
          {
            // Cache-First für Session- und Speaker-Daten 
            urlPattern: ({ url }) => url.pathname.endsWith('.json'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'conference-data-cache',

              //Verhindert, dass der Cache unendlich wächst oder veraltete Daten ewig liegen bleiben.
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 7
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      
      manifest: {
        name: 'VibeConnect App',
        short_name: 'VCApp',
        start_url: '/FRONT-assignment3/',
        description: 'The Only Conference App You Need',
        theme_color: '#850c54',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/FRONT-assignment3/',
        id: '/FRONT-assignment3/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      }
    })
  ],
  base: '/FRONT-assignment3/'
})
