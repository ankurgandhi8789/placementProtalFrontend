// src/pages/school/SchoolRequirements.jsx
import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';
import { schoolAPI } from '../../api';
import Spinner from '../../components/common/Spinner';
import {
  Plus, Trash2, Check, X, Briefcase, Users, DollarSign,
  Home, Shield, FileText, ChevronRight, ChevronDown,
  CheckCircle, Edit3, AlertCircle, Save
} from 'lucide-react';

// ─── Vacancy type options ──────────────────────────────────────────────────
const VACANCY_TYPES = [
  { value: 'PRT',            label: 'PRT',              desc: 'Primary Teacher',         color: 'blue'   },
  { value: 'TGT',            label: 'TGT',              desc: 'Trained Graduate Teacher', color: 'purple' },
  { value: 'PGT',            label: 'PGT',              desc: 'Post Graduate Teacher',   color: 'indigo' },
  { value: 'PRT + TGT',      label: 'PRT + TGT',        desc: 'Primary & Trained',       color: 'violet' },
  { value: 'TGT + PGT',      label: 'TGT + PGT',        desc: 'Trained & Post Graduate', color: 'fuchsia'},
  { value: 'PRT + TGT + PGT',label: 'PRT + TGT + PGT',  desc: 'All Teaching Levels',    color: 'pink'   },
  { value: 'Principal',      label: 'Principal',        desc: 'School Principal',        color: 'amber'  },
  { value: 'Vice-Principal', label: 'Vice-Principal',   desc: 'Vice Principal',          color: 'orange' },
  { value: 'Non-Teaching',   label: 'Non-Teaching',     desc: 'Admin / Support Staff',   color: 'gray'   },
];

const TYPE_COLORS = {
  blue:    { bg: 'bg-blue-50',    border: 'border-blue-200',   text: 'text-blue-700',   sel: 'bg-blue-600 text-white border-blue-600'   },
  purple:  { bg: 'bg-purple-50',  border: 'border-purple-200', text: 'text-purple-700', sel: 'bg-purple-600 text-white border-purple-600' },
  indigo:  { bg: 'bg-indigo-50',  border: 'border-indigo-200', text: 'text-indigo-700', sel: 'bg-indigo-600 text-white border-indigo-600' },
  violet:  { bg: 'bg-violet-50',  border: 'border-violet-200', text: 'text-violet-700', sel: 'bg-violet-600 text-white border-violet-600' },
  fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-200',text: 'text-fuchsia-700',sel: 'bg-fuchsia-600 text-white border-fuchsia-600'},
  pink:    { bg: 'bg-pink-50',    border: 'border-pink-200',   text: 'text-pink-700',   sel: 'bg-pink-600 text-white border-pink-600'   },
  amber:   { bg: 'bg-amber-50',   border: 'border-amber-200',  text: 'text-amber-700',  sel: 'bg-amber-500 text-white border-amber-500'  },
  orange:  { bg: 'bg-orange-50',  border: 'border-orange-200', text: 'text-orange-700', sel: 'bg-orange-500 text-white border-orange-500' },
  gray:    { bg: 'bg-gray-50',    border: 'border-gray-200',   text: 'text-gray-700',   sel: 'bg-gray-600 text-white border-gray-600'   },
};

// ─── Boolean toggle card ──────────────────────────────────────────────────
const BoolToggle = ({ label, desc, icon: Icon, value, onChange, required }) => (
  <div>
    <p className="text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-red-400">*</span>}
    </p>
    <div className="grid grid-cols-2 gap-2">
      {[{ v: true, l: 'Yes', icon: CheckCircle, activeClass: 'bg-emerald-600 border-emerald-600 text-white' },
        { v: false, l: 'No',  icon: X,           activeClass: 'bg-red-500 border-red-500 text-white' }
      ].map(opt => (
        <button key={String(opt.v)} type="button" onClick={() => onChange(opt.v)}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-bold
            transition-all ${value === opt.v ? opt.activeClass : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}>
          <opt.icon size={15} />
          {opt.l}
        </button>
      ))}
    </div>
    {desc && <p className="text-gray-400 text-xs mt-1.5">{desc}</p>}
  </div>
);

// ─── Vacancy row (inside the fieldArray) ─────────────────────────────────
const VacancyRow = ({ idx, register, errors, remove, showRemove }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className={`border rounded-2xl overflow-hidden transition-all ${
      errors?.vacancies?.[idx] ? 'border-red-200 bg-red-50/30' : 'border-gray-100 bg-white'
    }`}>
      {/* Row header */}
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
        onClick={() => setExpanded(e => !e)}>
        <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Briefcase size={13} className="text-blue-600" />
        </div>
        <p className="font-bold text-gray-800 text-sm flex-1">Vacancy #{idx + 1}</p>
        <div className="flex items-center gap-1">
          {showRemove && (
            <button type="button" onClick={(e) => { e.stopPropagation(); remove(idx); }}
              className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-200 transition-colors">
              <Trash2 size={13} />
            </button>
          )}
          {expanded ? <ChevronDown size={15} className="text-gray-400" /> : <ChevronRight size={15} className="text-gray-400" />}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-50 pt-3">
          {/* Type selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Type of Vacancy <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                {...register(`vacancies.${idx}.type`, { required: 'Please select vacancy type' })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white
                  focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                <option value="">Select vacancy type</option>
                {VACANCY_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label} — {t.desc}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {errors?.vacancies?.[idx]?.type && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={11} /> {errors.vacancies[idx].type.message}
              </p>
            )}

            {/* Visual type chips for reference */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {VACANCY_TYPES.map(t => {
                const c = TYPE_COLORS[t.color];
                return (
                  <span key={t.value} className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.bg} ${c.border} ${c.text}`}>
                    {t.label}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Number of posts */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Number of Posts <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register(`vacancies.${idx}.numberOfPosts`, {
                    required: 'Required',
                    min: { value: 1, message: 'At least 1 post' }
                  })}
                  type="number" min="1" placeholder="e.g. 2"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-200 transition-colors" />
              </div>
              {errors?.vacancies?.[idx]?.numberOfPosts && (
                <p className="text-red-400 text-xs mt-1">{errors.vacancies[idx].numberOfPosts.message}</p>
              )}
            </div>

            {/* Salary */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Salary Offered <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register(`vacancies.${idx}.salary`, { required: 'Required' })}
                  placeholder="e.g. ₹30,000/month"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-200 transition-colors" />
              </div>
              {errors?.vacancies?.[idx]?.salary && (
                <p className="text-red-400 text-xs mt-1">{errors.vacancies[idx].salary.message}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────
const SchoolRequirements = () => {
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [profile, setProfile]   = useState(null);
  // Local state for boolean fields (not in useForm to avoid RHF checkbox issues)
  const [accommodation, setAccommodation] = useState(null);
  const [healthInsurance, setHealthInsurance] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(null);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: { vacancies: [{ type: '', numberOfPosts: '', salary: '' }] }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'vacancies' });

  useEffect(() => {
    schoolAPI.getProfile().then(({ data }) => {
      const p = data.profile || data;
      setProfile(p);
      if (p.vacancies?.length > 0) {
        reset({ vacancies: p.vacancies.map(v => ({ type: v.type, numberOfPosts: v.numberOfPosts, salary: v.salary })) });
      }
      if (p.accommodationProvided !== undefined) setAccommodation(p.accommodationProvided);
      if (p.healthInsuranceProvided !== undefined) setHealthInsurance(p.healthInsuranceProvided);
      if (p.termsAccepted !== undefined) setTermsAccepted(p.termsAccepted);
    }).finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data) => {
    // Validate booleans
    if (accommodation === null) { toast.error('Please select accommodation option'); return; }
    if (healthInsurance === null) { toast.error('Please select health insurance option'); return; }
    if (termsAccepted !== true) { toast.error('You must agree to Terms & Conditions'); return; }

    setSaving(true);
    try {
      await schoolAPI.updateProfile({
        vacancies: data.vacancies,
        accommodationProvided: accommodation,
        healthInsuranceProvided: healthInsurance,
        termsAccepted,
      });
      toast.success('Requirements saved successfully!');
    } catch { toast.error('Failed to save requirements'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  const totalPosts = fields.reduce((s, _, i) => {
    const el = document.querySelector(`input[name="vacancies.${i}.numberOfPosts"]`);
    return s + (parseInt(el?.value) || 0);
  }, 0);

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900">Teacher Requirements</h2>
        <p className="text-gray-400 text-sm mt-1">Post your vacancy details for teacher placement</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* ─ Section 1: Institute details summary ─ */}
        {profile?.schoolName && (
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-4 text-white flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              {profile.logo
                ? <img src={profile.logo} alt="" className="w-full h-full object-cover rounded-xl" />
                : <span className="font-black text-lg">{profile.schoolName[0]}</span>}
            </div>
            <div>
              <p className="font-extrabold text-base leading-tight">{profile.schoolName}</p>
              {profile.city && <p className="text-blue-200 text-xs mt-0.5">{profile.city}{profile.state ? `, ${profile.state}` : ''}</p>}
            </div>
            {profile.isVerified && (
              <div className="ml-auto flex items-center gap-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-2.5 py-1">
                <CheckCircle size={11} className="text-emerald-300" />
                <span className="text-emerald-200 text-[10px] font-semibold">Verified</span>
              </div>
            )}
          </div>
        )}

        {/* ─ Section 2: Vacancies ─ */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Briefcase size={15} className="text-blue-600" /> Vacancy Details
            </h3>
            <button type="button"
              onClick={() => append({ type: '', numberOfPosts: '', salary: '' })}
              className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold bg-blue-50
                px-3 py-1.5 rounded-xl hover:bg-blue-100 transition-colors">
              <Plus size={13} /> Add Vacancy
            </button>
          </div>

          {/* Type legend */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mb-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Vacancy Type Reference</p>
            <div className="grid grid-cols-2 gap-1">
              {VACANCY_TYPES.map(t => {
                const c = TYPE_COLORS[t.color];
                return (
                  <div key={t.value} className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${c.bg} ${c.text} flex-shrink-0`}>{t.label}</span>
                    <span className="text-[10px] text-gray-400 truncate">{t.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            {fields.map((field, idx) => (
              <VacancyRow
                key={field.id}
                idx={idx}
                register={register}
                errors={errors}
                remove={remove}
                showRemove={fields.length > 1}
              />
            ))}
          </div>
        </div>

        {/* ─ Section 3: Facilities ─ */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
            <Home size={15} className="text-blue-600" /> Facilities Provided
          </h3>
          <div className="space-y-5">
            <BoolToggle
              label="Will institute provide Accommodation?"
              desc="Whether the school provides housing or hostel for the teacher"
              icon={Home}
              value={accommodation}
              onChange={setAccommodation}
              required
            />
            <div className="h-px bg-gray-50" />
            <BoolToggle
              label="Will institute provide Health Insurance?"
              desc="Whether the school provides medical / health coverage for the teacher"
              icon={Shield}
              value={healthInsurance}
              onChange={setHealthInsurance}
              required
            />
          </div>
        </div>

        {/* ─ Section 4: Terms ─ */}
        <div className={`rounded-2xl p-5 border-2 transition-all ${
          termsAccepted === true ? 'bg-emerald-50 border-emerald-200' :
          termsAccepted === false ? 'bg-red-50 border-red-200' :
          'bg-amber-50 border-amber-200'
        }`}>
          <h3 className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-2">
            <FileText size={15} className="text-blue-600" /> Terms & Conditions
            <span className="text-red-400">*</span>
          </h3>
          <p className="text-gray-500 text-xs mb-4">
            Please read and agree to the{' '}
            <a href="/terms/school" target="_blank" className="text-blue-600 underline font-semibold">
              School Terms & Conditions
            </a>{' '}
            before submitting your requirements.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setTermsAccepted(true)}
              className={`flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 text-sm font-bold transition-all ${
                termsAccepted === true ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-emerald-300'
              }`}>
              <CheckCircle size={16} />
              Yes, I Agree
            </button>
            <button type="button" onClick={() => setTermsAccepted(false)}
              className={`flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 text-sm font-bold transition-all ${
                termsAccepted === false ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-red-300'
              }`}>
              <X size={16} />
              No, I Don't
            </button>
          </div>

          {termsAccepted === false && (
            <div className="mt-3 flex items-start gap-2 bg-red-100 rounded-xl p-3">
              <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-xs">
                You must agree to the Terms & Conditions to post requirements. Please review them and click "Yes, I Agree".
              </p>
            </div>
          )}
          {termsAccepted === true && (
            <div className="mt-3 flex items-center gap-2 bg-emerald-100 rounded-xl p-3">
              <CheckCircle size={15} className="text-emerald-600 flex-shrink-0" />
              <p className="text-emerald-700 text-xs font-semibold">
                Thank you for agreeing to our Terms & Conditions.
              </p>
            </div>
          )}
        </div>

        {/* Submit */}
        <button type="submit" disabled={saving || termsAccepted !== true}
          className="w-full flex items-center justify-center gap-2 py-4
            bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold rounded-xl
            shadow-md hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm">
          <Save size={16} />
          {saving ? 'Saving Requirements...' : 'Save Requirements'}
        </button>

        {termsAccepted !== true && (
          <p className="text-center text-xs text-gray-400">
            Please agree to Terms & Conditions to save your requirements.
          </p>
        )}
      </form>
    </div>
  );
};

export default SchoolRequirements;