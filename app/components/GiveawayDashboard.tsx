'use client'
import { useState, useEffect } from 'react';
import GiveawayCard from './GiveawayCard';
import { Giveaway, Seller, getFilteredGiveaways } from '@/lib/actions';
import { Users, Search } from 'lucide-react';

export default function GiveawayDashboard({ 
  initialGiveaways, 
  sellers, 
  categories 
}: { 
  initialGiveaways: Giveaway[], 
  sellers: Seller[], 
  categories: {id: number, name: string}[] 
}) {
  const [giveaways, setGiveaways] = useState<Giveaway[]>(initialGiveaways);
  const [filterSeller, setFilterSeller] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [minViewers, setMinViewers] = useState<number | "">("");
  const [maxViewers, setMaxViewers] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFilteredData = async () => {
      setLoading(true);
      const results = await getFilteredGiveaways({
        sellerName: filterSeller || undefined,
        categoryId: filterCat || undefined,
        minViewers: minViewers === "" ? undefined : minViewers,
        maxViewers: maxViewers === "" ? undefined : maxViewers,
      });
      setGiveaways(results);
      setLoading(false);
    };

    fetchFilteredData();
    
    // ADD initialGiveaways HERE:
    // When revalidatePath('/') runs, initialGiveaways becomes a new reference,
    // which triggers this effect and pulls the fresh data from the DB.
  }, [filterSeller, filterCat, minViewers, maxViewers, initialGiveaways]);

  return (
    <div className="space-y-6">
      {/* ... keep all your existing return UI exactly the same ... */}
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 items-center">
        <select 
          value={filterSeller}
          onChange={(e) => setFilterSeller(e.target.value)}
          className="bg-gray-50 border-none rounded-lg px-4 py-2 text-sm font-bold text-black"
        >
          <option value="">All Sellers</option>
          {sellers.map(s => <option key={s.id} value={s.username}>{s.username}</option>)}
        </select>

        <select 
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="bg-gray-50 border-none rounded-lg px-4 py-2 text-sm font-bold text-black"
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg">
          <Users size={16} className="text-gray-400" />
          <input 
            type="number"
            placeholder="Min"
            value={minViewers}
            onChange={(e) => setMinViewers(e.target.value === "" ? "" : Number(e.target.value))}
            className="bg-transparent text-sm font-medium w-16 outline-none text-black"
          />
          <span className="text-gray-300">—</span>
          <input 
            type="number"
            placeholder="Max"
            value={maxViewers}
            onChange={(e) => setMaxViewers(e.target.value === "" ? "" : Number(e.target.value))}
            className="bg-transparent text-sm font-medium w-16 outline-none text-black"
          />
        </div>

        {loading && <div className="text-xs text-gray-400 animate-pulse">Querying SQL...</div>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {giveaways.length > 0 ? (
          giveaways.map(g => (
            <GiveawayCard key={g.id} giveaway={g} categories={categories}/>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
            <Search className="mx-auto text-gray-200 mb-2" size={48} />
            <p className="text-gray-400 font-medium">No results found in database.</p>
          </div>
        )}
      </div>
    </div>
  );
}