import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { format } from 'date-fns';
import { Send, Loader2 } from 'lucide-react';

export default function NewsletterManager() {
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [sendSegment, setSendSegment] = useState('all');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  const { data: subscribers, isLoading } = useQuery({
    queryKey: ['newsletter', segmentFilter],
    queryFn: async () => {
      const res = await api.get(`/newsletter${segmentFilter !== 'all' ? `?segment=${segmentFilter}` : ''}`);
      return res.data;
    },
  });

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await api.post('/newsletter/send', { subject, body, segment: sendSegment });
      alert(res.data.message);
      setSubject('');
      setBody('');
    } catch (err) {
      alert('Error sending newsletter');
    } finally {
      setSending(false);
    }
  };

  if (isLoading) return <div>Loading subscribers...</div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-display">Newsletter & Announcements</h2>
          <p className="text-muted-foreground mt-1 text-sm">Manage audience segments and send executive briefs.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={segmentFilter} 
            onChange={(e) => setSegmentFilter(e.target.value)}
            className="px-4 py-2 bg-foreground/5 border border-rule/30 text-sm rounded-lg"
          >
            <option value="all">All Segments</option>
            <option value="general">General</option>
            <option value="patients">Patients</option>
            <option value="professionals">Professionals</option>
          </select>
          <button 
            onClick={() => {
              const csv = subscribers?.map((s: any) => `${s.name || ''},${s.email},${s.segment},${s.status},${s.createdAt}`).join('\n');
              const blob = new Blob([`Name,Email,Segment,Status,Date\n${csv}`], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'subscribers.csv';
              a.click();
            }}
            className="px-4 py-2 bg-foreground text-background text-sm rounded-lg hover:bg-foreground/90 transition-colors"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-foreground/5 rounded-xl border border-rule/30 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-foreground/10 text-foreground/80 font-medium">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Segment</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule/30">
              {subscribers?.map((sub: any) => (
                <tr key={sub._id} className="hover:bg-foreground/5 transition-colors">
                  <td className="px-6 py-4 text-muted-foreground">{sub.name || '-'}</td>
                  <td className="px-6 py-4 font-medium">{sub.email}</td>
                  <td className="px-6 py-4 capitalize text-muted-foreground">{sub.segment}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${sub.status === 'subscribed' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                      {sub.status}
                    </span>
                  </td>
                </tr>
              ))}
              {subscribers?.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No subscribers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-foreground/5 rounded-xl border border-rule/30 p-6 h-fit">
          <h3 className="font-display text-xl mb-4">Compose Brief</h3>
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Audience Segment</label>
              <select 
                value={sendSegment} 
                onChange={(e) => setSendSegment(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-rule/30 text-sm rounded-lg focus:outline-none focus:border-gold/50"
              >
                <option value="all">All Subscribers</option>
                <option value="general">General Updates</option>
                <option value="patients">Patients</option>
                <option value="professionals">Healthcare Professionals</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Subject</label>
              <input 
                type="text" 
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-rule/30 text-sm rounded-lg focus:outline-none focus:border-gold/50"
                placeholder="e.g. October Policy Updates"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Message</label>
              <textarea 
                required
                rows={6}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-rule/30 text-sm rounded-lg focus:outline-none focus:border-gold/50 resize-none"
                placeholder="Compose your newsletter..."
              />
            </div>
            <button 
              type="submit" 
              disabled={sending}
              className="w-full px-4 py-3 bg-gold text-foreground text-sm font-medium rounded-lg hover:bg-gold/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send Newsletter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
