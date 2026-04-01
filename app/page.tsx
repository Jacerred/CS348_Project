import { getAllSellers, getFullGiveawayList, Show } from "@/lib/actions";
import SidebarManager from "./components/SidebarManager";
import GiveawayDashboard from "./components/GiveawayDashboard";
import db from '@/lib/db';

export default async function Home() {
  const sellers = await getAllSellers();
  const allGiveaways = await getFullGiveawayList();
  // Get unique categories for filtering
  const categories = await db.prepare('SELECT * FROM Categories').all() as {id: number, name: string}[];

  return (
    <div className="flex min-h-screen bg-gray-50 text-black font-sans">
      <aside className="w-80 bg-white border-r border-gray-200 p-6">
        <h1 className="text-xl font-black mb-8 tracking-tighter">WHATNOT TRACKER</h1>
        <SidebarManager initialSellers={sellers} categories={categories}/>
      </aside>

      <main className="flex-1 p-8">
        <GiveawayDashboard 
          initialGiveaways={allGiveaways} 
          sellers={sellers}
          categories={categories}
        />
      </main>
    </div>
  );
}