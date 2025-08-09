import React from 'react'
import { useNetwork } from '@txnlab/use-wallet-react'

/**
 * Shows the active network reported by use-wallet (live),
 * and optionally warns if it differs from VITE_ALGOD_NETWORK.
 */
export default function NetworkStatus() {
  const {
    activeNetwork,        // 'testnet' | 'mainnet' | 'localnet' | custom id
    activeNetworkConfig,  // includes flags like isTestnet, plus algod baseServer/port
  } = useNetwork()

  // Env target (what you *intended* to run)
  const envNetwork = (import.meta.env.VITE_ALGOD_NETWORK || 'unknown').toLowerCase()

  // Color by active network (from manager)
  const colorByNet: Record<string, string> = {
    localnet: 'bg-gray-500',
    testnet: 'bg-blue-500',
    mainnet: 'bg-green-500',
  }
  const pillColor = colorByNet[String(activeNetwork).toLowerCase()] || 'bg-gray-700'

  // Detect mismatch between env and actual active network
  const mismatch =
    envNetwork &&
    String(activeNetwork).toLowerCase() &&
    envNetwork !== String(activeNetwork).toLowerCase()

  return (
    <div className="flex items-center gap-2">
      <span
        className={`${pillColor} text-white px-3 py-1 rounded-full text-xs font-semibold uppercase shadow-md`}
        title={
          activeNetworkConfig?.algod
            ? `Algod: ${activeNetworkConfig.algod.baseServer}${activeNetworkConfig.algod.port ? `:${activeNetworkConfig.algod.port}` : ''}`
            : ''
        }
      >
        {String(activeNetwork)}
      </span>

      {/* Optional: subtle warning if env and active differ */}
      {mismatch && (
        <span
          className="bg-amber-500 text-white px-2 py-1 rounded-md text-[10px] font-semibold shadow"
          title={`Env says "${envNetwork}", wallet manager is on "${activeNetwork}"`}
        >
          ENV ≠ ACTIVE
        </span>
      )}
    </div>
  )
}
