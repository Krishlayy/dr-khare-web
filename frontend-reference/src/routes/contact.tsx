import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import api from '../lib/api';
import { useQuery } from '@tanstack/react-query';

export const Route = createFileRoute('/contact')({
  component: ContactRoute,
});

function ContactRoute() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');

  const { data: contactData } = useQuery({
    queryKey: ['content', 'page_contact'],
    queryFn: async () => {
      const res = await api.get('/content');
      return res.data.page_contact;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.post('/contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
    }
  };

  if (!contactData) return null;

  return (
    <div className="mx-auto max-w-7xl px-6 py-20 md:px-10">
      <div className="mb-16">
        <h1 className="font-display text-4xl font-light tracking-tight sm:text-5xl">{contactData.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          {contactData.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16">
        <form onSubmit={handleSubmit} className="space-y-6 bg-background/50 border border-rule/50 rounded-2xl p-8 sm:p-10 shadow-sm h-fit">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <input 
                id="name"
                required 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-background border border-rule/60 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-foreground/50 transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <input 
                id="email"
                type="email" 
                required 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-background border border-rule/60 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-foreground/50 transition-colors" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">Subject</label>
            <input 
              id="subject"
              required 
              value={formData.subject}
              onChange={e => setFormData({...formData, subject: e.target.value})}
              className="w-full bg-background border border-rule/60 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-foreground/50 transition-colors" 
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">Message</label>
            <textarea 
              id="message"
              required 
              rows={5}
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
              className="w-full bg-background border border-rule/60 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-foreground/50 transition-colors resize-none" 
            />
          </div>
          <button 
            type="submit" 
            disabled={status === 'sending'}
            className="w-full sm:w-auto rounded-full bg-foreground px-8 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
          >
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>
          {status === 'success' && <p className="text-green-600 text-sm mt-2">Message sent successfully.</p>}
          {status === 'error' && <p className="text-red-500 text-sm mt-2">Failed to send message. Please try again.</p>}
        </form>

        <div className="space-y-12 border-t lg:border-t-0 lg:border-l border-rule/30 pt-12 lg:pt-0 lg:pl-12">
          {contactData.locations && contactData.locations.length > 0 && (
            <div>
              <h3 className="font-display text-xl mb-6">Offices</h3>
              <div className="space-y-8">
                {contactData.locations.map((loc: any, idx: number) => (
                  <div key={idx}>
                    <p className="font-medium text-sm mb-1">{loc.name}</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed mb-2">
                      {loc.address}
                    </p>
                    <p className="text-sm text-foreground">{loc.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {contactData.emails && contactData.emails.length > 0 && (
            <div>
              <h3 className="font-display text-xl mb-6">Direct Inquiries</h3>
              <div className="space-y-6">
                {contactData.emails.map((em: any, idx: number) => (
                  <div key={idx}>
                    <p className="font-medium text-sm mb-1">{em.name}</p>
                    <a href={`mailto:${em.address}`} className="text-sm text-gold hover:underline">
                      {em.address}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
