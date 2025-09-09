import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repo = 'wt-mobile' // <-- your repo name

export default defineConfig({
  // Use base path only in production (for GitHub Pages)
  base: process.env.NODE_ENV === 'production' ? `/${repo}/` : '/',
  plugins: [react()],
})

