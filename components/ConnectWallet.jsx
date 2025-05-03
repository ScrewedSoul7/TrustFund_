"use client";
import { ethers } from "ethers";
import { useState, useEffect } from "react";

export default function ConnectWallet() {
  const [address, setAddress] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) setAddress(accounts[0].address);
        } catch (error) {
          console.error("Connection check failed:", error);
        }
      }
    };
    checkConnection();
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error("Please install MetaMask");
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setAddress(signer.address);
      
    } catch (error) {
      console.error("Connection error:", error);
      alert(error.message || "Failed to connect wallet");
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={address ? disconnectWallet : connectWallet}
        className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
      >
        {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connect Wallet"}
      </button>
    </div>
  );
}