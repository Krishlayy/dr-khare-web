import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";
import { Save } from "lucide-react";
import { toast } from "sonner";

export default function SiteSettingsManager() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'seo' | 'footer' | 'contact'>('seo');

  const { data: contentMap, isLoading } = useQuery({
    queryKey: ['content'],
    queryFn: async () => {
      const res = await api.get('/content');
      return res.data;
    }
  });

  const [localData, setLocalData] = useState<any>(null);

  if (contentMap && !localData) {
    setLocalData(JSON.parse(JSON.stringify(contentMap)));
  }

  const mutation = useMutation({
    mutationFn: async (updates: any) => {
      await api.post('/content', updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      toast.success("Settings saved successfully.");
    }
  });

  const handleSave = () => {
    mutation.mutate({
      global_seo: localData.global_seo,
      global_footer: localData.global_footer,
      page_contact: localData.page_contact,
    });
  };

  if (isLoading || !localData) return <div className="p-10 text-muted-foreground">Loading settings...</div>;

  const seo = localData.global_seo || {};
  const footer = localData.global_footer || {};
  const contact = localData.page_contact || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display">Global Site Settings</h2>
        <button 
          onClick={handleSave}
          disabled={mutation.isPending}
          className="bg-gold text-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {mutation.isPending ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="flex border-b border-rule/30 mb-6">
        <button onClick={() => setActiveTab('seo')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'seo' ? 'border-b-2 border-gold text-gold' : 'text-muted-foreground hover:text-foreground'}`}>SEO & Branding</button>
        <button onClick={() => setActiveTab('footer')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'footer' ? 'border-b-2 border-gold text-gold' : 'text-muted-foreground hover:text-foreground'}`}>Footer</button>
        <button onClick={() => setActiveTab('contact')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'contact' ? 'border-b-2 border-gold text-gold' : 'text-muted-foreground hover:text-foreground'}`}>Contact Page</button>
      </div>

      {activeTab === 'seo' && (
        <div className="space-y-4 bg-background/50 border border-rule/50 p-6 rounded-2xl">
          <h3 className="text-lg font-medium mb-4">SEO & Metadata</h3>
          <div>
            <label className="block text-sm mb-1">Site Title (Meta Title)</label>
            <input value={seo.default_title || ''} onChange={e => setLocalData({...localData, global_seo: {...seo, default_title: e.target.value}})} className="w-full bg-background border border-rule/50 rounded-lg px-4 py-2 focus:border-gold outline-none" />
          </div>
          <div>
            <label className="block text-sm mb-1">Meta Description</label>
            <textarea value={seo.default_description || ''} onChange={e => setLocalData({...localData, global_seo: {...seo, default_description: e.target.value}})} className="w-full bg-background border border-rule/50 rounded-lg px-4 py-2 focus:border-gold outline-none" rows={3} />
          </div>
          <div>
            <label className="block text-sm mb-1">Site Logo URL</label>
            <input value={seo.logo_url || ''} onChange={e => setLocalData({...localData, global_seo: {...seo, logo_url: e.target.value}})} className="w-full bg-background border border-rule/50 rounded-lg px-4 py-2 focus:border-gold outline-none" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm mb-1">Favicon URL</label>
            <input value={seo.favicon_url || ''} onChange={e => setLocalData({...localData, global_seo: {...seo, favicon_url: e.target.value}})} className="w-full bg-background border border-rule/50 rounded-lg px-4 py-2 focus:border-gold outline-none" />
          </div>
          <div>
            <label className="block text-sm mb-1">OpenGraph Image URL</label>
            <input value={seo.og_image_url || ''} onChange={e => setLocalData({...localData, global_seo: {...seo, og_image_url: e.target.value}})} className="w-full bg-background border border-rule/50 rounded-lg px-4 py-2 focus:border-gold outline-none" />
          </div>

          <h3 className="text-lg font-medium mt-8 mb-4">Analytics & Tracking</h3>
          <div>
            <label className="block text-sm mb-1">Google Analytics ID</label>
            <input value={seo.ga_id || ''} onChange={e => setLocalData({...localData, global_seo: {...seo, ga_id: e.target.value}})} className="w-full bg-background border border-rule/50 rounded-lg px-4 py-2 focus:border-gold outline-none" placeholder="G-XXXXXXXXXX" />
          </div>
          <div>
            <label className="block text-sm mb-1">Custom Tracking Scripts (&lt;head&gt;)</label>
            <textarea value={seo.custom_scripts || ''} onChange={e => setLocalData({...localData, global_seo: {...seo, custom_scripts: e.target.value}})} className="w-full bg-background border border-rule/50 rounded-lg px-4 py-2 font-mono text-sm focus:border-gold outline-none" rows={4} placeholder="<script>...</script>" />
          </div>
        </div>
      )}

      {activeTab === 'footer' && (
        <div className="space-y-4 bg-background/50 border border-rule/50 p-6 rounded-2xl">
          <h3 className="text-lg font-medium mb-4">Footer Content</h3>
          <div>
            <label className="block text-sm mb-1">Title / Name</label>
            <input value={footer.title || ''} onChange={e => setLocalData({...localData, global_footer: {...footer, title: e.target.value}})} className="w-full bg-background border border-rule/50 rounded-lg px-4 py-2 focus:border-gold outline-none" />
          </div>
          <div>
            <label className="block text-sm mb-1">Credentials (e.g. MD • MPH)</label>
            <input value={footer.credentials || ''} onChange={e => setLocalData({...localData, global_footer: {...footer, credentials: e.target.value}})} className="w-full bg-background border border-rule/50 rounded-lg px-4 py-2 focus:border-gold outline-none" />
          </div>
          <div>
            <label className="block text-sm mb-1">Biography Snippet</label>
            <textarea value={footer.bio || ''} onChange={e => setLocalData({...localData, global_footer: {...footer, bio: e.target.value}})} className="w-full bg-background border border-rule/50 rounded-lg px-4 py-2 focus:border-gold outline-none" rows={3} />
          </div>
          <div>
            <label className="block text-sm mb-1">Newsletter Title</label>
            <input value={footer.newsletter_title || ''} onChange={e => setLocalData({...localData, global_footer: {...footer, newsletter_title: e.target.value}})} className="w-full bg-background border border-rule/50 rounded-lg px-4 py-2 focus:border-gold outline-none" />
          </div>
          <div>
            <label className="block text-sm mb-1">Newsletter Description</label>
            <textarea value={footer.newsletter_desc || ''} onChange={e => setLocalData({...localData, global_footer: {...footer, newsletter_desc: e.target.value}})} className="w-full bg-background border border-rule/50 rounded-lg px-4 py-2 focus:border-gold outline-none" rows={2} />
          </div>
          <div>
            <label className="block text-sm mb-1">Copyright Text</label>
            <input value={footer.copyright || ''} onChange={e => setLocalData({...localData, global_footer: {...footer, copyright: e.target.value}})} className="w-full bg-background border border-rule/50 rounded-lg px-4 py-2 focus:border-gold outline-none" />
          </div>
          
          <h3 className="text-lg font-medium mt-8 mb-4">Quick Links (JSON Editor)</h3>
          <textarea 
            value={JSON.stringify(footer.links || [], null, 2)}
            onChange={e => {
              try {
                const parsed = JSON.parse(e.target.value);
                setLocalData({...localData, global_footer: {...footer, links: parsed}});
              } catch (err) { }
            }}
            className="w-full bg-background border border-rule/50 rounded-lg px-4 py-2 font-mono text-sm focus:border-gold outline-none"
            rows={10}
          />
        </div>
      )}

      {activeTab === 'contact' && (
        <div className="space-y-4 bg-background/50 border border-rule/50 p-6 rounded-2xl">
          <h3 className="text-lg font-medium mb-4">Contact Page Settings</h3>
          <div>
            <label className="block text-sm mb-1">Page Title</label>
            <input value={contact.title || ''} onChange={e => setLocalData({...localData, page_contact: {...contact, title: e.target.value}})} className="w-full bg-background border border-rule/50 rounded-lg px-4 py-2 focus:border-gold outline-none" />
          </div>
          <div>
            <label className="block text-sm mb-1">Page Subtitle</label>
            <textarea value={contact.subtitle || ''} onChange={e => setLocalData({...localData, page_contact: {...contact, subtitle: e.target.value}})} className="w-full bg-background border border-rule/50 rounded-lg px-4 py-2 focus:border-gold outline-none" rows={2} />
          </div>

          <h3 className="text-lg font-medium mt-8 mb-4">Locations & Emails (JSON Editor)</h3>
          <textarea 
            value={JSON.stringify({ locations: contact.locations || [], emails: contact.emails || [] }, null, 2)}
            onChange={e => {
              try {
                const parsed = JSON.parse(e.target.value);
                setLocalData({...localData, page_contact: {...contact, locations: parsed.locations, emails: parsed.emails}});
              } catch (err) { }
            }}
            className="w-full bg-background border border-rule/50 rounded-lg px-4 py-2 font-mono text-sm focus:border-gold outline-none"
            rows={15}
          />
        </div>
      )}
    </div>
  );
}
