import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

const AiPageManager = () => {
  const queryClient = useQueryClient();
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const { data: content, isLoading } = useQuery({
    queryKey: ['content', 'ask_page'],
    queryFn: async () => {
      const res = await api.get('/content');
      return res.data.ask_page || {};
    }
  });

  useEffect(() => {
    if (content?.suggestions) {
      setSuggestions(content.suggestions);
    }
  }, [content]);

  const mutation = useMutation({
    mutationFn: (newContent) => api.post('/content', { ask_page: newContent }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      toast.success('AI Assistant Page updated successfully');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ suggestions: suggestions.filter(s => s.trim() !== '') });
  };

  const handleSuggestionChange = (index: number, value: string) => {
    const newSuggestions = [...suggestions];
    newSuggestions[index] = value;
    setSuggestions(newSuggestions);
  };

  const removeSuggestion = (index: number) => {
    setSuggestions(suggestions.filter((_, i) => i !== index));
  };

  const addSuggestion = () => {
    setSuggestions([...suggestions, '']);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-serif text-ink mb-6">AI Assistant Page Management</h2>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Suggested Questions</label>
          <p className="text-sm text-gray-500 mb-4">These questions appear as quick-click chips below the AI chat window.</p>
          
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="flex gap-2">
                <input 
                  type="text"
                  value={suggestion}
                  onChange={e => handleSuggestionChange(index, e.target.value)}
                  className="flex-1 border border-gray-300 rounded p-2 focus:border-ink outline-none text-sm" 
                  placeholder="e.g. What are Dr. Khare's leadership principles?"
                />
                <button 
                  type="button" 
                  onClick={() => removeSuggestion(index)}
                  className="p-2 bg-red-50 text-red-500 rounded hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          
          <button 
            type="button"
            onClick={addSuggestion}
            className="mt-3 flex items-center gap-1 text-sm font-bold text-ink hover:text-ink/80"
          >
            <Plus className="w-4 h-4" /> Add Suggestion
          </button>
        </div>
        
        <button 
          type="submit" 
          disabled={mutation.isPending}
          className="bg-ink text-white px-8 py-3 rounded font-bold hover:bg-ink/80 transition-colors disabled:opacity-50"
        >
          {mutation.isPending ? 'Saving...' : 'Save AI Page'}
        </button>
      </form>
    </div>
  );
};

export default AiPageManager;
