import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Enable HMR polling, necessary for Docker environments
    watch: {
      usePolling: true,
    },
    host: true, // Ensures the server is accessible externally
    strictPort: true,     // Prevents Vite from switching ports if the specified one is in use
    port: 5173, // Port on which Vite will run
    hmr: {
      clientPort: 5173, // Ensure HMR communicates on the correct port
    },
  },
})
