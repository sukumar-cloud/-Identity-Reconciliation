import { useState } from 'react';
import { Server, Key, Globe, Save } from 'lucide-react';

export default function SettingsPage() {
  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_API_URL || 'http://localhost:3000');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('api_url', apiUrl);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-12 animate-fade-in max-w-5xl mx-auto">
      <div className="mb-12 border-b border-white/10 pb-8">
        <h1 className="font-display font-bold text-4xl text-white tracking-tight">Settings</h1>
        <p className="text-white/40 text-sm mt-2 font-body max-w-xl">Configure your Bitespeed service connection.</p>
      </div>

      <div className="space-y-12">
        {/* API Config */}
        <div className="border border-white/10">
          <div className="flex items-center gap-3 px-8 py-6 border-b border-white/10">
            <Server className="w-4 h-4 text-white/40" />
            <h2 className="font-display font-semibold text-white text-sm uppercase tracking-widest">Backend Connection</h2>
          </div>
          <div className="p-8 space-y-6">
            <div>
              <label className="block text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-3">
                API Base URL
              </label>
              <input
                className="input-field"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://your-service.onrender.com"
              />
              <p className="text-white/20 text-[10px] font-mono mt-3 uppercase tracking-wider">The base URL of your deployed Bitespeed backend service.</p>
            </div>
          </div>
        </div>

        {/* Endpoint reference */}
        <div className="border border-white/10">
          <div className="flex items-center gap-3 px-8 py-6 border-b border-white/10">
            <Key className="w-4 h-4 text-white/40" />
            <h2 className="font-display font-semibold text-white text-sm uppercase tracking-widest">Endpoint Reference</h2>
          </div>
          <div className="p-8 space-y-4">
            {[
              { method: 'POST', path: '/identify', desc: 'Identify & reconcile a contact' },
              { method: 'GET', path: '/contacts', desc: 'List all contacts' },
              { method: 'GET', path: '/contacts/search', desc: 'Search contacts by email or phone' },
            ].map((e) => (
              <div key={e.path} className="flex items-center gap-6 p-4 border border-white/5 hover:bg-white/[0.02] transition-colors">
                <span className={`font-mono text-[9px] px-2 py-0.5 border ${
                  e.method === 'POST' ? 'bg-white text-black border-white' : 'border-white/10 text-white/40'
                } uppercase tracking-widest`}>
                  {e.method}
                </span>
                <span className="font-mono text-xs text-white/60 tracking-tight">{e.path}</span>
                <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest ml-auto">{e.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Service status */}
        <div className="border border-white/10 p-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-1.5 bg-white" />
            <div>
              <p className="text-xs font-mono text-white uppercase tracking-widest">Service Status</p>
              <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em] mt-1">Online · PostgreSQL connected</p>
            </div>
          </div>
          <span className="text-[10px] font-mono border border-white/10 px-3 py-1 text-white/40 uppercase tracking-widest">v1.0.0</span>
        </div>

        <button
          onClick={handleSave}
          className="btn-primary w-full uppercase tracking-[0.2em] text-xs font-mono py-4"
        >
          {saved ? 'Settings Saved' : 'Save Configuration'}
        </button>
      </div>
    </div>
  );
}
