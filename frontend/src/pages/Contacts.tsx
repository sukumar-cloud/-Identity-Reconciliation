import { useEffect, useState } from react;
import { Search, Mail, Phone, Crown } from lucide-react;
import { getAllContacts } from ../api;
import { Contact } from ../types;

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(");

 useEffect(() => {
 const fetchContacts = async () => {
 try {
 const data = await getAllContacts();
 setContacts(data);
 } catch (error) {
 console.error(Failed to fetch contacts:, error);
 } finally {
 setLoading(false);
 }
 };

 fetchContacts();
 const interval = setInterval(fetchContacts, 10000);
 return () => clearInterval(interval);
 }, []);

 const filteredContacts = contacts.filter(c => 
 c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
 c.phoneNumber?.includes(searchQuery)
 );

 return (
 <div className=p-12 animate-fade-in max-w-7xl mx-auto>
 <div className=mb-12 border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6>
 <div>
 <h1 className=font-display font-bold text-4xl text-white tracking-tight>Identity Registry</h1>
 <p className=text-white/40 text-sm mt-2 font-body max-w-xl>Centralized directory of all identified and linked contacts.</p>
 </div>
 
 <div className=relative group min-w-[320px]>
 <Search className=absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors />
 <input 
 type=text
 placeholder=Search by email or phone...
 className=input-field pl-12
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 />
 </div>
 </div>

 <div className=border border-white/10>
 <table className=w-full text-left border-collapse>
 <thead>
 <tr className=border-b border-white/10 bg-white/[0.02]>
 <th className=px-8 py-5 text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]>Identification</th>
 <th className=px-8 py-5 text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]>Precedence</th>
 <th className=px-8 py-5 text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]>System ID</th>
 <th className=px-8 py-5 text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] text-right>Registered</th>
 </tr>
 </thead>
 <tbody className=divide-y divide-white/10>
 {loading && contacts.length === 0 ? (
 <tr>
 <td colSpan={4} className=px-8 py-12 text-center text-white/20 font-mono text-[10px] uppercase tracking-widest>
 Initializing registry...
 </td>
 </tr>
 ) : filteredContacts.length === 0 ? (
 <tr>
 <td colSpan={4} className=px-8 py-12 text-center text-white/20 font-mono text-[10px] uppercase tracking-widest>
 No matching records found
 </td>
 </tr>
 ) : (
 filteredContacts.map((contact) => (
 <tr key={contact.id} className=hover:bg-white/[0.02] transition-colors group>
 <td className=px-8 py-6>
 <div className=space-y-1.5>
 <div className=flex items-center gap-2>
 <Mail className=w-3 h-3 text-white/20 />
 <span className=text-sm font-mono text-white tracking-tight>
 {contact.email || <span className=text-white/10>NO EMAIL</span>}
 </span>
 </div>
 {contact.phoneNumber && (
 <div className=flex items-center gap-2>
 <Phone className=w-3 h-3 text-white/20 />
 <span className=text-[10px] font-mono text-white/40>+{contact.phoneNumber}</span>
 </div>
 )}
 </div>
 </td>
 <td className=px-8 py-6>
 <div className=flex items-center gap-3>
 {contact.linkPrecedence === primary ? (
 <div className=flex items-center gap-2 px-2 py-0.5 bg-white text-black text-[9px] font-mono uppercase tracking-widest>
 <Crown className=w-3 h-3 />
 Primary
 </div>
 ) : (
 <div className=flex items-center gap-2 px-2 py-0.5 border border-white/10 text-white/40 text-[9px] font-mono uppercase tracking-widest>
 Secondary
 </div>
 )}
 </div>
 </td>
 <td className=px-8 py-6>
 <div className=space-y-1>
 <p className=text-[10px] font-mono text-white tracking-widest>ID: {String(contact.id).padStart(4, 0)}</p>
 {contact.linkedId && (
 <p className=text-[9px] font-mono text-white/20 uppercase tracking-tight>Linked to #{String(contact.linkedId).padStart(4, 0)}</p>
 )}
 </div>
 </td>
 <td className=px-8 py-6 text-right>
 <p className=text-[10px] font-mono text-white/40 uppercase tracking-widest>
 {new Date(contact.createdAt).toLocaleDateString()}
 </p>
 <p className=text-[9px] font-mono text-white/20 mt-1 uppercase>
 {new Date(contact.createdAt).toLocaleTimeString([], { hour: 2-digit, minute: 2-digit })}
 </p>
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>
 );
}
