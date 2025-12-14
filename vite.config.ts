import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // If TAURI_PLATFORM env is defined, use base './', otherwise use '/Md2Design/' for GH Pages
  base: process.env.TAURI_PLATFORM ? './' : '/Md2Design/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})
