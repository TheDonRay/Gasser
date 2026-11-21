import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Forward /api/* to the Express backend so the API key never touches the browser
    proxy: {
      '/api': 'http://localhost:9989',
    },
  },
})
