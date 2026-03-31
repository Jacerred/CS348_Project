import AddSellerForm from "./components/AddSellerForm";
import SellerDropDown from "./components/SellerDropDown";
// Import your direct database function
import { getAllSellers, deleteSellerByUsername } from "@/lib/actions"; 

export default async function Home() {

  const sellers = await getAllSellers();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-20 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md space-y-8">
        <h1 className="text-2xl font-bold text-center text-gray-900">WhatNot Tracker</h1>
        
        <div>
          <AddSellerForm />
        </div>
        
        <div>
          <SellerDropDown initialSellers={sellers}/>
        </div>
      </div>
    </div>
  );
}