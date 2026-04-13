import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from "vite-plugin-eslint"

// https://vite.dev/config/
export default defineConfig({
  base: '/admin/',
  plugins: [react(), eslint()],
  server: {
    port: 3002, // Cổng bạn muốn chạy
    open: true, // Tự động mở trình duyệt
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
process.on("SIGINT", () => {
  console.log("Server stopped")
  process.exit(0)
})

