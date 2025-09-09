import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // 👇 use your repo name here
  base: '/wt-mobile/',
  plugins: [react()],
})
