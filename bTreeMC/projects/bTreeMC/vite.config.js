// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Optional: keep if you need Buffer, etc.
// import { nodePolyfills } from 'vite-plugin-node-polyfills'

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

      // Always need to know which network we’re targeting
      const missing = []
      if (miss('VITE_ALGOD_NETWORK')) missing.push('VITE_ALGOD_NETWORK')

      // If user explicitly sets a custom Indexer, require its server
      // (port/token can be empty for public nodes)
      if (get('VITE_INDEXER_SERVER') && miss('VITE_INDEXER_SERVER')) {
        missing.push('VITE_INDEXER_SERVER')
      }

      // If deploying LOCALNET (rare on Vercel), enforce KMD vars
      if (get('VITE_ALGOD_NETWORK') === 'localnet') {
        if (miss('VITE_KMD_SERVER')) missing.push('VITE_KMD_SERVER')
        if (miss('VITE_KMD_PORT')) missing.push('VITE_KMD_PORT')
        if (miss('VITE_KMD_TOKEN')) missing.push('VITE_KMD_TOKEN')
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
  plugins: [
    react(),
    // nodePolyfills({ globals: { Buffer: true } }),
    validateViteEnv(),
  ],
  define: {
    global: 'globalThis', // Polyfill Node's `global`
    'process.env': {},    // Polyfill empty process.env
  },
})
