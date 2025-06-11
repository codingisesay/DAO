import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const useHttps = env.USE_HTTPS === 'true'

  return {
    plugins: [react()],
    server: {
      https: useHttps
        ? {
            key: fs.readFileSync(path.resolve(__dirname, './cert.key')),
            cert: fs.readFileSync(path.resolve(__dirname, './cert.crt')),
          }
        : false,
      host: true,
    },
  }
})
