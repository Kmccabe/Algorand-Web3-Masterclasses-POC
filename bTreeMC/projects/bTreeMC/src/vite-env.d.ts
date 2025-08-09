/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ALGOD_NETWORK: 'localnet' | 'testnet' | 'mainnet'
  readonly VITE_ALGOD_SERVER: string
  readonly VITE_ALGOD_PORT?: string
  readonly VITE_ALGOD_TOKEN?: string

  readonly VITE_INDEXER_SERVER?: string
  readonly VITE_INDEXER_PORT?: string
  readonly VITE_INDEXER_TOKEN?: string

  readonly VITE_KMD_SERVER?: string
  readonly VITE_KMD_PORT?: string
  readonly VITE_KMD_TOKEN?: string
  readonly VITE_KMD_WALLET?: string
  readonly VITE_KMD_PASSWORD?: string

  readonly VERCEL_ENV?: 'development' | 'preview' | 'production'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
