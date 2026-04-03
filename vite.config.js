import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'https://placement-protal-backend.vercel.app',
      // '/api': 'http://localhost:8080',
    },
  },
  optimizeDeps: {
    include: ['react-slick'],
  },
})
