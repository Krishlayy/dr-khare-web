import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { format } from 'date-fns';

const JourneyEditor = () => {
  const [milestones, setMilestones] = useState([]);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMilestones = () => {
    setLoading(true);
    api.get('/milestones')
      .then(res => setMilestones(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  const handleCreateNew = () => {
    setEditingMilestone({
      title: '', institution: '', location: '', description: '', category: 'career', startDate: '', endDate: '',
      order: 0, isFeatured: false
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const dataToSave = { ...editingMilestone };
    if (!dataToSave.endDate) delete dataToSave.endDate;

    try {
      if (editingMilestone._id) {
        await api.put(`/milestones/${editingMilestone._id}`, dataToSave);
      } else {
        await api.post('/milestones', dataToSave);
      }
      setEditingMilestone(null);
      fetchMilestones();
    } catch (err) {
      alert('Error saving milestone');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this milestone?')) return;
    try {
      await api.delete(`/milestones/${id}`);
      fetchMilestones();
    } catch (err) {
      alert('Error deleting milestone');
    }
  };

  if (editingMilestone) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-ink">{editingMilestone._id ? 'Edit Milestone' : 'New Milestone'}</h2>
          <button onClick={() => setEditingMilestone(null)} className="text-gray-500 hover:text-gray-800">Cancel</button>
        </div>
        <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
              <input type="text" required value={editingMilestone.title} onChange={e => setEditingMilestone({...editingMilestone, title: e.target.value})} className="w-full border border-gray-300 rounded p-2 focus:border-ink outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Institution</label>
              <input type="text" required value={editingMilestone.institution} onChange={e => setEditingMilestone({...editingMilestone, institution: e.target.value})} className="w-full border border-gray-300 rounded p-2 focus:border-ink outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
              <input type="text" value={editingMilestone.location || ''} onChange={e => setEditingMilestone({...editingMilestone, location: e.target.value})} className="w-full border border-gray-300 rounded p-2 focus:border-ink outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Start Date</label>
              <input type="date" required value={editingMilestone.startDate ? new Date(editingMilestone.startDate).toISOString().split('T')[0] : ''} onChange={e => setEditingMilestone({...editingMilestone, startDate: e.target.value})} className="w-full border border-gray-300 rounded p-2 focus:border-ink outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">End Date (Leave blank if present)</label>
              <input type="date" value={editingMilestone.endDate ? new Date(editingMilestone.endDate).toISOString().split('T')[0] : ''} onChange={e => setEditingMilestone({...editingMilestone, endDate: e.target.value})} className="w-full border border-gray-300 rounded p-2 focus:border-ink outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
              <select value={editingMilestone.category} onChange={e => setEditingMilestone({...editingMilestone, category: e.target.value})} className="w-full border border-gray-300 rounded p-2 focus:border-ink outline-none">
                <option value="career">Career</option>
                <option value="education">Education</option>
                <option value="award">Award</option>
                <option value="publication">Publication</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
              <textarea value={editingMilestone.description || ''} onChange={e => setEditingMilestone({...editingMilestone, description: e.target.value})} rows="4" className="w-full border border-gray-300 rounded p-2 focus:border-ink outline-none"></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Sort Order</label>
              <input type="number" value={editingMilestone.order || 0} onChange={e => setEditingMilestone({...editingMilestone, order: parseInt(e.target.value) || 0})} className="w-full border border-gray-300 rounded p-2 focus:border-ink outline-none" />
              <p className="text-xs text-gray-500 mt-1">Lower numbers appear first.</p>
            </div>
            <div className="flex items-center gap-2 self-center pt-6">
              <input type="checkbox" id="isFeatured" checked={editingMilestone.isFeatured || false} onChange={e => setEditingMilestone({...editingMilestone, isFeatured: e.target.checked})} className="w-4 h-4" />
              <label htmlFor="isFeatured" className="text-sm font-bold text-gray-700">Feature on Homepage</label>
            </div>
          </div>
          <button type="submit" className="bg-ink text-white px-8 py-3 rounded font-bold hover:bg-ink/80 transition-colors">Save Milestone</button>
        </form>
      </div>
    );
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif text-ink">Journey Editor</h1>
        <button onClick={handleCreateNew} className="bg-ink text-white px-4 py-2 rounded text-sm hover:bg-ink/80 transition-colors">Add Milestone</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="p-4 border-b w-16">Order</th>
              <th className="p-4 border-b">Timeline</th>
              <th className="p-4 border-b">Title & Institution</th>
              <th className="p-4 border-b">Category</th>
              <th className="p-4 border-b">Featured</th>
              <th className="p-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...milestones].sort((a, b) => (a.order || 0) - (b.order || 0) || new Date(b.startDate) - new Date(a.startDate)).map(m => (
              <tr key={m._id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-sm font-bold">{m.order || 0}</td>
                <td className="p-4 text-sm font-medium whitespace-nowrap">
                  {format(new Date(m.startDate), 'MMM yyyy')} - {m.endDate ? format(new Date(m.endDate), 'MMM yyyy') : 'Present'}
                </td>
                <td className="p-4">
                  <p className="font-medium text-ink">{m.title}</p>
                  <p className="text-sm text-gray-500">{m.institution}</p>
                </td>
                <td className="p-4 text-sm capitalize">{m.category}</td>
                <td className="p-4">
                  {m.isFeatured && <span className="bg-gold/20 text-gold text-xs px-2 py-1 rounded font-bold uppercase">Featured</span>}
                </td>
                <td className="p-4">
                  <button onClick={() => setEditingMilestone(m)} className="text-ink hover:underline mr-4 text-sm font-medium">Edit</button>
                  <button onClick={() => handleDelete(m._id)} className="text-red-500 hover:underline text-sm font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JourneyEditor;
