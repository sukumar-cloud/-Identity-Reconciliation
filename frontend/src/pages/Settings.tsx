import { useState } from 'react';
import { Settings, Server, Key, Globe, Save } from 'lucide-react';

export default function SettingsPage() {
  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_API_URL || 'http://localhost:3000');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('api_url', apiUrl);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 animate-fade-in max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="font-mono text-accent text-xs tracking-widest uppercase">Configuration</span>
        </div>
        <h1 className="font-display font-bold text-3xl text-ink">Settings</h1>
        <p className="text-ink-muted text-sm mt-1">Configure your Bitespeed service connection.</p>
      </div>

      <div className="space-y-5">
        {/* API Config */}
        <div className="glass-panel rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
            <Server className="w-4 h-4 text-accent" />
            <h2 className="font-display font-semibold text-ink text-sm">Backend Connection</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-mono text-ink-muted uppercase tracking-widest mb-2">
                <Globe className="inline w-3 h-3 mr-1" />API Base URL
              </label>
              <input
                className="input-field"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://your-service.onrender.com"
              />
              <p className="text-ink-muted text-[11px] font-body mt-1.5">The base URL of your deployed Bitespeed backend service.</p>
            </div>
          </div>
        </div>

        {/* Endpoint reference */}
        <div className="glass-panel rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
            <Key className="w-4 h-4 text-accent" />
            <h2 className="font-display font-semibold text-ink text-sm">Endpoint Reference</h2>
          </div>
          <div className="p-6 space-y-3">
            {[
              { method: 'POST', path: '/identify', desc: 'Identify & reconcile a contact' },
              { method: 'GET', path: '/contacts', desc: 'List all contacts' },
              { method: 'GET', path: '/contacts/search', desc: 'Search contacts by email or phone' },
            ].map((e) => (
              <div key={e.path} className="flex items-center gap-3 p-3 bg-void rounded-lg border border-border">
                <span className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                  e.method === 'POST' ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-muted/30 text-ink-muted border border-border'
                }`}>
                  {e.method}
                </span>
                <span className="font-mono text-xs text-ink">{e.path}</span>
                <span className="font-body text-xs text-ink-muted ml-auto">{e.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Service status */}
        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <div>
                <p className="font-display font-semibold text-ink text-sm">Service Status</p>
                <p className="font-mono text-[11px] text-accent">Online · PostgreSQL connected</p>
              </div>
            </div>
            <span className="tag-primary">v1.0.0</span>
          </div>
        </div>

        <button
          onClick={handleSave}
          className={`btn-primary flex items-center gap-2 ${saved ? 'bg-green-500' : ''}`}
        >
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
