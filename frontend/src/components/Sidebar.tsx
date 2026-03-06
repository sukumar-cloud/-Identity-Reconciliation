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
    <aside className="w-60 shrink-0 h-screen sticky top-0 flex flex-col bg-black border-r border-white/10">
      {/* Logo */}
      <div className="px-8 py-10 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white flex items-center justify-center">
            <Eye className="w-4 h-4 text-black" />
          </div>
          <div>
            <p className="font-display font-bold text-white text-sm tracking-tighter">BITESPEED</p>
            <p className="font-mono text-white/40 text-[9px] tracking-[0.2em] uppercase">Identity</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-8 space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`nav-link w-full text-left flex items-center gap-3 px-4 py-3 transition-all ${
              activePage === id 
                ? 'text-white bg-white/5 border-l-2 border-white' 
                : 'text-white/40 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-xs font-mono uppercase tracking-widest">{label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-8 border-t border-white/10">
        <button
          onClick={() => onNavigate('settings')}
          className={`nav-link w-full text-left flex items-center gap-3 px-4 py-3 transition-all ${
            activePage === 'settings' 
              ? 'text-white bg-white/5 border-l-2 border-white' 
              : 'text-white/40 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span className="text-xs font-mono uppercase tracking-widest">Settings</span>
        </button>
        <div className="mt-8 px-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1 h-1 bg-white" />
            <span className="font-mono text-[9px] text-white tracking-[0.2em] uppercase">System Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
