// src/pages/admin/AdminSchoolDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminAPI } from '../../api';
import Spinner from '../../components/common/Spinner';
import {
  ArrowLeft, CheckCircle, XCircle, MapPin, Phone,
  Mail, Globe, Building2, Briefcase, Users, Home,
  Shield, FileText, DollarSign, MessageSquare, Save
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

const VACANCY_COLORS = {
  PRT: 'bg-blue-100 text-blue-700', TGT: 'bg-purple-100 text-purple-700',
  PGT: 'bg-indigo-100 text-indigo-700', Principal: 'bg-amber-100 text-amber-700',
  'Vice-Principal': 'bg-orange-100 text-orange-700', 'Non-Teaching': 'bg-gray-100 text-gray-700',
};

const VacancyBadge = ({ type }) => {
  const base = type?.split(' + ')[0] || type;
  const cls  = VACANCY_COLORS[base] || 'bg-blue-100 text-blue-700';
  return (
    <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${cls}`}>{type}</span>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={13} className="text-gray-500" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
};

const AdminSchoolDetail = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [school, setSchool]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  const { register, handleSubmit } = useForm();

  useEffect(() => {
    adminAPI.getSchool(id)
      .then(({ data }) => setSchool(data.school || data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleVerify = async () => {
    try {
      const res = await adminAPI.verifySchool(id, { isVerified: !school.isVerified });
      setSchool(res.data.school || res.data);
      toast.success(`School ${!school.isVerified ? 'verified' : 'unverified'}`);
    } catch { toast.error('Failed to update'); }
  };

  const onSaveNotes = async (data) => {
    setSaving(true);
    try {
      await adminAPI.updateSchoolNotes(id, data);
      toast.success('Notes saved');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!school) return <div className="text-center py-12 text-gray-400">School not found</div>;

  const initials = (school.schoolName || 'S').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const totalPosts = school.vacancies?.reduce((s, v) => s + (Number(v.numberOfPosts) || 0), 0) || 0;

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Back + header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors flex-shrink-0">
          <ArrowLeft size={16} className="text-gray-600" />
        </button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-amber-100 overflow-hidden flex items-center justify-center flex-shrink-0">
            {school.logo ? <img src={school.logo} alt="" className="w-full h-full object-cover" /> :
              <span className="font-bold text-amber-600">{initials}</span>}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-extrabold text-gray-900 truncate">{school.schoolName}</h2>
            <p className="text-gray-400 text-xs">{[school.city, school.state].filter(Boolean).join(', ')}</p>
          </div>
        </div>
        <button onClick={handleVerify}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
            school.isVerified
              ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
          }`}>
          {school.isVerified ? <><XCircle size={13} /> Unverify</> : <><CheckCircle size={13} /> Verify</>}
        </button>
      </div>

      {/* Verified banner */}
      {school.isVerified && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center gap-2">
          <CheckCircle size={15} className="text-emerald-500" />
          <p className="text-emerald-700 text-sm font-semibold">This school is verified by admin</p>
        </div>
      )}

      {/* Summary pills */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Briefcase, label: 'Vacancy Types', value: school.vacancies?.length || 0, bg: 'bg-blue-50', ic: 'text-blue-600', val: 'text-blue-700' },
          { icon: Users,     label: 'Total Posts',   value: totalPosts,                     bg: 'bg-purple-50', ic: 'text-purple-600', val: 'text-purple-700' },
          { icon: Home,      label: 'Accommodation', value: school.accommodationProvided ? 'Yes' : 'No', bg: school.accommodationProvided ? 'bg-emerald-50' : 'bg-gray-50', ic: school.accommodationProvided ? 'text-emerald-600' : 'text-gray-400', val: school.accommodationProvided ? 'text-emerald-700' : 'text-gray-500' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-3 text-center border border-white`}>
            <div className="flex justify-center mb-1">
              <s.icon size={16} className={s.ic} />
            </div>
            <p className={`font-black text-lg ${s.val}`}>{s.value}</p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Grid layout */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* School info */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50">
            <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center">
              <Building2 size={15} className="text-amber-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">School Information</h3>
          </div>
          <div className="p-5">
            <InfoItem icon={Phone}  label="Director Contact" value={school.directorContact} />
            <InfoItem icon={Phone}  label="Phone"            value={school.phone} />
            <InfoItem icon={Mail}   label="Email"            value={school.email} />
            <InfoItem icon={MapPin} label="Address"          value={school.address} />
            <InfoItem icon={MapPin} label="City"             value={school.city} />
            <InfoItem icon={MapPin} label="State"            value={school.state} />
            <InfoItem icon={MapPin} label="Pincode"          value={school.pincode} />
            <InfoItem icon={Globe}  label="Website"          value={school.website} />

            {/* Facilities */}
            <div className="mt-3 pt-3 border-t border-gray-50">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Facilities</p>
              <div className="flex gap-2 flex-wrap">
                <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                  school.accommodationProvided ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                }`}>
                  <Home size={11} />
                  Accommodation: {school.accommodationProvided ? 'Yes' : 'No'}
                </span>
                <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                  school.healthInsuranceProvided ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                }`}>
                  <Shield size={11} />
                  Health Insurance: {school.healthInsuranceProvided ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            {/* Terms */}
            <div className="mt-3">
              <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${
                school.termsAccepted ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                <FileText size={11} />
                Terms: {school.termsAccepted ? 'Accepted' : 'Not Accepted'}
              </span>
            </div>
          </div>
        </div>

        {/* Vacancies */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50">
            <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
              <Briefcase size={15} className="text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">
              Vacancies ({school.vacancies?.length || 0})
            </h3>
          </div>
          <div className="p-5">
            {!school.vacancies?.length ? (
              <div className="text-center py-6">
                <Briefcase size={24} className="text-gray-200 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No vacancies posted</p>
              </div>
            ) : (
              <div className="space-y-2">
                {school.vacancies.map((v, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase size={13} className="text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <VacancyBadge type={v.type} />
                        <p className="text-gray-500 text-xs mt-0.5 flex items-center gap-1">
                          <DollarSign size={10} />{v.salary}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-black text-gray-900 text-lg">{v.numberOfPosts}</p>
                      <p className="text-gray-400 text-[10px]">post{v.numberOfPosts !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                ))}
                <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
                  <p className="text-blue-700 text-xs font-bold">Total Positions</p>
                  <p className="text-blue-700 font-black text-lg">{totalPosts}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin notes */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50">
          <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
            <MessageSquare size={15} className="text-purple-600" />
          </div>
          <h3 className="font-bold text-gray-900 text-sm">Admin Notes</h3>
        </div>
        <div className="p-5">
          <form onSubmit={handleSubmit(onSaveNotes)} className="space-y-3">
            <textarea
              {...register('adminNotes')}
              defaultValue={school.adminNotes || ''}
              rows={3}
              placeholder="Internal notes about this school (not visible to school)..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none
                focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold
                rounded-xl text-sm hover:bg-blue-700 transition-colors disabled:opacity-60">
              <Save size={14} />
              {saving ? 'Saving...' : 'Save Notes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSchoolDetail;