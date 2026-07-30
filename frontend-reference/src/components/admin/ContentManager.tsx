import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";
import { Save } from "lucide-react";

export default function ContentManager() {
  const queryClient = useQueryClient();

  const { data: contentMap, isLoading } = useQuery({
    queryKey: ['content'],
    queryFn: async () => {
      const res = await api.get('/content');
      return res.data;
    }
  });

  const [localData, setLocalData] = useState<any>(null);

  if (contentMap && !localData) {
    setLocalData(JSON.parse(JSON.stringify(contentMap.homepage_content || {})));
  }

  const mutation = useMutation({
    mutationFn: async (updates: any) => {
      await api.post('/content', { homepage_content: updates });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      alert("Homepage content saved successfully.");
    }
  });

  const handleSave = () => {
    mutation.mutate(localData);
  };

  if (isLoading || !localData) return <div className="p-10 text-muted-foreground">Loading homepage settings...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display">Homepage Content</h2>
        <button 
          onClick={handleSave}
          disabled={mutation.isPending}
          className="bg-gold text-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {mutation.isPending ? 'Saving...' : 'Save Homepage'}
        </button>
      </div>

      <div className="space-y-4 bg-background/50 border border-rule/50 p-6 rounded-2xl">
        <h3 className="text-lg font-medium mb-4">Hero Section</h3>
        <div>
          <label className="block text-sm mb-1">Hero Title</label>
          <textarea value={localData.hero_title || ''} onChange={e => setLocalData({...localData, hero_title: e.target.value})} className="w-full bg-background border border-rule/50 rounded-lg px-4 py-2 focus:border-gold outline-none" rows={2} />
        </div>
        <div>
          <label className="block text-sm mb-1">Hero Subtitle</label>
          <textarea value={localData.hero_subtitle || ''} onChange={e => setLocalData({...localData, hero_subtitle: e.target.value})} className="w-full bg-background border border-rule/50 rounded-lg px-4 py-2 focus:border-gold outline-none" rows={3} />
        </div>
        <div>
          <label className="block text-sm mb-1">Hero Background Image URL (Optional)</label>
          <input value={localData.hero_background || ''} onChange={e => setLocalData({...localData, hero_background: e.target.value})} className="w-full bg-background border border-rule/50 rounded-lg px-4 py-2 focus:border-gold outline-none" placeholder="/assets/bg.jpg or https://..." />
        </div>
        <div>
          <label className="block text-sm mb-1">About Snippet</label>
          <textarea value={localData.about_snippet || ''} onChange={e => setLocalData({...localData, about_snippet: e.target.value})} className="w-full bg-background border border-rule/50 rounded-lg px-4 py-2 focus:border-gold outline-none" rows={3} />
        </div>
        
        <div className="grid grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-sm mb-1">Primary CTA Text</label>
            <input value={localData.cta_primary_text || ''} onChange={e => setLocalData({...localData, cta_primary_text: e.target.value})} className="w-full bg-background border border-rule/50 rounded-lg px-4 py-2 focus:border-gold outline-none" />
          </div>
          <div>
            <label className="block text-sm mb-1">Primary CTA URL</label>
            <input value={localData.cta_primary_url || ''} onChange={e => setLocalData({...localData, cta_primary_url: e.target.value})} className="w-full bg-background border border-rule/50 rounded-lg px-4 py-2 focus:border-gold outline-none" />
          </div>
          <div>
            <label className="block text-sm mb-1">Secondary CTA Text</label>
            <input value={localData.cta_secondary_text || ''} onChange={e => setLocalData({...localData, cta_secondary_text: e.target.value})} className="w-full bg-background border border-rule/50 rounded-lg px-4 py-2 focus:border-gold outline-none" />
          </div>
          <div>
            <label className="block text-sm mb-1">Secondary CTA URL</label>
            <input value={localData.cta_secondary_url || ''} onChange={e => setLocalData({...localData, cta_secondary_url: e.target.value})} className="w-full bg-background border border-rule/50 rounded-lg px-4 py-2 focus:border-gold outline-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
