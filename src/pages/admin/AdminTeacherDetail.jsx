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
  Link2, History, Award, Send, ClipboardList, Video,
  ChevronRight, Lock, Unlock, Circle, AlertCircle
} from 'lucide-react';

// ─── Pipeline steps ────────────────────────────────────────────────────────
const PIPELINE = [
  {
    value: 'applied',
    label: 'Applied',
    step: 1,
    color: '#6B7280',
    bg: '#F3F4F6',
    taskTitle: 'Contact the Teacher',
    taskDesc: 'Reach out via phone or email to introduce the consultancy.',
    taskColor: '#2563EB',
    taskBg: '#EFF6FF',
    taskBorder: '#BFDBFE',
  },
  {
    value: 'contacted',
    label: 'Contacted',
    step: 2,
    color: '#2563EB',
    bg: '#EFF6FF',
    taskTitle: 'Schedule Written Test',
    taskDesc: 'Set a test date and send the invitation to the teacher.',
    taskColor: '#7C3AED',
    taskBg: '#F5F3FF',
    taskBorder: '#DDD6FE',
  },
  {
    value: 'test_scheduled',
    label: 'Test Scheduled',
    step: 3,
    color: '#7C3AED',
    bg: '#F5F3FF',
    taskTitle: 'Record Test Result',
    taskDesc: 'Review the submitted test and mark it as completed.',
    taskColor: '#0369A1',
    taskBg: '#F0F9FF',
    taskBorder: '#BAE6FD',
  },
  {
    value: 'test_completed',
    label: 'Test Completed',
    step: 4,
    color: '#0369A1',
    bg: '#F0F9FF',
    taskTitle: 'Schedule Interview',
    taskDesc: 'Book an interview slot and notify the teacher.',
    taskColor: '#B45309',
    taskBg: '#FFFBEB',
    taskBorder: '#FDE68A',
  },
  {
    value: 'interview_scheduled',
    label: 'Interview Scheduled',
    step: 5,
    color: '#B45309',
    bg: '#FFFBEB',
    taskTitle: 'Record Interview Result',
    taskDesc: 'Evaluate the interview and mark it as completed.',
    taskColor: '#EA580C',
    taskBg: '#FFF7ED',
    taskBorder: '#FED7AA',
  },
  {
    value: 'interview_completed',
    label: 'Interview Completed',
    step: 6,
    color: '#EA580C',
    bg: '#FFF7ED',
    taskTitle: 'Assign to School',
    taskDesc: 'Select a school and finalize the teacher placement.',
    taskColor: '#059669',
    taskBg: '#ECFDF5',
    taskBorder: '#A7F3D0',
  },
  {
    value: 'assigned',
    label: 'Assigned',
    step: 7,
    color: '#059669',
    bg: '#ECFDF5',
    taskTitle: 'Complete Placement',
    taskDesc: 'Confirm the placement is successfully completed.',
    taskColor: '#0F766E',
    taskBg: '#F0FDFA',
    taskBorder: '#99F6E4',
  },
  {
    value: 'completed',
    label: 'Completed ✓',
    step: 8,
    color: '#0F766E',
    bg: '#F0FDFA',
    taskTitle: null,
    taskDesc: 'Placement successfully completed.',
    taskColor: '#0F766E',
    taskBg: '#F0FDFA',
    taskBorder: '#99F6E4',
  },
  {
    value: 'rejected',
    label: 'Rejected',
    step: 0,
    color: '#DC2626',
    bg: '#FEF2F2',
    taskTitle: null,
    taskDesc: 'This application has been rejected.',
    taskColor: '#DC2626',
    taskBg: '#FEF2F2',
    taskBorder: '#FECACA',
  },
];

const getPipeline = (value) => PIPELINE.find(p => p.value === value) || PIPELINE[0];

// ─── Pill badge ─────────────────────────────────────────────────────────────
const Pill = ({ label, color, bg }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
    style={{ color, backgroundColor: bg }}>{label}</span>
);

