import { useEffect, useState } from 'react';
import { Users, Link2, GitMerge, Zap, ArrowUpRight } from 'lucide-react';
import { getDashboardStats, DashboardStats } from '../api';

interface StatCardProps {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
}

function StatCard({ label, value, sub, icon }: StatCardProps) {
  return (
    <div className="border border-white/10 p-8 flex flex-col justify-between min-h-[160px]">
      <div className="flex items-start justify-between">
        <span className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] leading-none">{label}</span>
        <span className="text-white/20">
          {icon}
        </span>
      </div>
      <div>
        <p className="font-display font-bold text-4xl text-white tracking-tighter mb-1">{value}</p>
        <p className="text-white/20 text-[10px] font-mono uppercase tracking-wider">{sub}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Update every 10s
    return () => clearInterval(interval);
  }, []);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'JUST NOW';
    if (diffMins < 60) return `${diffMins}M AGO`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}H AGO`;
    return date.toLocaleDateString();
  };

  return (
    <div className="p-12 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-16 border-b border-white/10 pb-10">
        <h1 className="font-display font-bold text-5xl text-white tracking-tighter">System Overview</h1>
        <p className="text-white/40 text-sm mt-4 font-body max-w-xl leading-relaxed">Real-time identity reconciliation metrics and live activity feed.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 mb-16">
        <div className="bg-black">
          <StatCard 
            label="Total Records" 
            value={loading ? '...' : stats?.totalContacts || 0} 
            sub="Captured identities" 
            icon={<Users className="w-4 h-4" />} 
          />
        </div>
        <div className="bg-black">
          <StatCard 
            label="Primary Nodes" 
            value={loading ? '...' : stats?.linkedClusters || 0} 
            sub="Unique clusters" 
            icon={<Link2 className="w-4 h-4" />} 
          />
        </div>
        <div className="bg-black">
          <StatCard 
            label="Merge Events" 
            value={loading ? '...' : '0'} 
            sub="Recent demotions" 
            icon={<GitMerge className="w-4 h-4" />} 
          />
        </div>
        <div className="bg-black">
          <StatCard 
            label="Active Uptime" 
            value="100%" 
            sub="Service status" 
            icon={<Zap className="w-4 h-4" />} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Recent Activity */}
        <div className="lg:col-span-12">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-display font-bold text-xl text-white uppercase tracking-widest">Live Feed</h2>
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 bg-white animate-pulse" />
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Live Updates</span>
            </div>
          </div>
          <div className="border border-white/10">
            <div className="divide-y divide-white/10">
              {loading ? (
                <div className="p-12 text-center text-white/20 font-mono text-[10px] uppercase tracking-widest">Loading records...</div>
              ) : stats?.recentActivity.length === 0 ? (
                <div className="p-12 text-center text-white/20 font-mono text-[10px] uppercase tracking-widest">No activity detected</div>
              ) : (
                stats?.recentActivity.map((item, i) => (
                  <div key={i} className="flex items-center gap-8 p-8 hover:bg-white/[0.02] transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm text-white truncate tracking-tight">{item.email || 'NO EMAIL'}</p>
                      {item.phone && <p className="font-mono text-[10px] text-white/30 mt-1">+{item.phone}</p>}
                    </div>
                    <div className="flex items-center gap-6">
                      <span className={`text-[9px] font-mono px-3 py-1 border ${
                        item.action === 'NEW PRIMARY' 
                          ? 'bg-white text-black border-white' 
                          : 'text-white/40 border-white/10'
                      } uppercase tracking-widest`}>
                        {item.action}
                      </span>
                      <span className="text-white/20 text-[10px] font-mono shrink-0 w-24 text-right uppercase">{formatTime(item.createdAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
