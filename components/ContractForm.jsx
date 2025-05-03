"use client";
import { useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import TrustFundABI from "../abi/TrustFundABI.json";
import DepositInterface from "./DepositInterface";

export default function ContractForm() {
  const [formData, setFormData] = useState({
    title: "",
    recipientAddress: "",
    amount: "",
    useConnectedWallet: false
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedContract, setDeployedContract] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsDeploying(true);
      
      if (!window.ethereum) throw new Error("Please install MetaMask wallet");
      if (!formData.title.trim()) throw new Error("Contract title is required");
      
      const amount = Number(formData.amount);
      if (isNaN(amount)) throw new Error("Please enter a valid number");
      if (amount <= 0) throw new Error("Amount must be greater than 0");

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const buyerAddress = await signer.getAddress();
      const sellerAddress = formData.useConnectedWallet ? buyerAddress : formData.recipientAddress;

      if (!formData.useConnectedWallet && !ethers.isAddress(sellerAddress)) {
        throw new Error("Invalid recipient address");
      }

      const factory = new ethers.ContractFactory(
        TrustFundABI.abi,
        TrustFundABI.bytecode,
        signer
      );
      
      const contract = await factory.deploy(buyerAddress, sellerAddress);
      await contract.waitForDeployment();

      // Store contract details
      const newContract = {
        title: formData.title,
        buyer: buyerAddress,
        seller: sellerAddress,
        amount: formData.amount,
        deployedAt: new Date().toISOString(),
        state: "AWAITING_PAYMENT",
        address: contract.target
      };

      const existingContracts = JSON.parse(localStorage.getItem('deployedContracts') || '[]');
      localStorage.setItem('deployedContracts', JSON.stringify([...existingContracts, newContract]));

      setDeployedContract(newContract);
      setFormData({ 
        title: "", 
        recipientAddress: "", 
        amount: "", 
        useConnectedWallet: false 
      });
    } catch (error) {
      alert(error.message);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleDepositSuccess = () => {
    // Update contract state in localStorage
    const contracts = JSON.parse(localStorage.getItem('deployedContracts') || []);
    const updatedContracts = contracts.map(contract => 
      contract.address === deployedContract.address 
        ? { ...contract, state: "FUNDED" } 
        : contract
    );
    localStorage.setItem('deployedContracts', JSON.stringify(updatedContracts));
    
    // Reset state and refresh
    setDeployedContract(null);
    router.refresh();
  };

  if (deployedContract) {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-primary-dark">
          Fund the Escrow Contract
        </h2>
        <DepositInterface
          contractAddress={deployedContract.address}
          contractAmount={deployedContract.amount}
          onSuccess={handleDepositSuccess}
        />
        <button
          onClick={() => setDeployedContract(null)}
          className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Create New Contract
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <label className="block text-lg font-medium text-primary-dark">
          Contract Title
        </label>
        <input 
          type="text" 
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-lg border-2 border-cyan-200 shadow-sm p-3 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400" 
          placeholder="Website Development Agreement"
          required
        />
      </div>

      <div>
        <label className="block text-lg font-medium text-primary-dark">
          Escrow Amount (ETH)
        </label>
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="mt-1 block w-full rounded-lg border-2 border-cyan-200 shadow-sm p-3 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
          placeholder="1.5"
          step="0.001"
          min="0.001"
          required
        />
      </div>

      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="useConnectedWallet"
          checked={formData.useConnectedWallet}
          onChange={(e) => setFormData({ ...formData, useConnectedWallet: e.target.checked })}
          className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
        />
        <label htmlFor="useConnectedWallet" className="ml-2 block text-sm text-gray-900">
          Use my wallet as recipient
        </label>
      </div>

      {!formData.useConnectedWallet && (
        <div>
          <label className="block text-lg font-medium text-primary-dark">
            Recipient Address
          </label>
          <input 
            type="text" 
            value={formData.recipientAddress}
            onChange={(e) => setFormData({ ...formData, recipientAddress: e.target.value })}
            className="mt-1 block w-full rounded-lg border-2 border-cyan-200 shadow-sm p-3 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400" 
            placeholder="0x..."
            required
          />
        </div>
      )}

      <button 
        type="submit"
        disabled={isDeploying}
        className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
      >
        {isDeploying ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Deploying...
          </span>
        ) : (
          "Deploy Contract"
        )}
      </button>
    </form>
  );
}