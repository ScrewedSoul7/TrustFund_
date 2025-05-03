"use client";
import { useState } from "react";
import { ethers } from "ethers";
import TrustFundABI from "../abi/TrustFundABI.json";

export default function DepositInterface({ contractAddress, contractAmount, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, TrustFundABI.abi, signer);
      
      const tx = await contract.deposit({
        value: ethers.parseEther(contractAmount.toString())
      });
      await tx.wait();
      onSuccess();
      alert('Deposit successful! Contract created!');
    } catch (error) {
      alert(`Deposit failed: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleDeposit}
        className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 disabled:bg-gray-300 w-full"
        disabled={loading}
      >
        {loading ? 'Processing...' : `Deposit ${contractAmount} ETH`}
      </button>
    </div>
  );
}