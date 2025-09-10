import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repo = 'wt-mobile'                         // <- your repo name
const isPages = process.env.GITHUB_PAGES === 'true' // set by the Pages workflow

export default defineConfig({
  // dev => '/', GitHub Pages build => '/wt-mobile/'
  base: isPages ? `/${repo}/` : '/',
  plugins: [react()],
})
