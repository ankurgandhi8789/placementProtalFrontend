// src/pages/teacher/TeacherDashboard.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { teacherAPI } from '../../api';
import StatusBadge from '../../components/common/StatusBadge';
import Spinner from '../../components/common/Spinner';
import {
  User, FileText, Activity, ArrowRight, CheckCircle,
  AlertCircle, LogOut, History, Edit3, BookOpen,
  TrendingUp, Bell, ChevronRight, GraduationCap,
  MapPin, Phone, Mail, Calendar, Award, Star,
  ClipboardList, X, Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// ─── Pipeline stages ───────────────────────────────────────────────────────
const PIPELINE = [
  { key: 'applied',             label: 'Applied',            short: 'Applied',    color: 'gray'   },
  { key: 'contacted',           label: 'Contacted',          short: 'Contacted',  color: 'blue'   },
  { key: 'test_scheduled',      label: 'Test Scheduled',     short: 'Test',       color: 'purple' },
  { key: 'test_completed',      label: 'Test Completed',     short: 'Test Done',  color: 'indigo' },
  { key: 'interview_scheduled', label: 'Interview Scheduled',short: 'Interview',  color: 'amber'  },
  { key: 'interview_completed', label: 'Interview Done',     short: 'Int. Done',  color: 'orange' },
  { key: 'assigned',            label: 'Assigned',           short: 'Assigned',   color: 'emerald'},
  { key: 'completed',           label: 'Completed',          short: 'Done',       color: 'green'  },
];

// ─── Sidebar nav items ─────────────────────────────────────────────────────
const SIDEBAR_ITEMS = [
  { icon: Activity,     label: 'Dashboard',      to: '/teacher/dashboard',  key: 'dashboard' },
  { icon: User,         label: 'My Profile',     to: '/teacher/profile',    key: 'profile'   },
  { icon: Edit3,        label: 'Edit Info',      to: '/teacher/edit',       key: 'edit'      },
  { icon: ClipboardList,label: 'Application',    to: '/teacher/apply',      key: 'apply'     },
  { icon: History,      label: 'My History',     to: '/teacher/history',    key: 'history'   },
  { icon: TrendingUp,   label: 'Track Status',   to: '/teacher/status',     key: 'status'    },
];

// ─── Profile completion calc ───────────────────────────────────────────────
const calcCompletion = (profile) => {
  if (!profile) return 0;
  const checks = [
    !!profile.fullName,
    !!profile.phone,
    !!profile.email,
    !!profile.gender,
    !!profile.dateOfBirth,
    !!profile.currentAddress,
    profile.subjects?.length > 0,
    profile.classLevels?.length > 0,
    profile.education?.length > 0,
    !!profile.profilePhoto,
    !!profile.resume,
    profile.experienceYears >= 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
};

// ─── Right Floating Sidebar ────────────────────────────────────────────────
const TeacherSidebar = ({ open, onClose, profile, user, onLogout, activeKey }) => {
  const navigate = useNavigate();
  const completion = calcCompletion(profile);
  const initials = (user?.name || profile?.fullName || 'T')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300
          ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />
      {/* Panel */}
      <div className={`fixed top-0 right-0 bottom-0 z-50 w-[290px] bg-white flex flex-col
        rounded-l-[22px] shadow-[−8px_0_40px_rgba(37,99,235,0.15)]
        transition-transform duration-[320ms] ease-[cubic-bezier(.4,0,.2,1)]
        ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ boxShadow: '-8px 0 40px rgba(37,99,235,0.15)' }}
      >
        {/* Header gradient */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-600 px-5 pt-6 pb-5 rounded-tl-[22px] flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25
              flex items-center justify-center transition-colors"
          >
            <X size={14} className="text-white" />
          </button>

          {/* Avatar + info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              {profile?.profilePhoto ? (
                <img src={profile.profilePhoto} alt="Profile"
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-white/40" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-white/20 ring-2 ring-white/40
                  flex items-center justify-center text-white font-black text-xl">
                  {initials}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full
                ring-2 ring-blue-700" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-extrabold text-[15px] leading-tight truncate">
                {profile?.fullName || user?.name || 'Teacher'}
              </p>
              <p className="text-blue-200 text-[11px] mt-0.5 truncate">
                {profile?.email || user?.email}
              </p>
              <span className="inline-flex items-center gap-1 bg-white/15 border border-white/25
                rounded-full px-2 py-0.5 text-white/90 text-[10px] font-semibold mt-1">
                🎓 Teacher
              </span>
            </div>
          </div>

          {/* Profile completion bar */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-white/70 text-[10px] font-semibold uppercase tracking-wide">
                Profile Complete
              </span>
              <span className="text-white font-bold text-[11px]">{completion}%</span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-700"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </div>

        {/* Nav items */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[.7px] mb-2 ml-2">Menu</p>

          {SIDEBAR_ITEMS.map(item => (
            <Link
              key={item.key}
              to={item.to}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium
                transition-all mb-0.5 ${
                activeKey === item.key
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className={`w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0 ${
                activeKey === item.key ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <item.icon size={15} className={activeKey === item.key ? 'text-blue-600' : 'text-gray-500'} />
              </span>
              <span className="flex-1">{item.label}</span>
              <ChevronRight size={13} className={activeKey === item.key ? 'text-blue-400' : 'text-gray-300'} />
            </Link>
          ))}

          <div className="h-px bg-gray-100 my-3" />

          {/* Quick info card */}
          {profile?.currentStatus && (
            <div className="mx-1 mb-3 p-3 bg-gradient-to-br from-blue-50 to-indigo-50
              border border-blue-100 rounded-xl">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">
                Current Status
              </p>
              <StatusBadge status={profile.currentStatus} />
              {profile?.assignedSchool && (
                <p className="text-[11px] text-emerald-700 font-semibold mt-2">
                  🏫 Assigned to school!
                </p>
              )}
            </div>
          )}

          {/* Logout */}
          <button
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px]
              font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <span className="w-8 h-8 rounded-[10px] bg-red-50 flex items-center justify-center">
              <LogOut size={15} className="text-red-500" />
            </span>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

// ─── Progress Ring ─────────────────────────────────────────────────────────
const ProgressRing = ({ pct, size = 80, stroke = 7 }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke="#E5E7EB" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke="#2563EB" strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  );
};

