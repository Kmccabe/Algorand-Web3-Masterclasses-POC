import { AlgoViteClientConfig, AlgoViteKMDConfig } from '../../interfaces/network'

const getEnv = (key: string) => (import.meta.env[key as keyof ImportMetaEnv] as string | undefined)?.toString().trim() ?? ''

const req = (key: string) => {
  const v = getEnv(key)
  if (!v) throw new Error(`Missing required env var: ${key}`)
  return v
}

const normalizeServer = (url: string) => url.replace(/\/+$/, '')

export function getAlgodConfigFromViteEnvironment(): AlgoViteClientConfig {
  const network = req('VITE_ALGOD_NETWORK') // 'localnet' | 'testnet' | 'mainnet'
  const server = normalizeServer(req('VITE_ALGOD_SERVER'))

  // Interface requires string|number and string; use '' when unset
  const port = getEnv('VITE_ALGOD_PORT') || ''
  const token = getEnv('VITE_ALGOD_TOKEN') || ''

  return { server, port, token, network }
}

export function getIndexerConfigFromViteEnvironment(): AlgoViteClientConfig {
  const server = normalizeServer(req('VITE_INDEXER_SERVER'))
  const port = getEnv('VITE_INDEXER_PORT') || ''
  const token = getEnv('VITE_INDEXER_TOKEN') || ''
  const network = req('VITE_ALGOD_NETWORK')
  return { server, port, token, network }
}

export function getKmdConfigFromViteEnvironment(): AlgoViteKMDConfig {
  const network = req('VITE_ALGOD_NETWORK')
  if (network !== 'localnet') {
    throw new Error('KMD configuration requested but VITE_ALGOD_NETWORK is not "localnet"')
  }

  const server = normalizeServer(req('VITE_KMD_SERVER'))
  const port = req('VITE_KMD_PORT')
  const token = req('VITE_KMD_TOKEN')
  const wallet = getEnv('VITE_KMD_WALLET') || 'unencrypted-default-wallet'
  const password = getEnv('VITE_KMD_PASSWORD') || ''

  return { server, port, token, wallet, password }
}
