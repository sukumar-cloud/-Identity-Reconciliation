import { Activity, GitMerge, UserPlus, Link2 } from 'lucide-react';

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
  merge: { icon: GitMerge, label: 'MERGE' },
  new: { icon: UserPlus, label: 'NEW' },
  secondary: { icon: Link2, label: 'SECONDARY' },
  identify: { icon: Activity, label: 'IDENTIFIED' },
};

export default function ActivityPage() {
  return (
    <div className="p-12 animate-fade-in max-w-5xl mx-auto">
      <div className="mb-12 border-b border-white/10 pb-8">
        <h1 className="font-display font-bold text-4xl text-white tracking-tight">Activity Feed</h1>
        <p className="text-white/40 text-sm mt-2 font-body max-w-xl">Full audit trail of identity reconciliation events.</p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Events today', value: '47' },
          { label: 'Merges', value: '8' },
          { label: 'New contacts', value: '12' },
          { label: 'Secondaries', value: '27' },
        ].map((s) => (
          <div key={s.label} className="border border-white/10 p-6">
            <p className="font-display font-bold text-2xl text-white tracking-tight">{s.value}</p>
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="border border-white/10">
        <div className="divide-y divide-white/10">
          {events.map((event) => {
            const cfg = eventConfig[event.type as keyof typeof eventConfig];
            const Icon = cfg.icon;
            return (
              <div key={event.id} className="flex gap-8 p-8 hover:bg-white/[0.02] transition-colors group animate-slide-up">
                <div className="w-10 h-10 border border-white/10 flex items-center justify-center shrink-0 transition-all group-hover:border-white">
                  <Icon className="w-4 h-4 text-white/40 group-hover:text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 border border-white/10 text-white/40 uppercase tracking-widest">
                      {cfg.label}
                    </span>
                    <span className="font-mono text-[10px] text-white/20 uppercase tracking-[0.2em]">Primary #{event.primaryId}</span>
                  </div>
                  <p className="font-display font-semibold text-sm text-white uppercase tracking-wide">{event.message}</p>
                  <p className="font-mono text-[11px] text-white/40 mt-2 leading-relaxed tracking-tight">{event.detail}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">{event.time}</p>
                  <p className="font-mono text-[9px] text-white/10 mt-1 uppercase">{event.full_time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-12 text-center">
        <button className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors border border-white/10 px-8 py-4">
          Load more events
        </button>
      </div>
    </div>
  );
}
