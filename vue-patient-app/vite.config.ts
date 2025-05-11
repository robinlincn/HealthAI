import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/vue-patient-app/', // Set the base path for the application
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 9003, // Specify port for Vue app
    host: '0.0.0.0', // Listen on all network interfaces
  },
})
