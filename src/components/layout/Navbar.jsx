// src/components/common/Navbar.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard, LogOut, User, FileText,
         BarChart2, Home, Info, Briefcase, BookOpen,
         Phone, School, Users, Link2, Image, Megaphone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { label: 'Home',          to: '/' },
  { label: 'About',         to: '/about' },
  { label: 'Services',      to: '/services' },
  { label: 'T&C (Teacher)', to: '/terms/teacher' },
  { label: 'T&C (School)',  to: '/terms/school' },
  { label: 'Vacancy',       to: '/vacancy' },
  { label: 'Contact Us',    to: '/contact' },
];

// ── Per-role sidebar nav items ──────────────────────────
const guestNavItems = [
  { label: 'Home',          to: '/',              icon: Home },
  { label: 'About Us',      to: '/about',         icon: Info },
  { label: 'Services',      to: '/services',      icon: Briefcase },
  { label: 'T&C (Teacher)', to: '/terms/teacher', icon: BookOpen },
  { label: 'T&C (School)',  to: '/terms/school',  icon: School },
  { label: 'Vacancy',       to: '/vacancy',       icon: FileText },
  { label: 'Contact Us',    to: '/contact',       icon: Phone },
];

const teacherNavItems = [
  { label: 'Home',     to: '/',                   icon: Home },
  { label: 'Vacancy',  to: '/vacancy',            icon: FileText },
  { label: 'Contact',  to: '/contact',            icon: Phone },
];
const teacherAccountItems = [
  { label: 'My Profile',          to: '/teacher/profile',   icon: User },
  { label: 'My Resume',           to: '/teacher/documents', icon: FileText },
  { label: 'Application Status',  to: '/teacher/status',    icon: BarChart2 },
];

const adminNavItems = [
  { label: 'Home',    to: '/',      icon: Home },
  { label: 'Vacancy', to: '/vacancy', icon: FileText },
];
const adminPanelItems = [
  { label: 'Dashboard',   to: '/admin/dashboard', icon: LayoutDashboard, badge: null },
  { label: 'Teachers',    to: '/admin/teachers',  icon: User,            badge: '248' },
  { label: 'Schools',     to: '/admin/schools',   icon: School,          badge: '87'  },
  { label: 'Assignments', to: '/admin/assign',    icon: Link2,           badge: null  },
  { label: 'Vacancies',   to: '/admin/vacancies', icon: Briefcase,       badge: '12', badgeDanger: true },
];
const adminContentItems = [
  { label: 'Slider Images', to: '/admin/content',   icon: Image },
  { label: 'Homepage',      to: '/admin/homepage',  icon: Megaphone },
  { label: 'Manage Users',  to: '/admin/users',     icon: Users },
];

// ── Pipeline status bar ─────────────────────────────────
const PIPELINE_STAGES = ['registered','contacted','test_scheduled','interview','assigned','completed'];
const stageIndex = (s) => PIPELINE_STAGES.indexOf(s);

const PipelineBar = ({ pipeline }) => {
  const active = stageIndex(pipeline ?? 'registered');
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4">
      <p className="text-[11px] font-bold text-emerald-800 mb-2">Pipeline Status</p>
      <div className="flex gap-1 mb-1.5">
        {PIPELINE_STAGES.map((s, i) => (
          <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${
            i < active  ? 'bg-blue-600' :
            i === active ? 'bg-amber-400' : 'bg-gray-200'
          }`} />
        ))}
      </div>
      <p className="text-[10px] text-gray-500">
        Step {active + 1} of 6 — {pipeline?.replace('_',' ') ?? 'Registered'}
      </p>
    </div>
  );
};

// ── Single nav item ──────────────────────────────────────
const SbItem = ({ item, onClick }) => (
  <NavLink
    to={item.to}
    end={item.to === '/'}
    onClick={onClick}
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
        {item.badge && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            item.badgeDanger
              ? 'bg-red-100 text-red-700'
              : 'bg-blue-100 text-blue-700'
          }`}>
            {item.badge}
          </span>
        )}
        {!item.badge && (
          <span className={`text-sm ${isActive ? 'text-blue-300' : 'text-gray-300'}`}>›</span>
        )}
      </>
    )}
  </NavLink>
);

const SbSection = ({ label, items, onClose }) => (
  <div className="mb-2">
    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[.7px] mb-2 ml-1">{label}</p>
    {items.map(item => <SbItem key={item.to} item={item} onClick={onClose} />)}
  </div>
);

