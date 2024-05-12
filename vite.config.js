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
      pages: [
        {
          entry: 'src/main.js',
          filename: 'index.html',
          template: 'index.html',
        },
        {
          entry: '404.html',
          filename: '404.html',
          template: 'public/404.html',
          injectOptions: {
            data: {
              BASE_URL: BASE_URL
            }
          }
        }
      ],
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
