'use client'
import { useState } from 'react';
import { addSeller, deleteSellerByUsername, addShow, Seller, Show, addGiveaway } from '@/lib/actions';

export default function SidebarManager({ initialSellers, categories }: { initialSellers: Seller[], categories: { id: number, name: string }[]}) {
    const [newSeller, setNewSeller] = useState("");
    const [selectedSellerId, setSelectedSellerId] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [newShowTitle, setNewShowTitle] = useState("");
    const [newShowViewerCount, setNewShowViewerCount] = useState(0);
    const [newShowNotes, setNewShowNotes] = useState("");
    const [newShowUrl, setNewShowUrl] = useState("");


    return (
        <div className="space-y-10">
            {/* ADD SELLER */}
            <section>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Add Seller</h3>
                <div className="flex flex-col gap-2">
                    <input
                        value={newSeller}
                        onChange={(e) => setNewSeller(e.target.value)}
                        placeholder="Username..."
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
                    />
                    <button
                        disabled={!newSeller}
                        onClick={async () => {
                            await addSeller(newSeller, null);
                            setNewSeller("");
                        }}
                        className="bg-black text-white text-sm font-bold py-2 rounded-lg disabled:opacity-30"
                    >
                        Add Seller
                    </button>
                </div>
            </section>

            {/* ADD SHOW TO SELLER */}
            <section>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Add Show</h3>
                <div className="flex flex-col gap-2">
                    <select
                        value={selectedSellerId}
                        onChange={(e) => setSelectedSellerId(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                    >
                        <option value="">Target Seller...</option>
                        {initialSellers.map(s => <option key={s.id} value={s.id}>{s.username}</option>)}
                    </select>
                    <input
                        value={newShowTitle}
                        onChange={(e) => setNewShowTitle(e.target.value)}
                        placeholder="Show Title (e.g. 'Night Pulls')"
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
                    />
                    <select
                        value={selectedCategoryId}
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                    >
                        <option value="">All Categories</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <span className="text-sm text-gray-600">Viewer Count:</span>
                    <input
                        value={newShowViewerCount}
                        onChange={(e) => setNewShowViewerCount(Number(e.target.value))}
                        placeholder="Viewer Count"
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
                    />
                    <input
                        value={newShowNotes}
                        onChange={(e) => setNewShowNotes(e.target.value)}
                        placeholder="Notes (optional)"
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
                    />
                    <input
                        value={newShowUrl}
                        onChange={(e) => setNewShowUrl(e.target.value)}
                        placeholder="Show URL (optional)"
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
                    />
                    <button
                        disabled={!selectedSellerId || !newShowTitle || !selectedCategoryId || newShowViewerCount < 0 || isNaN(newShowViewerCount)}
                        onClick={async () => {
                            console.log("Selected Category ID:", selectedCategoryId);
                            const show = await addShow(newShowTitle, Number(selectedSellerId), Number(selectedCategoryId), newShowViewerCount, newShowNotes || null, newShowUrl || null);
                            await addGiveaway(show.lastInsertRowid as number, false);
                            setNewShowTitle("");
                            setNewShowViewerCount(0);
                            setNewShowNotes("");
                            setNewShowUrl("");
                            setSelectedCategoryId("");
                        }}
                        className="bg-black text-white text-sm font-bold py-2 rounded-lg disabled:opacity-30"
                    >
                        Create Show
                    </button>
                </div>
                {/* DELETE SELLER */}
                <div className = "my-6">
                    <button
                        onClick={async () => {
                            const seller = initialSellers.find(s => s.id.toString() === selectedSellerId);
                            if (seller && confirm(`Delete ${seller.username}?`)) {
                                await deleteSellerByUsername(seller.username);
                                setSelectedSellerId("");
                            }
                        }}
                        className="w-full border border-red-200 text-red-600 text-xs py-2 rounded-lg hover:bg-red-50"
                    >
                        Delete Selected Seller
                    </button>
                </div>
            </section>
        </div>
    );
}