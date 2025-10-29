import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // We have REMOVED the "css: { ... }" block
  // because it conflicts with postcss.config.js
})