import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the same build works from a custom domain, a GitHub Pages
  // project page (/portfolio/) or the user page (/).
  base: './',
  plugins: [react(), tailwindcss()],
})
