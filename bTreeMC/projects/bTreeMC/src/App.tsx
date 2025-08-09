import { SupportedWallet, WalletId, WalletManager, WalletProvider } from '@txnlab/use-wallet-react'
// src/App.tsx
import { SnackbarProvider } from 'notistack'
import { WalletProvider, type SupportedWallet } from '@txnlab/use-wallet-react'
import Home from './Home'
import { getAlgodConfigFromViteEnvironment, getKmdConfigFromViteEnvironment } from './utils/network/getAlgoClientConfigs'

const isLocalnet = import.meta.env.VITE_ALGOD_NETWORK === 'localnet'

let supportedWallets: SupportedWallet[] = []
if (isLocalnet) {
  const kmd = getKmdConfigFromViteEnvironment()
  supportedWallets = [
    {
      id: 'kmd',
      name: 'KMD',
      installURL: '',
      icon: '', // optional
      providerId: 'kmd',
      options: {
        kmdServer: kmd.server,
        kmdPort: kmd.port,
        kmdToken: kmd.token,
        wallet: kmd.wallet, // name
        password: kmd.password
      }
    }
  ]
}

// On TestNet/MainNet you’ll rely on Pera/Lute/etc. (no KMD in the browser)
export default function App() {
  const algod = getAlgodConfigFromViteEnvironment()
  return (
    <SnackbarProvider maxSnack={3}>
      <WalletProvider
        algod={{
          server: algod.server,
          port: algod.port,
          token: algod.token
        }}
        supportedWallets={supportedWallets}
      >
        <Home />
      </WalletProvider>
    </SnackbarProvider>
  )
}
