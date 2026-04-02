import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { adminAPI } from '../../api';
import Spinner from '../../components/common/Spinner';
import { UserPlus, Shield, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const { user } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchAdmins = () => {
    adminAPI.getAdmins().then(({ data }) => setAdmins(data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchAdmins(); }, []);

  const onCreateAdmin = async (data) => {
    setCreating(true);
    try {
      await adminAPI.createAdmin(data);
      toast.success('Admin created successfully!');
      reset();
      fetchAdmins();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create admin');
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await adminAPI.toggleUserActive(id);
      toast.success('Status updated');
      fetchAdmins();
    } catch {
      toast.error('Failed to update');
    }
  };

  if (user?.role !== 'superadmin') {
    return (
      <div className="text-center py-16">
        <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-700">Super Admin Only</h3>
        <p className="text-gray-400 mt-2">This section is restricted to super admins only.</p>
      </div>
    );
  }

  if (loading) return <Spinner size="lg" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Admin Management</h2>
        <p className="text-gray-500 text-sm mt-1">Create and manage admin accounts</p>
      </div>

      {/* Create Admin Form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-lg">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-blue-600" /> Create New Admin
        </h3>
        <form onSubmit={handleSubmit(onCreateAdmin)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input {...register('name', { required: 'Name is required' })} placeholder="Admin name"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input {...register('email', { required: 'Email is required' })} type="email" placeholder="admin@email.com"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
              type="password" placeholder="Min 6 characters"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={creating}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
            <UserPlus className="w-4 h-4" /> {creating ? 'Creating...' : 'Create Admin'}
          </button>
        </form>
      </div>

      {/* Admin List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">All Admins ({admins.length})</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {admins.map((admin) => (
            <div key={admin._id} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  {admin.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{admin.name}</p>
                  <p className="text-gray-400 text-sm">{admin.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${admin.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                  {admin.role}
                </span>
                {admin._id !== user._id && (
                  <button onClick={() => handleToggle(admin._id)}
                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${admin.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                    {admin.isActive ? <><ToggleRight className="w-4 h-4" /> Active</> : <><ToggleLeft className="w-4 h-4" /> Inactive</>}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;
