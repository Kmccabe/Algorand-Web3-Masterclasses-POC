/**
 * Logs environment info in both build-time (Vite compile) and runtime.
 * Build-time: shows in Vercel build logs.
 * Runtime: only runs in local dev or Vercel preview.
 */
export function debugViteEnv() {
  const mode = import.meta.env.MODE
  const vercelEnv = import.meta.env.VERCEL_ENV // 'development' | 'preview' | 'production'

  // ===== Build-time banner =====
  // This prints during the Vite compile (visible in Vercel build logs)
  console.log(
    `\n🛠️ [Build-time] VITE_ALGOD_NETWORK=${
      import.meta.env.VITE_ALGOD_NETWORK || '(unset)'
    } | MODE=${mode} | VERCEL_ENV=${vercelEnv || '(not set)'}\n`,
  )

  // ===== Runtime validation policy (preview warns, production optional) =====
  const mustCheck = vercelEnv === 'preview' || vercelEnv === 'production'
  if (mustCheck) {
    const miss = (k: string) => {
      const v = import.meta.env[k as keyof ImportMetaEnv]
      return !v || String(v).trim() === ''
    }

    const required = ['VITE_ALGOD_NETWORK', 'VITE_ALGOD_SERVER', 'VITE_INDEXER_SERVER']
    const missing = required.filter(miss)

    if (import.meta.env.VITE_ALGOD_NETWORK === 'localnet') {
      missing.push(...['VITE_KMD_SERVER', 'VITE_KMD_PORT', 'VITE_KMD_TOKEN'].filter(miss))
    }

    if (missing.length) {
      const msg = `ENV VALIDATION ${vercelEnv?.toUpperCase()}: Missing ${missing.join(', ')}`
      if (vercelEnv === 'production') {
        // You can switch this to console.warn if you don't want prod to blow up at runtime
        throw new Error(msg)
      } else {
        console.warn(msg)
      }
    }
  }

  // ===== Runtime logging (dev or preview only) =====
  if (
    mode !== 'development' &&
    vercelEnv !== 'preview' &&
    vercelEnv !== undefined // allow local dev without Vercel vars
  ) {
    return
  }

  const mask = (val?: string) => {
    if (!val) return '(empty)'
    if (val.length <= 8) return '********'
    return `${val.slice(0, 4)}…${val.slice(-4)}`
  }

  const envVars = {
    MODE: mode,
    VERCEL_ENV: vercelEnv || '(not on Vercel)',
    VITE_ALGOD_NETWORK: import.meta.env.VITE_ALGOD_NETWORK,
    VITE_ALGOD_SERVER: import.meta.env.VITE_ALGOD_SERVER,
    VITE_ALGOD_PORT: import.meta.env.VITE_ALGOD_PORT || '(empty)',
    VITE_ALGOD_TOKEN: mask(import.meta.env.VITE_ALGOD_TOKEN),

    VITE_INDEXER_SERVER: import.meta.env.VITE_INDEXER_SERVER,
    VITE_INDEXER_PORT: import.meta.env.VITE_INDEXER_PORT || '(empty)',
    VITE_INDEXER_TOKEN: mask(import.meta.env.VITE_INDEXER_TOKEN),

    VITE_KMD_SERVER: import.meta.env.VITE_KMD_SERVER || '(empty)',
    VITE_KMD_PORT: import.meta.env.VITE_KMD_PORT || '(empty)',
    VITE_KMD_TOKEN: mask(import.meta.env.VITE_KMD_TOKEN),
    VITE_KMD_WALLET: import.meta.env.VITE_KMD_WALLET || '(empty)',
    VITE_KMD_PASSWORD: mask(import.meta.env.VITE_KMD_PASSWORD),
  }

  console.log('--- [Runtime] Vite Environment Variables ---')
  for (const [key, value] of Object.entries(envVars)) {
    console.log(`${key}: ${value}`)
  }
  console.log('--------------------------------------------')
}
