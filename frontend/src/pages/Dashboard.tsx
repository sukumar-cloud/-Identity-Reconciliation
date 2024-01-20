import { Users, Link2, GitMerge, Zap, ArrowUpRight, Eye } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  accent?: boolean;
}

function StatCard({ label, value, sub, icon, accent }: StatCardProps) {
  return (
    <div className={`stat-card ${accent ? 'border-accent/20 accent-glow' : ''}`}>
      <div className="flex items-start justify-between">
        <span className="text-ink-muted text-xs font-body uppercase tracking-widest">{label}</span>
        <span className={`p-2 rounded-lg ${accent ? 'bg-accent/10 text-accent' : 'bg-muted/50 text-ink-muted'}`}>
          {icon}
        </span>
      </div>
      <p className={`font-display font-bold text-3xl ${accent ? 'text-accent' : 'text-ink'}`}>{value}</p>
      <p className="text-ink-muted text-xs font-body">{sub}</p>
    </div>
  );
}

const recentActivity = [
  { time: '2m ago', email: 'lorraine@hillvalley.edu', phone: '123456', action: 'IDENTIFIED', isNew: false },
  { time: '8m ago', email: 'mcfly@hillvalley.edu', phone: null, action: 'SECONDARY CREATED', isNew: true },
  { time: '15m ago', email: 'george@hillvalley.edu', phone: '919191', action: 'NEW PRIMARY', isNew: true },
  { time: '1h ago', email: 'biff@hillvalley.edu', phone: '717171', action: 'MERGED', isNew: false },
  { time: '2h ago', email: 'doc@hillvalley.edu', phone: '888888', action: 'IDENTIFIED', isNew: false },
];

export default function Dashboard() {
  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="font-mono text-accent text-xs tracking-widest uppercase">Overview</span>
        </div>
        <h1 className="font-display font-bold text-3xl text-ink">Identity Dashboard</h1>
        <p className="text-ink-muted text-sm mt-1 font-body">Real-time identity reconciliation across all customer touchpoints.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Contacts" value="1,284" sub="+12 this week" icon={<Users className="w-4 h-4" />} accent />
        <StatCard label="Linked Clusters" value="847" sub="Unique identities" icon={<Link2 className="w-4 h-4" />} />
        <StatCard label="Merges Today" value="23" sub="Primary demotions" icon={<GitMerge className="w-4 h-4" />} />
        <StatCard label="API Calls" value="4.2k" sub="Last 24 hours" icon={<Zap className="w-4 h-4" />} />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="col-span-2 glass-panel rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-display font-semibold text-ink text-sm">Recent Activity</h2>
            <button className="flex items-center gap-1 text-accent text-xs font-mono hover:underline">
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-border">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-panel/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  <Eye className="w-3.5 h-3.5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs text-ink truncate">{item.email}</p>
                  {item.phone && <p className="font-mono text-[11px] text-ink-muted">+{item.phone}</p>}
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  item.isNew 
                    ? 'bg-accent/10 text-accent border-accent/20' 
                    : 'bg-muted/30 text-ink-muted border-border'
                }`}>
                  {item.action}
                </span>
                <span className="text-ink-muted text-[10px] font-mono shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-4">
          <div className="glass-panel rounded-xl p-5">
            <h2 className="font-display font-semibold text-ink text-sm mb-4">Reconciliation Rules</h2>
            <div className="space-y-3">
              {[
                { rule: 'New contact', desc: 'No match → Primary created' },
                { rule: 'Shared info', desc: 'Match + new data → Secondary' },
                { rule: 'Cluster merge', desc: 'Two primaries → Older wins' },
              ].map((r) => (
                <div key={r.rule} className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  <div>
                    <p className="text-ink text-xs font-display font-semibold">{r.rule}</p>
                    <p className="text-ink-muted text-[11px] font-body">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-xl p-5">
            <h2 className="font-display font-semibold text-ink text-sm mb-3">Link Ratio</h2>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink-muted font-mono">Primary</span>
                  <span className="text-accent font-mono">66%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: '66%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink-muted font-mono">Secondary</span>
                  <span className="text-ink-muted font-mono">34%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-ink-muted rounded-full" style={{ width: '34%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
