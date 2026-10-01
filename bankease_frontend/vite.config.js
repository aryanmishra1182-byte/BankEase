import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/users': 'http://localhost:8080',
      '/login': 'http://localhost:8080',
      '/accounts': 'http://localhost:8080',
      '/transactions': 'http://localhost:8080',
      '/billers': 'http://localhost:8080',
      '/bills': 'http://localhost:8080',
      '/loans': 'http://localhost:8080',
      '/admin': 'http://localhost:8080'
    }
  }
})
