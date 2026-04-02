// src/pages/teacher/TeacherApply.jsx
import { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { teacherAPI } from '../../api';
import Spinner from '../../components/common/Spinner';
import { useAuth } from '../../context/AuthContext';
import {
  User, BookOpen, Briefcase, GraduationCap, FileText,
  Upload, Plus, Trash2, ChevronRight, ChevronLeft,
  CheckCircle, Image as ImageIcon, Save, X, Camera
} from 'lucide-react';

// ─── Dropdown Options ──────────────────────────────────────────────────────
const DEGREES = [
  '10th (Matriculation)', '12th (Intermediate)', 'Diploma',
  "Bachelor's (B.A.)", "Bachelor's (B.Sc.)", "Bachelor's (B.Com.)",
  "Bachelor's (B.Tech / B.E.)", 'B.Ed. (Bachelor of Education)',
  "Master's (M.A.)", "Master's (M.Sc.)", "Master's (M.Com.)",
  'M.Ed. (Master of Education)', 'M.Phil.', 'Ph.D.', 'Other'
];

const TEACHING_QUALS = ['B.Ed', 'D.El.Ed', 'M.Ed', 'NTT', 'JBT', 'CTET Qualified', 'STET Qualified', 'Other'];

const SUBJECTS = [
  'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology',
  'English', 'Hindi', 'Sanskrit', 'Social Studies', 'History',
  'Geography', 'Political Science', 'Economics', 'Commerce',
  'Accountancy', 'Computer Science', 'Physical Education',
  'Art & Craft', 'Music', 'Dance', 'EVS', 'Moral Science', 'Other'
];

const CLASS_LEVELS = [
  'Nursery / Pre-Primary', 'KG (Kindergarten)', 'Class 1 – 2',
  'Class 3 – 5 (Primary)', 'Class 6 – 8 (Middle)', 'Class 9 – 10 (Secondary)',
  'Class 11 – 12 (Senior Secondary)', 'All Classes'
];

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Other'
];

const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];

const EXPERIENCE_RANGES = ['Fresher (0 years)', '1 year', '2 years', '3 years',
  '4 years', '5 years', '6–8 years', '9–10 years', '10+ years'];

// ─── Steps config ──────────────────────────────────────────────────────────
const STEPS = [
  { id: 'personal',  label: 'Personal',   icon: User },
  { id: 'teaching',  label: 'Teaching',   icon: BookOpen },
  { id: 'education', label: 'Education',  icon: GraduationCap },
  { id: 'experience',label: 'Experience', icon: Briefcase },
  { id: 'documents', label: 'Documents',  icon: FileText },
];

// ─── Checkbox Tag Group ────────────────────────────────────────────────────
const TagSelect = ({ options, value = [], onChange, color = 'blue' }) => {
  const toggle = (opt) => {
    const next = value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt];
    onChange(next);
  };
  const colors = {
    blue:   'bg-blue-600 text-white border-blue-600',
    purple: 'bg-purple-600 text-white border-purple-600',
    amber:  'bg-amber-500 text-white border-amber-500',
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button key={opt} type="button" onClick={() => toggle(opt)}
          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
            value.includes(opt)
              ? colors[color]
              : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
          }`}>
          {opt}
        </button>
      ))}
    </div>
  );
};

// ─── Select field ──────────────────────────────────────────────────────────
const SelectField = ({ label, name, options, register, required, placeholder }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <div className="relative">
      <select
        {...register(name, required ? { required: `${label} is required` } : {})}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          appearance-none bg-white text-gray-700"
      >
        <option value="">{placeholder || `Select ${label}`}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
    </div>
  </div>
);

// ─── Input field ───────────────────────────────────────────────────────────
const InputField = ({ label, name, type = 'text', register, required, placeholder, disabled, readOnly }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-400">*</span>}
      {readOnly && <span className="ml-1 text-[10px] text-blue-500 font-normal">(auto-filled)</span>}
    </label>
    <input
      {...register(name, required ? { required: `${label} is required` } : {})}
      type={type}
      placeholder={placeholder}
      disabled={disabled || readOnly}
      className={`w-full px-4 py-2.5 border rounded-xl text-sm
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        transition-colors ${disabled || readOnly
          ? 'bg-gray-50 border-gray-100 text-gray-500 cursor-not-allowed'
          : 'border-gray-200 bg-white hover:border-blue-200'
        }`}
    />
  </div>
);

// ─── Photo Upload ──────────────────────────────────────────────────────────
const PhotoUpload = ({ value, onChange, loading }) => (
  <div className="flex flex-col items-center">
    <div className="relative mb-3">
      <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 overflow-hidden">
        {value ? (
          <img src={value} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon size={28} className="text-gray-300" />
          </div>
        )}
      </div>
      <label className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full
        flex items-center justify-center cursor-pointer shadow-md hover:bg-blue-700 transition-colors">
        <Camera size={13} className="text-white" />
        <input type="file" accept="image/*" className="hidden" onChange={onChange} disabled={loading} />
      </label>
    </div>
    <p className="text-[11px] text-gray-400 text-center">
      {loading ? 'Uploading...' : 'Tap camera to change photo'}
    </p>
    {value && (
      <button type="button" onClick={() => onChange(null)}
        className="text-[11px] text-red-400 hover:text-red-600 mt-1 flex items-center gap-0.5">
        <X size={10} /> Remove
      </button>
    )}
  </div>
);

// ─── Step: Personal ───────────────────────────────────────────────────────
const StepPersonal = ({ register, control, photoUrl, setPhotoUrl, uploadingPhoto, handlePhotoUpload }) => (
  <div className="space-y-5">
    {/* Photo */}
    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
      <h4 className="font-bold text-gray-800 text-sm mb-4">Profile Photo</h4>
      <div className="flex items-center gap-6">
        <PhotoUpload value={photoUrl} onChange={handlePhotoUpload} loading={uploadingPhoto} />
        <div className="text-xs text-gray-500 space-y-1.5">
          <p>📸 Upload a clear, recent passport-sized photo</p>
          <p>✅ Accepted: JPG, PNG, WebP</p>
          <p>📏 Max size: 5 MB</p>
          <p>🔄 You can re-upload anytime to update</p>
        </div>
      </div>
    </div>

    {/* Basic fields */}
    <div className="grid sm:grid-cols-2 gap-4">
      <InputField label="Full Name" name="fullName" register={register} required placeholder="As per documents" />
      <InputField label="Email Address" name="email" type="email" register={register} readOnly />
      <InputField label="Phone Number" name="phone" register={register} required placeholder="+91 XXXXX XXXXX" />
      <InputField label="Alternate Phone" name="alternatePhone" register={register} placeholder="Optional" />
      <InputField label="Date of Birth" name="dateOfBirth" type="date" register={register} required />
      <SelectField label="Gender" name="gender" options={GENDERS} register={register} required />
    </div>

    {/* Address */}
    <div className="space-y-4">
      <h4 className="font-bold text-gray-700 text-sm border-t border-gray-100 pt-4">Address</h4>
      <div className="sm:col-span-2">
        <InputField label="Current Address" name="currentAddress" register={register} required placeholder="House no, Street, Area" />
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <InputField label="City" name="city" register={register} required placeholder="City name" />
        <SelectField label="State" name="state" options={STATES} register={register} required />
        <InputField label="Pincode" name="pincode" register={register} placeholder="6-digit pincode" />
      </div>
      <InputField label="Permanent Address" name="permanentAddress" register={register} placeholder="If different from current" />
    </div>
  </div>
);

// ─── Step: Teaching ───────────────────────────────────────────────────────
const StepTeaching = ({ register, control }) => (
  <div className="space-y-5">
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        Subjects You Teach <span className="text-red-400">*</span>
      </label>
      <Controller
        name="subjects"
        control={control}
        render={({ field }) => (
          <TagSelect options={SUBJECTS} value={field.value} onChange={field.onChange} color="blue" />
        )}
      />
    </div>

    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        Class Levels <span className="text-red-400">*</span>
      </label>
      <Controller
        name="classLevels"
        control={control}
        render={({ field }) => (
          <TagSelect options={CLASS_LEVELS} value={field.value} onChange={field.onChange} color="purple" />
        )}
      />
    </div>

    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">Teaching Qualifications</label>
      <Controller
        name="teachingQualifications"
        control={control}
        render={({ field }) => (
          <TagSelect options={TEACHING_QUALS} value={field.value} onChange={field.onChange} color="amber" />
        )}
      />
    </div>

    <div className="grid sm:grid-cols-2 gap-4">
      <SelectField label="Years of Experience" name="experienceYears" options={EXPERIENCE_RANGES} register={register} />
      <InputField label="Expected Salary" name="expectedSalary" register={register} placeholder="e.g. ₹25,000/month" />
    </div>

    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Teaching Locations</label>
      <Controller
        name="preferredLocations"
        control={control}
        render={({ field }) => (
          <TagSelect options={STATES.slice(0, 15)} value={field.value} onChange={field.onChange} color="blue" />
        )}
      />
    </div>
  </div>
);

// ─── Step: Education ──────────────────────────────────────────────────────
const StepEducation = ({ register, control }) => {
  const { fields, append, remove } = useFieldArray({ control, name: 'education' });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-gray-700">Education History</p>
        <button type="button"
          onClick={() => append({ degree: '', specialization: '', institution: '', boardOrUniversity: '', yearOfPassing: '', percentage: '' })}
          className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold
            bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition-colors">
          <Plus size={13} /> Add Education
        </button>
      </div>

      {fields.map((field, idx) => (
        <div key={field.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Education #{idx + 1}
            </span>
            {fields.length > 1 && (
              <button type="button" onClick={() => remove(idx)}
                className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center
                  text-red-500 hover:bg-red-200 transition-colors">
                <Trash2 size={11} />
              </button>
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Degree / Qualification <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select {...register(`education.${idx}.degree`, { required: true })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white">
                  <option value="">Select degree</option>
                  {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronRight size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Specialization</label>
              <input {...register(`education.${idx}.specialization`)}
                placeholder="e.g. Mathematics"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white
                  focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Institution <span className="text-red-400">*</span>
              </label>
              <input {...register(`education.${idx}.institution`, { required: true })}
                placeholder="College / School name"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white
                  focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Board / University</label>
              <input {...register(`education.${idx}.boardOrUniversity`)}
                placeholder="e.g. CBSE, Delhi University"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white
                  focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Year of Passing <span className="text-red-400">*</span>
              </label>
              <input {...register(`education.${idx}.yearOfPassing`, { required: true, min: 1980, max: new Date().getFullYear() })}
                type="number" placeholder="e.g. 2020"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white
                  focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Percentage / CGPA</label>
              <input {...register(`education.${idx}.percentage`, { min: 0, max: 100 })}
                type="number" placeholder="e.g. 78.5"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white
                  focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Step: Experience ─────────────────────────────────────────────────────
const StepExperience = ({ register, control }) => {
  const { fields, append, remove } = useFieldArray({ control, name: 'experiences' });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-gray-700">Work Experience</p>
        <button type="button"
          onClick={() => append({ schoolName: '', role: '', subject: '', startDate: '', endDate: '', currentlyWorking: false })}
          className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold
            bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition-colors">
          <Plus size={13} /> Add Experience
        </button>
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <Briefcase size={28} className="text-gray-300 mx-auto mb-2" />
          <p className="text-gray-400 text-sm font-medium">No experience added yet</p>
          <p className="text-gray-300 text-xs mt-0.5">Click "Add Experience" if you have prior teaching history</p>
        </div>
      )}

      {fields.map((field, idx) => (
        <div key={field.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Experience #{idx + 1}</span>
            <button type="button" onClick={() => remove(idx)}
              className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-500">
              <Trash2 size={11} />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { name: `experiences.${idx}.schoolName`, label: 'School / Institution', placeholder: 'School name' },
              { name: `experiences.${idx}.role`, label: 'Role / Designation', placeholder: 'e.g. PGT Mathematics' },
              { name: `experiences.${idx}.subject`, label: 'Subject Taught', placeholder: 'e.g. Mathematics' },
            ].map(f => (
              <div key={f.name}>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                <input {...register(f.name)} placeholder={f.placeholder}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date</label>
              <input {...register(`experiences.${idx}.startDate`)} type="date"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white
                  focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">End Date</label>
              <input {...register(`experiences.${idx}.endDate`)} type="date"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white
                  focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <input {...register(`experiences.${idx}.currentlyWorking`)} type="checkbox"
                id={`curr-${idx}`}
                className="w-4 h-4 text-blue-600 rounded border-gray-300" />
              <label htmlFor={`curr-${idx}`} className="text-xs font-medium text-gray-600">
                Currently working here
              </label>
            </div>
          </div>
        </div>
      ))}

      <div className="mt-2">
        <label className="block text-sm font-bold text-gray-700 mb-1.5">Experience Summary</label>
        <textarea {...register('experienceDetails')} rows={3}
          placeholder="Briefly describe your overall teaching experience, achievements, special skills..."
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white
            focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
      </div>
    </div>
  );
};

// ─── Step: Documents ──────────────────────────────────────────────────────
const StepDocuments = ({ resumeUrl, setResumeUrl, uploadingResume, handleResumeUpload,
  photoUrl, setPhotoUrl, uploadingPhoto, handlePhotoUpload }) => (
  <div className="space-y-5">
    {/* Resume */}
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <h4 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
        <FileText size={16} className="text-blue-600" /> Resume (PDF)
      </h4>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
          <FileText size={24} className={resumeUrl ? 'text-blue-600' : 'text-gray-300'} />
        </div>
        <div className="flex-1">
          {resumeUrl ? (
            <div className="space-y-2">
              <a href={resumeUrl} target="_blank" rel="noreferrer"
                className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-500" />
                Resume uploaded — View PDF
              </a>
              <p className="text-gray-400 text-xs">Last updated. You can re-upload to replace it.</p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No resume uploaded yet. Upload your latest CV.</p>
          )}
        </div>
      </div>
      <label className={`mt-4 flex items-center justify-center gap-2 w-full py-3
        border-2 border-dashed rounded-xl cursor-pointer transition-all text-sm font-semibold ${
        uploadingResume
          ? 'border-blue-200 bg-blue-50 text-blue-400 cursor-not-allowed'
          : 'border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400'
      }`}>
        <Upload size={15} />
        {uploadingResume ? 'Uploading resume...' : resumeUrl ? 'Re-upload Resume' : 'Upload Resume (PDF only)'}
        <input type="file" accept=".pdf" className="hidden" onChange={handleResumeUpload} disabled={uploadingResume} />
      </label>
    </div>

    {/* Profile Photo re-upload */}
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <h4 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
        <ImageIcon size={16} className="text-purple-600" /> Profile Photo
      </h4>
      <div className="flex items-center gap-6">
        <PhotoUpload value={photoUrl} onChange={handlePhotoUpload} loading={uploadingPhoto} />
        <div className="flex-1 text-xs text-gray-400 space-y-1.5">
          {photoUrl
            ? <p className="text-emerald-600 font-semibold flex items-center gap-1"><CheckCircle size={13} /> Photo uploaded</p>
            : <p className="text-amber-600 font-semibold">No photo yet — please upload</p>}
          <p>• Passport-size, clear face photo</p>
          <p>• JPG, PNG or WebP, max 5 MB</p>
          <p>• Tap the camera icon to change</p>
        </div>
      </div>
    </div>

    {/* Terms */}
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" className="mt-0.5 w-4 h-4 text-blue-600 rounded border-gray-300 flex-shrink-0" required />
        <span className="text-sm text-amber-800">
          I confirm that all the information I have provided is accurate and complete.
          I agree to the{' '}
          <a href="/terms/teacher" className="text-blue-600 underline font-semibold" target="_blank">
            Terms & Conditions
          </a>
          {' '}of Maa Savitri Consultancy Services.
        </span>
      </label>
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────
const TeacherApply = () => {
  const [step, setStep]       = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [photoUrl, setPhotoUrl]     = useState('');
  const [resumeUrl, setResumeUrl]   = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [savedSteps, setSavedSteps] = useState({});
  const { user } = useAuth();

  const { register, handleSubmit, control, reset, getValues, trigger, formState: { errors } } = useForm({
    defaultValues: {
      education: [{ degree: '', specialization: '', institution: '', boardOrUniversity: '', yearOfPassing: '', percentage: '' }],
      experiences: [],
      subjects: [],
      classLevels: [],
      teachingQualifications: [],
      preferredLocations: [],
    }
  });

  // Auto-fill email & name from user context
  useEffect(() => {
    teacherAPI.getProfile()
      .then(({ data }) => {
        const p = data.profile || data;
        reset({
          fullName: p.fullName || user?.name || '',
          email:    p.email    || user?.email || '',
          phone:    p.phone    || user?.phone || '',
          alternatePhone: p.alternatePhone || '',
          dateOfBirth:  p.dateOfBirth ? p.dateOfBirth.split('T')[0] : '',
          gender:       p.gender || '',
          currentAddress:   p.currentAddress   || '',
          permanentAddress: p.permanentAddress  || '',
          city:    p.city    || '',
          state:   p.state   || '',
          pincode: p.pincode || '',
          subjects:    p.subjects    || [],
          classLevels: p.classLevels || [],
          teachingQualifications: p.teachingQualifications || [],
          preferredLocations:     p.preferredLocations     || [],
          experienceYears:    p.experienceYears    || '',
          experienceDetails:  p.experienceDetails  || '',
          expectedSalary:     p.expectedSalary     || '',
          education:   p.education?.length   ? p.education   : [{ degree: '', specialization: '', institution: '', boardOrUniversity: '', yearOfPassing: '', percentage: '' }],
          experiences: p.experiences?.length ? p.experiences : [],
        });
        setPhotoUrl(p.profilePhoto || '');
        setResumeUrl(p.resume      || '');
      })
      .finally(() => setLoading(false));
  }, [reset, user]);

  // Step-level save
  const saveStep = async () => {
    const data = getValues();
    setSaving(true);
    try {
      await teacherAPI.updateProfile({
        ...data,
        profilePhoto: photoUrl,
        resume: resumeUrl,
      });
      setSavedSteps(prev => ({ ...prev, [step]: true }));
      toast.success(`Step ${step + 1} saved!`);
    } catch {
      toast.error('Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const nextStep = async () => {
    const valid = await trigger();
    if (!valid) { toast.error('Please fill all required fields'); return; }
    await saveStep();
    if (step < STEPS.length - 1) setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const onFinalSubmit = async (data) => {
    setSaving(true);
    try {
      await teacherAPI.updateProfile({ ...data, profilePhoto: photoUrl, resume: resumeUrl });
      toast.success('Application submitted successfully! 🎉');
    } catch {
      toast.error('Submission failed');
    } finally {
      setSaving(false);
    }
  };

  // Photo upload
  const handlePhotoUpload = async (e) => {
    if (!e?.target?.files?.[0]) return;
    const file = e.target.files[0];
    setUploadingPhoto(true);
    try {
      const fd = new FormData();
      fd.append('photo', file);
      const { data } = await teacherAPI.uploadPhoto(fd);
      setPhotoUrl(data.url);
      toast.success('Photo updated!');
    } catch { toast.error('Photo upload failed'); }
    finally { setUploadingPhoto(false); }
  };

  // Resume upload
  const handleResumeUpload = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { toast.error('Only PDF files allowed'); return; }
    setUploadingResume(true);
    try {
      const fd = new FormData();
      fd.append('resume', file);
      const { data } = await teacherAPI.uploadResume(fd);
      setResumeUrl(data.url);
      toast.success('Resume uploaded!');
    } catch { toast.error('Resume upload failed'); }
    finally { setUploadingResume(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Spinner size="lg" />
    </div>
  );

  const isLastStep = step === STEPS.length - 1;

  return (
    <div className="min-h-screen bg-[#EEF2FF] pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-4 pt-6 pb-5">
        <div className="max-w-2xl mx-auto">
          <p className="text-blue-200 text-xs font-semibold mb-1">🎓 Maa Savitri Consultancy</p>
          <h1 className="text-white text-xl font-black mb-0.5">Teacher Application Form</h1>
          <p className="text-blue-200 text-xs">
            Fill all sections carefully. Each section auto-saves as you proceed.
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 overflow-x-auto">
          <div className="flex items-center gap-0 min-w-max">
            {STEPS.map((s, idx) => {
              const done    = savedSteps[idx] || idx < step;
              const current = idx === step;
              return (
                <div key={s.id} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => idx < step && setStep(idx)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
                      transition-all ${current
                        ? 'bg-blue-600 text-white'
                        : done
                        ? 'text-emerald-600 cursor-pointer hover:bg-emerald-50'
                        : 'text-gray-400 cursor-default'
                    }`}
                  >
                    {done && !current
                      ? <CheckCircle size={13} className="text-emerald-500" />
                      : <s.icon size={13} />
                    }
                    {s.label}
                  </button>
                  {idx < STEPS.length - 1 && (
                    <div className={`w-4 h-px mx-0.5 ${done ? 'bg-emerald-300' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form body */}
      <div className="max-w-2xl mx-auto px-4 py-5">
        <form onSubmit={handleSubmit(onFinalSubmit)}>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-50">
              <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                {(() => { const StepIcon = STEPS[step].icon; return <StepIcon size={17} className="text-blue-600" />; })()}
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-base">{STEPS[step].label}</h3>
                <p className="text-gray-400 text-xs">Step {step + 1} of {STEPS.length}</p>
              </div>
              <div className="ml-auto">
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  {Math.round(((step + 1) / STEPS.length) * 100)}%
                </span>
              </div>
            </div>

            {step === 0 && (
              <StepPersonal register={register} control={control}
                photoUrl={photoUrl} setPhotoUrl={setPhotoUrl}
                uploadingPhoto={uploadingPhoto} handlePhotoUpload={handlePhotoUpload} />
            )}
            {step === 1 && <StepTeaching register={register} control={control} />}
            {step === 2 && <StepEducation register={register} control={control} />}
            {step === 3 && <StepExperience register={register} control={control} />}
            {step === 4 && (
              <StepDocuments
                resumeUrl={resumeUrl} setResumeUrl={setResumeUrl}
                uploadingResume={uploadingResume} handleResumeUpload={handleResumeUpload}
                photoUrl={photoUrl} setPhotoUrl={setPhotoUrl}
                uploadingPhoto={uploadingPhoto} handlePhotoUpload={handlePhotoUpload} />
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-3">
            {step > 0 && (
              <button type="button" onClick={prevStep}
                className="flex items-center gap-2 px-5 py-3 border border-gray-200 text-gray-700
                  rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                <ChevronLeft size={15} /> Back
              </button>
            )}
            <button type="button" onClick={saveStep} disabled={saving}
              className="flex items-center gap-2 px-4 py-3 border border-blue-200 text-blue-700
                rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors ml-auto disabled:opacity-50">
              <Save size={14} />
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            {isLastStep ? (
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800
                  text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-60">
                <CheckCircle size={15} />
                {saving ? 'Submitting...' : 'Submit Application'}
              </button>
            ) : (
              <button type="button" onClick={nextStep} disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800
                  text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-60">
                {saving ? 'Saving...' : 'Save & Next'}
                <ChevronRight size={15} />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherApply;