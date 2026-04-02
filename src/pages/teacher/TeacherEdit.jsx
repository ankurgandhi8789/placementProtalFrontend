// src/pages/teacher/TeacherEdit.jsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { teacherAPI } from '../../api';
import Spinner from '../../components/common/Spinner';
import { useAuth } from '../../context/AuthContext';
import { Camera, Save, CheckCircle, User, Mail, Phone } from 'lucide-react';

const TeacherEdit = () => {
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const { user, updateUser } = useAuth();

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm();

  useEffect(() => {
    teacherAPI.getProfile().then(({ data }) => {
      const p = data.profile || data;
      reset({
        fullName: p.fullName || user?.name || '',
        email:    p.email    || user?.email || '',
        phone:    p.phone    || user?.phone || '',
      });
      setPhotoUrl(p.profilePhoto || '');
    }).finally(() => setLoading(false));
  }, [reset, user]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('photo', file);
      const { data } = await teacherAPI.uploadPhoto(fd);
      setPhotoUrl(data.url);
      toast.success('Photo updated!');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await teacherAPI.updateProfile({ fullName: data.fullName, phone: data.phone });
      toast.success('Profile updated successfully!');
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900">Edit Profile</h2>
        <p className="text-gray-400 text-sm mt-1">Update your basic info and profile photo</p>
      </div>

      {/* Photo section */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-5 shadow-sm text-center">
        <div className="relative inline-block mb-4">
          <div className="w-28 h-28 rounded-full border-4 border-blue-100 overflow-hidden bg-gray-100 mx-auto">
            {photoUrl ? (
              <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User size={40} className="text-gray-300" />
              </div>
            )}
          </div>
          <label className="absolute bottom-1 right-1 w-9 h-9 bg-blue-600 rounded-full flex items-center
            justify-center cursor-pointer shadow-lg hover:bg-blue-700 transition-colors">
            <Camera size={16} className="text-white" />
            <input type="file" accept="image/*" className="hidden"
              onChange={handlePhotoUpload} disabled={uploading} />
          </label>
        </div>
        <p className="font-bold text-gray-900 text-lg">{user?.name}</p>
        <p className="text-gray-400 text-sm">{user?.email}</p>
        {uploading && (
          <p className="text-blue-500 text-xs mt-2 animate-pulse">Uploading photo...</p>
        )}
        {photoUrl && !uploading && (
          <p className="text-emerald-600 text-xs mt-2 flex items-center justify-center gap-1">
            <CheckCircle size={12} /> Photo updated
          </p>
        )}
        <p className="text-gray-300 text-xs mt-3">Tap the camera icon to change your photo</p>
      </div>

      {/* Info form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4 mb-5">
          <h3 className="font-bold text-gray-800 text-sm border-b border-gray-50 pb-3">Basic Information</h3>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Full Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register('fullName', { required: 'Name is required' })}
                placeholder="Your full name"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Email Address
              <span className="ml-1.5 text-[10px] text-blue-500 font-normal bg-blue-50 px-2 py-0.5 rounded-full">
                Cannot be changed
              </span>
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                {...register('email')}
                disabled
                className="w-full pl-10 pr-4 py-2.5 border border-gray-100 rounded-xl text-sm
                  bg-gray-50 text-gray-400 cursor-not-allowed"
              />
            </div>
            <p className="text-gray-400 text-[11px] mt-1">
              To change email, contact admin at info@maasavitri.com
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Phone Number <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register('phone', {
                  required: 'Phone is required',
                  pattern: { value: /^[0-9+\s\-]{10,15}$/, message: 'Invalid phone number' }
                })}
                placeholder="+91 XXXXX XXXXX"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-3.5
            bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold
            rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-60 text-sm">
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
        <p className="text-amber-700 text-xs font-medium">
          Need to update education, subjects, or experience?{' '}
          <a href="/teacher/apply" className="text-blue-600 font-bold underline">
            Edit full application →
          </a>
        </p>
      </div>
    </div>
  );
};

export default TeacherEdit;