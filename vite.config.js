import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'https://placement-protal-backend.vercel.app/',
    },
  },
  optimizeDeps: {
    include: ['react-slick'],
  },
})
