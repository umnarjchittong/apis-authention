import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), basicSsl()],
  base: '/authention',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },
  server: {
    https: true,
    port: 3030,
    open: true,
    watch: {
      usePolling: true,
      ignored: ['!**/*.{js,jsx,ts,tsx,css}'],
    },
    hmr: {
      overlay: true,
      protocol: 'wss',
      host: 'localhost',
      port: 3030,
    },
  },
})
