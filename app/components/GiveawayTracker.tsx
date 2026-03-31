'use client'
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function GiveawayTracker() {
  // refreshInterval: 5000 tells SWR to fetch from our API every 5 seconds
  const { data: giveaways, error } = useSWR('/api/giveaways', fetcher, { 
    refreshInterval: 5000 
  });

  if (error) return <div>Failed to load</div>;
  if (!giveaways) return <div>Loading...</div>;

  return (
    <div className="grid gap-4">
      {giveaways.map((g: any) => (
        <div key={g.id} className="p-4 border rounded shadow">
          <h3 className="font-bold">{g.seller_name} - {g.show_title}</h3>
          <Countdown endTime={g.end_time} />
        </div>
      ))}
    </div>
  );
}

// A simple helper component for the ticking clock
function Countdown({ endTime }: { endTime: string }) {
  // Logic to calculate (endTime - currentTime) and display as MM:SS
  return <span>Ends at: {new Date(endTime).toLocaleTimeString()}</span>;
}