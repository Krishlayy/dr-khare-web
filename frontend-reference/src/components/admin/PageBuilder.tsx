import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { GripVertical, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const PageBuilder = () => {
  const queryClient = useQueryClient();
  const [sections, setSections] = useState<any[]>([]);

  const { data: content, isLoading } = useQuery({
    queryKey: ['content', 'page_layout'],
    queryFn: async () => {
      const res = await api.get('/content');
      return res.data.page_layout?.sections || [];
    }
  });

  useEffect(() => {
    if (content && content.length > 0) {
      setSections([...content].sort((a: any, b: any) => a.order - b.order));
    }
  }, [content]);

  const mutation = useMutation({
    mutationFn: (newLayout) => api.post('/content', { page_layout: { sections: newLayout } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      toast.success('Page layout updated successfully');
    }
  });

  const handleSave = () => {
    mutation.mutate(sections);
  };

  const toggleVisibility = (index: number) => {
    const newSections = [...sections];
    newSections[index].visible = !newSections[index].visible;
    setSections(newSections);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sections.length - 1) return;
    
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;
    
    // Update orders
    newSections.forEach((sec, i) => sec.order = i + 1);
    
    setSections(newSections);
  };

  if (isLoading) return <div>Loading...</div>;

  const sectionNames: Record<string, string> = {
    hero: 'Hero Banner',
    video: 'Featured Video',
    research: 'Research Impact',
    publications: 'Selected Publications',
    insights: 'Insights & Ideas',
    awards: 'Awards & Honors',
    metrics: 'Impact Metrics',
    journey: 'Featured Journey',
    reviews: 'Patient Reviews',
    ai: 'AI Assistant Callout'
  };

  return (
    <div>
      <h2 className="text-2xl font-serif text-ink mb-6">Homepage Section Builder</h2>
      <p className="text-sm text-gray-500 mb-6 max-w-2xl">
        Reorder the sections of the homepage by moving them up or down. Toggle visibility to hide a section completely from the live website.
      </p>

      <div className="space-y-3 max-w-2xl mb-8">
        {sections.map((section, index) => (
          <div 
            key={section.id} 
            className={`flex items-center gap-4 p-4 rounded-lg border ${section.visible ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
          >
            <div className="flex flex-col gap-1">
              <button 
                onClick={() => moveSection(index, 'up')}
                disabled={index === 0}
                className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
              >
                <GripVertical className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="flex-1 font-bold">
              {sectionNames[section.id] || section.id}
            </div>

            <button 
              onClick={() => toggleVisibility(index)}
              className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
            >
              {section.visible ? (
                <><Eye className="w-4 h-4" /> Visible</>
              ) : (
                <><EyeOff className="w-4 h-4" /> Hidden</>
              )}
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={handleSave}
        disabled={mutation.isPending}
        className="bg-ink text-white px-8 py-3 rounded font-bold hover:bg-ink/80 transition-colors disabled:opacity-50"
      >
        {mutation.isPending ? 'Saving...' : 'Save Page Layout'}
      </button>
    </div>
  );
};

export default PageBuilder;
