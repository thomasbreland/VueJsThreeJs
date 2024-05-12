import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createHtmlPlugin } from 'vite-plugin-html';

// allow base URL to be set by environment, e.g., during pipeline, for deploying to GitHub Pages subdirectory
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.GH_PAGES_BASE_URL : '/';

// https://vitejs.dev/config/
export default defineConfig({
  base: BASE_URL,

  plugins: [
    vue(),
    createHtmlPlugin({
      inject: {
        data: {
          BASE_URL: encodeURIComponent(BASE_URL)
        }
      },
      template: 'public/404.html'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
