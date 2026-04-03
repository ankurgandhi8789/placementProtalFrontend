import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { teacherAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/common/Spinner';
import { User, Upload, Image, CheckCircle } from 'lucide-react';

const TeacherEdit = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');
  const { user } = useAuth();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    teacherAPI.getProfile().then(({ data }) => {
      const p = data.profile || data;
      reset({
        fullName: p.fullName || user?.name || '',
        email: p.email || user?.email || '',
        phone: p.phone || user?.phone || '',
      });
      setPhotoPreview(p.profilePhoto || '');
    }).finally(() => setLoading(false));
  }, []);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await teacherAPI.updateProfile(data);
      toast.success('Profile updated!');
    } catch {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const { data } = await teacherAPI.uploadPhoto(formData);
      setPhotoPreview(data.url);
      toast.success('Photo updated!');
    } catch { toast.error('Upload failed'); }
    finally { setUploadingPhoto(false); e.target.value = ''; }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900">Edit Info</h2>
        <p className="text-gray-400 text-sm mt-1">Update your basic account information</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        {/* Photo */}
        <div className="flex items-center gap-5 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 border-2 border-blue-200 flex-shrink-0">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Image size={28} className="text-gray-400" />
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-700 mb-2">Profile Photo</p>
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
              <Upload size={14} /> {uploadingPhoto ? 'Uploading...' : photoPreview ? 'Change Photo' : 'Upload Photo'}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
            </label>
            {photoPreview && (
              <p className="text-emerald-600 text-xs mt-1.5 flex items-center gap-1">
                <CheckCircle size={11} /> Photo saved
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Full Name *</label>
            <input {...register('fullName', { required: 'Name is required' })}
              placeholder="Your full name"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all" />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email Address</label>
            <input {...register('email')} type="email" readOnly
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
            <p className="text-gray-400 text-xs mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone Number *</label>
            <input {...register('phone', { required: 'Phone is required' })}
              placeholder="+91 98765 43210"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all" />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <button type="submit" disabled={saving}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 text-sm">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherEdit;
