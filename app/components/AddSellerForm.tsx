'use client'
import { addSeller, getAllSellers } from '@/lib/actions';
import { get } from 'http';

export default function AddSellerForm() {
  async function handleSubmit(formData: FormData) {
    const username = formData.get('username') as string;
    // Call your SQL function directly
    await addSeller(username, "Added from web UI");
    alert("Seller Added!");
  }

  return (
    <form action={handleSubmit}>
        <input 
        name="username" 
        placeholder="Seller Username" 
        className="border border-gray-300 rounded-md px-4 py-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
        type="submit" 
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 ml-2"
        >
        Add Seller
        </button>
    </form>
  );
}