// ─── Step tracker bar ────────────────────────────────────────────────────────
const StepBar = ({ currentStatus }) => {
  const ordered = PIPELINE.filter(p => p.step > 0).sort((a, b) => a.step - b.step);
  const currentStep = getPipeline(currentStatus)?.step || 1;

  return (
    <div className="w-full overflow-x-auto pb-1">
      <div className="flex items-center min-w-max px-1">
        {ordered.map((p, i) => {
          const done = p.step < currentStep;
          const active = p.step === currentStep;
          const locked = p.step > currentStep;
          return (
            <div key={p.value} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                  ${done ? 'bg-emerald-500 border-emerald-500 text-white' :
                    active ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' :
                    'bg-white border-gray-200 text-gray-400'}`}>
                  {done ? <CheckCircle size={14} /> : p.step}
                </div>
                <span className={`text-[9px] font-semibold whitespace-nowrap
                  ${done ? 'text-emerald-600' : active ? 'text-blue-600' : 'text-gray-400'}`}>
                  {p.label}
                </span>
              </div>
              {i < ordered.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 mb-4 rounded-full transition-all
                  ${p.step < currentStep ? 'bg-emerald-400' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Info row ────────────────────────────────────────────────────────────────
const InfoRow = ({ icon: Icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
        <Icon size={14} className="text-slate-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-semibold text-gray-800 mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );
};

// ─── Section card ────────────────────────────────────────────────────────────
const Card = ({ title, icon: Icon, accent = '#2563EB', children, defaultOpen = true }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="w-full flex items-center gap-3 px-5 py-4 border-b border-gray-50">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: accent + '18' }}>
          <Icon size={15} style={{ color: accent }} />
        </div>
        <h3 className="font-black text-gray-900 text-sm flex-1 text-left">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
};

// ─── Task action button ───────────────────────────────────────────────────────
const TaskBtn = ({ onClick, icon: Icon, label, variant = 'solid', color = '#2563EB', disabled }) => {
  const solid = variant === 'solid';
  return (
    <button onClick={onClick} disabled={disabled} type="button"
      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
      style={solid
        ? { backgroundColor: color, color: '#fff', boxShadow: `0 4px 14px ${color}40` }
        : { backgroundColor: 'transparent', color, border: `2px solid ${color}` }}>
      <Icon size={15} />{label}
    </button>
  );
};

// ─── MAIN ────────────────────────────────────────────────────────────────────
const AdminTeacherDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [done, setDone] = useState({});
  const [showOverride, setShowOverride] = useState(false);
  const [overrideStatus, setOverrideStatus] = useState('');
  const [overrideNote, setOverrideNote] = useState('');

  const { register, handleSubmit, setValue, watch } = useForm();
  const { register: regAssign, handleSubmit: handleAssign, watch: watchAssign } = useForm();

  useEffect(() => {
    Promise.all([adminAPI.getTeacher(id), adminAPI.getSchools({ limit: 200 })])
      .then(([t, s]) => {
        const p = t.data;
        setTeacher(p);
        setSchools(s.data.schools || []);
        setValue('adminNotes', p.adminNotes || '');
        setValue('testDate', p.testDate ? p.testDate.split('T')[0] : '');
        setValue('interviewDate', p.interviewDate ? p.interviewDate.split('T')[0] : '');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const markDone = (key) => setDone(prev => ({ ...prev, [key]: true }));

  const advanceStatus = async (newStatus, extraData = {}) => {
    setUpdating(true);
    try {
      const notes = watch('adminNotes');
      const testDate = watch('testDate');
      const interviewDate = watch('interviewDate');
      const res = await adminAPI.updateTeacherStatus(id, {
        currentStatus: newStatus,
        adminNotes: notes,
        testDate,
        interviewDate,
        ...extraData,
      });
      setTeacher(res.data);
      setDone({});
      toast.success(`Status updated to "${getPipeline(newStatus)?.label}"`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const onAssign = async (data) => {
    if (!data.schoolId) { toast.error('Please select a school'); return; }
    setAssigning(true);
    try {
      const res = await adminAPI.assignTeacher(id, data);
      setTeacher(res.data);
      toast.success('Teacher assigned!');
    } catch { toast.error('Failed to assign teacher'); }
    finally { setAssigning(false); }
  };

  const openEmail = (type) => {
    const subjects = { contact: 'Welcome to M.S. Consultancy', test: 'Test Invitation – M.S. Consultancy', interview: 'Interview Invitation – M.S. Consultancy' };
    const body = `Dear ${name},\n\nThis is regarding your application with M.S. Consultancy Services.\n\nBest regards,\nAdmin Team`;
    window.open(`mailto:${email}?subject=${encodeURIComponent(subjects[type])}&body=${encodeURIComponent(body)}`);
    markDone(`email_${type}`);
    toast.success('Email client opened!');
  };

  const handleOverride = async () => {
    if (!overrideStatus) { toast.error('Select a status'); return; }
    setUpdating(true);
    try {
      const res = await adminAPI.updateTeacherStatus(id, {
        currentStatus: overrideStatus,
        adminNotes: overrideNote || watch('adminNotes'),
      });
      setTeacher(res.data);
      setDone({});
      setShowOverride(false);
      toast.success('Status overridden successfully');
    } catch { toast.error('Override failed'); }
    finally { setUpdating(false); }
  };

  if (loading) return <div className="flex justify-center items-center py-24"><Spinner size="lg" /></div>;
  if (!teacher) return <div className="text-center py-16 text-gray-400 text-sm">Teacher not found</div>;

  const name = teacher.fullName || teacher.user?.name || 'Teacher';
  const email = teacher.email || teacher.user?.email;
  const phone = teacher.phone || teacher.user?.phone;
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const cfg = getPipeline(teacher.currentStatus);
  const currentStep = cfg.step;

  // ── Task renderer — one step at a time ──────────────────────────────────
  const renderTask = () => {
    const status = teacher.currentStatus;

    if (status === 'completed') return (
      <div className="text-center py-6">
        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle size={28} className="text-emerald-600" />
        </div>
        <p className="font-black text-gray-900">Placement Complete!</p>
        <p className="text-sm text-gray-500 mt-1">All steps have been successfully finished.</p>
      </div>
    );

    if (status === 'rejected') return (
      <div className="text-center py-6">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <AlertCircle size={28} className="text-red-500" />
        </div>
        <p className="font-black text-gray-900">Application Rejected</p>
        <p className="text-sm text-gray-500 mt-1">This application has been marked as rejected.</p>
      </div>
    );

    // ── STEP 1: Applied → Contact ──
    if (status === 'applied') {
      const called = done.called;
      const emailed = done.email_contact;
      const canProceed = called || emailed;
      return (
        <div className="space-y-3">
          <StepHeader step={1} title="Contact the Teacher" color="#2563EB" />
          <div className="grid grid-cols-2 gap-2">
            <a href={`tel:${phone}`} onClick={() => markDone('called')}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 font-bold text-sm transition-all active:scale-95"
              style={called ? { background: '#DCFCE7', borderColor: '#22C55E', color: '#16A34A' } : { borderColor: '#2563EB', color: '#2563EB' }}>
              <Phone size={18} />
              {called ? 'Called ✓' : 'Call Now'}
            </a>
            <button onClick={() => openEmail('contact')} type="button"
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 font-bold text-sm transition-all active:scale-95"
              style={emailed ? { background: '#DCFCE7', borderColor: '#22C55E', color: '#16A34A' } : { borderColor: '#2563EB', color: '#2563EB' }}>
              <Mail size={18} />
              {emailed ? 'Sent ✓' : 'Send Email'}
            </button>
          </div>
          <div className="px-3 py-2 bg-blue-50 rounded-xl text-xs text-blue-700 font-medium">
            📞 {phone} &nbsp;|&nbsp; ✉ {email}
          </div>
          <TaskBtn
            onClick={() => advanceStatus('contacted')}
            icon={CheckCircle} label="Mark as Contacted → Move Next"
            color="#2563EB" disabled={!canProceed || updating} />
          {!canProceed && <p className="text-xs text-center text-gray-400">Call or email the teacher first</p>}
        </div>
      );
    }

    // ── STEP 2: Contacted → Schedule Test ──
    if (status === 'contacted') {
      const hasDate = !!watch('testDate');
      const emailSent = done.email_test;
      const canProceed = hasDate && emailSent;
      return (
        <div className="space-y-3">
          <StepHeader step={2} title="Schedule Written Test" color="#7C3AED" />
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Test Date *</label>
            <input {...register('testDate')} type="date" required
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-purple-500 bg-white" />
          </div>
          <TaskBtn onClick={() => openEmail('test')} icon={Send} label={emailSent ? 'Invitation Sent ✓' : 'Send Test Invitation Email'}
            color="#7C3AED" variant={emailSent ? 'outline' : 'solid'} />
          <TaskBtn
            onClick={() => advanceStatus('test_scheduled')}
            icon={CheckCircle} label="Confirm Test Scheduled → Move Next"
            color="#7C3AED" disabled={!canProceed || updating} />
          {!canProceed && <p className="text-xs text-center text-gray-400">Set date and send email first</p>}
        </div>
      );
    }

    // ── STEP 3: Test Scheduled → Mark Completed ──
    if (status === 'test_scheduled') {
      const testDate = teacher.testDate ? new Date(teacher.testDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';
      return (
        <div className="space-y-3">
          <StepHeader step={3} title="Record Test Result" color="#0369A1" />
          <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl flex items-center gap-2">
            <Calendar size={16} className="text-sky-600 flex-shrink-0" />
            <div>
              <p className="text-xs text-sky-600 font-bold">Scheduled Date</p>
              <p className="text-sm font-black text-sky-900">{testDate}</p>
            </div>
          </div>
          <TaskBtn
            onClick={() => advanceStatus('test_completed')}
            icon={CheckCircle} label="Mark Test Completed → Move Next"
            color="#0369A1" disabled={updating} />
        </div>
      );
    }

    // ── STEP 4: Test Completed → Schedule Interview ──
    if (status === 'test_completed') {
      const hasDate = !!watch('interviewDate');
      const emailSent = done.email_interview;
      const canProceed = hasDate && emailSent;
      return (
        <div className="space-y-3">
          <StepHeader step={4} title="Schedule Interview" color="#B45309" />
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Interview Date *</label>
            <input {...register('interviewDate')} type="date" required
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-amber-500 bg-white" />
          </div>
          <TaskBtn onClick={() => openEmail('interview')} icon={Send} label={emailSent ? 'Invitation Sent ✓' : 'Send Interview Invitation'}
            color="#B45309" variant={emailSent ? 'outline' : 'solid'} />
          <TaskBtn
            onClick={() => advanceStatus('interview_scheduled')}
            icon={CheckCircle} label="Confirm Interview Scheduled → Move Next"
            color="#B45309" disabled={!canProceed || updating} />
          {!canProceed && <p className="text-xs text-center text-gray-400">Set date and send invitation first</p>}
        </div>
      );
    }

    // ── STEP 5: Interview Scheduled → Mark Completed ──
    if (status === 'interview_scheduled') {
      const iDate = teacher.interviewDate ? new Date(teacher.interviewDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';
      return (
        <div className="space-y-3">
          <StepHeader step={5} title="Record Interview Result" color="#EA580C" />
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl flex items-center gap-2">
            <Video size={16} className="text-orange-600 flex-shrink-0" />
            <div>
              <p className="text-xs text-orange-600 font-bold">Scheduled Date</p>
              <p className="text-sm font-black text-orange-900">{iDate}</p>
            </div>
          </div>
          <TaskBtn
            onClick={() => advanceStatus('interview_completed')}
            icon={CheckCircle} label="Mark Interview Completed → Move Next"
            color="#EA580C" disabled={updating} />
        </div>
      );
    }

    // ── STEP 6: Interview Completed → Assign School ──
    if (status === 'interview_completed') {
      const schoolId = watchAssign('schoolId');
      return (
        <div className="space-y-3">
          <StepHeader step={6} title="Assign to School" color="#059669" />
          <form onSubmit={handleAssign(onAssign)} className="space-y-3">
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Select School *</label>
              <div className="relative">
                <select {...regAssign('schoolId')} required
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500 bg-white appearance-none">
                  <option value="">Choose a school...</option>
                  {schools.map(s => (
                    <option key={s._id} value={s._id}>{s.schoolName} — {s.city || ''}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <button type="submit" disabled={assigning || !schoolId}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white transition-all active:scale-95 disabled:opacity-40"
              style={{ background: '#059669', boxShadow: '0 4px 14px #05996940' }}>
              <School size={15} /> {assigning ? 'Assigning...' : 'Assign & Move Next'}
            </button>
          </form>
        </div>
      );
    }

    // ── STEP 7: Assigned → Complete ──
    if (status === 'assigned') {
      return (
        <div className="space-y-3">
          <StepHeader step={7} title="Complete Placement" color="#0F766E" />
          {teacher.assignedSchool && (
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl">
              <p className="text-xs text-teal-600 font-bold mb-0.5">Assigned School</p>
              <p className="text-sm font-black text-teal-900">{teacher.assignedSchool.schoolName}</p>
              <p className="text-xs text-teal-600">{teacher.assignedSchool.city}, {teacher.assignedSchool.state}</p>
            </div>
          )}
          <TaskBtn
            onClick={() => advanceStatus('completed')}
            icon={CheckCircle} label="Mark Placement Complete ✓"
            color="#0F766E" disabled={updating} />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="max-w-2xl mx-auto lg:max-w-5xl space-y-4 px-0 pb-10">

      {/* ── Top hero bar ─────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 flex-shrink-0">
            <ArrowLeft size={16} className="text-gray-600" />
          </button>

          {/* Avatar */}
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${cfg.taskColor}, #1e3a8a)` }}>
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-base font-black text-gray-900 truncate">{name}</h2>
            <p className="text-xs text-gray-400 truncate">{email}</p>
          </div>

          <Pill label={cfg.label} color={cfg.color} bg={cfg.bg} />
        </div>

        {/* Step bar */}
        <div className="mt-4 pt-4 border-t border-gray-50">
          <StepBar currentStatus={teacher.currentStatus} />
        </div>
      </div>

      {/* ── Main layout ──────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-[1fr_360px] gap-4 items-start">

        {/* LEFT — profile info */}
        <div className="space-y-4">

          {/* Assigned school banner */}
          {teacher.assignedSchool && (
            <div className="rounded-2xl p-4 text-white"
              style={{ background: 'linear-gradient(135deg, #059669, #0F766E)' }}>
              <div className="flex items-center gap-2 mb-1">
                <School size={15} className="opacity-70" />
                <p className="font-black text-sm">Currently Assigned</p>
              </div>
              <p className="text-emerald-100 font-bold">{teacher.assignedSchool.schoolName}</p>
              <p className="text-emerald-200 text-xs mt-0.5">{teacher.assignedSchool.city}, {teacher.assignedSchool.state}</p>
            </div>
          )}

          {/* Personal */}
          <Card title="Personal Information" icon={User} accent="#2563EB">
            <InfoRow icon={Phone} label="Phone" value={phone} />
            <InfoRow icon={Mail} label="Email" value={email} />
            <InfoRow icon={MapPin} label="City" value={teacher.city} />
            <InfoRow icon={MapPin} label="State" value={teacher.state} />
            <InfoRow icon={Briefcase} label="Experience" value={teacher.experienceYears ? `${teacher.experienceYears} years` : null} />
            <InfoRow icon={Award} label="Expected Salary" value={teacher.expectedSalary} />
            <InfoRow icon={Calendar} label="Date of Birth" value={teacher.dateOfBirth ? new Date(teacher.dateOfBirth).toLocaleDateString('en-IN') : null} />
          </Card>

          {/* Teaching profile */}
          {(teacher.subjects?.length > 0 || teacher.classLevels?.length > 0) && (
            <Card title="Teaching Profile" icon={BookOpen} accent="#7C3AED">
              {teacher.subjects?.length > 0 && (
                <div className="mb-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Subjects</p>
                  <div className="flex flex-wrap gap-1.5">
                    {teacher.subjects.map(s => (
                      <span key={s} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {teacher.classLevels?.length > 0 && (
                <div className="mb-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Class Levels</p>
                  <div className="flex flex-wrap gap-1.5">
                    {teacher.classLevels.map(cl => (
                      <span key={cl} className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-xl text-xs font-bold">{cl}</span>
                    ))}
                  </div>
                </div>
              )}
              {teacher.teachingQualifications?.length > 0 && (
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Qualifications</p>
                  <div className="flex flex-wrap gap-1.5">
                    {teacher.teachingQualifications.map(q => (
                      <span key={q} className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-xl text-xs font-bold">{q}</span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Education */}
          {teacher.education?.length > 0 && (
            <Card title="Education" icon={GraduationCap} accent="#4F46E5">
              <div className="space-y-3">
                {teacher.education.map((edu, i) => (
                  <div key={i} className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <p className="font-black text-gray-900 text-sm">{edu.degree}</p>
                    {edu.specialization && <p className="text-indigo-600 text-xs font-bold">{edu.specialization}</p>}
                    <p className="text-gray-500 text-xs mt-0.5">{edu.institution}</p>
                    <div className="flex gap-3 mt-1">
                      {edu.yearOfPassing && <span className="text-xs text-gray-400">{edu.yearOfPassing}</span>}
                      {edu.percentage && <span className="text-xs text-emerald-600 font-bold">{edu.percentage}%</span>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Resume */}
          {teacher.resume && (
            <Card title="Resume" icon={FileText} accent="#0F766E">
              <a href={teacher.resume} target="_blank" rel="noreferrer"
                className="flex items-center gap-3 p-3 bg-teal-50 border border-teal-200 rounded-xl hover:bg-teal-100 transition-colors">
                <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-teal-700 text-sm">{teacher.resumeOriginalName || 'View Resume PDF'}</p>
                  <p className="text-teal-400 text-xs">Opens in new tab</p>
                </div>
                <ChevronRight size={14} className="text-teal-400 ml-auto" />
              </a>
            </Card>
          )}

          {/* Status history */}
          {teacher.statusHistory?.length > 0 && (
            <Card title="Activity History" icon={History} accent="#6B7280">
              <div className="space-y-2">
                {[...teacher.statusHistory].reverse().slice(0, 8).map((h, i) => (
                  <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl bg-gray-50">
                    <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0 mt-1.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-gray-700 capitalize">{h.status?.replace(/_/g, ' ')}</p>
                      {h.note && <p className="text-xs text-gray-400 italic mt-0.5">"{h.note}"</p>}
                    </div>
                    <p className="text-[10px] text-gray-400 flex-shrink-0 whitespace-nowrap">
                      {new Date(h.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* RIGHT — task pipeline ────────────────────────────────── */}
        <div className="space-y-4">

          {/* Active task card */}
          <div className="bg-white border-2 rounded-2xl shadow-sm overflow-hidden"
            style={{ borderColor: cfg.taskBorder || '#E5E7EB' }}>

            {/* Header */}
            <div className="px-5 py-4 flex items-center gap-2"
              style={{ backgroundColor: cfg.taskBg || '#F9FAFB' }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: (cfg.taskColor || '#2563EB') + '20' }}>
                <ClipboardList size={16} style={{ color: cfg.taskColor || '#2563EB' }} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Task</p>
                <p className="text-sm font-black" style={{ color: cfg.taskColor || '#111827' }}>
                  {cfg.taskTitle || 'Pipeline Complete'}
                </p>
              </div>
            </div>

            <div className="p-5">
              {/* Admin note (always visible) */}
              <div className="mb-4">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                  <MessageSquare size={10} className="inline mr-1" />Admin Note
                </label>
                <textarea {...register('adminNotes')} rows={2}
                  placeholder="Add a note for the teacher (optional)..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs resize-none focus:outline-none focus:border-blue-400 bg-gray-50 font-medium" />
              </div>

              {/* Task content */}
              {renderTask()}
            </div>
          </div>

          {/* Reject button */}
          {!['completed', 'rejected'].includes(teacher.currentStatus) && (
            <button onClick={() => advanceStatus('rejected')} type="button" disabled={updating}
              className="w-full py-2.5 rounded-xl border-2 border-red-200 text-red-500 font-bold text-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
              <AlertCircle size={14} /> Reject Application
            </button>
          )}

          {/* Admin Override (force any status) */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <button onClick={() => setShowOverride(o => !o)} type="button"
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lock size={14} className="text-gray-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-black text-gray-700">Admin Override</p>
                <p className="text-xs text-gray-400">Force set any status</p>
              </div>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${showOverride ? 'rotate-180' : ''}`} />
            </button>

            {showOverride && (
              <div className="px-5 pb-5 space-y-3 border-t border-gray-50 pt-4">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                  <AlertCircle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 font-medium">Use with caution. This bypasses the task flow.</p>
                </div>
                <div className="relative">
                  <select value={overrideStatus} onChange={e => setOverrideStatus(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white appearance-none font-semibold focus:outline-none focus:border-gray-400">
                    <option value="">Select status...</option>
                    {PIPELINE.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <textarea value={overrideNote} onChange={e => setOverrideNote(e.target.value)} rows={2}
                  placeholder="Reason for override (optional)..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs resize-none focus:outline-none focus:border-gray-400 font-medium" />
                <button onClick={handleOverride} disabled={!overrideStatus || updating} type="button"
                  className="w-full py-2.5 rounded-xl bg-gray-800 text-white font-bold text-sm hover:bg-gray-900 transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
                  <Unlock size={14} /> Apply Override
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Step header inside task card ───────────────────────────────────────────
const StepHeader = ({ step, title, color }) => (
  <div className="flex items-center gap-2 mb-1 pb-3 border-b border-gray-100">
    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
      style={{ backgroundColor: color }}>
      {step}
    </div>
    <p className="font-black text-gray-900 text-sm">{title}</p>
  </div>
);

export default AdminTeacherDetail;