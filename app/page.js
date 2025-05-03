import { LockClosedIcon, DocumentCheckIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Hero from "@/components/Hero"

export default function Home() {
  return (
    <>
      <Hero 
        title="Secure Escrow Service"
        subtitle="Blockchain-powered protection for your transactions"
      />
      
      {/* Explanatory Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary-dark mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Safely manage payments with our three-step escrow process
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <LockClosedIcon className="h-12 w-12 text-cyan-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">1. Create Contract</h3>
            <p className="text-gray-600">Define milestones and payment terms using our smart contract template</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <CurrencyDollarIcon className="h-12 w-12 text-cyan-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">2. Secure Deposit</h3>
            <p className="text-gray-600">Funds are held in escrow until all conditions are met</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <DocumentCheckIcon className="h-12 w-12 text-cyan-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">3. Release Funds</h3>
            <p className="text-gray-600">Automated payments upon successful milestone completion</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
          <Link href="createContract" className="inline-block bg-cyan-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-cyan-600 transition-colors">
            Create New Contract
          </Link>
        </div>
      </div>
      <Hero 
        title="Secure Milestone Payments"
        subtitle="Blockchain-powered escrow system for trustworthy transactions"
      />
    </>
  )
}