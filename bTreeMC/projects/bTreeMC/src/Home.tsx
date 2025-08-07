import { useWallet } from '@txnlab/use-wallet-react'
import React, { useState } from 'react'
import ConnectWallet from './components/ConnectWallet'
import Transact from './components/Transact'
import NFTmint from './components/NFTmint' // ✅ NEW

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openDemoModal, setOpenDemoModal] = useState<boolean>(false)
  const [showBuildingMessage, setShowBuildingMessage] = useState<boolean>(false)

  // Visitor Pass UX
  const [showVisitorPassMessage, setShowVisitorPassMessage] = useState<boolean>(false)
  const [openNftModal, setOpenNftModal] = useState<boolean>(false) // ✅ NEW

  const { activeAddress } = useWallet()

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal)
  }

  const toggleDemoModal = () => {
    setOpenDemoModal(!openDemoModal)
  }

  const handleStartBuilding = () => {
    setShowBuildingMessage(true)
    setTimeout(() => {
      setShowBuildingMessage(false)
    }, 3000)
  }

  // Open the NFT mint modal (or prompt wallet connect first)
  const handleGetVisitorPass = () => {
    // nice little toast for instant feedback
    setShowVisitorPassMessage(true)
    setTimeout(() => setShowVisitorPassMessage(false), 1500)

    if (!activeAddress) {
      // if wallet not connected, prompt connect first
      setOpenWalletModal(true)
      return
    }
    setOpenNftModal(true) // ✅ open NFTmint modal
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header Section */}
          <div className="mb-12">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-4xl font-bold text-white">bT</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">bTree</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Run powerful Economics Experiments on the Algorand Blockchain. <br />
              Design, test, and analyze economic models using 'Smart Contracts'. <br />
              Recruit participants, execute transactions, and visualize results with ease.
              Store your experiments on the Algorand blockchain, ensuring transparency and security.
            </p>

            {/* Get Visitor Pass button */}
            <button
              type="button"
              data-test-id="get-visitor-pass"
              onClick={handleGetVisitorPass}
              className="mt-6 inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white
                         bg-gradient-to-r from-blue-600 to-purple-600 shadow-md hover:shadow-lg
                         hover:from-blue-700 hover:to-purple-700 transition-all focus:outline-none focus:ring-2
                         focus:ring-offset-2 focus:ring-purple-500"
              aria-label="Get Visitor Pass"
            >
              Get Visitor Pass
            </button>
          </div>

          {/* Action Buttons Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Connect Wallet Button */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Connect Wallet</h3>
              <p className="text-gray-600 text-sm mb-4">Connect your Algorand wallet to get started</p>
              <button
                data-test-id="connect-wallet"
                onClick={toggleWalletModal}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                {activeAddress ? 'Wallet Connected' : 'Connect Wallet'}
              </button>
            </div>

            {/* Send Payments Button */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💸</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Join Today</h3>
              <p className="text-gray-600 text-sm mb-4">Join Economists on Algorand</p>
              <button
                data-test-id="transactions-demo"
                onClick={toggleDemoModal}
                disabled={!activeAddress}
                className={`w-full font-medium py-3 px-6 rounded-lg transition-colors ${
                  activeAddress
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Send <br />Payment
              </button>
            </div>

            {/* Start Building Button */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Build Experiment</h3>
              <p className="text-gray-600 text-sm mb-4">Create your economic experiment</p>
              <button
                onClick={handleStartBuilding}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Start Building Your Experiment
              </button>
            </div>
          </div>

          {/* Success Message */}
          {showBuildingMessage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-8 shadow-2xl max-w-md mx-4 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Success!</h3>
                <p className="text-gray-600">Going to the Building Page</p>
              </div>
            </div>
          )}

          {/* Transient toast for visitor pass */}
          {showVisitorPassMessage && (
            <div
              role="status"
              aria-live="polite"
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
            >
              <div className="bg-white border border-indigo-100 rounded-lg shadow-lg px-5 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm">🎟️</div>
                  <span className="text-gray-800 font-semibold">Opening Visitor Pass…</span>
                </div>
              </div>
            </div>
          )}

          {/* Getting Started Link */}
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Need Help Getting Started?</h3>
            <a
              data-test-id="getting-started"
              className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors"
              target="_blank"
              href="https://github.com/algorandfoundation/algokit-cli"
              rel="noopener noreferrer"
            >
              View Documentation
            </a>
          </div>
        </div>

        {/* Modals */}
        <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
        <Transact openModal={openDemoModal} setModalState={setOpenDemoModal} />
        <NFTmint openModal={openNftModal} setModalState={setOpenNftModal} /> {/* ✅ NEW */}
      </div>
    </div>
  )
}

export default Home
