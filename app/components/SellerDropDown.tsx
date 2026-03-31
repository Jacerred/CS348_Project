'use client'

import { deleteSellerByUsername, Seller } from "@/lib/actions";
import { useState } from "react";

export default function SellerDropDown({ initialSellers }: { initialSellers: Seller[] }) {
  const [selectedId, setSelectedId] = useState("");

  const handleDelete = async () => {
    // Find the username based on the ID we selected
    const sellerToDelete = initialSellers.find(s => s.id.toString() === selectedId);
    
    if (sellerToDelete) {
      if (confirm(`Delete ${sellerToDelete.username}?`)) {
        await deleteSellerByUsername(sellerToDelete.username);
        setSelectedId(""); // Reset the dropdown
      }
    }
  };

  return (
    <div className="mt-8 flex flex-col gap-2">
      <label htmlFor="sellers" className="font-bold text-gray-800">
        Select a Seller:
      </label>
      
      <select 
        id="sellers" 
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="border border-gray-300 rounded-md px-4 py-2 text-black bg-white focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Choose a Seller --</option>
        {initialSellers.map((seller) => (
          <option key={seller.id} value={seller.id}>
            {seller.username}
          </option>
        ))}
      </select>

      <button 
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-gray-400"
        onClick={handleDelete}
        disabled={!selectedId} // Can't delete if nothing is selected!
      >
        Delete Selected Seller
      </button>
    </div>
  );
}