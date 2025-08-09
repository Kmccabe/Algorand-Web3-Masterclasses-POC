// src/App.tsx
import { NetworkId, WalletId, WalletManager, WalletProvider } from '@txnlab/use-wallet-react'
import { SnackbarProvider } from 'notistack'
import Home from './Home'

// Determine network from env (.env.local for localhost → TestNet)
const network = (import.meta.env.VITE_ALGOD_NETWORK || 'testnet') as 'localnet' | 'testnet' | 'mainnet'
const isLocalnet = network === 'localnet'

// Wallets to enable
// - Localnet: only KMD
// - TestNet/MainNet: Pera, Lute, Defly
const wallets = isLocalnet ? [WalletId.KMD] : [WalletId.PERA, WalletId.LUTE, WalletId.DEFLY]

// Construct the WalletManager
const walletManager = new WalletManager({
  wallets,
  defaultNetwork: network === 'mainnet' ? NetworkId.MAINNET : network === 'localnet' ? NetworkId.LOCALNET : NetworkId.TESTNET,
  // Using built-in network configs for TestNet/MainNet
})

export default function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <WalletProvider manager={walletManager}>
        <Home />
      </WalletProvider>
    </SnackbarProvider>
  )
}
