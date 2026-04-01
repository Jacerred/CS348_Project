'use client'
import { useState, useEffect } from 'react';
import { updateGiveaway, deleteGiveaway, updateShow, Giveaway, deleteShow } from '@/lib/actions';
import { ExternalLink, RotateCcw, Trash2, Users, Tag, Calendar, Info, Pencil, Check, X } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

export default function GiveawayCard({ giveaway, categories }: { giveaway: Giveaway, categories: Category[] }) {
  const [msLeft, setMsLeft] = useState(giveaway.remaining_ms || 300000);
  const [active, setActive] = useState(giveaway.status === 'RUNNING');
  const [continuous, setContinuous] = useState(giveaway.is_continuous);

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(giveaway.show_title || "");
  const [editCatId, setEditCatId] = useState(giveaway.category_id?.toString() || "");
  const [editNotes, setEditNotes] = useState(giveaway.notes || "");

  // --- TIMER LOGIC (Keep existing useEffect here) ---

  const handleSave = async () => {
    await updateShow(giveaway.show_id, {
      title: editTitle,
      category_id: editCatId ? Number(editCatId) : undefined,
      notes: editNotes
    });
    setIsEditing(false);
  };

  // --- TIMER LOGIC ---
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (active && msLeft > 0) {
      timer = setInterval(() => {
        setMsLeft((prev) => {
          const next = prev - 1000;
          if (next <= 0) {
            if (continuous) return 300000; // Auto-restart
            setActive(false);
            return 0;
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [active, msLeft, continuous]);

  // --- FORMATTING ---
  const format = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggleContinuous = async () => {
    const newVal = !continuous;
    setContinuous(newVal);
    await updateGiveaway(giveaway.id, { is_continuous: newVal ? 1 : 0 });
  };

  return (
    <div className={`bg-white border-2 rounded-2xl p-5 shadow-sm transition-all ${active ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-100'}`}>
      
      {/* HEADER BAR */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col gap-1 w-full mr-2">
          {isEditing ? (
            <select 
              value={editCatId}
              onChange={(e) => setEditCatId(e.target.value)}
              className="text-[10px] font-black bg-gray-50 border border-gray-200 px-2 py-1 rounded-lg outline-none"
            >
              <option value="">No Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          ) : (
            <span className="text-[10px] font-black bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full w-fit flex items-center gap-1">
              <Tag size={10} /> {giveaway.category_name || 'General'}
            </span>
          )}
          
          {isEditing ? (
            <input 
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-lg font-black text-black border-b border-gray-300 outline-none focus:border-red-500"
            />
          ) : (
            <h3 className="text-lg font-black text-black leading-tight">{giveaway.seller_name}</h3>
          )}
        </div>
        
        {/* Toggle Edit Button */}
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`p-2 rounded-lg transition ${isEditing ? 'bg-green-100 text-green-600' : 'bg-gray-50 text-gray-400 hover:text-black'}`}
        >
          {isEditing ? <Check size={16} /> : <Pencil size={16} />}
        </button>
      </div>

      {/* SHOW DETAILS */}
      {!isEditing && (
        <div className="mb-4">
          <h4 className="text-sm font-bold text-gray-700">{giveaway.show_title}</h4>
          <div className="flex items-center gap-3 mt-1">
             <div className="flex items-center gap-1.5 text-red-600">
               <Users size={12} />
               <span className="text-[10px] font-bold">{giveaway.viewer_count?.toLocaleString()}</span>
             </div>
             {giveaway.url && (
               <a href={giveaway.url} target="_blank" className="text-blue-500 flex items-center gap-1 text-[10px]">
                 <ExternalLink size={10} /> LINK
               </a>
             )}
          </div>
        </div>
      )}

      {/* 3. MAIN TIMER */}
      <div className="bg-gray-50 rounded-xl py-6 mb-4 relative overflow-hidden">
         {/* Simple background progress bar could go here */}
         <div 
           className={`text-6xl font-mono font-black text-center tabular-nums tracking-tighter ${msLeft < 30000 ? 'text-red-600 animate-pulse' : 'text-gray-900'}`}
         >
           {format(msLeft)}
         </div>
      </div>

      {/* 4. ACTIONS */}
      <div className="flex gap-2 mb-4">
        <button 
          onClick={() => setActive(!active)}
          className={`flex-[2] py-3 rounded-xl font-black text-sm tracking-widest transition-all ${active ? 'bg-orange-500 text-white shadow-orange-200' : 'bg-black text-white'}`}
        >
          {active ? 'PAUSE' : 'START TIMER'}
        </button>
        <button 
          onClick={() => setMsLeft(300000)}
          className="flex-1 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center hover:bg-gray-200"
          title="Reset to 5m"
        >
          <RotateCcw size={18} />
        </button>
        <button 
          onClick={() => confirm('Delete this giveaway?') && deleteShow(giveaway.show_id)}
          className="flex-1 bg-gray-100 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* FOOTER: Notes & Actions */}
      <div className="border-t border-gray-100 pt-4 space-y-3">
        {isEditing ? (
          <textarea 
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
            placeholder="Edit notes..."
            className="w-full text-[11px] bg-gray-50 p-2 rounded-lg border border-gray-200 outline-none"
            rows={2}
          />
        ) : (
          giveaway.notes && (
            <div className="flex items-start gap-2 bg-blue-50/50 p-2 rounded-lg">
              <Info size={12} className="text-blue-400 mt-0.5 shrink-0" />
              <p className="text-[11px] text-blue-700 leading-tight italic">{giveaway.notes}</p>
            </div>
          )
        )}
        
        {isEditing && (
          <button 
            onClick={() => {
                setIsEditing(false);
                setEditTitle(giveaway.show_title || "");
                setEditCatId(giveaway.category_id?.toString() || "");
                setEditNotes(giveaway.notes || "");
            }}
            className="w-full text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-red-500"
          >
            Cancel Changes
          </button>
        )}
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-[11px] font-bold text-gray-500 group-hover:text-gray-700 uppercase tracking-tighter">Continuous Mode</span>
          <input 
            type="checkbox" 
            checked={continuous} 
            onChange={handleToggleContinuous}
            className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
          />
        </label>
      </div>
    </div>
  );
}