import { useState, useEffect } from 'react';
import api from '../../lib/api';

const PortfolioManager = () => {
  const [publications, setPublications] = useState<any[]>([]);
  const [editingPub, setEditingPub] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchPubs = () => {
    setLoading(true);
    api.get('/publications')
      .then(res => setPublications(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPubs();
  }, []);

  const handleCreateNew = () => {
    setEditingPub({
      title: '', type: 'paper', authors: '', abstract: '', year: new Date().getFullYear(), publisher: '', externalLink: '', pdfLink: '', isFeatured: false, order: 0
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const dataToSave = { ...editingPub, authors: Array.isArray(editingPub.authors) ? editingPub.authors : editingPub.authors.split(',').map(a => a.trim()).filter(Boolean) };

    try {
      if (editingPub._id) {
        await api.put(`/publications/${editingPub._id}`, dataToSave);
      } else {
        await api.post('/publications', dataToSave);
      }
      setEditingPub(null);
      fetchPubs();
    } catch (err) {
      alert('Error saving publication');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await api.delete(`/publications/${id}`);
      fetchPubs();
    } catch (err) {
      alert('Error deleting');
    }
  };

  if (editingPub) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-ink">{editingPub._id ? 'Edit Item' : 'New Item'}</h2>
          <button onClick={() => setEditingPub(null)} className="text-gray-500 hover:text-gray-800">Cancel</button>
        </div>
        <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
              <input type="text" required value={editingPub.title} onChange={e => setEditingPub({...editingPub, title: e.target.value})} className="w-full border border-gray-300 rounded p-2 focus:border-ink outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
              <select value={editingPub.type} onChange={e => setEditingPub({...editingPub, type: e.target.value})} className="w-full border border-gray-300 rounded p-2 focus:border-ink outline-none">
                <option value="paper">Research Paper</option>
                <option value="book">Book</option>
                <option value="chapter">Book Chapter</option>
                <option value="article">Article</option>
                <option value="degree">Degree / Qualification</option>
                <option value="certificate">Certificate</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Year</label>
              <input type="number" value={editingPub.year || ''} onChange={e => setEditingPub({...editingPub, year: Number(e.target.value)})} className="w-full border border-gray-300 rounded p-2 focus:border-ink outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Authors (comma separated)</label>
              <input type="text" value={Array.isArray(editingPub.authors) ? editingPub.authors.join(', ') : editingPub.authors} onChange={e => setEditingPub({...editingPub, authors: e.target.value})} className="w-full border border-gray-300 rounded p-2 focus:border-ink outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Publisher / Journal</label>
              <input type="text" value={editingPub.publisher || ''} onChange={e => setEditingPub({...editingPub, publisher: e.target.value})} className="w-full border border-gray-300 rounded p-2 focus:border-ink outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">External Link</label>
              <input type="url" value={editingPub.externalLink || ''} onChange={e => setEditingPub({...editingPub, externalLink: e.target.value})} className="w-full border border-gray-300 rounded p-2 focus:border-ink outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Abstract / Description</label>
              <textarea value={editingPub.abstract || ''} onChange={e => setEditingPub({...editingPub, abstract: e.target.value})} rows="4" className="w-full border border-gray-300 rounded p-2 focus:border-ink outline-none"></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Sort Order</label>
              <input type="number" value={editingPub.order || 0} onChange={e => setEditingPub({...editingPub, order: parseInt(e.target.value) || 0})} className="w-full border border-gray-300 rounded p-2 focus:border-ink outline-none" />
              <p className="text-xs text-gray-500 mt-1">Lower numbers appear first.</p>
            </div>
            <div className="flex items-center gap-2 self-center pt-6">
              <input type="checkbox" id="isFeatured" checked={editingPub.isFeatured || false} onChange={e => setEditingPub({...editingPub, isFeatured: e.target.checked})} className="w-4 h-4" />
              <label htmlFor="isFeatured" className="text-sm font-bold text-gray-700">Feature on Homepage</label>
            </div>
          </div>
          <button type="submit" className="bg-ink text-white px-8 py-3 rounded font-bold hover:bg-ink/80 transition-colors">Save Item</button>
        </form>
      </div>
    );
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif text-ink">Portfolio & Publications</h1>
        <button onClick={handleCreateNew} className="bg-ink text-white px-4 py-2 rounded text-sm hover:bg-ink/80 transition-colors">Add Item</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="p-4 border-b w-16">Order</th>
              <th className="p-4 border-b">Year</th>
              <th className="p-4 border-b">Title & Type</th>
              <th className="p-4 border-b">Featured</th>
              <th className="p-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...publications].sort((a, b) => (a.order || 0) - (b.order || 0) || (b.year || 0) - (a.year || 0)).map(p => (
              <tr key={p._id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-sm font-bold">{p.order || 0}</td>
                <td className="p-4 font-medium">{p.year}</td>
                <td className="p-4">
                  <p className="font-medium text-ink line-clamp-1">{p.title}</p>
                  <p className="text-sm text-gray-500 uppercase tracking-widest text-xs mt-1">{p.type}</p>
                </td>
                <td className="p-4">
                  {p.isFeatured && <span className="bg-gold/20 text-gold text-xs px-2 py-1 rounded font-bold uppercase">Featured</span>}
                </td>
                <td className="p-4 whitespace-nowrap">
                  <button onClick={() => setEditingPub(p)} className="text-ink hover:underline mr-4 text-sm font-medium">Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:underline text-sm font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortfolioManager;