// ── MOBILE SIDEBAR ───────────────────────────────────────
const MobileSidebar = ({ open, onClose, user, onLogout, teacherPipeline }) => {
  const sidebarRef = useRef(null);
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isTeacher = user?.role === 'teacher';
  const isSchool = user?.role === 'school';

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const dashboardLink =
    isTeacher ? '/teacher/dashboard'
    : isSchool ? '/school/dashboard'
    : '/admin/dashboard';

  const avatarGradient =
    isAdmin   ? 'from-violet-600 to-violet-900'
    : isTeacher ? 'from-blue-600 to-blue-900'
    : isSchool  ? 'from-emerald-600 to-emerald-900'
    : 'from-gray-300 to-gray-400';

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 bottom-0 z-50 w-[300px] bg-white shadow-2xl
          rounded-l-[20px] flex flex-col overflow-hidden
          transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)]
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* ── Header ── */}
        <div className={`flex-shrink-0 bg-gradient-to-br ${
          isAdmin ? 'from-violet-900 to-violet-700'
          : 'from-blue-900 to-blue-600'
        } px-4 pt-5 pb-4`}>
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25
              flex items-center justify-center transition-colors"
          >
            <X size={15} className="text-white" />
          </button>

          {user ? (
            <>
              {/* Avatar + name */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-[52px] h-[52px] rounded-full bg-gradient-to-br ${avatarGradient}
                  flex items-center justify-center text-white font-black text-lg
                  ring-2 ring-white/40 flex-shrink-0`}>
                  {initials}
                </div>
                <div>
                  <p className="text-white font-extrabold text-[15px] leading-tight flex items-center gap-1.5">
                    {user.name}
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30" />
                  </p>
                  <p className="text-white/70 text-[11px] mt-0.5 capitalize">{user.role?.replace('_', ' ')} Account</p>
                  <p className="text-white/50 text-[10px]">{user.email}</p>
                </div>
              </div>

              {/* Role badge */}
              <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/25
                rounded-full px-3 py-1 text-white/95 text-[10px] font-semibold">
                {isAdmin ? '⭐' : isTeacher ? '🎓' : '🏫'}
                {user.role?.replace('_', ' ')?.replace(/\b\w/g, c => c.toUpperCase())}
              </span>

              {/* Dashboard quick link */}
              <Link
                to={dashboardLink}
                onClick={onClose}
                className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25
                  border border-white/25 rounded-xl px-4 py-2.5 text-white text-[12px] font-semibold
                  mt-3 transition-colors"
              >
                <LayoutDashboard size={13} />
                {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
              </Link>
            </>
          ) : (
            /* Guest header */
            <div className="flex items-center gap-3">
              <div className="w-[52px] h-[52px] rounded-full bg-white/20 border-2 border-white/30
                flex items-center justify-center flex-shrink-0">
                <User size={24} className="text-white/70" />
              </div>
              <div>
                <p className="text-white font-extrabold text-[16px]">Welcome!</p>
                <p className="text-white/65 text-[12px] mt-0.5">Join as Teacher or School</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-3 py-4">

          {/* Guest */}
          {!user && (
            <>
              <SbSection label="Navigation" items={guestNavItems} onClose={onClose} />
              <hr className="border-gray-100 my-3" />
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[.7px] mb-3 ml-1">Get Started</p>
              <div className="flex flex-col gap-2">
                <Link to="/register?role=teacher" onClick={onClose}
                  className="block text-center bg-gradient-to-r from-blue-600 to-blue-800
                    text-white rounded-xl py-3 text-[13px] font-semibold shadow-blue-200 shadow-md">
                  Register as Teacher
                </Link>
                <Link to="/register?role=school" onClick={onClose}
                  className="block text-center border-[1.5px] border-blue-600 text-blue-700
                    rounded-xl py-3 text-[13px] font-semibold hover:bg-blue-50 transition-colors">
                  Register as School
                </Link>
                <Link to="/login" onClick={onClose}
                  className="block text-center border border-gray-200 text-gray-600
                    rounded-xl py-3 text-[13px] font-medium hover:bg-gray-50 transition-colors">
                  Login to Account
                </Link>
              </div>
            </>
          )}

          {/* Teacher */}
          {isTeacher && (
            <>
              <SbSection label="Navigation" items={teacherNavItems} onClose={onClose} />
              <hr className="border-gray-100 my-3" />
              <SbSection label="My Account" items={teacherAccountItems} onClose={onClose} />
              {teacherPipeline && <PipelineBar pipeline={teacherPipeline} />}
            </>
          )}

          {/* School */}
          {isSchool && (
            <>
              <SbSection label="Navigation" items={guestNavItems.slice(0,3)} onClose={onClose} />
              <hr className="border-gray-100 my-3" />
              <SbSection label="My School" items={[
                { label: 'School Profile',  to: '/school/profile',       icon: School },
                { label: 'Requirements',    to: '/school/requirements',  icon: FileText },
                { label: 'Dashboard',       to: '/school/dashboard',     icon: LayoutDashboard },
              ]} onClose={onClose} />
            </>
          )}

          {/* Admin */}
          {isAdmin && (
            <>
              <SbSection label="Navigation" items={adminNavItems} onClose={onClose} />
              <hr className="border-gray-100 my-3" />
              <SbSection label="Admin Panel" items={adminPanelItems} onClose={onClose} />
              <hr className="border-gray-100 my-3" />
              <SbSection label="Content" items={adminContentItems} onClose={onClose} />
            </>
          )}

          {/* Logout (logged-in users) */}
          {user && (
            <>
              <hr className="border-gray-100 my-3" />
              <button
                onClick={() => { onLogout(); onClose(); }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
                  text-[13px] font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <span className="w-8 h-8 rounded-[10px] bg-red-50 flex items-center justify-center flex-shrink-0">
                  <LogOut size={15} className="text-red-500" />
                </span>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

// ── MAIN NAVBAR ──────────────────────────────────────────
const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch teacher pipeline if needed
  const [teacherPipeline, setTeacherPipeline] = useState(null);
  useEffect(() => {
    if (user?.role === 'teacher') {
      fetch('/api/teacher/status', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(r => r.json())
        .then(d => { if (d.success) setTeacherPipeline(d.pipeline); })
        .catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const dashboardLink =
    user?.role === 'teacher' ? '/teacher/dashboard'
    : user?.role === 'school'   ? '/school/dashboard'
    : '/admin/dashboard';

  return (
    <>
      {/* ── FLOATING PILL NAVBAR ── */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-3">
        <nav className={`w-full max-w-5xl bg-white/95 backdrop-blur-md rounded-full
          border transition-all duration-300 ${
          scrolled
            ? 'shadow-[0_8px_32px_rgba(37,99,235,0.18)] border-blue-100'
            : 'shadow-[0_4px_20px_rgba(0,0,0,0.10)] border-gray-200'
        }`}>
          <div className="flex items-center justify-between px-4 sm:px-5 h-14">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-900
                flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="text-white font-black text-[11px] tracking-tight">MS</span>
              </div>
              <div className="hidden sm:block leading-tight">
                <p className="text-blue-900 font-extrabold text-[13px] leading-none">Maa Savitri</p>
                <p className="text-gray-400 text-[10px] font-medium leading-none mt-0.5">Consultancy Services</p>
              </div>
            </Link>

            {/* Desktop pill nav */}
            <div className="hidden lg:flex items-center gap-0.5
              bg-gray-50 rounded-full px-2 py-1.5 border border-gray-100">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-full text-[11.5px] font-semibold
                     transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-500 hover:text-blue-600 hover:bg-white'
                  }`}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Desktop right side */}
            <div className="hidden lg:flex items-center gap-2">
              {user ? (
                <button
                  onClick={() => navigate(dashboardLink)}
                  className="flex items-center gap-2 pl-1.5 pr-4 py-1.5
                    bg-blue-600 text-white rounded-full text-[12px] font-semibold
                    hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <div className="w-7 h-7 bg-white/25 rounded-full flex items-center
                    justify-center text-[11px] font-black border border-white/30">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  {user.name.split(' ')[0]}
                </button>
              ) : (
                <>
                  <Link to="/login"
                    className="px-4 py-1.5 border border-gray-200 text-gray-700 rounded-full
                      text-[12px] font-semibold hover:border-blue-400 hover:text-blue-600
                      transition-all">
                    Login
                  </Link>
                  <Link to="/register"
                    className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-blue-800
                      text-white rounded-full text-[12px] font-semibold
                      hover:shadow-lg hover:shadow-blue-200 transition-all shadow-sm">
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Hamburger — mobile/tablet only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-full bg-gray-100 flex items-center
                justify-center text-gray-600 hover:bg-gray-200 transition-colors flex-shrink-0"
              aria-label="Open menu"
            >
              <Menu size={17} />
            </button>
          </div>
        </nav>
      </div>

      {/* Spacer */}
      {/* <div className="h-20" /> */}

      {/* Right-side Mobile Sidebar */}
      <MobileSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onLogout={handleLogout}
        teacherPipeline={teacherPipeline}
      />
    </>
  );
};

export default Navbar;