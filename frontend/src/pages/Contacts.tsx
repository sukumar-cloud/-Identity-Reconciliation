import { useState } from 'react';
import { Search, Users, Mail, Phone, Crown, ChevronDown } from 'lucide-react';

// Mock data for display — in production this comes from GET /contacts
const mockContacts = [
  { id: 1, email: 'lorraine@hillvalley.edu', phoneNumber: '123456', linkedId: null, linkPrecedence: 'primary' as const, createdAt: '2023-04-01T00:00:00Z', updatedAt: '2023-04-01T00:00:00Z' },
  { id: 23, email: 'mcfly@hillvalley.edu', phoneNumber: '123456', linkedId: 1, linkPrecedence: 'secondary' as const, createdAt: '2023-04-20T05:30:00Z', updatedAt: '2023-04-20T05:30:00Z' },
  { id: 11, email: 'george@hillvalley.edu', phoneNumber: '919191', linkedId: null, linkPrecedence: 'primary' as const, createdAt: '2023-04-11T00:00:00Z', updatedAt: '2023-04-11T00:00:00Z' },
  { id: 27, email: 'biffsucks@hillvalley.edu', phoneNumber: '717171', linkedId: 11, linkPrecedence: 'secondary' as const, createdAt: '2023-04-21T05:30:00Z', updatedAt: '2023-04-28T06:40:00Z' },
  { id: 5, email: 'doc@hillvalley.edu', phoneNumber: '555000', linkedId: null, linkPrecedence: 'primary' as const, createdAt: '2023-03-15T00:00:00Z', updatedAt: '2023-03-15T00:00:00Z' },
  { id: 8, email: 'emmett@hillvalley.edu', phoneNumber: null, linkedId: 5, linkPrecedence: 'secondary' as const, createdAt: '2023-03-20T00:00:00Z', updatedAt: '2023-03-20T00:00:00Z' },
];

type FilterType = 'all' | 'primary' | 'secondary';

export default function Contacts() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = mockContacts.filter((c) => {
    const matchSearch =
      !search ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phoneNumber?.includes(search) ||
      String(c.id).includes(search);
    const matchFilter = filter === 'all' || c.linkPrecedence === filter;
    return matchSearch && matchFilter;
  });

  const getLinkedContacts = (primaryId: number) =>
    mockContacts.filter((c) => c.linkedId === primaryId);

  return (
    <div className="p-12 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12 border-b border-white/10 pb-8">
        <h1 className="font-display font-bold text-4xl text-white tracking-tight">Contact Registry</h1>
        <p className="text-white/40 text-sm mt-2 font-body max-w-xl">View and search all tracked identities.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            className="input-field pl-12"
            placeholder="SEARCH BY EMAIL, PHONE, OR ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex border border-white/10">
          {(['all', 'primary', 'secondary'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-3 text-[10px] font-mono uppercase tracking-widest transition-all ${
                filter === f ? 'bg-white text-black' : 'text-white/40 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-white/20 text-[10px] font-mono uppercase tracking-widest">
          <Users className="w-3.5 h-3.5" />
          {filtered.length} RECORDS
        </div>
      </div>

      {/* Table */}
      <div className="border border-white/10">
        <div className="grid grid-cols-12 gap-4 px-8 py-4 border-b border-white/10 bg-white/[0.02] text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">
          <div className="col-span-1">ID</div>
          <div className="col-span-4">Identity Details</div>
          <div className="col-span-3">Relationship</div>
          <div className="col-span-2">Linked</div>
          <div className="col-span-2 text-right">Created</div>
        </div>

        <div className="divide-y divide-white/10">
          {filtered.map((contact) => {
            const linkedContacts = getLinkedContacts(contact.id);
            const isExpanded = expandedId === contact.id;

            return (
              <div key={contact.id} className="group">
                <div
                  className="grid grid-cols-12 gap-4 px-8 py-6 hover:bg-white/[0.02] transition-all cursor-pointer items-center"
                  onClick={() => setExpandedId(isExpanded ? null : contact.id)}
                >
                  <div className="col-span-1">
                    <span className="font-mono text-xs text-white/40">#{contact.id}</span>
                  </div>
                  <div className="col-span-4 space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-white/20" />
                      <span className="font-mono text-xs text-white">{contact.email ?? '—'}</span>
                    </div>
                    {contact.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-white/20" />
                        <span className="font-mono text-[10px] text-white/40">+{contact.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                  <div className="col-span-3">
                    {contact.linkPrecedence === 'primary' ? (
                      <span className="text-[10px] font-mono border border-white px-2 py-0.5 bg-white text-black uppercase tracking-wider flex items-center gap-2 w-fit">
                        <Crown className="w-3 h-3" /> PRIMARY
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono border border-white/10 px-2 py-0.5 text-white/40 uppercase tracking-wider w-fit block">
                        SECONDARY
                      </span>
                    )}
                  </div>
                  <div className="col-span-2">
                    {contact.linkedId ? (
                      <span className="font-mono text-xs text-white/40 uppercase tracking-widest">→ #{contact.linkedId}</span>
                    ) : (
                      <span className="font-mono text-[10px] text-white/20 uppercase tracking-[0.2em]">ORIGIN</span>
                    )}
                  </div>
                  <div className="col-span-2 text-right flex items-center justify-end gap-4">
                    <span className="font-mono text-[10px] text-white/20 uppercase">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </span>
                    {linkedContacts.length > 0 && (
                      <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-white' : ''}`} />
                    )}
                  </div>
                </div>

                {/* Expanded secondaries */}
                {isExpanded && linkedContacts.length > 0 && (
                  <div className="bg-white/[0.03] border-t border-white/10">
                    {linkedContacts.map((linked) => (
                      <div key={linked.id} className="grid grid-cols-12 gap-4 px-8 py-4 items-center border-b border-white/[0.05] last:border-0">
                        <div className="col-span-1">
                          <span className="font-mono text-xs text-white/20 pl-4 border-l border-white/20">#{linked.id}</span>
                        </div>
                        <div className="col-span-4 space-y-1 opacity-60">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-white">{linked.email ?? '—'}</span>
                          </div>
                          {linked.phoneNumber && (
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] text-white/40">+{linked.phoneNumber}</span>
                            </div>
                          )}
                        </div>
                        <div className="col-span-3">
                          <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest pl-2">SUB-RECORD</span>
                        </div>
                        <div className="col-span-2 opacity-40">
                          <span className="font-mono text-xs">→ #{linked.linkedId}</span>
                        </div>
                        <div className="col-span-2 text-right">
                          <span className="font-mono text-[10px] text-white/10 uppercase">
                            {new Date(linked.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-24 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/20">No matching records</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
