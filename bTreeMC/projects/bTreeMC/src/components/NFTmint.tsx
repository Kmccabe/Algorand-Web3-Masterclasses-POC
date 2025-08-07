// src/components/NFTmint.tsx
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import React, { useMemo, useState } from 'react'
import { sha512_256 } from 'js-sha512'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

interface NFTmintProps {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const NFTmint: React.FC<NFTmintProps> = ({ openModal, setModalState }) => {
  const [metadataUrlInput, setMetadataUrlInput] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const { enqueueSnackbar } = useSnackbar()
  const { transactionSigner, activeAddress } = useWallet()

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algorand = useMemo(() => AlgorandClient.fromConfig({ algodConfig }), [algodConfig])

  const closeModal = () => setModalState(false)

  const ensureArc3Url = (url: string) => {
    // ARC-3 convention suggests appending #arc3 to the ASA URL.
    // We'll add it if it's not already present to be beginner-friendly.
    if (!url) return url
    return url.includes('#arc3') ? url : `${url}#arc3`
  }

  const isValidUrl = (value: string) => {
    try {
      // Allow ipfs:// and http(s)://. Users said they host via Pinata (http(s)/ipfs gateway).
      if (value.startsWith('ipfs://')) return true
      const u = new URL(value)
      return ['http:', 'https:'].includes(u.protocol)
    } catch {
      return false
    }
  }

  const canMint = metadataUrlInput.trim().length > 0 && isValidUrl(metadataUrlInput.trim())

  const handleMint = async () => {
    if (!transactionSigner || !activeAddress) {
      enqueueSnackbar('Please connect your wallet first.', { variant: 'warning' })
      return
    }
    if (!canMint) {
      enqueueSnackbar('Please provide a valid metadata URL (ipfs:// or https://).', { variant: 'warning' })
      return
    }

    setLoading(true)
    const rawUrl = metadataUrlInput.trim()
    const metadataUrl = ensureArc3Url(rawUrl)

    try {
      enqueueSnackbar('Submitting NFT create transaction…', { variant: 'info' })

      // Compute SHA-512/256 hash bytes of the provided URL (beginner-friendly as requested).
      // Note: ARC-3 typically hashes the JSON metadata CONTENT, not the URL.
      // We follow your requested logic and hash the URL string.
      const hashBytes = new Uint8Array(sha512_256.array(rawUrl))

      const result = await algorand.send.assetCreate({
        sender: activeAddress,
        signer: transactionSigner,
        total: 1n,                 // NFT: total supply 1
        decimals: 0,               // NFT: 0 decimals
        assetName: 'bTree Visitor Ticket',
        unitName: 'MTK',
        url: metadataUrl,          // ARC-3 URL (with #arc3 appended if missing)
        metadataHash: hashBytes,   // 32-byte SHA-512/256 digest
        defaultFrozen: false,
      })

      // Show tx id; asset id is available after confirmation, which algokit handles under the hood.
      enqueueSnackbar(`NFT create transaction sent! TxID: ${result.txIds[0]}`, { variant: 'success' })
      setMetadataUrlInput('')
      closeModal()
    } catch (e: any) {
      console.error(e)
      enqueueSnackbar(
        typeof e?.message === 'string' ? `Failed to mint NFT: ${e.message}` : 'Failed to mint NFT.',
        { variant: 'error' }
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <dialog
      id="nft_mint_modal"
      className={`modal ${openModal ? 'modal-open' : ''} bg-slate-200`}
    >
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Mint your bTree Visitor NFT</h3>
        <p className="text-sm text-slate-600 mt-2">
          Paste the URL to your metadata (from Pinata/IPFS). We’ll use your connected wallet to mint a 1/1 NFT.
        </p>

        <div className="mt-4">
          <label htmlFor="metadataUrl" className="label">
            <span className="label-text">Metadata URL</span>
          </label>
          <input
            id="metadataUrl"
            type="text"
            placeholder="e.g. https://gateway.pinata.cloud/ipfs/Qm.../metadata.json"
            className="input input-bordered w-full"
            value={metadataUrlInput}
            onChange={(e) => setMetadataUrlInput(e.target.value)}
            data-test-id="metadata-url"
          />
          <div className="mt-2 text-xs text-slate-500">
            Tip: If you’re using ARC‑3 metadata, the URL usually ends with <code>#arc3</code>. We’ll add it for you if missing.
          </div>
        </div>

        <div className="modal-action">
          <button className="btn" onClick={closeModal}>
            Close
          </button>
          <button
            className={`btn ${canMint ? '' : 'btn-disabled'}`}
            onClick={handleMint}
            data-test-id="mint-nft"
          >
            {loading ? <span className="loading loading-spinner" /> : 'Mint NFT'}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default NFTmint
