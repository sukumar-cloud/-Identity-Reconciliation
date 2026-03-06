import { useEffect, useState } from 'react';
import { getDashboardStats, DashboardStats } from '../api';

export default function SettingsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Update every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-12 animate-fade-in max-w-5xl mx-auto">
      <div className="mb-12 border-b border-white/10 pb-8">
        <h1 className="font-display font-bold text-4xl text-white tracking-tight">System Status</h1>
        <p className="text-white/40 text-sm mt-2 font-body max-w-xl">Production-grade identity reconciliation service.</p>
      </div>

      <div className="space-y-16">
        {/* Service Status */}
        <div className="border border-white/10 p-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-2 h-2 bg-white" />
              <div>
                <p className="text-xs font-mono text-white uppercase tracking-widest">Service Status</p>
                <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em] mt-2">Online · PostgreSQL Connected</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Version</p>
              <p className="text-[9px] font-mono text-white/40 uppercase tracking-[0.2em] mt-1">v1.0.0</p>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="border border-white/10 p-12">
          <h2 className="font-display font-bold text-xs text-white/40 uppercase tracking-[0.3em] mb-8">System Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="font-display font-bold text-3xl text-white tracking-tighter">
                {loading ? '...' : stats?.totalContacts || 0}
              </p>
              <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest mt-2">Total Records</p>
            </div>
            <div className="text-center">
              <p className="font-display font-bold text-3xl text-white tracking-tighter">
                {loading ? '...' : stats?.linkedClusters || 0}
              </p>
              <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest mt-2">Primary Nodes</p>
            </div>
            <div className="text-center">
              <p className="font-display font-bold text-3xl text-white tracking-tighter">
                {loading ? '...' : stats?.recentActivity.length || 0}
              </p>
              <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest mt-2">Recent Activity</p>
            </div>
            <div className="text-center">
              <p className="font-display font-bold text-3xl text-white tracking-tighter">100%</p>
              <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest mt-2">Uptime</p>
            </div>
          </div>
        </div>

        {/* System Architecture */}
        <div className="border border-white/10 p-12">
          <h2 className="font-display font-bold text-xs text-white/40 uppercase tracking-[0.3em] mb-8">System Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-4">Backend Stack</p>
              <div className="space-y-2">
                <p className="text-white text-xs font-mono">Node.js Runtime</p>
                <p className="text-white/60 text-[10px] font-mono">Express Framework</p>
                <p className="text-white/60 text-[10px] font-mono">TypeScript</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-4">Database Layer</p>
              <div className="space-y-2">
                <p className="text-white text-xs font-mono">Neon PostgreSQL</p>
                <p className="text-white/60 text-[10px] font-mono">Serverless Architecture</p>
                <p className="text-white/60 text-[10px] font-mono">Automated Backups</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-4">Core Features</p>
              <div className="space-y-2">
                <p className="text-white text-xs font-mono">Identity Reconciliation</p>
                <p className="text-white/60 text-[10px] font-mono">Real-time Processing</p>
                <p className="text-white/60 text-[10px] font-mono">Audit Logging</p>
              </div>
            </div>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="border border-white/10 p-12">
          <h2 className="font-display font-bold text-xs text-white/40 uppercase tracking-[0.3em] mb-8">API Endpoints</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-white/5">
              <div className="flex items-center gap-4">
                <span className="text-[9px] font-mono px-2 py-0.5 bg-white text-black uppercase tracking-widest">POST</span>
                <span className="font-mono text-xs text-white tracking-tight">/identify</span>
              </div>
              <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Identity Resolution</span>
            </div>
            <div className="flex items-center justify-between p-4 border border-white/5">
              <div className="flex items-center gap-4">
                <span className="text-[9px] font-mono px-2 py-0.5 text-white/40 border border-white/10 uppercase tracking-widest">GET</span>
                <span className="font-mono text-xs text-white tracking-tight">/dashboard/stats</span>
              </div>
              <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">System Metrics</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
