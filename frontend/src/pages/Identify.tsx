import { useState } from 'react';
import { Terminal, Send, RotateCcw, ChevronRight, Mail, Phone, Hash, Link2 } from 'lucide-react';
import { identifyContact } from '../api';
import { IdentifyResponse } from '../types';

type Mode = 'customer' | 'api';

export default function IdentifyPage() {
  const [mode, setMode] = useState<Mode>('customer');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IdentifyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawJson, setRawJson] = useState('');

  const handleSubmit = async () => {
    if (!email.trim() && !phone.trim()) {
      setError('Please enter at least an email or phone number.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const payload: { email?: string; phoneNumber?: string } = {};
      if (email.trim()) payload.email = email.trim();
      if (phone.trim()) payload.phoneNumber = phone.trim();
      const res = await identifyContact(payload);
      setResult(res);
      setRawJson(JSON.stringify(res, null, 2));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Request failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEmail(''); setPhone(''); setResult(null); setError(null); setRawJson('');
  };

  return (
    <div className="p-8 animate-fade-in max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="font-mono text-accent text-xs tracking-widest uppercase">Identity Lookup</span>
        </div>
        <h1 className="font-display font-bold text-3xl text-ink">Identify Contact</h1>
        <p className="text-ink-muted text-sm mt-1">Resolve and consolidate customer identity across all touchpoints.</p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-1 p-1 bg-surface border border-border rounded-lg w-fit mb-8">
        {(['customer', 'api'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-5 py-2 rounded-md text-sm font-display font-medium transition-all duration-150 ${
              mode === m ? 'bg-accent text-void' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {m === 'customer' ? '👤 Customer Form' : '⚡ API Tester'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Form */}
        <div className="col-span-2 space-y-5">
          {mode === 'customer' ? (
            <div className="glass-panel rounded-xl p-6 space-y-5">
              <div>
                <label className="block text-xs font-mono text-ink-muted uppercase tracking-widest mb-2">
                  <Mail className="inline w-3 h-3 mr-1.5" />Email Address
                </label>
                <input
                  className="input-field"
                  placeholder="doc@hillvalley.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-ink-muted text-xs font-mono">OR</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div>
                <label className="block text-xs font-mono text-ink-muted uppercase tracking-widest mb-2">
                  <Phone className="inline w-3 h-3 mr-1.5" />Phone Number
                </label>
                <input
                  className="input-field"
                  placeholder="1234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
              </div>
              {error && (
                <div className="bg-danger/10 border border-danger/20 rounded-lg px-4 py-3 text-danger text-xs font-mono">
                  {error}
                </div>
              )}
              <div className="flex gap-3 pt-1">
                <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-void/30 border-t-void rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {loading ? 'Identifying...' : 'Identify'}
                </button>
                <button onClick={handleReset} className="btn-ghost flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-panel">
                <Terminal className="w-4 h-4 text-accent" />
                <span className="font-mono text-xs text-ink-muted">POST /identify</span>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-mono text-ink-muted mb-2">email (optional)</label>
                  <input className="input-field" placeholder='"doc@example.com"' value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-mono text-ink-muted mb-2">phoneNumber (optional)</label>
                  <input className="input-field" placeholder='"1234567890"' value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="bg-void rounded-lg p-3 font-mono text-xs text-ink-muted border border-border">
                  <span className="text-accent">POST</span> <span className="text-ink">/identify</span><br />
                  <span className="text-ink-muted">Content-Type: application/json</span><br /><br />
                  <span className="text-warn">{'{'}</span><br />
                  {email && <>&nbsp;&nbsp;"email": <span className="text-accent">"{email}"</span>,<br /></>}
                  {phone && <>&nbsp;&nbsp;"phoneNumber": <span className="text-accent">"{phone}"</span><br /></>}
                  <span className="text-warn">{'}'}</span>
                </div>
                {error && <div className="bg-danger/10 border border-danger/20 rounded-lg px-4 py-3 text-danger text-xs font-mono">{error}</div>}
                <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                  {loading ? <span className="w-4 h-4 border-2 border-void/30 border-t-void rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                  {loading ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Result */}
        <div className="col-span-3">
          {!result && !loading && (
            <div className="h-full glass-panel rounded-xl flex flex-col items-center justify-center text-center p-12 min-h-[320px]">
              <div className="w-16 h-16 rounded-full bg-accent/5 border border-accent/10 flex items-center justify-center mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/10 to-transparent animate-scan" />
                <Link2 className="w-6 h-6 text-accent/40" />
              </div>
              <p className="font-display font-semibold text-ink-muted text-sm">Awaiting identity query</p>
              <p className="font-body text-ink-muted/60 text-xs mt-1">Results will appear here</p>
            </div>
          )}

          {result && (
            <div className="space-y-4 animate-slide-up">
              {/* Consolidated card */}
              <div className="glass-panel rounded-xl overflow-hidden accent-glow border-accent/20">
                <div className="flex items-center justify-between px-6 py-4 border-b border-accent/10 bg-accent/5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    <span className="font-display font-semibold text-accent text-sm">Identity Resolved</span>
                  </div>
                  <span className="tag-primary">
                    <Hash className="w-3 h-3" />
                    Primary ID: {result.contact.primaryContatctId}
                  </span>
                </div>
                <div className="p-6 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-3">
                      <Mail className="inline w-3 h-3 mr-1" />Emails
                    </p>
                    <div className="space-y-1.5">
                      {result.contact.emails.map((e, i) => (
                        <div key={e} className="flex items-center gap-2">
                          {i === 0 && <span className="tag-primary text-[10px] px-1.5 py-0">PRIMARY</span>}
                          {i > 0 && <span className="tag-secondary text-[10px] px-1.5 py-0">SEC</span>}
                          <span className="font-mono text-xs text-ink truncate">{e}</span>
                        </div>
                      ))}
                      {result.contact.emails.length === 0 && <span className="font-mono text-xs text-ink-muted">—</span>}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-3">
                      <Phone className="inline w-3 h-3 mr-1" />Phone Numbers
                    </p>
                    <div className="space-y-1.5">
                      {result.contact.phoneNumbers.map((p, i) => (
                        <div key={p} className="flex items-center gap-2">
                          {i === 0 && <span className="tag-primary text-[10px] px-1.5 py-0">PRIMARY</span>}
                          {i > 0 && <span className="tag-secondary text-[10px] px-1.5 py-0">SEC</span>}
                          <span className="font-mono text-xs text-ink">{p}</span>
                        </div>
                      ))}
                      {result.contact.phoneNumbers.length === 0 && <span className="font-mono text-xs text-ink-muted">—</span>}
                    </div>
                  </div>
                </div>
                {result.contact.secondaryContactIds.length > 0 && (
                  <div className="px-6 pb-5">
                    <p className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-2">Secondary Contact IDs</p>
                    <div className="flex flex-wrap gap-2">
                      {result.contact.secondaryContactIds.map((id) => (
                        <span key={id} className="tag-secondary">
                          <ChevronRight className="w-3 h-3" />#{id}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Raw JSON */}
              <div className="glass-panel rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-panel">
                  <Terminal className="w-3.5 h-3.5 text-ink-muted" />
                  <span className="font-mono text-[11px] text-ink-muted">Response JSON</span>
                </div>
                <pre className="p-4 font-mono text-xs text-ink-muted overflow-x-auto leading-relaxed">{rawJson}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
