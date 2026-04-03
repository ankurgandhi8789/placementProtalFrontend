// src/pages/admin/AdminTeacherDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { adminAPI } from '../../api';
import StatusBadge from '../../components/common/StatusBadge';
import Spinner from '../../components/common/Spinner';
import {
  ArrowLeft, FileText, User, BookOpen, Briefcase,
  GraduationCap, MapPin, Phone, Mail, ChevronDown,
  CheckCircle, School, Calendar, MessageSquare, Save,
  Link2, History, Award
} from 'lucide-react';

const STATUSES = [
  { value: 'applied',             label: 'Applied',             color: 'bg-gray-100 text-gray-700' },
  { value: 'contacted',           label: 'Contacted',           color: 'bg-blue-100 text-blue-700' },
  { value: 'test_scheduled',      label: 'Test Scheduled',      color: 'bg-purple-100 text-purple-700' },
  { value: 'test_completed',      label: 'Test Completed',      color: 'bg-indigo-100 text-indigo-700' },
  { value: 'interview_scheduled', label: 'Interview Scheduled', color: 'bg-amber-100 text-amber-700' },
  { value: 'interview_completed', label: 'Interview Completed', color: 'bg-orange-100 text-orange-700' },
  { value: 'assigned',            label: 'Assigned',            color: 'bg-emerald-100 text-emerald-700' },
  { value: 'completed',           label: 'Completed',           color: 'bg-teal-100 text-teal-700' },
  { value: 'rejected',            label: 'Rejected',            color: 'bg-red-100 text-red-700' },
];

