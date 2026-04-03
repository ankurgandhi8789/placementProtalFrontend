import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';
import { teacherAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/common/Spinner';
import {
  User, BookOpen, GraduationCap, Briefcase, FileText,
  Upload, Plus, Trash2, ChevronRight, ChevronLeft,
  CheckCircle, Image, Save
} from 'lucide-react';

const SUBJECTS = ['Mathematics','Science','English','Hindi','Social Studies','Physics','Chemistry','Biology','Computer Science','Physical Education','Art','Music','Other'];
const CLASS_LEVELS = ['Nursery','KG','Class 1-5','Class 6-8','Class 9-10','Class 11-12'];
const QUALIFICATIONS = ['B.Ed','M.Ed','D.El.Ed','B.T.C','NTT','CTET','STET','Other'];

const SECTIONS = [
  { id: 'personal',    label: 'Personal Info',   icon: User },
  { id: 'teaching',    label: 'Teaching Info',   icon: BookOpen },
  { id: 'education',   label: 'Education',       icon: GraduationCap },
  { id: 'experience',  label: 'Experience',      icon: Briefcase },
  { id: 'documents',   label: 'Documents',       icon: FileText },
];

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const Input = ({ className = '', ...props }) => (
  <input className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400
    focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all ${className}`} {...props} />
);

const TeacherApply = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');
  const [resumeName, setResumeName] = useState('');
  const { user } = useAuth();

  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      education: [{ degree: '', specialization: '', institution: '', boardOrUniversity: '', yearOfPassing: '', percentage: '' }],
      experiences: [{ schoolName: '', role: '', subject: '', startDate: '', endDate: '', currentlyWorking: false }],
    }
  });

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: 'education' });
  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: 'experiences' });

  // Load existing profile and auto-fill
  useEffect(() => {
    teacherAPI.getProfile().then(({ data }) => {
      const p = data.profile || data;
      reset({
        // Auto-fill from user + profile
        fullName: p.fullName || user?.name || '',
        email: p.email || user?.email || '',
        phone: p.phone || user?.phone || '',
        alternatePhone: p.alternatePhone || '',
        dateOfBirth: p.dateOfBirth ? p.dateOfBirth.split('T')[0] : '',
        gender: p.gender || '',
        currentAddress: p.currentAddress || '',
        permanentAddress: p.permanentAddress || '',
        city: p.city || '',
        state: p.state || '',
        pincode: p.pincode || '',
        subjects: p.subjects || [],
        classLevels: p.classLevels || [],
        teachingQualifications: p.teachingQualifications || [],
        experienceYears: p.experienceYears || 0,
        experienceDetails: p.experienceDetails || '',
        expectedSalary: p.expectedSalary || '',
        preferredLocation: p.preferredLocation || '',
        education: p.education?.length > 0 ? p.education : [{ degree: '', specialization: '', institution: '', boardOrUniversity: '', yearOfPassing: '', percentage: '' }],
        experiences: p.experiences?.length > 0 ? p.experiences : [{ schoolName: '', role: '', subject: '', startDate: '', endDate: '', currentlyWorking: false }],
      });
      setPhotoPreview(p.profilePhoto || '');
      setResumeName(p.resumeOriginalName || (p.resume ? 'Resume uploaded' : ''));
    }).finally(() => setLoading(false));
  }, []);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await teacherAPI.updateProfile({ ...data, isProfileComplete: true });
      toast.success('Application saved successfully!');
    } catch {
      toast.error('Failed to save. Please try again.');
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
      toast.success('Photo uploaded!');
    } catch { toast.error('Photo upload failed'); }
    finally { setUploadingPhoto(false); e.target.value = ''; }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') return toast.error('Only PDF allowed');
    setUploadingResume(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      await teacherAPI.uploadResume(formData);
      setResumeName(file.name);
      toast.success('Resume uploaded!');
    } catch { toast.error('Resume upload failed'); }
    finally { setUploadingResume(false); e.target.value = ''; }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  const progress = Math.round(((step + 1) / SECTIONS.length) * 100);

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900">Teacher Application</h2>
        <p className="text-gray-400 text-sm mt-1">Fill all sections to complete your application</p>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {SECTIONS.map((s, idx) => (
          <button key={s.id} onClick={() => setStep(idx)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
              idx === step ? 'bg-blue-600 text-white shadow-sm' :
              idx < step ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}>
            {idx < step ? <CheckCircle size={12} /> : <s.icon size={12} />}
            {s.label}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>

        {/* ── SECTION 0: Personal Info ── */}
        {step === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
              <User size={16} className="text-blue-600" /> Personal Information
            </h3>

            {/* Photo upload */}
            <div className="flex items-center gap-5 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border-2 border-blue-200">
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image size={24} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">Profile Photo</p>
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors">
                  <Upload size={12} /> {uploadingPhoto ? 'Uploading...' : photoPreview ? 'Re-upload Photo' : 'Upload Photo'}
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
                </label>
                <p className="text-gray-400 text-[10px] mt-1">JPG, PNG — max 5MB</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full Name *" error={errors.fullName?.message}>
                <Input {...register('fullName', { required: 'Required' })} placeholder="Your full name" />
              </Field>
              <Field label="Email *" error={errors.email?.message}>
                <Input {...register('email', { required: 'Required' })} type="email" placeholder="Auto-filled" readOnly className="bg-gray-50 cursor-not-allowed" />
              </Field>
              <Field label="Phone *" error={errors.phone?.message}>
                <Input {...register('phone', { required: 'Required' })} placeholder="Auto-filled from account" />
              </Field>
              <Field label="Alternate Phone">
                <Input {...register('alternatePhone')} placeholder="+91 98765 43210" />
              </Field>
              <Field label="Date of Birth">
                <Input {...register('dateOfBirth')} type="date" />
              </Field>
              <Field label="Gender">
                <select {...register('gender')} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </Field>
              <Field label="City">
                <Input {...register('city')} placeholder="New Delhi" />
              </Field>
              <Field label="State">
                <Input {...register('state')} placeholder="Delhi" />
              </Field>
              <Field label="Pincode">
                <Input {...register('pincode')} placeholder="110001" />
              </Field>
              <Field label="Expected Salary">
                <Input {...register('expectedSalary')} placeholder="e.g. ₹25,000/month" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Current Address">
                  <textarea {...register('currentAddress')} rows={2} placeholder="Full current address"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Permanent Address">
                  <textarea {...register('permanentAddress')} rows={2} placeholder="Full permanent address"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none" />
                </Field>
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION 1: Teaching Info ── */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
              <BookOpen size={16} className="text-blue-600" /> Teaching Information
            </h3>

            <Field label="Subjects You Teach *">
              <div className="flex flex-wrap gap-2 mt-1">
                {SUBJECTS.map(sub => {
                  const checked = watch('subjects')?.includes(sub);
                  return (
                    <label key={sub} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      checked ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                    }`}>
                      <input type="checkbox" value={sub} {...register('subjects')} className="hidden" />
                      {sub}
                    </label>
                  );
                })}
              </div>
            </Field>

            <Field label="Class Levels *">
              <div className="flex flex-wrap gap-2 mt-1">
                {CLASS_LEVELS.map(cl => {
                  const checked = watch('classLevels')?.includes(cl);
                  return (
                    <label key={cl} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      checked ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
                    }`}>
                      <input type="checkbox" value={cl} {...register('classLevels')} className="hidden" />
                      {cl}
                    </label>
                  );
                })}
              </div>
            </Field>

            <Field label="Teaching Qualifications">
              <div className="flex flex-wrap gap-2 mt-1">
                {QUALIFICATIONS.map(q => {
                  const checked = watch('teachingQualifications')?.includes(q);
                  return (
                    <label key={q} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      checked ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300'
                    }`}>
                      <input type="checkbox" value={q} {...register('teachingQualifications')} className="hidden" />
                      {q}
                    </label>
                  );
                })}
              </div>
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Years of Experience">
                <Input {...register('experienceYears', { valueAsNumber: true })} type="number" min="0" placeholder="0" />
              </Field>
              <Field label="Preferred Location">
                <Input {...register('preferredLocation')} placeholder="e.g. Delhi, NCR" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Experience Details">
                  <textarea {...register('experienceDetails')} rows={3} placeholder="Describe your teaching experience..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none" />
                </Field>
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION 2: Education ── */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <GraduationCap size={16} className="text-blue-600" /> Education Details
              </h3>
              <button type="button" onClick={() => appendEdu({ degree: '', specialization: '', institution: '', boardOrUniversity: '', yearOfPassing: '', percentage: '' })}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                <Plus size={12} /> Add
              </button>
            </div>
            {eduFields.map((field, idx) => (
              <div key={field.id} className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-3 relative">
                {eduFields.length > 1 && (
                  <button type="button" onClick={() => removeEdu(idx)}
                    className="absolute top-3 right-3 w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors">
                    <Trash2 size={11} />
                  </button>
                )}
                <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">Education #{idx + 1}</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { name: `education.${idx}.degree`, placeholder: 'Degree (e.g. B.Ed, M.A.)' },
                    { name: `education.${idx}.specialization`, placeholder: 'Specialization (e.g. Mathematics)' },
                    { name: `education.${idx}.institution`, placeholder: 'College / School name' },
                    { name: `education.${idx}.boardOrUniversity`, placeholder: 'Board / University' },
                    { name: `education.${idx}.yearOfPassing`, placeholder: 'Year of Passing (e.g. 2020)' },
                    { name: `education.${idx}.percentage`, placeholder: 'Percentage / CGPA' },
                  ].map(({ name, placeholder }) => (
                    <Input key={name} {...register(name)} placeholder={placeholder} className="bg-white" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── SECTION 3: Experience ── */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Briefcase size={16} className="text-blue-600" /> Work Experience
              </h3>
              <button type="button" onClick={() => appendExp({ schoolName: '', role: '', subject: '', startDate: '', endDate: '', currentlyWorking: false })}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                <Plus size={12} /> Add
              </button>
            </div>
            {expFields.map((field, idx) => (
              <div key={field.id} className="p-4 bg-amber-50 border border-amber-100 rounded-xl space-y-3 relative">
                {expFields.length > 1 && (
                  <button type="button" onClick={() => removeExp(idx)}
                    className="absolute top-3 right-3 w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors">
                    <Trash2 size={11} />
                  </button>
                )}
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">Experience #{idx + 1}</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input {...register(`experiences.${idx}.schoolName`)} placeholder="School / Institution name" className="bg-white" />
                  <Input {...register(`experiences.${idx}.role`)} placeholder="Role (e.g. Math Teacher)" className="bg-white" />
                  <Input {...register(`experiences.${idx}.subject`)} placeholder="Subject taught" className="bg-white" />
                  <Input {...register(`experiences.${idx}.startDate`)} type="date" className="bg-white" />
                  <Input {...register(`experiences.${idx}.endDate`)} type="date" className="bg-white"
                    disabled={watch(`experiences.${idx}.currentlyWorking`)} />
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input type="checkbox" {...register(`experiences.${idx}.currentlyWorking`)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                    Currently working here
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── SECTION 4: Documents ── */}
        {step === 4 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
              <FileText size={16} className="text-blue-600" /> Documents
            </h3>

            {/* Profile Photo re-upload */}
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-sm font-semibold text-gray-700 mb-3">Profile Photo</p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 border-2 border-blue-200 flex-shrink-0">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image size={24} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
                    <Upload size={14} /> {uploadingPhoto ? 'Uploading...' : photoPreview ? 'Re-upload Photo' : 'Upload Photo'}
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
                  </label>
                  {photoPreview && <p className="text-emerald-600 text-xs mt-1 flex items-center gap-1"><CheckCircle size={11} /> Photo uploaded</p>}
                </div>
              </div>
            </div>

            {/* Resume upload */}
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
              <p className="text-sm font-semibold text-gray-700 mb-3">Resume / CV (PDF only)</p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText size={24} className="text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  {resumeName && (
                    <p className="text-emerald-700 text-sm font-semibold truncate mb-1 flex items-center gap-1">
                      <CheckCircle size={13} /> {resumeName}
                    </p>
                  )}
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors">
                    <Upload size={14} /> {uploadingResume ? 'Uploading...' : resumeName ? 'Re-upload Resume' : 'Upload Resume'}
                    <input type="file" accept=".pdf" className="hidden" onChange={handleResumeUpload} disabled={uploadingResume} />
                  </label>
                  <p className="text-gray-400 text-xs mt-1">PDF only — max 10MB</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-6">
          <button type="button" onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <ChevronLeft size={16} /> Previous
          </button>

          {step < SECTIONS.length - 1 ? (
            <button type="button" onClick={() => setStep(s => s + 1)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors disabled:opacity-60">
              <Save size={16} /> {saving ? 'Saving...' : 'Save Application'}
            </button>
          )}
        </div>

        {/* Save anytime button */}
        <div className="mt-3 text-center">
          <button type="submit" disabled={saving}
            className="text-xs text-gray-400 hover:text-blue-600 transition-colors underline">
            {saving ? 'Saving...' : 'Save progress anytime'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeacherApply;
