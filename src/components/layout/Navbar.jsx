import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Menu, X, LayoutDashboard, LogOut, User, FileText,
  Home, Info, Briefcase, BookOpen, Phone,
  School, Users, Image, Edit3, ClipboardList, History,
  TrendingUp, CheckCircle, Clock, MapPin, Award, ChevronRight,
  UserPlus, GraduationCap, Mail, Shield, Layers,
  ChevronDown, ChevronUp, Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { teacherAPI, schoolAPI } from '../../api';

// ── Nav data ──────────────────────────────────────────────
const navLinks = [
  { label: 'Home',          to: '/',              icon: Home },
  { label: 'About',         to: '/about',         icon: Info },
  { label: 'Services',      to: '/services',      icon: Briefcase },
  { label: 'T&C (Teacher)', to: '/terms/teacher', icon: BookOpen },
  { label: 'T&C (School)',  to: '/terms/school',  icon: School },
  { label: 'Vacancy',       to: '/vacancy',       icon: FileText },
  { label: 'Contact Us',    to: '/contact',       icon: Phone },
];

const teacherMenuItems = [
  { label: 'Dashboard',    to: '/teacher/dashboard', icon: LayoutDashboard },
  { label: 'My Profile',   to: '/teacher/profile',   icon: User },
  { label: 'Edit Info',    to: '/teacher/edit',      icon: Edit3 },
  { label: 'Application',  to: '/teacher/apply',     icon: ClipboardList },
  { label: 'My History',   to: '/teacher/history',   icon: History },
  { label: 'Track Status', to: '/teacher/status',    icon: TrendingUp },
];

const schoolMenuItems = [
  { label: 'Dashboard',      to: '/school/dashboard',    icon: LayoutDashboard },
  { label: 'School Profile', to: '/school/profile',      icon: School },
  { label: 'Requirements',   to: '/school/requirements', icon: FileText },
];

const adminMenuItems = [
  { label: 'Dashboard',        to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Teachers',         to: '/admin/teachers',  icon: Users },
  { label: 'Schools',          to: '/admin/schools',   icon: School },
  { label: 'Vacancies',        to: '/admin/vacancies', icon: Briefcase },
  { label: 'Homepage Content', to: '/admin/content',   icon: Image },
  { label: 'Manage Admins',    to: '/admin/admins',    icon: UserPlus },
];

const PIPELINE      = ['applied','contacted','test_scheduled','interview','assigned','completed'];
const PIPELINE_LABELS = ['Applied','Contacted','Test','Interview','Assigned','Done'];

const calcCompletion = (profile) => {
  if (!profile) return 0;
  const checks = [
    !!profile.phone, !!profile.gender, !!profile.dateOfBirth,
    !!profile.currentAddress, profile.subjects?.length > 0,
    profile.classLevels?.length > 0, profile.education?.length > 0,
    !!profile.profilePhoto, !!profile.resume,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
};

// ── Shared sidebar nav item ───────────────────────────────
const SbItem = ({ item, onClose }) => (
  <NavLink
    to={item.to}
    end={item.to === '/'}
    onClick={onClose}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all mb-0.5 ${
        isActive
          ? 'bg-blue-50 text-blue-700 font-semibold'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`
    }
  >
    {({ isActive }) => (
      <>
        <span className={`w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0 ${
          isActive ? 'bg-blue-100' : 'bg-gray-100'
        }`}>
          <item.icon size={15} className={isActive ? 'text-blue-600' : 'text-gray-500'} />
        </span>
        <span className="flex-1">{item.label}</span>
        <ChevronRight size={13} className={isActive ? 'text-blue-400' : 'text-gray-300'} />
      </>
    )}
  </NavLink>
);

const SbSection = ({ label, items, onClose }) => (
  <div className="mb-3">
    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[.7px] mb-1.5 ml-1">{label}</p>
    {items.map(item => <SbItem key={item.to} item={item} onClose={onClose} />)}
  </div>
);

const StatPill = ({ icon: Icon, label, value, color = 'blue' }) => {
  const c = {
    blue:   'bg-blue-50 text-blue-700 border-blue-100',
    green:  'bg-emerald-50 text-emerald-700 border-emerald-100',
    amber:  'bg-amber-50 text-amber-700 border-amber-100',
    violet: 'bg-violet-50 text-violet-700 border-violet-100',
  };
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[12px] font-semibold ${c[color]}`}>
      <Icon size={13} />
      <span className="text-gray-500 font-medium text-[11px]">{label}</span>
      <span className="ml-auto">{value}</span>
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// PANEL — shared shell used by BOTH user panel & nav panel
// ══════════════════════════════════════════════════════════
const Panel = ({ open, onClose, children, panelRef }) => (
  <>
    {/* Backdrop */}
    <div
      className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    />
    {/* Floating panel */}
    <div
      ref={panelRef}
      className={`fixed top-[72px] right-3 bottom-4 z-[9995] w-[300px] bg-white
        rounded-[20px] flex flex-col overflow-hidden
        shadow-[0_20px_60px_rgba(0,0,0,0.18),0_4px_20px_rgba(0,0,0,0.08)]
        transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]
        ${open ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'}`}
    >
      {children}
    </div>
  </>
);

// ── USER PANEL (logged-in details) ────────────────────────
const UserPanel = ({ open, onClose, user, onLogout, roleData }) => {
  const ref = useRef(null);

  const isAdmin   = user?.role === 'admin' || user?.role === 'superadmin';
  const isTeacher = user?.role === 'teacher';
  const isSchool  = user?.role === 'school';

  const teacherProfile = roleData?.teacherProfile;
  const schoolProfile  = roleData?.schoolProfile;
  const completion     = isTeacher ? calcCompletion(teacherProfile) : 0;
  const pipelineIdx    = isTeacher ? PIPELINE.indexOf(teacherProfile?.currentStatus) : -1;
  const activeReqs     = schoolProfile?.requirements?.filter(r => r.isActive)?.length || 0;

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const headerGradient =
    isAdmin   ? 'from-violet-900 to-violet-700'
    : isSchool  ? 'from-emerald-900 to-emerald-700'
    : 'from-blue-900 to-blue-600';

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <Panel open={open} onClose={onClose} panelRef={ref}>
      {/* Header */}
      <div className={`flex-shrink-0 bg-gradient-to-br ${headerGradient} px-4 pt-5 pb-4 relative`}>
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
          <X size={15} className="text-white" />
        </button>

        {/* Avatar row */}
        <div className="flex items-center gap-3 mb-3">
          <div className="relative flex-shrink-0">
            {(isTeacher && teacherProfile?.profilePhoto) || (isSchool && schoolProfile?.logo) ? (
              <img
                src={isTeacher ? teacherProfile.profilePhoto : schoolProfile.logo}
                alt=""
                className="w-[54px] h-[54px] rounded-full object-cover ring-2 ring-white/40"
              />
            ) : (
              <div className="w-[54px] h-[54px] rounded-full bg-white/20 ring-2 ring-white/40 flex items-center justify-center text-white font-black text-lg">
                {initials}
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-white/30" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white font-extrabold text-[15px] leading-tight truncate">{user.name}</p>
            <p className="text-white/60 text-[10px] truncate flex items-center gap-1 mt-0.5">
              <Mail size={9} />{user.email}
            </p>
            <span className="inline-flex items-center gap-1 bg-white/15 border border-white/25 rounded-full px-2 py-0.5 text-white/90 text-[10px] font-semibold mt-1.5">
              {isAdmin ? <Shield size={9} /> : isTeacher ? <GraduationCap size={9} /> : <School size={9} />}
              {user.role?.replace('_', ' ')?.replace(/\b\w/g, c => c.toUpperCase())}
            </span>
          </div>
        </div>

        {/* Teacher: completion bar */}
        {isTeacher && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-white/70 text-[10px] font-semibold uppercase tracking-wide">Profile Complete</span>
              <span className={`font-bold text-[11px] ${completion >= 80 ? 'text-emerald-300' : completion >= 50 ? 'text-amber-300' : 'text-red-300'}`}>
                {completion}%
              </span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  completion >= 80 ? 'bg-gradient-to-r from-emerald-400 to-emerald-300'
                  : completion >= 50 ? 'bg-gradient-to-r from-amber-400 to-amber-300'
                  : 'bg-gradient-to-r from-red-400 to-red-300'
                }`}
                style={{ width: `${completion}%` }}
              />
            </div>
            {completion < 100 && (
              <p className="text-white/40 text-[9px] mt-1">Complete your profile to get more opportunities</p>
            )}
          </div>
        )}

        {/* Teacher: pipeline */}
        {isTeacher && pipelineIdx >= 0 && (
          <div className="bg-white/10 border border-white/15 rounded-xl p-2.5 mb-3">
            <p className="text-white/60 text-[9px] font-bold uppercase tracking-wide mb-2">Application Pipeline</p>
            <div className="flex gap-1 mb-1.5">
              {PIPELINE.map((_, i) => (
                <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${
                  i < pipelineIdx ? 'bg-blue-400' : i === pipelineIdx ? 'bg-amber-400' : 'bg-white/20'
                }`} />
              ))}
            </div>
            <div className="flex justify-between">
              <p className="text-white/60 text-[9px]">Step {pipelineIdx + 1} of {PIPELINE.length}</p>
              <p className="text-amber-300 text-[9px] font-semibold capitalize">
                {teacherProfile?.currentStatus?.replace(/_/g, ' ')}
              </p>
            </div>
          </div>
        )}

        {/* Teacher pills */}
        {isTeacher && teacherProfile && (
          <div className="flex flex-wrap gap-1.5">
            {teacherProfile.subjects?.slice(0, 2).map(s => (
              <span key={s} className="bg-white/15 border border-white/20 rounded-full px-2 py-0.5 text-white/80 text-[10px] font-medium">{s}</span>
            ))}
            {teacherProfile.experienceYears > 0 && (
              <span className="bg-white/15 border border-white/20 rounded-full px-2 py-0.5 text-white/80 text-[10px] font-medium">
                {teacherProfile.experienceYears}yr exp
              </span>
            )}
            {teacherProfile.city && (
              <span className="bg-white/15 border border-white/20 rounded-full px-2 py-0.5 text-white/80 text-[10px] font-medium flex items-center gap-0.5">
                <MapPin size={8} />{teacherProfile.city}
              </span>
            )}
          </div>
        )}

        {/* School pills */}
        {isSchool && schoolProfile && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {schoolProfile.schoolName && (
              <span className="bg-white/15 border border-white/20 rounded-full px-2 py-0.5 text-white/80 text-[10px] font-medium">{schoolProfile.schoolName}</span>
            )}
            {schoolProfile.city && (
              <span className="bg-white/15 border border-white/20 rounded-full px-2 py-0.5 text-white/80 text-[10px] font-medium flex items-center gap-0.5">
                <MapPin size={8} />{schoolProfile.city}
              </span>
            )}
            <span className="bg-white/15 border border-white/20 rounded-full px-2 py-0.5 text-white/80 text-[10px] font-medium">
              {activeReqs} open req{activeReqs !== 1 ? 's' : ''}
            </span>
            {schoolProfile.isVerified && (
              <span className="bg-emerald-500/30 border border-emerald-400/30 rounded-full px-2 py-0.5 text-emerald-200 text-[10px] font-medium flex items-center gap-0.5">
                <CheckCircle size={8} /> Verified
              </span>
            )}
          </div>
        )}

        {/* Admin badge */}
        {isAdmin && (
          <div className="mt-2 bg-white/10 border border-white/15 rounded-xl px-3 py-2 flex items-center gap-2">
            <Shield size={14} className="text-violet-300 flex-shrink-0" />
            <div>
              <p className="text-white text-[11px] font-bold">Admin Access</p>
              <p className="text-white/50 text-[9px]">Full platform control</p>
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {/* Quick stats */}
        {isTeacher && teacherProfile && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            <StatPill icon={BookOpen}      label="Subjects"  value={teacherProfile.subjects?.length || 0}      color="blue"   />
            <StatPill icon={Award}         label="Exp (yrs)" value={teacherProfile.experienceYears || 0}        color="amber"  />
            <StatPill icon={GraduationCap} label="Classes"   value={teacherProfile.classLevels?.length || 0}   color="violet" />
            <StatPill icon={CheckCircle}   label="Profile"   value={`${completion}%`}                           color={completion >= 80 ? 'green' : 'amber'} />
          </div>
        )}
        {isSchool && schoolProfile && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            <StatPill icon={FileText}    label="Open Reqs" value={activeReqs}                             color="green" />
            <StatPill icon={CheckCircle} label="Verified"  value={schoolProfile.isVerified ? 'Yes' : 'No'} color={schoolProfile.isVerified ? 'green' : 'amber'} />
          </div>
        )}

        {/* Teacher detail card */}
        {isTeacher && teacherProfile && (
          <div className="mb-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mb-2">My Details</p>
            <div className="space-y-1.5">
              {teacherProfile.phone && (
                <p className="text-xs text-gray-600 flex items-center gap-1.5"><Phone size={11} className="text-blue-500 flex-shrink-0" />{teacherProfile.phone}</p>
              )}
              {teacherProfile.subjects?.length > 0 && (
                <p className="text-xs text-gray-600 flex items-center gap-1.5"><BookOpen size={11} className="text-blue-500 flex-shrink-0" />{teacherProfile.subjects.slice(0,3).join(', ')}</p>
              )}
              {teacherProfile.classLevels?.length > 0 && (
                <p className="text-xs text-gray-600 flex items-center gap-1.5"><GraduationCap size={11} className="text-blue-500 flex-shrink-0" />{teacherProfile.classLevels.slice(0,2).join(', ')}</p>
              )}
              {teacherProfile.expectedSalary && (
                <p className="text-xs text-gray-600 flex items-center gap-1.5"><Award size={11} className="text-blue-500 flex-shrink-0" />{teacherProfile.expectedSalary}</p>
              )}
              {teacherProfile.currentStatus && (
                <p className="text-xs font-semibold text-blue-700 flex items-center gap-1.5 mt-1">
                  <Clock size={11} className="text-blue-500 flex-shrink-0" />
                  Status: {teacherProfile.currentStatus.replace(/_/g,' ')}
                </p>
              )}
            </div>
          </div>
        )}

        {/* School detail card */}
        {isSchool && schoolProfile && (
          <div className="mb-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mb-2">School Info</p>
            <div className="space-y-1.5">
              {schoolProfile.phone && (
                <p className="text-xs text-gray-600 flex items-center gap-1.5"><Phone size={11} className="text-emerald-600 flex-shrink-0" />{schoolProfile.phone}</p>
              )}
              {schoolProfile.city && (
                <p className="text-xs text-gray-600 flex items-center gap-1.5"><MapPin size={11} className="text-emerald-600 flex-shrink-0" />{schoolProfile.city}, {schoolProfile.state}</p>
              )}
              {schoolProfile.board && (
                <p className="text-xs text-gray-600 flex items-center gap-1.5"><BookOpen size={11} className="text-emerald-600 flex-shrink-0" />{schoolProfile.board}</p>
              )}
              <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                <FileText size={11} className="text-emerald-600 flex-shrink-0" />
                {activeReqs} active requirement{activeReqs !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}

        {/* Role menus */}
        {isTeacher && <SbSection label="Menu" items={teacherMenuItems} onClose={onClose} />}
        {isSchool   && <SbSection label="Menu" items={schoolMenuItems}  onClose={onClose} />}
        {isAdmin    && <SbSection label="Admin Panel" items={adminMenuItems} onClose={onClose} />}

        {/* Site nav inside user panel too */}
        <SbSection label="Site Navigation" items={navLinks} onClose={onClose} />

        <hr className="border-gray-100 my-2" />
        <button
          onClick={() => { onLogout(); onClose(); }}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <span className="w-8 h-8 rounded-[10px] bg-red-50 flex items-center justify-center flex-shrink-0">
            <LogOut size={15} className="text-red-500" />
          </span>
          Logout
        </button>
      </div>
    </Panel>
  );
};

// ── NAV PANEL (hamburger — guest & mobile) ────────────────
const NavPanel = ({ open, onClose, user }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <Panel open={open} onClose={onClose} panelRef={ref}>
      {/* Header — matches user panel style */}
      <div className='pt-10'>
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-400/60 hover:bg-gray-400/90 flex items-center justify-center transition-colors">
          <X size={15} className="text-white" />
        </button>        
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {/* All nav links */}
        <SbSection label="Site Navigation" items={navLinks} onClose={onClose} />

        {/* Guest CTAs */}
        {!user && (
          <>
            <hr className="border-gray-100 my-3" />
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[.7px] mb-3 ml-1">Get Started</p>
            <div className="flex flex-col gap-2">
              <Link
                to="/register?role=teacher"
                onClick={onClose}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl py-3 text-[13px] font-semibold hover:shadow-lg hover:shadow-blue-200 transition-all"
              >
                <GraduationCap size={15} /> Register as Teacher
              </Link>
              <Link
                to="/register?role=school"
                onClick={onClose}
                className="flex items-center justify-center gap-2 border-[1.5px] border-blue-600 text-blue-700 rounded-xl py-3 text-[13px] font-semibold hover:bg-blue-50 transition-colors"
              >
                <School size={15} /> Register as School
              </Link>
              <Link
                to="/login"
                onClick={onClose}
                className="flex items-center justify-center gap-2 border border-gray-200 text-gray-600 rounded-xl py-3 text-[13px] font-medium hover:bg-gray-50 transition-colors"
              >
                <User size={14} /> Login to Account
              </Link>
            </div>
          </>
        )}

        {/* If logged in — show a "go to dashboard" shortcut */}
        {user && (
          <>
            <hr className="border-gray-100 my-3" />
            <Link
              to={`/${user.role}/dashboard`}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <span className="w-8 h-8 rounded-[10px] bg-blue-100 flex items-center justify-center flex-shrink-0">
                <LayoutDashboard size={15} className="text-blue-600" />
              </span>
              Go to Dashboard
              <ChevronRight size={13} className="text-blue-400 ml-auto" />
            </Link>
          </>
        )}
      </div>
    </Panel>
  );
};

