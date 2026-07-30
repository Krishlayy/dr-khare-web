import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';

const AboutManager = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    biography_lead: '',
    biography_body: '',
    clinical_leadership: '',
    research: ''
  });

  const { data: content, isLoading } = useQuery({
    queryKey: ['content', 'about_page'],
    queryFn: async () => {
      const res = await api.get('/content');
      return res.data.about_page || {};
    }
  });

  useEffect(() => {
    if (content) {
      setFormData({
        biography_lead: content.biography_lead || '',
        biography_body: content.biography_body || '',
        clinical_leadership: content.clinical_leadership || '',
        research: content.research || ''
      });
    }
  }, [content]);

  const mutation = useMutation({
    mutationFn: (newContent) => api.post('/content', { about_page: newContent }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      alert('About page updated successfully');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-serif text-ink mb-6">About Page Management</h2>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Biography Lead (Header)</label>
          <textarea 
            rows={3}
            value={formData.biography_lead}
            onChange={e => setFormData({...formData, biography_lead: e.target.value})}
            className="w-full border border-gray-300 rounded p-3 focus:border-ink outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Biography Body</label>
          <textarea 
            rows={5}
            value={formData.biography_body}
            onChange={e => setFormData({...formData, biography_body: e.target.value})}
            className="w-full border border-gray-300 rounded p-3 focus:border-ink outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Clinical Leadership & Advocacy</label>
          <textarea 
            rows={5}
            value={formData.clinical_leadership}
            onChange={e => setFormData({...formData, clinical_leadership: e.target.value})}
            className="w-full border border-gray-300 rounded p-3 focus:border-ink outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Research & Academic Contributions</label>
          <textarea 
            rows={5}
            value={formData.research}
            onChange={e => setFormData({...formData, research: e.target.value})}
            className="w-full border border-gray-300 rounded p-3 focus:border-ink outline-none" 
          />
        </div>
        <button 
          type="submit" 
          disabled={mutation.isPending}
          className="bg-ink text-white px-8 py-3 rounded font-bold hover:bg-ink/80 transition-colors disabled:opacity-50"
        >
          {mutation.isPending ? 'Saving...' : 'Save About Page'}
        </button>
      </form>
    </div>
  );
};

export default AboutManager;
