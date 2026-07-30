import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { format } from 'date-fns';

const ContactManager = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = () => {
    setLoading(true);
    api.get('/contact')
      .then(res => setMessages(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/contact/${id}/read`);
      setMessages(messages.map(m => m._id === id ? { ...m, read: true } : m));
    } catch (err) {
      alert('Error marking as read');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/contact/${id}`);
      fetchMessages();
    } catch (err) {
      alert('Error deleting');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif text-ink">Contact Inbox</h1>
      </div>

      <div className="bg-white rounded border border-gray-200 overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No messages in inbox.</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {messages.map((msg) => (
              <div key={msg._id} className={`p-6 ${msg.read ? 'bg-white' : 'bg-blue-50/30'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      {msg.name}
                      {!msg.read && <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">New</span>}
                    </h3>
                    <a href={`mailto:${msg.email}`} className="text-sm text-ink hover:underline">{msg.email}</a>
                    {msg.phone && <span className="text-sm text-gray-500 ml-4">{msg.phone}</span>}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{format(new Date(msg.createdAt), 'PP pp')}</div>
                    <div className="mt-2 space-x-3">
                      {!msg.read && (
                        <button onClick={() => markAsRead(msg._id)} className="text-xs font-bold text-ink hover:underline uppercase tracking-wider">Mark Read</button>
                      )}
                      <button onClick={() => handleDelete(msg._id)} className="text-xs font-bold text-red-500 hover:underline uppercase tracking-wider">Delete</button>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded text-sm text-gray-800 whitespace-pre-wrap border border-gray-100">
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactManager;
