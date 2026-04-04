// src/pages/admin/AdminManagement.jsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { adminAPI } from '../../api';
import Spinner from '../../components/common/Spinner';
import {
  UserPlus, Shield, Lock, Mail, User,
  CheckCircle, AlertCircle, ToggleLeft, ToggleRight,
  Crown, Eye, EyeOff
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminManagement = () => {
  const [admins, setAdmins]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const { user } = useAuth();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchAdmins = () => {
    adminAPI.getAdmins()
      .then(({ data }) => setAdmins(data.admins || data))
      .finally(() => setLoading(false));
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
    } finally { setCreating(false); }
  };

  const handleToggle = async (id) => {
    try {
      await adminAPI.toggleUserActive(id);
      toast.success('Status updated');
      fetchAdmins();
    } catch { toast.error('Failed to update'); }
  };

  // Guard: super admin only
  const isSuperAdmin = user?.role === 'super_admin' || user?.role === 'superadmin';

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <Shield size={32} className="text-red-400" />
        </div>
        <h3 className="text-xl font-extrabold text-gray-800 mb-2">Super Admin Only</h3>
        <p className="text-gray-400 text-sm max-w-xs">This section is restricted to super admins. Contact your system administrator for access.</p>
      </div>
    );
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
          <Crown size={18} className="text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">Admin Management</h2>
          <p className="text-gray-400 text-xs mt-0.5">Create and manage admin accounts · Super Admin only</p>
        </div>
      </div>

      {/* Super admin badge */}
      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3 flex items-center gap-2">
        <Crown size={14} className="text-purple-500 flex-shrink-0" />
        <p className="text-purple-700 text-xs font-semibold">
          You're logged in as <strong>Super Administrator</strong>. Only you can create new admin accounts.
        </p>
      </div>

      {/* Create admin form */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
          <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
            <UserPlus size={15} className="text-blue-600" />
          </div>
          <h3 className="font-bold text-gray-900 text-sm">Create New Admin</h3>
        </div>
        <div className="p-5">
          <form onSubmit={handleSubmit(onCreateAdmin)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input {...register('name', { required: 'Name is required' })}
                  placeholder="Admin's full name"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-200 transition-colors" />
              </div>
              {errors.name && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                Email Address <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                  type="email" placeholder="admin@maasavitri.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-200 transition-colors" />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('password', {
                    required: 'Password required',
                    minLength: { value: 8, message: 'Min 8 characters' }
                  })}
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Minimum 8 characters"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm bg-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-200 transition-colors"
                />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.password.message}</p>
              )}
            </div>

            <button type="submit" disabled={creating}
              className="w-full flex items-center justify-center gap-2 py-3.5
                bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold
                rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-60 text-sm">
              <UserPlus size={15} />
              {creating ? 'Creating Admin...' : 'Create Admin Account'}
            </button>
          </form>
        </div>
      </div>

      {/* Admin list */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
              <Shield size={15} className="text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">All Admins</h3>
          </div>
          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            {admins.length} total
          </span>
        </div>

        {admins.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-gray-400 text-sm">No admin accounts found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {admins.map(admin => {
              const initials = (admin.name || 'A').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
              const isSelf   = admin._id === user._id;
              const isSA     = admin.role === 'super_admin' || admin.role === 'superadmin';

              return (
                <div key={admin._id} className={`flex items-center justify-between px-5 py-4 transition-colors ${
                  isSelf ? 'bg-blue-50/50' : 'hover:bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      isSA ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-bold text-gray-900 text-sm">{admin.name}</p>
                        {isSelf && (
                          <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded-full">You</span>
                        )}
                      </div>
                      <p className="text-gray-400 text-xs truncate">{admin.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Role badge */}
                    <span className={`hidden sm:flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSA ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {isSA ? <><Crown size={9} /> Super Admin</> : 'Admin'}
                    </span>

                    {/* Active status */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      admin.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                    }`}>
                      {admin.isActive ? 'Active' : 'Inactive'}
                    </span>

                    {/* Toggle (not self) */}
                    {!isSelf && (
                      <button onClick={() => handleToggle(admin._id)}
                        className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl font-semibold transition-all ${
                          admin.isActive
                            ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                        }`}>
                        {admin.isActive
                          ? <><ToggleRight size={13} /> Deactivate</>
                          : <><ToggleLeft size={13} /> Activate</>}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManagement;