import { useWallet } from '@txnlab/use-wallet-react'
import React, { useState } from 'react'
import ConnectWallet from './components/ConnectWallet'
import Transact from './components/Transact'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openDemoModal, setOpenDemoModal] = useState<boolean>(false)
  const [showBuildingMessage, setShowBuildingMessage] = useState<boolean>(false)
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
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Subscribe Today</h3>
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
      </div>
    </div>
  )
}

export default Home
