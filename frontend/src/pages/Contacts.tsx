import { useState } from 'react';
import { Search, Filter, Users, Mail, Phone, Hash, Link2, Crown, ChevronDown } from 'lucide-react';

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
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="font-mono text-accent text-xs tracking-widest uppercase">Database</span>
        </div>
        <h1 className="font-display font-bold text-3xl text-ink">Contact Registry</h1>
        <p className="text-ink-muted text-sm mt-1">View and search all tracked identities.</p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            className="input-field pl-10"
            placeholder="Search email, phone, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1 p-1 bg-surface border border-border rounded-lg">
          <Filter className="w-3.5 h-3.5 text-ink-muted ml-2" />
          {(['all', 'primary', 'secondary'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded text-xs font-mono capitalize transition-all ${
                filter === f ? 'bg-accent/10 text-accent' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 text-ink-muted text-xs font-mono">
          <Users className="w-3.5 h-3.5" />
          {filtered.length} contact{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-border bg-panel text-[10px] font-mono text-ink-muted uppercase tracking-widest">
          <div className="col-span-1">ID</div>
          <div className="col-span-4">Email</div>
          <div className="col-span-2">Phone</div>
          <div className="col-span-2">Precedence</div>
          <div className="col-span-2">Linked To</div>
          <div className="col-span-1">Created</div>
        </div>

        <div className="divide-y divide-border/50">
          {filtered.map((contact) => {
            const linkedContacts = getLinkedContacts(contact.id);
            const isExpanded = expandedId === contact.id;

            return (
              <div key={contact.id}>
                <div
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-panel/50 transition-colors cursor-pointer items-center"
                  onClick={() => setExpandedId(isExpanded ? null : contact.id)}
                >
                  <div className="col-span-1">
                    <span className="font-mono text-xs text-ink-muted flex items-center gap-1">
                      <Hash className="w-3 h-3" />{contact.id}
                    </span>
                  </div>
                  <div className="col-span-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-ink-muted shrink-0" />
                      <span className="font-mono text-xs text-ink truncate">
                        {contact.email ?? <span className="text-ink-muted">—</span>}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-ink-muted shrink-0" />
                      <span className="font-mono text-xs text-ink">
                        {contact.phoneNumber ?? <span className="text-ink-muted">—</span>}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    {contact.linkPrecedence === 'primary' ? (
                      <span className="tag-primary text-[10px]">
                        <Crown className="w-3 h-3" /> Primary
                      </span>
                    ) : (
                      <span className="tag-secondary text-[10px]">Secondary</span>
                    )}
                  </div>
                  <div className="col-span-2">
                    {contact.linkedId ? (
                      <span className="flex items-center gap-1 font-mono text-xs text-ink-muted">
                        <Link2 className="w-3 h-3" />#{contact.linkedId}
                      </span>
                    ) : (
                      <span className="text-ink-muted text-xs font-mono">Root</span>
                    )}
                  </div>
                  <div className="col-span-1 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-ink-muted">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </span>
                    {linkedContacts.length > 0 && (
                      <ChevronDown className={`w-3.5 h-3.5 text-accent transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </div>

                {/* Expanded secondaries */}
                {isExpanded && linkedContacts.length > 0 && (
                  <div className="bg-accent/3 border-t border-accent/10">
                    {linkedContacts.map((linked) => (
                      <div key={linked.id} className="grid grid-cols-12 gap-4 px-6 py-3 items-center opacity-75">
                        <div className="col-span-1">
                          <span className="font-mono text-xs text-ink-muted flex items-center gap-1 pl-3 border-l-2 border-accent/30">
                            <Hash className="w-3 h-3" />{linked.id}
                          </span>
                        </div>
                        <div className="col-span-4">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 text-ink-muted shrink-0" />
                            <span className="font-mono text-xs text-ink-muted truncate">{linked.email ?? '—'}</span>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <span className="font-mono text-xs text-ink-muted">{linked.phoneNumber ?? '—'}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="tag-secondary text-[10px]">Secondary</span>
                        </div>
                        <div className="col-span-2">
                          <span className="flex items-center gap-1 font-mono text-xs text-ink-muted">
                            <Link2 className="w-3 h-3 text-accent/50" />#{linked.linkedId}
                          </span>
                        </div>
                        <div className="col-span-1">
                          <span className="font-mono text-[10px] text-ink-muted">
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
            <div className="px-6 py-16 text-center">
              <p className="font-display text-ink-muted text-sm">No contacts found</p>
              <p className="font-body text-ink-muted/60 text-xs mt-1">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
