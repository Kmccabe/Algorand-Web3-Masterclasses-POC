import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function validateViteEnv() {
  return {
    name: 'validate-vite-env',
    apply: 'build',
    configResolved() {
      const vercelEnv = process.env.VERCEL_ENV // 'development' | 'preview' | 'production'
      const isVercel = process.env.VERCEL === '1' || !!vercelEnv
      if (!isVercel) return

      const get = (k) => (process.env[k] ?? '').trim()
      const miss = (k) => get(k) === ''

      const required = ['VITE_ALGOD_NETWORK', 'VITE_ALGOD_SERVER', 'VITE_INDEXER_SERVER']
      const missing = required.filter(miss)

      if (get('VITE_ALGOD_NETWORK') === 'localnet') {
        missing.push(...['VITE_KMD_SERVER', 'VITE_KMD_PORT', 'VITE_KMD_TOKEN'].filter(miss))
      }

      if (!missing.length) return

      const msg = `[ENV] Missing required vars: ${missing.join(', ')}`
      if (vercelEnv === 'production') {
        throw new Error(msg) // ❌ fail prod builds
      } else {
        console.warn(msg) // ⚠️ warn on preview
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), validateViteEnv()],
})
