import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { Shield, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

const UserManager = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin'
  });

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get('/users');
      return res.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: (newUser) => api.post('/users', newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsEditing(false);
      setFormData({ username: '', email: '', password: '', role: 'admin' });
      toast.success('User created successfully');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  if (isLoading) return <div>Loading users...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif text-ink">User Management</h2>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="bg-ink text-white px-4 py-2 rounded font-bold hover:bg-ink/80 transition-colors"
        >
          {isEditing ? 'Cancel' : 'Add New User'}
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200 space-y-4 max-w-xl">
          <h3 className="text-lg font-bold">Create Admin User</h3>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
            <input 
              type="text" 
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
              required
              className="w-full border border-gray-300 rounded p-2 focus:border-ink outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              required
              className="w-full border border-gray-300 rounded p-2 focus:border-ink outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              required
              className="w-full border border-gray-300 rounded p-2 focus:border-ink outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Role</label>
            <select 
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
              className="w-full border border-gray-300 rounded p-2 focus:border-ink outline-none"
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
              <option value="editor">Editor</option>
            </select>
          </div>
          <button 
            type="submit" 
            disabled={createMutation.isPending}
            className="bg-ink text-white px-6 py-2 rounded font-bold hover:bg-ink/80 transition-colors disabled:opacity-50"
          >
            {createMutation.isPending ? 'Creating...' : 'Create User'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-bold text-sm text-gray-600">Username</th>
              <th className="p-4 font-bold text-sm text-gray-600">Email</th>
              <th className="p-4 font-bold text-sm text-gray-600">Role</th>
              <th className="p-4 font-bold text-sm text-gray-600 w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u: any) => (
              <tr key={u._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                <td className="p-4 font-medium">{u.username}</td>
                <td className="p-4 text-gray-600">{u.email}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                    u.role === 'superadmin' ? 'bg-purple-100 text-purple-800' :
                    u.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    <Shield className="w-3 h-3" />
                    {u.role}
                  </span>
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => {
                      if(confirm('Are you sure?')) deleteMutation.mutate(u._id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManager;
