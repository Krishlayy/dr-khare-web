import { useState, useEffect, useRef } from 'react';
import api from '../../lib/api';
import TipTapEditor from './TipTapEditor';

const BlogCMS = () => {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  const fetchPosts = () => {
    setLoading(true);
    api.get('/blogs') // Get all blogs including drafts (since we don't pass status param)
      .then(res => setPosts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreateNew = () => {
    setEditingPost({
      title: '', slug: '', excerpt: '', content: '', coverImage: '', tags: '', category: '', status: 'draft',
      metaTitle: '', metaDescription: '', featured: false, publishDate: ''
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const dataToSave = { ...editingPost, tags: Array.isArray(editingPost.tags) ? editingPost.tags : editingPost.tags.split(',').map(t => t.trim()).filter(Boolean) };
    
    try {
      if (editingPost._id) {
        await api.put(`/blogs/${editingPost._id}`, dataToSave);
      } else {
        await api.post('/blogs', dataToSave);
      }
      setEditingPost(null);
      fetchPosts();
    } catch (err) {
      alert('Error saving post: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      fetchPosts();
    } catch (err) {
      alert('Error deleting post');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await api.post('/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setEditingPost(prev => ({ ...prev, coverImage: res.data.url }));
    } catch (err) {
      alert('Upload failed');
    }
  };

  if (editingPost) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-ink">{editingPost._id ? 'Edit Post' : 'New Post'}</h2>
          <button onClick={() => setEditingPost(null)} className="text-gray-500 hover:text-gray-800">Cancel</button>
        </div>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
              <input type="text" required value={editingPost.title} onChange={e => setEditingPost({...editingPost, title: e.target.value})} className="w-full border border-gray-300 rounded p-2 focus:border-ink outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Slug (URL)</label>
              <input type="text" required value={editingPost.slug} onChange={e => setEditingPost({...editingPost, slug: e.target.value})} className="w-full border border-gray-300 rounded p-2 focus:border-ink outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
              <input type="text" value={editingPost.category} onChange={e => setEditingPost({...editingPost, category: e.target.value})} className="w-full border border-gray-300 rounded p-2 focus:border-ink outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Tags (comma separated)</label>
              <input type="text" value={Array.isArray(editingPost.tags) ? editingPost.tags.join(', ') : editingPost.tags} onChange={e => setEditingPost({...editingPost, tags: e.target.value})} className="w-full border border-gray-300 rounded p-2 focus:border-ink outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
              <select value={editingPost.status} onChange={e => setEditingPost({...editingPost, status: e.target.value})} className="w-full border border-gray-300 rounded p-2 focus:border-ink outline-none">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
            {editingPost.status === 'scheduled' && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Publish Date</label>
                <input type="datetime-local" value={editingPost.publishDate ? new Date(editingPost.publishDate).toISOString().slice(0,16) : ''} onChange={e => setEditingPost({...editingPost, publishDate: e.target.value})} className="w-full border border-gray-300 rounded p-2 focus:border-ink outline-none" />
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Cover Image</label>
              <div className="flex items-center space-x-4">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">Upload Image</button>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                {editingPost.coverImage && <img src={editingPost.coverImage} alt="Cover" className="h-10 w-10 object-cover rounded" />}
              </div>
            </div>
            <div className="col-span-1 md:col-span-2 mt-4 pt-4 border-t border-gray-200">
              <h3 className="font-bold mb-4 text-ink">SEO & Advanced Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Meta Title</label>
                  <input type="text" value={editingPost.metaTitle || ''} onChange={e => setEditingPost({...editingPost, metaTitle: e.target.value})} className="w-full border border-gray-300 rounded p-2 focus:border-ink outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Meta Description</label>
                  <textarea value={editingPost.metaDescription || ''} onChange={e => setEditingPost({...editingPost, metaDescription: e.target.value})} rows={2} className="w-full border border-gray-300 rounded p-2 focus:border-ink outline-none"></textarea>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <input type="checkbox" id="featured" checked={editingPost.featured || false} onChange={e => setEditingPost({...editingPost, featured: e.target.checked})} className="w-4 h-4 text-ink" />
                  <label htmlFor="featured" className="text-sm font-bold text-gray-700">Feature on Homepage</label>
                </div>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Excerpt</label>
            <textarea value={editingPost.excerpt} onChange={e => setEditingPost({...editingPost, excerpt: e.target.value})} rows="2" className="w-full border border-gray-300 rounded p-2 focus:border-ink outline-none"></textarea>
          </div>
          <div className="mb-12">
            <label className="block text-sm font-bold text-gray-700 mb-1">Content</label>
            <TipTapEditor value={editingPost.content || ''} onChange={val => setEditingPost({...editingPost, content: val})} />
          </div>
          <button type="submit" className="bg-ink text-white px-8 py-3 rounded font-bold hover:bg-ink/80 transition-colors">Save Post</button>
        </form>
      </div>
    );
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif text-ink">Blog & Essays CMS</h1>
        <button onClick={handleCreateNew} className="bg-ink text-white px-4 py-2 rounded text-sm hover:bg-ink/80 transition-colors">Create New Post</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="p-4 border-b">Title</th>
              <th className="p-4 border-b">Status</th>
              <th className="p-4 border-b">Date</th>
              <th className="p-4 border-b">Views</th>
              <th className="p-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post._id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{post.title}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded uppercase tracking-wider font-bold ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {post.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-sm text-gray-500">{post.views}</td>
                <td className="p-4">
                  <button onClick={() => setEditingPost(post)} className="text-ink hover:underline mr-4 text-sm font-medium">Edit</button>
                  <button onClick={() => handleDelete(post._id)} className="text-red-500 hover:underline text-sm font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlogCMS;
