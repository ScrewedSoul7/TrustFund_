import ContractForm from "@/components/ContractForm";

export default function CreateContract() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <section className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-dark mb-2">
            Create New Escrow Contract
          </h1>
          <p className="text-xl text-gray-600">
            Secure transaction with smart contract escrow
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <ContractForm />
        </div>
      </section>
    </main>
  );
}