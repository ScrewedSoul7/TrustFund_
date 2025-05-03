import Link from "next/link";
import { CubeIcon } from "@heroicons/react/24/solid";
import ConnectWallet from "./ConnectWallet";

export default function Navbar() {
  return (
    <nav className="bg-cyan-400 border-b border-cyan-500 text-nav-dark">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            <Link href="/" className="flex flex-shrink-0 items-center mr-4">
              <CubeIcon className="h-10 w-10 text-nav-dark" />
              <span className="hidden md:block text-2xl font-bold ml-2">
                TrustFund
              </span>
            </Link>
          </div>
          <div className="md:ml-auto">
            <div className="flex gap-4 items-center">
              <Link href="/createContract" className="font-bold hover:bg-cyan-300 px-4 h-20 flex items-center justify-center transition">
                Create Contract
              </Link>
              <Link href="/manageContract" className="font-bold hover:bg-cyan-300 px-4 h-20 flex items-center justify-center transition">
                Manage Contracts
              </Link>
            <div className="flex gap-4">
              <ConnectWallet />
                </div>
            </div>
            </div>
        </div>
    </div>
    </nav>
  )
}