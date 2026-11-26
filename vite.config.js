import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' so the build also works when opened from a sub-folder (e.g. a preview link)
export default defineConfig({ plugins: [react()], base: './' })
