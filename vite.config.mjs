import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
  cacheDir: '.vite-cache',
  css: { postcss: { plugins: [] } },
})