// ─── Main Dashboard ────────────────────────────────────────────────────────
const TeacherDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    teacherAPI.getProfile()
      .then(({ data }) => setProfile(data.profile || data))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );

  const completion  = calcCompletion(profile);
  const currentIdx  = PIPELINE.findIndex(s => s.key === profile?.currentStatus);
  const currentStep = PIPELINE[currentIdx] || PIPELINE[0];
  const firstName   = (profile?.fullName || user?.name || 'Teacher').split(' ')[0];

  return (
    <div className="min-h-screen bg-[#EEF2FF]"
      style={{ backgroundImage: 'radial-gradient(circle at 15% 15%, rgba(37,99,235,0.06) 0%, transparent 50%), radial-gradient(circle at 85% 85%, rgba(245,158,11,0.06) 0%, transparent 50%)' }}>

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 max-w-4xl mx-auto">
        <div>
          <p className="text-xs text-gray-400 font-medium">Teacher Portal</p>
          <h1 className="text-lg font-extrabold text-gray-900">Dashboard</h1>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100
            flex items-center justify-center hover:border-blue-200 transition-colors"
        >
          {profile?.profilePhoto ? (
            <img src={profile.profilePhoto} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-blue-700 font-bold text-sm">
              {firstName[0]}
            </span>
          )}
        </button>
      </div>

      {/* ── Hero branding section ── */}
      <div className="px-4 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600
          rounded-2xl p-6 mb-5 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-1/4 w-20 h-20 bg-amber-400/10 rounded-full translate-y-1/2" />

          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20
                rounded-full px-3 py-1 text-white/85 text-[11px] font-semibold mb-3">
                🎓 Maa Savitri Consultancy
              </span>
              <h2 className="text-white text-2xl font-black leading-tight mb-1">
                Welcome back,<br />
                <span className="text-amber-300">{firstName}!</span>
              </h2>
              <p className="text-blue-200 text-[12px] leading-relaxed max-w-56">
                Your teacher placement journey is in progress. Keep your profile updated.
              </p>

              {/* Current status pill */}
              <div className="mt-4 inline-flex items-center gap-2 bg-white/15 border border-white/25
                rounded-xl px-3 py-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-white text-[12px] font-semibold">
                  Status: {currentStep.label}
                </span>
              </div>
            </div>

            {/* Progress ring */}
            <div className="flex flex-col items-center flex-shrink-0 ml-4">
              <div className="relative">
                <ProgressRing pct={completion} size={78} stroke={7} />
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-white font-black text-lg leading-none">{completion}</span>
                  <span className="text-blue-200 text-[9px] font-bold">%</span>
                </div>
              </div>
              <p className="text-blue-200 text-[10px] mt-1.5 text-center font-medium leading-tight">
                Profile<br />Complete
              </p>
            </div>
          </div>

          {/* Pipeline mini-bar */}
          <div className="mt-5 pt-4 border-t border-white/15">
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {PIPELINE.slice(0, 6).map((step, idx) => {
                const done    = idx < currentIdx;
                const current = idx === currentIdx;
                return (
                  <div key={step.key} className="flex items-center flex-shrink-0">
                    <div className={`flex flex-col items-center gap-1`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold
                        transition-all ${done ? 'bg-emerald-400 text-white' : current ? 'bg-amber-400 text-blue-900 ring-2 ring-amber-300/50' : 'bg-white/15 text-white/40'}`}>
                        {done ? '✓' : idx + 1}
                      </div>
                      <span className={`text-[8px] whitespace-nowrap ${current ? 'text-amber-300 font-bold' : done ? 'text-emerald-300' : 'text-white/35'}`}>
                        {step.short}
                      </span>
                    </div>
                    {idx < 5 && (
                      <div className={`w-5 h-px mx-1 mb-4 ${idx < currentIdx ? 'bg-emerald-400' : 'bg-white/20'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Incomplete profile alert ── */}
      {completion < 100 && (
        <div className="px-4 max-w-4xl mx-auto mb-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle size={18} className="text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-amber-800 text-sm">Profile {completion}% complete</p>
              <p className="text-amber-600 text-xs mt-0.5">Fill your application form to increase placement chances.</p>
            </div>
            <Link to="/teacher/apply"
              className="flex-shrink-0 bg-amber-500 text-white text-[11px] font-bold
                rounded-xl px-3 py-1.5 hover:bg-amber-600 transition-colors">
              Fill Now
            </Link>
          </div>
        </div>
      )}

      {/* ── Stat cards ── */}
      <div className="px-4 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            {
              icon: User, label: 'Profile',
              value: profile?.isProfileComplete ? 'Complete' : `${completion}%`,
              sub: profile?.isProfileComplete ? 'All done!' : 'Needs update',
              iconBg: completion === 100 ? 'bg-emerald-100' : 'bg-amber-100',
              iconColor: completion === 100 ? 'text-emerald-600' : 'text-amber-600',
              valueColor: completion === 100 ? 'text-emerald-700' : 'text-amber-700',
            },
            {
              icon: BookOpen, label: 'Subjects',
              value: profile?.subjects?.length || 0,
              sub: profile?.subjects?.slice(0,1).join('') || 'Not set',
              iconBg: 'bg-blue-100', iconColor: 'text-blue-600', valueColor: 'text-blue-700',
            },
            {
              icon: Award, label: 'Experience',
              value: `${profile?.experienceYears || 0}yr${profile?.experienceYears !== 1 ? 's' : ''}`,
              sub: 'Teaching exp.',
              iconBg: 'bg-purple-100', iconColor: 'text-purple-600', valueColor: 'text-purple-700',
            },
            {
              icon: FileText, label: 'Resume',
              value: profile?.resume ? '✓' : '✗',
              sub: profile?.resume ? 'Uploaded' : 'Missing',
              iconBg: profile?.resume ? 'bg-emerald-100' : 'bg-red-100',
              iconColor: profile?.resume ? 'text-emerald-600' : 'text-red-500',
              valueColor: profile?.resume ? 'text-emerald-700' : 'text-red-600',
            },
          ].map(card => (
            <div key={card.label}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4
                hover:shadow-md hover:border-blue-100 transition-all duration-200">
              <div className={`w-9 h-9 ${card.iconBg} rounded-xl flex items-center justify-center mb-3`}>
                <card.icon size={16} className={card.iconColor} />
              </div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{card.label}</p>
              <p className={`font-black text-xl mt-0.5 ${card.valueColor}`}>{card.value}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 truncate">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Admin message ── */}
        {profile?.adminNotes && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4 flex gap-3">
            <Bell size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-blue-800 text-sm">Message from Admin</p>
              <p className="text-blue-700 text-sm mt-0.5">{profile.adminNotes}</p>
            </div>
          </div>
        )}

        {/* ── Assigned school banner ── */}
        {profile?.assignedSchool && (
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500
            rounded-2xl p-5 mb-4 text-white">
            <p className="font-black text-lg mb-0.5">🎉 Congratulations!</p>
            <p className="text-emerald-100 text-sm">You've been assigned to:</p>
            <p className="font-bold text-xl mt-1">{profile.assignedSchool.schoolName}</p>
            <p className="text-emerald-200 text-sm">
              {profile.assignedSchool.city}, {profile.assignedSchool.state}
            </p>
          </div>
        )}

        {/* ── Quick action cards ── */}
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          {[
            {
              to: '/teacher/apply',
              icon: ClipboardList,
              label: 'Fill Application',
              sub: 'Complete your teacher application form',
              iconBg: 'bg-blue-100', iconColor: 'text-blue-600',
              highlight: completion < 100,
            },
            {
              to: '/teacher/profile',
              icon: User,
              label: 'View Profile',
              sub: 'See your complete teacher profile',
              iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600',
            },
            {
              to: '/teacher/history',
              icon: History,
              label: 'My History',
              sub: 'View your application & status history',
              iconBg: 'bg-purple-100', iconColor: 'text-purple-600',
            },
            {
              to: '/teacher/status',
              icon: TrendingUp,
              label: 'Track Status',
              sub: 'Monitor your placement pipeline',
              iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600',
            },
          ].map(({ to, icon: Icon, label, sub, iconBg, iconColor, highlight }) => (
            <Link key={to} to={to}
              className={`bg-white rounded-2xl border shadow-sm p-4
                flex items-center justify-between group
                hover:shadow-md transition-all duration-200 ${
                highlight ? 'border-blue-200 ring-2 ring-blue-50' : 'border-gray-100 hover:border-blue-100'
              }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
                  <Icon size={18} className={iconColor} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{label}</p>
                  <p className="text-gray-400 text-[11px] mt-0.5">{sub}</p>
                </div>
              </div>
              <ArrowRight size={15} className="text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Right floating sidebar */}
      <TeacherSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        profile={profile}
        user={user}
        onLogout={handleLogout}
        activeKey="dashboard"
      />
    </div>
  );
};

export default TeacherDashboard;