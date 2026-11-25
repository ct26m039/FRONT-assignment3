import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'VibeConnect App',
        short_name: 'VCApp',
        start_url: '/FRONT-assignment3/',
        description: 'The Only Conference App You Need',
        theme_color: '#850c54',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [

        ]
      }
    })
  ],
  base: '/FRONT-assignment3/'
})