// ─── Info row ──────────────────────────────────────────────────────────────
const InfoRow = ({ icon: Icon, label, value }) => {
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

// ─── Section card wrapper ──────────────────────────────────────────────────
const Card = ({ title, icon: Icon, iconBg = 'bg-blue-100', iconColor = 'text-blue-600', children }) => (
  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
    <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
      <div className={`w-8 h-8 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
        <Icon size={15} className={iconColor} />
      </div>
      <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────
const AdminTeacherDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [updating, setUpdating] = useState(false);
  const [assigning, setAssigning] = useState(false);

  const { register, handleSubmit, setValue, watch } = useForm();
  const { register: regAssign, handleSubmit: handleAssign } = useForm();

  const watchStatus = watch('currentStatus');

  useEffect(() => {
    Promise.all([adminAPI.getTeacher(id), adminAPI.getSchools({ limit: 200 })])
      .then(([t, s]) => {
        const p = t.data;
        setTeacher(p);
        setSchools(s.data.schools || []);
        setValue('currentStatus', p.currentStatus || 'applied');
        setValue('adminNotes', p.adminNotes || '');
        setValue('testDate', p.testDate ? p.testDate.split('T')[0] : '');
        setValue('interviewDate', p.interviewDate ? p.interviewDate.split('T')[0] : '');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const onUpdateStatus = async (data) => {
    setUpdating(true);
    try {
      const res = await adminAPI.updateTeacherStatus(id, data);
      setTeacher(res.data);
      toast.success('Status updated successfully!');
    } catch { toast.error('Failed to update status'); }
    finally { setUpdating(false); }
  };

  const onAssign = async (data) => {
    if (!data.schoolId) { toast.error('Please select a school'); return; }
    setAssigning(true);
    try {
      const res = await adminAPI.assignTeacher(id, data);
      setTeacher(res.data);
      toast.success('Teacher assigned to school!');
    } catch { toast.error('Failed to assign teacher'); }
    finally { setAssigning(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!teacher) return <div className="text-center py-12 text-gray-400">Teacher not found</div>;

  const name     = teacher.fullName || teacher.user?.name || 'Teacher';
  const email    = teacher.email    || teacher.user?.email;
  const phone    = teacher.phone    || teacher.user?.phone;
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const currentStatusCfg = STATUSES.find(s => s.value === watchStatus);

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Back + hero */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors flex-shrink-0">
          <ArrowLeft size={16} className="text-gray-600" />
        </button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-900 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-extrabold text-gray-900 truncate">{name}</h2>
            <p className="text-gray-400 text-xs truncate">{email}</p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <StatusBadge status={teacher.currentStatus} />
        </div>
      </div>

      {/* Layout: stacked on mobile, 2-col on desktop */}
      <div className="grid lg:grid-cols-[1fr_380px] gap-4">

        {/* LEFT — profile info */}
        <div className="space-y-4">

          {/* Assigned school banner */}
          {teacher.assignedSchool && (
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl p-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <School size={16} className="text-emerald-200" />
                <p className="font-extrabold">Currently Assigned</p>
              </div>
              <p className="text-emerald-100 text-sm">{teacher.assignedSchool.schoolName}</p>
              <p className="text-emerald-200 text-xs mt-0.5">
                {teacher.assignedSchool.city}, {teacher.assignedSchool.state}
              </p>
            </div>
          )}

          {/* Personal info */}
          <Card title="Personal Information" icon={User}>
            <InfoRow icon={Phone}   label="Phone"       value={phone} />
            <InfoRow icon={Mail}    label="Email"       value={email} />
            <InfoRow icon={MapPin}  label="City"        value={teacher.city} />
            <InfoRow icon={MapPin}  label="State"       value={teacher.state} />
            <InfoRow icon={Briefcase} label="Experience" value={teacher.experienceYears ? `${teacher.experienceYears} years` : null} />
            <InfoRow icon={Award}   label="Expected Salary" value={teacher.expectedSalary} />
            <InfoRow icon={Calendar} label="DOB"        value={teacher.dateOfBirth ? new Date(teacher.dateOfBirth).toLocaleDateString('en-IN') : null} />
          </Card>

          {/* Subjects & class levels */}
          {(teacher.subjects?.length > 0 || teacher.classLevels?.length > 0) && (
            <Card title="Teaching Profile" icon={BookOpen} iconBg="bg-purple-100" iconColor="text-purple-600">
              {teacher.subjects?.length > 0 && (
                <div className="mb-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Subjects</p>
                  <div className="flex flex-wrap gap-1.5">
                    {teacher.subjects.map(s => (
                      <span key={s} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-xl text-xs font-semibold">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {teacher.classLevels?.length > 0 && (
                <div className="mb-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Class Levels</p>
                  <div className="flex flex-wrap gap-1.5">
                    {teacher.classLevels.map(cl => (
                      <span key={cl} className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-xl text-xs font-semibold">{cl}</span>
                    ))}
                  </div>
                </div>
              )}
              {teacher.teachingQualifications?.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Qualifications</p>
                  <div className="flex flex-wrap gap-1.5">
                    {teacher.teachingQualifications.map(q => (
                      <span key={q} className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-xl text-xs font-semibold">{q}</span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Education */}
          {teacher.education?.length > 0 && (
            <Card title="Education" icon={GraduationCap} iconBg="bg-indigo-100" iconColor="text-indigo-600">
              <div className="space-y-3">
                {teacher.education.map((edu, i) => (
                  <div key={i} className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <p className="font-bold text-gray-900 text-sm">{edu.degree}</p>
                    {edu.specialization && <p className="text-indigo-600 text-xs font-medium">{edu.specialization}</p>}
                    <p className="text-gray-500 text-xs mt-0.5">{edu.institution}</p>
                    <div className="flex gap-3 mt-1">
                      {edu.yearOfPassing && <span className="text-xs text-gray-400">{edu.yearOfPassing}</span>}
                      {edu.percentage && <span className="text-xs text-emerald-600 font-semibold">{edu.percentage}%</span>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Resume */}
          {teacher.resume && (
            <Card title="Resume" icon={FileText} iconBg="bg-teal-100" iconColor="text-teal-600">
              <a href={teacher.resume} target="_blank" rel="noreferrer"
                className="flex items-center gap-3 p-3 bg-teal-50 border border-teal-100 rounded-xl hover:bg-teal-100 transition-colors group">
                <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-teal-700 text-sm">
                    {teacher.resumeOriginalName || 'View Resume PDF'}
                  </p>
                  <p className="text-teal-400 text-xs">Click to open in new tab</p>
                </div>
              </a>
            </Card>
          )}

          {/* Status history */}
          {teacher.statusHistory?.length > 0 && (
            <Card title="Status History" icon={History} iconBg="bg-gray-100" iconColor="text-gray-600">
              <div className="space-y-2">
                {[...teacher.statusHistory].reverse().slice(0, 6).map((h, i) => (
                  <div key={i} className="flex items-start gap-3 p-2.5 bg-gray-50 rounded-xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-2" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-700 capitalize">{h.status?.replace(/_/g,' ')}</p>
                      {h.note && <p className="text-xs text-gray-400 mt-0.5 italic">"{h.note}"</p>}
                    </div>
                    <p className="text-[10px] text-gray-400 flex-shrink-0 whitespace-nowrap">
                      {new Date(h.updatedAt).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* RIGHT — admin controls */}
        <div className="space-y-4">

          {/* Update status card */}
          <Card title="Update Pipeline Status" icon={Briefcase}>
            <form onSubmit={handleSubmit(onUpdateStatus)} className="space-y-4">
              {/* Status select */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Status</label>
                <div className="relative">
                  <select {...register('currentStatus')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white
                      focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none font-semibold">
                    {STATUSES.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {currentStatusCfg && (
                  <div className="mt-2 flex justify-center">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${currentStatusCfg.color}`}>
                      → {currentStatusCfg.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Dates for scheduled stages */}
              {(watchStatus === 'test_scheduled' || watchStatus === 'test_completed') && (
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Test Date</label>
                  <input {...register('testDate')} type="date"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                </div>
              )}
              {(watchStatus === 'interview_scheduled' || watchStatus === 'interview_completed') && (
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Interview Date</label>
                  <input {...register('interviewDate')} type="date"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                </div>
              )}

              {/* Admin notes */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                  <MessageSquare size={11} /> Admin Note (visible to teacher)
                </label>
                <textarea {...register('adminNotes')} rows={3}
                  placeholder="Write a note for the teacher (optional)..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none
                    focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
              </div>

              <button type="submit" disabled={updating}
                className="w-full flex items-center justify-center gap-2 py-3
                  bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold rounded-xl
                  shadow-md hover:shadow-lg transition-all disabled:opacity-60 text-sm">
                <Save size={15} />
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </form>
          </Card>

          {/* Assign to school */}
          <Card title="Assign to School" icon={Link2} iconBg="bg-emerald-100" iconColor="text-emerald-600">
            {teacher.assignedSchool && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                <div>
                  <p className="text-emerald-800 text-xs font-bold">Currently Assigned</p>
                  <p className="text-emerald-700 text-sm font-semibold">{teacher.assignedSchool.schoolName}</p>
                </div>
              </div>
            )}
            <form onSubmit={handleAssign(onAssign)} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Select School</label>
                <div className="relative">
                  <select {...regAssign('schoolId')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white
                      focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none">
                    <option value="">Choose a school...</option>
                    {schools.map(s => (
                      <option key={s._id} value={s._id}>{s.schoolName} — {s.city || ''}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <button type="submit" disabled={assigning}
                className="w-full flex items-center justify-center gap-2 py-3
                  bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold rounded-xl
                  shadow-md hover:shadow-lg transition-all disabled:opacity-60 text-sm">
                <School size={15} />
                {assigning ? 'Assigning...' : teacher.assignedSchool ? 'Reassign School' : 'Assign to School'}
              </button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminTeacherDetail;