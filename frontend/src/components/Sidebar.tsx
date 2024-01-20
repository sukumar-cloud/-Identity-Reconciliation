import { Eye, LayoutDashboard, Users, Terminal, Settings, Activity } from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'identify', label: 'Identify', icon: Terminal },
  { id: 'contacts', label: 'Contacts', icon: Users },
  { id: 'activity', label: 'Activity', icon: Activity },
];

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 flex flex-col bg-surface border-r border-border">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center animate-pulse-accent">
            <Eye className="w-4 h-4 text-accent" />
          </div>
          <div>
            <p className="font-display font-bold text-ink text-sm tracking-wide">BITESPEED</p>
            <p className="font-mono text-ink-muted text-[10px] tracking-widest uppercase">Identity Engine</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`nav-link w-full text-left ${activePage === id ? 'active' : ''}`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-border">
        <button
          onClick={() => onNavigate('settings')}
          className={`nav-link w-full text-left ${activePage === 'settings' ? 'active' : ''}`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
        <div className="mt-4 mx-1 p-3 rounded-lg bg-accent/5 border border-accent/10">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-[10px] text-accent tracking-widest uppercase">Service Online</span>
          </div>
          <p className="font-mono text-[10px] text-ink-muted">v1.0.0 · PostgreSQL</p>
        </div>
      </div>
    </aside>
  );
}
