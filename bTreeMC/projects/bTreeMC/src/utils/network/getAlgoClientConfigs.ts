import { AlgoViteClientConfig, AlgoViteKMDConfig } from '../../interfaces/network'

/** Safe env getter (Vite exposes only keys starting with VITE_) */
const getEnv = (key: string) => {
  const raw = import.meta.env[key as keyof ImportMetaEnv] as unknown as string | undefined
  return typeof raw === 'string' ? raw.trim() : ''
}

/** Required env getter with helpful error */
const req = (key: string) => {
  const v = getEnv(key)
  if (!v) throw new Error(`[env] Missing required env var: ${key}`)
  return v
}

const normalizeServer = (url: string) => url.replace(/\/+$/, '')

export function getAlgodConfigFromViteEnvironment(): AlgoViteClientConfig {
  const network = req('VITE_ALGOD_NETWORK') // 'localnet' | 'testnet' | 'mainnet'
  const server = normalizeServer(req('VITE_ALGOD_SERVER'))
  const port = getEnv('VITE_ALGOD_PORT') || ''   // Algonode keeps this empty
  const token = getEnv('VITE_ALGOD_TOKEN') || '' // Algonode keeps this empty
  return { server, port, token, network }
}

/**
 * Make indexer optional: if not fully configured, return a minimal object or throw
 * depending on how your caller uses it. Here we return null so callers can branch.
 */
export function getIndexerConfigFromViteEnvironment(): AlgoViteClientConfig | null {
  const server = getEnv('VITE_INDEXER_SERVER')
  if (!server) return null
  const network = req('VITE_ALGOD_NETWORK')
  const port = getEnv('VITE_INDEXER_PORT') || ''
  const token = getEnv('VITE_INDEXER_TOKEN') || ''
  return { server: normalizeServer(server), port, token, network }
}

export function getKmdConfigFromViteEnvironment(): AlgoViteKMDConfig {
  const network = req('VITE_ALGOD_NETWORK')
  if (network !== 'localnet') {
    throw new Error('[env] KMD config requested but VITE_ALGOD_NETWORK !== "localnet"')
  }
  const server = normalizeServer(req('VITE_KMD_SERVER'))
  const port = req('VITE_KMD_PORT')
  const token = req('VITE_KMD_TOKEN')
  const wallet = getEnv('VITE_KMD_WALLET') || 'unencrypted-default-wallet'
  const password = getEnv('VITE_KMD_PASSWORD') || ''
  return { server, port, token, wallet, password }
}
