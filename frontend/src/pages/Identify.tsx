import { useState } from 'react';
import { Terminal, Send, RotateCcw, Link2 } from 'lucide-react';
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
    <div className="p-12 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12 border-b border-white/10 pb-8">
        <h1 className="font-display font-bold text-4xl text-white tracking-tight">Identify Contact</h1>
        <p className="text-white/40 text-sm mt-2 font-body max-w-xl">Resolve and consolidate customer identity across all touchpoints.</p>
      </div>

      {/* Mode toggle */}
      <div className="flex border border-white/10 w-fit mb-12">
        {(['customer', 'api'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-8 py-3 text-xs font-mono uppercase tracking-widest transition-all ${
              mode === m ? 'bg-white text-black' : 'text-white/40 hover:text-white'
            }`}
          >
            {m === 'customer' ? 'Form' : 'API Tester'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Form */}
        <div className="lg:col-span-5 space-y-8">
          {mode === 'customer' ? (
            <div className="border border-white/10 p-8 space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-3">
                    Email Address
                  </label>
                  <input
                    className="input-field"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="text-white/20 text-[10px] font-mono">OR</span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-3">
                    Phone Number
                  </label>
                  <input
                    className="input-field"
                    placeholder="1234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  />
                </div>
              </div>
              
              {error && (
                <div className="border border-white/10 p-4 text-white/60 text-[10px] font-mono leading-relaxed uppercase tracking-wider">
                  Error: {error}
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-3 uppercase tracking-widest text-xs font-mono">
                  {loading ? (
                    <span className="w-3 h-3 border border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  {loading ? 'Processing' : 'Identify'}
                </button>
                <button onClick={handleReset} className="border border-white/10 px-4 flex items-center justify-center hover:border-white transition-colors">
                  <RotateCcw className="w-3.5 h-3.5 text-white/40" />
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-white/10 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
                <Terminal className="w-3.5 h-3.5 text-white/40" />
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">POST /identify</span>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-3">Email (optional)</label>
                  <input className="input-field" placeholder='"doc@example.com"' value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-3">Phone (optional)</label>
                  <input className="input-field" placeholder='"1234567890"' value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="bg-white/[0.02] border border-white/10 p-6 font-mono text-[11px] leading-relaxed">
                  <p className="text-white/40 mb-4 uppercase tracking-widest">Request Payload</p>
                  <div className="text-white/60">
                    <span>{'{'}</span><br />
                    {email && <>&nbsp;&nbsp;"email": <span className="text-white">"{email}"</span>,<br /></>}
                    {phone && <>&nbsp;&nbsp;"phoneNumber": <span className="text-white">"{phone}"</span><br /></>}
                    <span>{'}'}</span>
                  </div>
                </div>
                {error && <div className="border border-white/10 p-4 text-white/60 text-[10px] font-mono uppercase tracking-widest">{error}</div>}
                <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-3 uppercase tracking-widest text-xs font-mono">
                  {loading ? <span className="w-3 h-3 border border-black/30 border-t-black rounded-full animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  {loading ? 'Sending' : 'Send Request'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Result */}
        <div className="lg:col-span-7">
          {!result && !loading && (
            <div className="h-full border border-white/10 border-dashed flex flex-col items-center justify-center text-center p-12 min-h-[400px]">
              <div className="w-12 h-12 border border-white/10 flex items-center justify-center mb-6">
                <Link2 className="w-5 h-5 text-white/20" />
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/20">Awaiting Query</p>
            </div>
          )}

          {result && (
            <div className="space-y-8 animate-slide-up">
              <div className="border border-white">
                <div className="flex items-center justify-between px-8 py-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white" />
                    <span className="text-xs font-mono uppercase tracking-[0.2em]">Identity Resolved</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/40">
                    PRIMARY ID: {result.contact.primaryContatctId}
                  </span>
                </div>
                
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">Emails</p>
                    <div className="space-y-3">
                      {result.contact.emails.map((e, i) => (
                        <div key={e} className="flex items-center gap-3">
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 border ${i === 0 ? 'bg-white text-black border-white' : 'border-white/10 text-white/40'}`}>
                            {i === 0 ? 'PRI' : 'SEC'}
                          </span>
                          <span className="font-mono text-xs text-white">{e}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">Phone Numbers</p>
                    <div className="space-y-3">
                      {result.contact.phoneNumbers.map((p, i) => (
                        <div key={p} className="flex items-center gap-3">
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 border ${i === 0 ? 'bg-white text-black border-white' : 'border-white/10 text-white/40'}`}>
                            {i === 0 ? 'PRI' : 'SEC'}
                          </span>
                          <span className="font-mono text-xs text-white">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {result.contact.secondaryContactIds.length > 0 && (
                  <div className="px-8 pb-8">
                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-4">Linked Identities</p>
                    <div className="flex flex-wrap gap-2">
                      {result.contact.secondaryContactIds.map((id) => (
                        <span key={id} className="text-[10px] font-mono border border-white/10 px-3 py-1 text-white/60">
                          #{id}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Raw JSON */}
              <div className="border border-white/10">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
                  <Terminal className="w-3.5 h-3.5 text-white/20" />
                  <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">RAW RESPONSE</span>
                </div>
                <pre className="p-8 font-mono text-[11px] text-white/40 overflow-x-auto leading-relaxed">{rawJson}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
