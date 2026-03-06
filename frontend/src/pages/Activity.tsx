import { useEffect, useState } from "react";
import { GitMerge, Users, Clock } from "lucide-react";
import { getDashboardStats, DashboardStats } from "../api";

export default function ActivityPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
    const interval = setInterval(fetchActivity, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "JUST NOW";
    if (diffMins < 60) return `${diffMins}M AGO`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}H AGO`;

    return date.toLocaleDateString();
  };

  return (
    <div className="p-12 animate-fade-in max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div className="mb-12 border-b border-white/10 pb-8">
        <h1 className="font-display font-bold text-4xl text-white tracking-tight">
          Activity Feed
        </h1>
        <p className="text-white/40 text-sm mt-2 font-body max-w-xl">
          Full audit trail of identity reconciliation events.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-white/10 border border-white/10 mb-16">

        <div className="bg-black p-8">
          <p className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-4">
            Events Total
          </p>
          <p className="text-3xl font-display font-bold text-white tracking-tighter">
            {loading ? "..." : stats?.totalContacts || 0}
          </p>
        </div>

        <div className="bg-black p-8">
          <p className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-4">
            Merges
          </p>
          <p className="text-3xl font-display font-bold text-white tracking-tighter">
            {loading ? "..." : stats?.mergeEvents || 0}
          </p>
        </div>

        <div className="bg-black p-8">
          <p className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-4">
            Clusters
          </p>
          <p className="text-3xl font-display font-bold text-white tracking-tighter">
            {loading ? "..." : stats?.linkedClusters || 0}
          </p>
        </div>

        <div className="bg-black p-8">
          <p className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-4">
            Uptime
          </p>
          <p className="text-3xl font-display font-bold text-white tracking-tighter">
            100%
          </p>
        </div>

      </div>

      {/* ACTIVITY FEED */}
      <div className="border border-white/10">
        <div className="divide-y divide-white/10">

          {loading && (!stats || stats.recentActivity.length === 0) ? (
            <div className="p-12 text-center text-white/20 font-mono text-[10px] uppercase tracking-widest">
              Initializing feed...
            </div>
          ) : stats?.recentActivity.length === 0 ? (
            <div className="p-12 text-center text-white/20 font-mono text-[10px] uppercase tracking-widest">
              No recent activity
            </div>
          ) : (
            stats?.recentActivity.map((event, i) => (
              <div
                key={i}
                className="p-10 flex gap-10 items-start hover:bg-white/[0.01] transition-colors"
              >

                {/* ICON */}
                <div className="mt-1">
                  {event.action === "NEW PRIMARY" ? (
                    <div className="p-3 border border-white/10 bg-white/5">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="p-3 border border-white/10 bg-black">
                      <GitMerge className="w-4 h-4 text-white/40" />
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="flex-1">

                  <div className="flex items-center justify-between mb-2">

                    <span className="text-[9px] font-mono px-2 py-0.5 border uppercase tracking-widest">
                      {event.action}
                    </span>

                    <div className="flex items-center gap-2 text-white/20 text-[10px] font-mono uppercase tracking-widest">
                      <Clock className="w-3 h-3" />
                      {formatTime(event.createdAt)}
                    </div>

                  </div>

                  <h3 className="font-mono text-sm text-white tracking-tight mb-1">
                    {event.action === "NEW PRIMARY"
                      ? "NEW PRIMARY CONTACT CREATED"
                      : "TWO CONTACTS MERGED"}
                  </h3>

                  <p className="font-mono text-[10px] text-white/40 uppercase tracking-wider">
                    {event.email && `EMAIL: ${event.email} `}
                    {event.phone && `PHONE: ${event.phone}`}
                  </p>

                </div>
              </div>
            ))
          )}

        </div>
      </div>
    </div>
  );
}