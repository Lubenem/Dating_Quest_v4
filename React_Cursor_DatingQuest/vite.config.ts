import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Dating_Quest_v4/React_Cursor_DatingQuest/Build/',
  build: {
    outDir: 'Build',
  },
})
