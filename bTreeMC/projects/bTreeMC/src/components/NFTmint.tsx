// src/components/NFTmint.tsx
import React, { useMemo, useState } from 'react'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { sha512_256 } from 'js-sha512'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

interface NFTmintProps {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const MAX_ASA_URL_BYTES = 96

// Count bytes (Algorand enforces byte length, not string length)
const byteLen = (s: string) => new TextEncoder().encode(s).length

// Normalize to ARC-3-friendly, short URL:
//  - Convert common HTTP(S) gateways to ipfs://
//  - Append #arc3 if missing
//  - If still too long and ends with /metadata.json, drop that suffix
const toArc3Url96 = (raw: string) => {
  let url = raw.trim()

  // Normalize well-known gateways
  url = url
    .replace(/^https?:\/\/gateway\.pinata\.cloud\/ipfs\//i, 'ipfs://')
    .replace(/^https?:\/\/(?:[^/]+\.)?mypinata\.cloud\/ipfs\//i, 'ipfs://')
    .replace(/^https?:\/\/ipfs\.io\/ipfs\//i, 'ipfs://')
    .replace(/^https?:\/\/cloudflare-ipfs\.com\/ipfs\//i, 'ipfs://')

  // If someone pasted a directory CID followed by a file, keep it;
  // we'll conditionally trim metadata.json below.

  // Add ARC-3 tag if missing
  if (!url.includes('#arc3')) url += '#arc3'

  // If too long, try removing `/metadata.json` right before the hash/end
  if (byteLen(url) > MAX_ASA_URL_BYTES) {
    url = url.replace(/\/metadata\.json(?=(#|$))/i, '')
  }

  return url
}

// Basic sanity check for inputs we accept
const looksLikeIpfsOrHttp = (value: string) => {
  if (!value) return false
  if (value.startsWith('ipfs://')) return true
  try {
    const u = new URL(value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

const NFTmint: React.FC<NFTmintProps> = ({ openModal, setModalState }) => {
  const [metadataUrlInput, setMetadataUrlInput] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const { enqueueSnackbar } = useSnackbar()
  const { transactionSigner, activeAddress } = useWallet()

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algorand = useMemo(() => AlgorandClient.fromConfig({ algodConfig }), [algodConfig])

  const closeModal = () => setModalState(false)

  const raw = metadataUrlInput.trim()
  const normalized = raw ? toArc3Url96(raw) : ''
  const normalizedBytes = normalized ? byteLen(normalized) : 0
  const canMint =
    !!activeAddress &&
    !!transactionSigner &&
    looksLikeIpfsOrHttp(raw) &&
    normalizedBytes > 0 &&
    normalizedBytes <= MAX_ASA_URL_BYTES

  const handleMint = async () => {
    if (!transactionSigner || !activeAddress) {
      enqueueSnackbar('Please connect your wallet first.', { variant: 'warning' })
      return
    }
    if (!looksLikeIpfsOrHttp(raw)) {
      enqueueSnackbar('Please provide a valid metadata URL (ipfs:// or https://).', { variant: 'warning' })
      return
    }

    const metadataUrl = toArc3Url96(raw)
    const len = byteLen(metadataUrl)
    if (len > MAX_ASA_URL_BYTES) {
      enqueueSnackbar(
        `ASA URL is too long (${len}/${MAX_ASA_URL_BYTES}). Use a shorter ipfs:// CID or pin the JSON file directly.`,
        { variant: 'error' }
      )
      return
    }

    setLoading(true)
    try {
      enqueueSnackbar('Submitting NFT create transaction…', { variant: 'info' })

      // NOTE: For strict ARC-3, metadataHash should be the SHA-512/256 of the *file contents*.
      // This demo follows your requested logic: hash the *input URL string* for simplicity.
      const hashBytes = new Uint8Array(sha512_256.array(raw))

      const result = await algorand.send.assetCreate({
        sender: activeAddress,
        signer: transactionSigner,
        total: 1n,
        decimals: 0,
        assetName: 'bTree Visitor Ticket',
        unitName: 'MTK',
        url: metadataUrl,        // guaranteed ≤ 96 bytes
        metadataHash: hashBytes, // 32-byte SHA-512/256 digest of the *URL string*
        defaultFrozen: false,
      })

      enqueueSnackbar(`NFT mint submitted! TxID: ${result.txIds[0]}`, { variant: 'success' })
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
          Paste the URL to your metadata (Pinata/IPFS). We’ll normalize it to <code>ipfs://…#arc3</code> and keep it within Algorand’s 96‑byte limit.
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

          {/* Preview & length */}
          {raw && (
            <div className="mt-2 text-xs text-slate-600">
              <div className="truncate">
                <span className="font-semibold">Normalized:</span> <code>{normalized || '—'}</code>
              </div>
              <div>
                Length: <span className={`${normalizedBytes <= MAX_ASA_URL_BYTES ? 'text-green-600' : 'text-red-600'}`}>
                  {normalizedBytes}
                </span>
                /{MAX_ASA_URL_BYTES} bytes
              </div>
            </div>
          )}
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
