import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), sentryVitePlugin({
    org: "jsm-dyd",
    project: "javascript-react"
  })],

  build: {
    sourcemap: true
  }
})
