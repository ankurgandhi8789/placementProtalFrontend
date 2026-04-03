// src/pages/school/SchoolProfile.jsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { schoolAPI } from '../../api';
import Spinner from '../../components/common/Spinner';
import {
  Upload, Image as ImageIcon, School, Phone, Mail,
  Globe, MapPin, Save, Camera, CheckCircle, Building2, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand',
  'Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur',
  'Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan',
  'Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Other'
];

const InputField = ({ label, icon: Icon, name, register, required, placeholder, type = 'text', disabled, note }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-400">*</span>}
      {note && <span className="ml-1.5 text-[10px] text-blue-500 font-normal bg-blue-50 px-1.5 py-0.5 rounded-full">{note}</span>}
    </label>
    <div className="relative">
      {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />}
      <input
        {...register(name, required ? { required: `${label} is required` } : {})}
        type={type} placeholder={placeholder} disabled={disabled}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 border rounded-xl text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
          disabled ? 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-200 bg-white hover:border-blue-200'
        }`}
      />
    </div>
  </div>
);

const SchoolProfile = () => {
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [logoUrl, setLogoUrl]         = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const { user }                      = useAuth();

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm();

  useEffect(() => {
    schoolAPI.getProfile().then(({ data }) => {
      const p = data.profile || data;
      reset({
        schoolName:       p.schoolName       || user?.name || '',
        directorContact:  p.directorContact  || '',
        address:          p.address          || '',
        city:             p.city             || '',
        state:            p.state            || '',
        pincode:          p.pincode          || '',
        phone:            p.phone            || user?.phone || '',
        email:            p.email            || user?.email || '',
        website:          p.website          || '',
      });
      setLogoUrl(p.logo || '');
    }).finally(() => setLoading(false));
  }, [reset, user]);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append('logo', file);
      const { data } = await schoolAPI.uploadLogo(fd);
      setLogoUrl(data.url);
      toast.success('Logo uploaded!');
    } catch { toast.error('Logo upload failed'); }
    finally { setUploadingLogo(false); }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await schoolAPI.updateProfile(data);
      toast.success('Profile updated successfully!');
    } catch { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900">School Profile</h2>
        <p className="text-gray-400 text-sm mt-1">Update your school's basic information</p>
      </div>

      {/* Logo section */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-5">
        <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
          <ImageIcon size={15} className="text-blue-600" /> School Logo
        </h3>
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center">
              {logoUrl
                ? <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                : <School size={28} className="text-gray-300" />}
            </div>
            <label className="absolute -bottom-1.5 -right-1.5 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-blue-700 transition-colors">
              <Camera size={14} className="text-white" />
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploadingLogo} />
            </label>
          </div>
          <div>
            {logoUrl
              ? <p className="text-emerald-600 font-semibold text-sm flex items-center gap-1.5 mb-1"><CheckCircle size={14} /> Logo uploaded</p>
              : <p className="text-gray-500 text-sm mb-1">No logo yet</p>}
            <p className="text-gray-400 text-xs">PNG, JPG or WebP · Max 5 MB</p>
            {uploadingLogo && <p className="text-blue-500 text-xs mt-1 animate-pulse">Uploading...</p>}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Institute details */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
            <Building2 size={15} className="text-blue-600" /> Institute Details
          </h3>
          <div className="space-y-4">
            <InputField label="School Name" icon={School} name="schoolName" register={register} required placeholder="Full name of the institute" />
            <InputField label="Contact of Director" icon={Phone} name="directorContact" register={register} required placeholder="Director's phone or email" />
          </div>
        </div>

        {/* Contact info */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
            <Phone size={15} className="text-blue-600" /> Contact Information
            <span className="text-gray-400 text-xs font-normal">(Optional)</span>
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <InputField label="Phone" icon={Phone} name="phone" register={register} placeholder="+91 XXXXX XXXXX" />
            <InputField label="Email" icon={Mail} name="email" register={register} type="email" placeholder="school@email.com"
              disabled note="auto-filled" />
            <div className="sm:col-span-2">
              <InputField label="Website" icon={Globe} name="website" register={register} placeholder="https://yourschool.com" />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
            <MapPin size={15} className="text-blue-600" /> Address
          </h3>
          <div className="space-y-4">
            <InputField label="Full Address" icon={MapPin} name="address" register={register} required placeholder="Street, Area, Landmark" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <InputField label="City" name="city" register={register} required placeholder="City" />
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  State <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select {...register('state', { required: 'State is required' })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm appearance-none bg-white
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-200 transition-colors">
                    <option value="">Select state</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <MapPin size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <InputField label="Pincode" name="pincode" register={register} placeholder="6-digit" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-3.5
            bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold
            rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-60 text-sm">
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default SchoolProfile;