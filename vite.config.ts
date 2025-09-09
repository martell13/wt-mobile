import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repo = 'wt-mobile'                // <-- your repo name
const isPages = process.env.GITHUB_PAGES === 'true' // set only in CI

export default defineConfig({
  base: isPages ? `/${repo}/` : '/',    // dev => '/', Pages => '/wt-mobile/'
  plugins: [react()],
})
