"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ethers } from "ethers";

export default function ManageContracts() {
  const [contracts, setContracts] = useState([]);
  const [connectedAddress, setConnectedAddress] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkConnection = async () => {
      if (!window.ethereum) {
        router.push('/');
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (!accounts.length) {
          router.push('/');
          return;
        }
        
        const address = await accounts[0].getAddress();
        setConnectedAddress(address);
        refreshContracts(address);
      } catch (error) {
        console.error(error);
        router.push('/');
      }
    };

    const refreshContracts = (address) => {
      try {
        // Ensure we always get an array
        const storedContracts = JSON.parse(localStorage.getItem('deployedContracts'));
        let contractsArray = [];
        
        if (Array.isArray(storedContracts)) {
          contractsArray = storedContracts;
        } else if (storedContracts && typeof storedContracts === 'object') {
          // Convert legacy object format to array
          contractsArray = Object.values(storedContracts);
          localStorage.setItem('deployedContracts', JSON.stringify(contractsArray));
        }

        const userContracts = contractsArray.filter(
          contract => contract.buyer === address || contract.seller === address
        );
        
        setContracts(userContracts);
      } catch (e) {
        console.error("Error loading contracts:", e);
        setContracts([]);
      }
    };

    checkConnection();
    window.addEventListener('storage', () => refreshContracts(connectedAddress));
    return () => window.removeEventListener('storage', () => refreshContracts(connectedAddress));
  }, [connectedAddress]);

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Your Contracts</h1>
      
      {contracts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">No contracts found</p>
          <Link href="/createContract" className="bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600 transition-colors">
            Create New Contract
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {contracts.map((contract) => (
            <div key={contract.address} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-primary-dark mb-2">{contract.title}</h2>
              <div className="space-y-2 text-gray-600">
                <p>Amount: {contract.amount} ETH</p>
                <p>Status: {contract.state}</p>
                <p className="break-all">Contract Address: {contract.address}</p>
              </div>
            </div>
          ))}
        </div>
      )}
            <button 
        onClick={() => {
            localStorage.setItem('deployedContracts', JSON.stringify([]));
            setContracts([]);
        }}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mb-4"
        >
        Clear All Contracts
        </button>
    </div>
  );
}