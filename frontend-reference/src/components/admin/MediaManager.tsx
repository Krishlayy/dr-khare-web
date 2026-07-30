import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { format } from 'date-fns';
import { Upload, Trash2, Copy, FileText, Image as ImageIcon, Film, Loader2 } from 'lucide-react';

export default function MediaManager() {
  const [filter, setFilter] = useState('all');
  const [currentFolder, setCurrentFolder] = useState('root');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: media, isLoading } = useQuery({
    queryKey: ['media', filter, currentFolder],
    queryFn: async () => {
      let url = `/media?folder=${currentFolder}`;
      if (filter !== 'all') url += `&category=${filter}`;
      const res = await api.get(url);
      
      let items = res.data;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        items = items.filter((item: any) => 
          item.originalName.toLowerCase().includes(q) || 
          (item.tags && item.tags.some((t: string) => t.toLowerCase().includes(q)))
        );
      }
      return items;
    },
  });

  const { data: allFolders } = useQuery({
    queryKey: ['media-folders'],
    queryFn: async () => {
      const res = await api.get('/media');
      const folders = new Set(res.data.map((m: any) => m.folder || 'root'));
      return Array.from(folders).sort();
    }
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    try {
      const files = Array.from(e.target.files);
      const uploadPromises = files.map(file => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', currentFolder);
        return api.post('/media', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      });
      
      await Promise.all(uploadPromises);
      
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['media-folders'] });
    } catch (err) {
      alert('Error uploading file(s)');
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/media/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['media-folders'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: {id: string, folder: string, tags: string}) => api.put(`/media/${data.id}`, { folder: data.folder, tags: data.tags }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['media-folders'] });
      setEditingItem(null);
    }
  });

  const getIcon = (category: string) => {
    switch (category) {
      case 'image': return <ImageIcon className="w-8 h-8 text-gold" />;
      case 'video': return <Film className="w-8 h-8 text-gold" />;
      case 'document': return <FileText className="w-8 h-8 text-gold" />;
      default: return <FileText className="w-8 h-8 text-gold" />;
    }
  };

  const copyToClipboard = (url: string) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    alert('URL copied to clipboard!');
  };

  if (isLoading) return <div className="text-muted-foreground p-8">Loading media library...</div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-display text-ink">Media Library</h2>
          <p className="text-muted-foreground mt-1 text-sm">Upload and manage images, PDFs, and videos.</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={currentFolder} 
            onChange={(e) => setCurrentFolder(e.target.value)}
            className="px-4 py-2 bg-foreground/5 border border-rule/30 text-sm rounded-lg focus:outline-none focus:border-gold/50"
          >
            <option value="root">Root Folder</option>
            {allFolders?.filter(f => f !== 'root').map((f: any) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          <button 
            onClick={() => {
              const name = window.prompt("Enter new folder name:");
              if (name && name.trim() !== '') {
                setCurrentFolder(name.trim());
              }
            }}
            className="px-4 py-2 bg-foreground/5 border border-rule/30 text-sm rounded-lg hover:bg-foreground/10"
          >
            + Folder
          </button>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-foreground/5 border border-rule/30 text-sm rounded-lg focus:outline-none focus:border-gold/50"
          >
            <option value="all">All Media</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="document">Documents</option>
          </select>
          <input 
            type="text" 
            placeholder="Search by name or tag..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 bg-foreground/5 border border-rule/30 text-sm rounded-lg focus:outline-none focus:border-gold/50 w-48"
          />
          <div className="relative">
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              onChange={handleFileUpload}
              disabled={uploading}
              multiple
            />
            <label 
              htmlFor="file-upload" 
              className="cursor-pointer px-4 py-2 bg-gold text-foreground text-sm font-medium rounded-lg hover:bg-gold/90 transition-colors flex items-center gap-2"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? 'Uploading...' : 'Upload Files'}
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {media?.map((item: any) => (
          <div key={item._id} className="bg-foreground/5 rounded-xl border border-rule/30 overflow-hidden group">
            <div className="aspect-square bg-background border-b border-rule/30 flex items-center justify-center p-4 relative overflow-hidden">
              {item.category === 'image' ? (
                <img src={item.url} alt={item.originalName} className="w-full h-full object-cover" />
              ) : item.category === 'video' ? (
                <video src={item.url} className="w-full h-full object-cover" muted loop autoPlay playsInline />
              ) : item.category === 'document' && item.originalName.toLowerCase().endsWith('.pdf') ? (
                <object data={item.url} type="application/pdf" className="w-full h-full object-cover overflow-hidden">
                  <div className="flex flex-col items-center justify-center p-4 h-full bg-background pointer-events-none">
                    <FileText className="w-8 h-8 text-gold mb-2" />
                    <span className="text-xs text-muted-foreground">PDF Document</span>
                  </div>
                </object>
              ) : (
                getIcon(item.category)
              )}
              
              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                <button 
                  onClick={() => copyToClipboard(item.url)}
                  className="p-2 bg-foreground text-background rounded-full hover:scale-110 transition-transform"
                  title="Copy URL"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { if(window.confirm('Delete this file?')) deleteMutation.mutate(item._id); }}
                  className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                  title="Delete File"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm font-medium truncate mb-1" title={item.originalName}>{item.originalName}</p>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span className="uppercase tracking-widest">{item.category}</span>
                <span>{(item.size / 1024).toFixed(1)} KB</span>
              </div>
              <div className="mt-2 text-xs text-foreground/80">
                <span className="font-medium">Folder:</span> {item.folder}
              </div>
              {item.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.tags.map((t: string) => <span key={t} className="bg-foreground/10 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">{t}</span>)}
                </div>
              )}
              <div className="flex items-center justify-between mt-3 border-t border-rule/30 pt-3">
                <p className="text-xs text-muted-foreground">
                  {format(new Date(item.createdAt), 'MMM d, yyyy')}
                </p>
                <button 
                  onClick={() => setEditingItem(item)}
                  className="text-xs text-ink hover:underline font-medium text-gold"
                >
                  Edit Metadata
                </button>
              </div>
            </div>
          </div>
        ))}
        {media?.length === 0 && (
          <div className="col-span-full py-20 text-center border border-dashed border-rule/30 rounded-2xl bg-foreground/5">
            <h3 className="font-display text-2xl mb-2">No media found in '{currentFolder}'</h3>
            <p className="text-muted-foreground text-sm">Upload files or switch folders.</p>
          </div>
        )}
      </div>

      {editingItem && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-rule/50 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-display mb-4">Edit Metadata</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Folder</label>
                <input 
                  type="text" 
                  value={editingItem.folder || 'root'} 
                  onChange={e => setEditingItem({...editingItem, folder: e.target.value})}
                  className="w-full bg-foreground/5 border border-rule/30 rounded-lg p-2 text-sm focus:border-gold outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                <input 
                  type="text" 
                  value={Array.isArray(editingItem.tags) ? editingItem.tags.join(', ') : (editingItem.tags || '')} 
                  onChange={e => setEditingItem({...editingItem, tags: e.target.value})}
                  className="w-full bg-foreground/5 border border-rule/30 rounded-lg p-2 text-sm focus:border-gold outline-none" 
                  placeholder="e.g. hero, background, profile"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-rule/30">
                <button onClick={() => setEditingItem(null)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                <button 
                  onClick={() => updateMutation.mutate({ id: editingItem._id, folder: editingItem.folder, tags: Array.isArray(editingItem.tags) ? editingItem.tags.join(',') : editingItem.tags })}
                  disabled={updateMutation.isPending}
                  className="px-4 py-2 bg-gold text-foreground text-sm font-medium rounded-lg hover:scale-[1.02] transition-transform disabled:opacity-50"
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
