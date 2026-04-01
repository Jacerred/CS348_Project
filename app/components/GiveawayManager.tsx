'use client'
import { useState, useEffect } from 'react';
import { getShows, getGiveaways, addGiveaway, Seller, Show, Giveaway } from '@/lib/actions';
import GiveawayCard from './GiveawayCard';

export default function GiveawayManager({ initialSellers }: { initialSellers: Seller[] }) {
  const [selectedSellerId, setSelectedSellerId] = useState("");
  const [shows, setShows] = useState<Show[]>([]);
  const [selectedShowId, setSelectedShowId] = useState("");
  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);

  // Load shows when seller changes
  useEffect(() => {
    if (selectedSellerId) {
      getShows(Number(selectedSellerId)).then(setShows);
      setSelectedShowId("");
    }
  }, [selectedSellerId]);

  // Load giveaways when show changes
  useEffect(() => {
    if (selectedShowId) {
      getGiveaways(Number(selectedShowId)).then(setGiveaways);
    }
  }, [selectedShowId]);

  return (
    <div className="space-y-6">
      {/* Selection Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow-sm">
        <div>
          <label className="text-xs font-bold uppercase text-gray-400">Seller</label>
          <select 
            value={selectedSellerId} 
            onChange={(e) => setSelectedSellerId(e.target.value)}
            className="w-full border-b-2 border-gray-200 py-2 text-lg focus:border-red-500 outline-none transition-colors text-black"
          >
            <option value="">Select Seller...</option>
            {initialSellers.map(s => <option key={s.id} value={s.id}>{s.username}</option>)}
          </select>
        </div>

        {selectedSellerId && (
          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Active Show</label>
            <select 
              value={selectedShowId} 
              onChange={(e) => setSelectedShowId(e.target.value)}
              className="w-full border-b-2 border-gray-200 py-2 text-lg focus:border-red-500 outline-none transition-colors text-black"
            >
              <option value="">Select Show...</option>
              {shows.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Giveaways Grid */}
      {selectedShowId && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Giveaways</h2>
            <button 
              onClick={() => addGiveaway(Number(selectedShowId))}
              className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800"
            >
              + New Timer
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {giveaways.map(g => (
              <GiveawayCard key={g.id} giveaway={g} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}