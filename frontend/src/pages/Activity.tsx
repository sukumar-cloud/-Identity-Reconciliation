import { Activity, GitMerge, UserPlus, Link2, Eye } from 'lucide-react';

const events = [
  { id: 1, type: 'merge', time: '2 min ago', full_time: '2026-03-06 14:32:00', message: 'Two primary contacts merged', detail: 'Contact #11 linked to #27 via shared phone 717171', primaryId: 11 },
  { id: 2, type: 'new', time: '8 min ago', full_time: '2026-03-06 14:26:00', message: 'New primary contact created', detail: 'email: george@hillvalley.edu · phone: 919191', primaryId: 11 },
  { id: 3, type: 'secondary', time: '15 min ago', full_time: '2026-03-06 14:19:00', message: 'Secondary contact created', detail: 'mcfly@hillvalley.edu linked to #1', primaryId: 1 },
  { id: 4, type: 'identify', time: '1 hr ago', full_time: '2026-03-06 13:34:00', message: 'Identity resolved', detail: 'lorraine@hillvalley.edu · 2 emails, 1 phone', primaryId: 1 },
  { id: 5, type: 'merge', time: '2 hr ago', full_time: '2026-03-06 12:10:00', message: 'Two primary contacts merged', detail: 'Cluster sizes: 3 + 2 → unified under #5', primaryId: 5 },
  { id: 6, type: 'new', time: '3 hr ago', full_time: '2026-03-06 11:05:00', message: 'New primary contact created', detail: 'doc@hillvalley.edu · phone: 555000', primaryId: 5 },
  { id: 7, type: 'identify', time: '5 hr ago', full_time: '2026-03-06 09:00:00', message: 'Identity resolved', detail: 'biffsucks@hillvalley.edu · 1 email, 1 phone', primaryId: 27 },
];

const eventConfig = {
  merge: { icon: GitMerge, color: 'text-warn', bg: 'bg-warn/10 border-warn/20', label: 'MERGE' },
  new: { icon: UserPlus, color: 'text-accent', bg: 'bg-accent/10 border-accent/20', label: 'NEW' },
  secondary: { icon: Link2, color: 'text-ink-muted', bg: 'bg-muted/30 border-border', label: 'SECONDARY' },
  identify: { icon: Eye, color: 'text-accent', bg: 'bg-accent/5 border-accent/10', label: 'IDENTIFIED' },
};

export default function ActivityPage() {
  return (
    <div className="p-8 animate-fade-in max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="font-mono text-accent text-xs tracking-widest uppercase">Audit Log</span>
        </div>
        <h1 className="font-display font-bold text-3xl text-ink">Activity Feed</h1>
        <p className="text-ink-muted text-sm mt-1">Full audit trail of identity reconciliation events.</p>
      </div>

      {/* Stats strip */}
      <div className="flex gap-4 mb-8">
        {[
          { label: 'Events today', value: '47' },
          { label: 'Merges', value: '8' },
          { label: 'New contacts', value: '12' },
          { label: 'Secondaries created', value: '27' },
        ].map((s) => (
          <div key={s.label} className="glass-panel rounded-lg px-4 py-3 flex-1 text-center">
            <p className="font-display font-bold text-xl text-ink">{s.value}</p>
            <p className="font-mono text-[10px] text-ink-muted uppercase tracking-wider mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />
        <div className="space-y-1">
          {events.map((event) => {
            const cfg = eventConfig[event.type as keyof typeof eventConfig];
            const Icon = cfg.icon;
            return (
              <div key={event.id} className="flex gap-4 group animate-slide-up" style={{ animationDelay: `${event.id * 50}ms` }}>
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 z-10 transition-all ${cfg.bg} group-hover:scale-110`}>
                  <Icon className={`w-4 h-4 ${cfg.color}`} />
                </div>
                <div className="flex-1 glass-panel rounded-xl p-4 mb-3 group-hover:border-accent/20 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${cfg.bg} ${cfg.color}`}>
                          {cfg.label}
                        </span>
                        <span className="font-mono text-[10px] text-ink-muted">Primary #{event.primaryId}</span>
                      </div>
                      <p className="font-display font-semibold text-sm text-ink">{event.message}</p>
                      <p className="font-mono text-[11px] text-ink-muted mt-1">{event.detail}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono text-xs text-ink-muted">{event.time}</p>
                      <p className="font-mono text-[10px] text-ink-muted/50">{event.full_time}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 ml-14 text-center">
        <button className="font-mono text-xs text-ink-muted hover:text-accent transition-colors flex items-center gap-2 mx-auto">
          <Activity className="w-3.5 h-3.5" /> Load more events
        </button>
      </div>
    </div>
  );
}
