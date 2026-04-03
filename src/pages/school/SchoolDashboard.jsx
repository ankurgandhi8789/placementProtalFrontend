// src/pages/school/SchoolDashboard.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { schoolAPI } from '../../api';
import Spinner from '../../components/common/Spinner';
import {
  School, FileText, Plus, ArrowRight, CheckCircle,
  MapPin, Phone, Globe, Building2, Users, LogOut,
  ClipboardList, ChevronRight, X, Briefcase,
  Bell, TrendingUp, Star
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// ─── Sidebar nav ──────────────────────────────────────────────────────────
const SCHOOL_NAV = [
  { icon: TrendingUp,   label: 'Dashboard',    to: '/school/dashboard',    key: 'dashboard'   },
  { icon: School,       label: 'School Profile', to: '/school/profile',    key: 'profile'     },
  { icon: ClipboardList,label: 'Requirements',  to: '/school/requirements', key: 'requirements'},
];

// ─── Circular arc progress ────────────────────────────────────────────────
const Arc = ({ value, max, label, color = '#2563EB' }) => {
  const pct = max ? Math.min(value / max, 1) : 0;
  const r = 30, cx = 40, cy = 40, stroke = 6;
  const circ = 2 * Math.PI * r;
  const offset = circ - pct * circ;
  return (
    <div className="flex flex-col items-center">
      <svg width="80" height="80" className="-rotate-90">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E5E7EB" strokeWidth={stroke} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color}
          strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset .8s ease' }} />
      </svg>
      <div className="text-center -mt-1">
        <p className="font-black text-lg text-gray-900 leading-none">{value}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
};

// ─── Right Sidebar ────────────────────────────────────────────────────────
const SchoolSidebar = ({ open, onClose, profile, user, onLogout, activeKey }) => {
  const initials = (profile?.schoolName || user?.name || 'S')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <>
      <div onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300
          ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} />

      <div className={`fixed top-0 right-0 bottom-0 z-50 w-[290px] bg-white flex flex-col
        rounded-l-[22px] overflow-hidden
        transition-transform duration-[320ms] ease-[cubic-bezier(.4,0,.2,1)]
        ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ boxShadow: '-8px 0 40px rgba(37,99,235,0.15)' }}>

        {/* Header */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-600 px-5 pt-6 pb-5 flex-shrink-0">
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
            <X size={14} className="text-white" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              {profile?.logo ? (
                <img src={profile.logo} alt="" className="w-14 h-14 rounded-xl object-cover ring-2 ring-white/40" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-white/20 ring-2 ring-white/40 flex items-center justify-center text-white font-black text-xl">
                  {initials}
                </div>
              )}
              {profile?.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full flex items-center justify-center ring-2 ring-blue-700">
                  <CheckCircle size={11} className="text-white" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-white font-extrabold text-[15px] leading-tight truncate">
                {profile?.schoolName || user?.name || 'School'}
              </p>
              <p className="text-blue-200 text-[11px] mt-0.5 truncate">{profile?.email || user?.email}</p>
              <span className="inline-flex items-center gap-1 bg-white/15 border border-white/25 rounded-full px-2 py-0.5 text-white/90 text-[10px] font-semibold mt-1">
                🏫 School Account
              </span>
            </div>
          </div>

          {/* Verified badge */}
          {profile?.isVerified && (
            <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 rounded-xl px-3 py-1.5">
              <CheckCircle size={12} className="text-emerald-300" />
              <span className="text-emerald-200 text-[11px] font-semibold">Verified by Admin</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[.7px] mb-2 ml-2">Navigation</p>

          {SCHOOL_NAV.map(item => (
            <Link key={item.key} to={item.to} onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all mb-0.5 ${
                activeKey === item.key ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
              }`}>
              <span className={`w-8 h-8 rounded-[10px] flex items-center justify-center ${activeKey === item.key ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <item.icon size={15} className={activeKey === item.key ? 'text-blue-600' : 'text-gray-500'} />
              </span>
              <span className="flex-1">{item.label}</span>
              <ChevronRight size={13} className={activeKey === item.key ? 'text-blue-400' : 'text-gray-300'} />
            </Link>
          ))}

          <div className="h-px bg-gray-100 my-3" />
          <button onClick={onLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-500 hover:bg-red-50 transition-colors">
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

// ─── Vacancy type badge ───────────────────────────────────────────────────
const VacancyTypeBadge = ({ type }) => {
  const colors = {
    PRT: 'bg-blue-100 text-blue-700',
    TGT: 'bg-purple-100 text-purple-700',
    PGT: 'bg-indigo-100 text-indigo-700',
    Principal: 'bg-amber-100 text-amber-700',
    'Vice-Principal': 'bg-orange-100 text-orange-700',
    'Non-Teaching': 'bg-gray-100 text-gray-700',
  };
  const base = type?.split(' + ')[0] || type;
  const c = colors[base] || 'bg-blue-100 text-blue-700';
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${c}`}>
      {type}
    </span>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────
const SchoolDashboard = () => {
  const [profile, setProfile]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const { user, logout }                = useAuth();
  const navigate                        = useNavigate();

  useEffect(() => {
    schoolAPI.getProfile()
      .then(({ data }) => setProfile(data.profile || data))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Spinner size="lg" /></div>
  );

  const vacancies = profile?.vacancies || [];
  const totalPosts = vacancies.reduce((s, v) => s + (Number(v.numberOfPosts) || 0), 0);
  const schoolInitials = (profile?.schoolName || 'S').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-[#EEF2FF]"
      style={{ backgroundImage: 'radial-gradient(circle at 15% 15%, rgba(37,99,235,0.06) 0%, transparent 50%), radial-gradient(circle at 85% 85%, rgba(245,158,11,0.05) 0%, transparent 50%)' }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 max-w-4xl mx-auto">
        <div>
          <p className="text-xs text-gray-400 font-medium">School Portal</p>
          <h1 className="text-lg font-extrabold text-gray-900">Dashboard</h1>
        </div>
        <button onClick={() => setSidebarOpen(true)}
          className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:border-blue-200 transition-colors overflow-hidden">
          {profile?.logo
            ? <img src={profile.logo} alt="" className="w-full h-full object-cover" />
            : <span className="text-blue-700 font-bold text-sm">{schoolInitials}</span>}
        </button>
      </div>

      <div className="px-4 max-w-4xl mx-auto">

        {/* Hero branding card */}
        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-2xl p-6 mb-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-1/3 w-20 h-20 bg-amber-400/10 rounded-full translate-y-1/2" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex-1">
              <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 rounded-full px-3 py-1 text-white/85 text-[11px] font-semibold mb-3">
                🏫 Maa Savitri Consultancy
              </span>
              <h2 className="text-white text-xl font-black leading-tight mb-1">
                {profile?.schoolName || user?.name || 'Welcome!'}
              </h2>
              <div className="flex items-center gap-2 flex-wrap mt-2">
                {profile?.city && (
                  <span className="flex items-center gap-1 text-blue-200 text-xs">
                    <MapPin size={11} />{profile.city}{profile.state ? `, ${profile.state}` : ''}
                  </span>
                )}
                {profile?.isVerified && (
                  <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                    <CheckCircle size={9} /> Verified
                  </span>
                )}
              </div>
              <p className="text-blue-200 text-xs mt-2 leading-relaxed max-w-xs">
                Manage your teacher vacancy requirements through Maa Savitri Consultancy.
              </p>
            </div>

            {/* Stats arc row */}
            <div className="flex gap-4 flex-shrink-0">
              <Arc value={vacancies.length} max={Math.max(vacancies.length, 5)} label="Vacancies" color="#F59E0B" />
              <Arc value={totalPosts} max={Math.max(totalPosts, 10)} label="Total Posts" color="#34D399" />
            </div>
          </div>

          {/* Quick stats bottom strip */}
          <div className="mt-5 pt-4 border-t border-white/15 grid grid-cols-3 gap-4">
            {[
              { icon: Briefcase, label: 'Vacancy Types', value: vacancies.length },
              { icon: Users,     label: 'Total Posts',   value: totalPosts },
              { icon: Star,      label: 'Status',        value: profile?.isVerified ? 'Verified' : 'Pending' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-amber-300 font-black text-lg leading-none">{s.value}</p>
                <p className="text-blue-300 text-[9px] mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Admin notes */}
        {profile?.adminNotes && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4 flex gap-3">
            <Bell size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-blue-800 text-sm">Message from Admin</p>
              <p className="text-blue-700 text-sm mt-0.5">{profile.adminNotes}</p>
            </div>
          </div>
        )}

        {/* Quick action cards */}
        <div className="grid sm:grid-cols-2 gap-3 mb-5">
          <Link to="/school/requirements"
            className="bg-white rounded-2xl border border-blue-100 ring-2 ring-blue-50 p-4 flex items-center justify-between group hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Plus size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Post Requirement</p>
                <p className="text-gray-400 text-xs">Add teacher vacancy</p>
              </div>
            </div>
            <ArrowRight size={15} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
          </Link>
          <Link to="/school/profile"
            className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between group hover:shadow-md transition-all hover:border-amber-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <School size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">School Profile</p>
                <p className="text-gray-400 text-xs">Update information</p>
              </div>
            </div>
            <ArrowRight size={15} className="text-gray-300 group-hover:text-amber-500 transition-colors" />
          </Link>
        </div>

        {/* Vacancies preview */}
        {vacancies.length > 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                <Briefcase size={15} className="text-blue-600" /> Posted Vacancies
              </h3>
              <Link to="/school/requirements"
                className="text-xs text-blue-600 font-semibold bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors">
                Manage →
              </Link>
            </div>
            <div className="space-y-2">
              {vacancies.slice(0, 4).map((v, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase size={13} className="text-blue-600" />
                    </div>
                    <div>
                      <VacancyTypeBadge type={v.type} />
                      <p className="text-gray-500 text-xs mt-0.5">{v.salary}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-sm">{v.numberOfPosts}</p>
                    <p className="text-gray-400 text-[10px]">post{v.numberOfPosts !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              ))}
              {vacancies.length > 4 && (
                <p className="text-center text-xs text-gray-400 pt-1">
                  +{vacancies.length - 4} more vacancies
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-8 text-center mb-6">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Plus size={22} className="text-blue-400" />
            </div>
            <p className="font-bold text-gray-700 mb-1">No vacancies posted yet</p>
            <p className="text-gray-400 text-sm mb-4">Post your teacher requirements to get started</p>
            <Link to="/school/requirements"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
              <Plus size={15} /> Post First Requirement
            </Link>
          </div>
        )}
      </div>

      <SchoolSidebar
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

export default SchoolDashboard;