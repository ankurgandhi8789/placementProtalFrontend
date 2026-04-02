import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { schoolAPI } from '../../api';
import Spinner from '../../components/common/Spinner';
import { Upload, Image } from 'lucide-react';

const SchoolProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    schoolAPI.getProfile().then(({ data }) => {
      reset({
        schoolName: data.schoolName || '',
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        pincode: data.pincode || '',
        schoolType: data.schoolType || '',
        board: data.board || '',
        website: data.website || '',
      });
      setLogoUrl(data.logo || '');
    }).finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await schoolAPI.updateProfile(data);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('logo', file);
      const { data } = await schoolAPI.uploadLogo(formData);
      setLogoUrl(data.url);
      toast.success('Logo uploaded!');
    } catch {
      toast.error('Logo upload failed');
    } finally {
      setUploadingLogo(false);
    }
  };

  if (loading) return <Spinner size="lg" />;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">School Profile</h2>
        <p className="text-gray-500 text-sm mt-1">Update your school information</p>
      </div>

      {/* Logo Upload */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">School Logo</h3>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden border border-gray-200">
            {logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" /> :
              <div className="w-full h-full flex items-center justify-center text-gray-400"><Image className="w-8 h-8" /></div>}
          </div>
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
            <Upload className="w-4 h-4" />
            {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
            <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploadingLogo} />
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">School Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { name: 'schoolName', label: 'School Name', placeholder: 'Enter school name' },
              { name: 'phone', label: 'Phone', placeholder: '+91 98765 43210' },
              { name: 'email', label: 'Email', placeholder: 'school@email.com' },
              { name: 'website', label: 'Website', placeholder: 'https://school.com' },
              { name: 'city', label: 'City', placeholder: 'New Delhi' },
              { name: 'state', label: 'State', placeholder: 'Delhi' },
              { name: 'pincode', label: 'Pincode', placeholder: '110001' },
            ].map(({ name, label, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input {...register(name)} placeholder={placeholder}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">School Type</label>
              <select {...register('schoolType')} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                <option value="">Select type</option>
                <option value="government">Government</option>
                <option value="private">Private</option>
                <option value="aided">Aided</option>
                <option value="international">International</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Board</label>
              <input {...register('board')} placeholder="CBSE / ICSE / State Board"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input {...register('address')} placeholder="Full address"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60">
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default SchoolProfile;