// ══════════════════════════════════════════════════════════
// MAIN NAVBAR
// ══════════════════════════════════════════════════════════
const Navbar = () => {
  const [userPanelOpen, setUserPanelOpen] = useState(false);
  const [navPanelOpen,  setNavPanelOpen]  = useState(false);
  const [scrolled,      setScrolled]      = useState(false);
  const [roleData,      setRoleData]      = useState({});
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  useEffect(() => {
    if (!user) return;
    if (user.role === 'teacher') {
      teacherAPI.getProfile()
        .then(({ data }) => setRoleData({ teacherProfile: data.profile || data }))
        .catch(() => {});
    } else if (user.role === 'school') {
      schoolAPI.getProfile()
        .then(({ data }) => setRoleData({ schoolProfile: data.profile || data }))
        .catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  // Only one panel open at a time
  const openUserPanel = () => { setNavPanelOpen(false);  setUserPanelOpen(true); };
  const openNavPanel  = () => { setUserPanelOpen(false); setNavPanelOpen(true);  };

  const avatarSrc = roleData?.teacherProfile?.profilePhoto || roleData?.schoolProfile?.logo;

  return (
    <>
      {/* ── FLOATING PILL NAVBAR ── */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-3">
        <nav className={`w-full max-w-5xl bg-white/95 backdrop-blur-md rounded-full border transition-all duration-300 ${
          scrolled
            ? 'shadow-[0_8px_32px_rgba(37,99,235,0.18)] border-blue-100'
            : 'shadow-[0_4px_20px_rgba(0,0,0,0.10)] border-gray-200'
        }`}>
          <div className="flex items-center justify-between px-4 sm:px-5 h-14">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center shadow-sm">
                <span className="text-white font-black text-[11px] tracking-tight">MS</span>
              </div>
              <div className="hidden sm:block leading-tight">
                <p className="text-blue-900 font-extrabold text-[13px] leading-none">Maa Savitri</p>
                <p className="text-gray-400 text-[10px] font-medium leading-none mt-0.5">Consultancy Services</p>
              </div>
            </Link>

            {/* Desktop pill nav */}
            <div className="hidden lg:flex items-center gap-0.5 bg-gray-50 rounded-full px-2 py-1.5 border border-gray-100">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-full text-[11.5px] font-semibold transition-all duration-200 whitespace-nowrap ${
                      isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-blue-600 hover:bg-white'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Desktop right */}
            <div className="hidden lg:flex items-center gap-2">
              {user ? (
                <button
                  onClick={openUserPanel}
                  className="flex items-center gap-2 pl-1.5 pr-4 py-1.5 bg-blue-600 text-white rounded-full text-[12px] font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  {avatarSrc ? (
                    <img src={avatarSrc} alt="" className="w-7 h-7 rounded-full object-cover border border-white/30" />
                  ) : (
                    <div className="w-7 h-7 bg-white/25 rounded-full flex items-center justify-center text-[11px] font-black border border-white/30">
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  {user.name.split(' ')[0]}
                </button>
              ) : (
                <>
                  <Link to="/login"
                    className="px-4 py-1.5 border border-gray-200 text-gray-700 rounded-full text-[12px] font-semibold hover:border-blue-400 hover:text-blue-600 transition-all">
                    Login
                  </Link>
                  <Link to="/register"
                    className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full text-[12px] font-semibold hover:shadow-lg hover:shadow-blue-200 transition-all shadow-sm">
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile right */}
            <div className="lg:hidden flex items-center gap-2">
              {/* Avatar pill — logged in only */}
              {user && (
                <button
                  onClick={openUserPanel}
                  className="flex items-center gap-1.5 pl-1 pr-3 py-1 bg-blue-600 text-white rounded-full text-[11px] font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  {avatarSrc ? (
                    <img src={avatarSrc} alt="" className="w-6 h-6 rounded-full object-cover border border-white/30" />
                  ) : (
                    <div className="w-6 h-6 bg-white/25 rounded-full flex items-center justify-center text-[10px] font-black border border-white/30">
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  {user.name.split(' ')[0]}
                </button>
              )}

              {/* Hamburger pill — only when NOT logged in */}
              {!user && (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="flex items-center gap-1.5 pl-1 pr-3 py-1 bg-white border border-blue-600 text-blue-600 rounded-full text-[11px] font-semibold shadow-sm"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                      <User size={12} className="text-blue-600" />
                    </div>
                    Login
                  </Link>

                  <button
                    onClick={openNavPanel}
                    aria-label="Open navigation"
                    className="flex items-center gap-1.5 pl-1 pr-3 py-1 bg-blue-600 text-white rounded-full text-[11px] font-semibold shadow-sm"
                  >
                    <div className="w-6 h-6 rounded-full bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
                      <Menu size={12} className="text-white" />
                    </div>
                    Menu
                  </button>
                </div>
              )}
            </div>

          </div>
        </nav>
      </div>

      {/* Spacer */}
      <div className="h-20" />

      {/* User panel — logged in */}
      {user && (
        <UserPanel
          open={userPanelOpen}
          onClose={() => setUserPanelOpen(false)}
          user={user}
          onLogout={handleLogout}
          roleData={roleData}
        />
      )}

      {/* Nav panel — hamburger (all users, primarily mobile) */}
      <NavPanel
        open={navPanelOpen}
        onClose={() => setNavPanelOpen(false)}
        user={user}
      />
    </>
  );
};

export default Navbar;