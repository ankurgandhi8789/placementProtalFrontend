// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../api';
import Spinner from '../../components/common/Spinner';
import {
  Users, School, UserCheck, Clock, TrendingUp,
  ArrowRight, Activity, BarChart3, CheckCircle2
} from 'lucide-react';

// ─── Pipeline stage config ─────────────────────────────────────────────────
const STAGE_CFG = {
  applied:              { label: 'Applied',          bg: 'bg-gray-100',    text: 'text-gray-600',    bar: 'bg-gray-400',    dot: '#9CA3AF' },
  contacted:            { label: 'Contacted',        bg: 'bg-blue-100',    text: 'text-blue-700',    bar: 'bg-blue-500',    dot: '#3B82F6' },
  test_scheduled:       { label: 'Test Scheduled',   bg: 'bg-purple-100',  text: 'text-purple-700',  bar: 'bg-purple-500',  dot: '#8B5CF6' },
  test_completed:       { label: 'Test Completed',   bg: 'bg-indigo-100',  text: 'text-indigo-700',  bar: 'bg-indigo-500',  dot: '#6366F1' },
  interview_scheduled:  { label: 'Interview',        bg: 'bg-amber-100',   text: 'text-amber-700',   bar: 'bg-amber-400',   dot: '#F59E0B' },
  interview_completed:  { label: 'Int. Completed',   bg: 'bg-orange-100',  text: 'text-orange-700',  bar: 'bg-orange-400',  dot: '#F97316' },
  assigned:             { label: 'Assigned',         bg: 'bg-emerald-100', text: 'text-emerald-700', bar: 'bg-emerald-500', dot: '#10B981' },
  completed:            { label: 'Completed',        bg: 'bg-teal-100',    text: 'text-teal-700',    bar: 'bg-teal-500',    dot: '#14B8A6' },
  rejected:             { label: 'Rejected',         bg: 'bg-red-100',     text: 'text-red-700',     bar: 'bg-red-400',     dot: '#EF4444' },
};

// ─── Mini donut chart ──────────────────────────────────────────────────────
const DonutChart = ({ segments, size = 80, stroke = 10 }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const total = segments.reduce((s, seg) => s + seg.value, 0);

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F3F4F6" strokeWidth={stroke} />
      {segments.map((seg, i) => {
        const pct = total > 0 ? seg.value / total : 0;
        const len = pct * circ;
        const el = (
          <circle key={i} cx={size/2} cy={size/2} r={r} fill="none"
            stroke={seg.color} strokeWidth={stroke}
            strokeDasharray={`${len} ${circ - len}`}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
            style={{ transition: 'stroke-dasharray .8s ease' }}
          />
        );
        offset += len;
        return el;
      })}
    </svg>
  );
};

// ─── Stat card ─────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, iconBg, iconColor, valueColor, to }) => {
  const inner = (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-4
      hover:shadow-md hover:border-blue-100 transition-all duration-200 ${to ? 'cursor-pointer' : ''}`}>
      <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center mb-3`}>
        <Icon size={18} className={iconColor} />
      </div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{label}</p>
      <p className={`font-black text-3xl mt-0.5 ${valueColor}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
};

// ─── Main Component ─────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard()
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center py-24"><Spinner size="lg" /></div>
  );

  const breakdown = stats?.statusBreakdown || [];
  const total     = stats?.totalTeachers || 0;
  const assigned  = stats?.assigned || 0;
  const pending   = stats?.pending  || 0;

  // Donut segments from top stages
  const donutSegs = breakdown
    .filter(b => STAGE_CFG[b._id])
    .slice(0, 6)
    .map(b => ({ value: b.count, color: STAGE_CFG[b._id]?.dot || '#9CA3AF' }));

  return (
    <div className="space-y-5">
      {/* Hero summary card */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/4 w-20 h-20 bg-amber-400/10 rounded-full translate-y-1/2" />
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <p className="text-blue-200 text-xs font-semibold mb-1">🎓 Maa Savitri Consultancy</p>
            <h2 className="text-white font-black text-2xl leading-tight">Overview</h2>
            <p className="text-blue-200 text-xs mt-1 leading-relaxed">
              {total} teachers · {stats?.totalSchools || 0} schools registered
            </p>
            <div className="flex items-center gap-3 mt-3">
              <div className="text-center">
                <p className="text-amber-300 font-black text-2xl">{assigned}</p>
                <p className="text-blue-300 text-[10px] font-medium">Placed</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <p className="text-red-300 font-black text-2xl">{pending}</p>
                <p className="text-blue-300 text-[10px] font-medium">Pending</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <p className="text-emerald-300 font-black text-2xl">
                  {total > 0 ? Math.round((assigned / total) * 100) : 0}%
                </p>
                <p className="text-blue-300 text-[10px] font-medium">Success</p>
              </div>
            </div>
          </div>
          {donutSegs.length > 0 && (
            <div className="flex-shrink-0">
              <DonutChart segments={donutSegs} size={90} stroke={11} />
            </div>
          )}
        </div>
      </div>

      {/* Stat cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Users}      label="Teachers"  value={total}                      sub="Registered"        iconBg="bg-blue-50"    iconColor="text-blue-600"    valueColor="text-blue-700"    to="/admin/teachers" />
        <StatCard icon={School}     label="Schools"   value={stats?.totalSchools || 0}   sub="Registered"        iconBg="bg-amber-50"   iconColor="text-amber-500"   valueColor="text-amber-600"   to="/admin/schools" />
        <StatCard icon={UserCheck}  label="Assigned"  value={assigned}                   sub="Placements done"   iconBg="bg-emerald-50" iconColor="text-emerald-600" valueColor="text-emerald-700" />
        <StatCard icon={Clock}      label="Pending"   value={pending}                    sub="Awaiting action"   iconBg="bg-red-50"     iconColor="text-red-500"     valueColor="text-red-600"     />
      </div>

      {/* Pipeline breakdown */}
      {breakdown.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <BarChart3 size={15} className="text-blue-600" />
              Teacher Pipeline
            </h3>
            <Link to="/admin/teachers"
              className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {breakdown.map(({ _id, count }) => {
              const cfg = STAGE_CFG[_id];
              if (!cfg) return null;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={_id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${cfg.bg} ${cfg.text}`}>
                      {cfg.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-700">{count}</span>
                      <span className="text-gray-400 text-[11px]">({pct}%)</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${cfg.bar} rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { to: '/admin/teachers',    icon: Users,        label: 'Manage Teachers',  bg: 'bg-blue-50',    ic: 'text-blue-600'    },
          { to: '/admin/schools',     icon: School,       label: 'Manage Schools',   bg: 'bg-amber-50',   ic: 'text-amber-600'   },
          { to: '/admin/vacancies',   icon: Activity,     label: 'Vacancies',        bg: 'bg-purple-50',  ic: 'text-purple-600'  },
          { to: '/admin/content',     icon: TrendingUp,   label: 'Site Content',     bg: 'bg-emerald-50', ic: 'text-emerald-600' },
        ].map(({ to, icon: Icon, label, bg, ic }) => (
          <Link key={to} to={to}
            className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center gap-2
              hover:shadow-md hover:border-blue-100 transition-all group text-center">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
              <Icon size={18} className={ic} />
            </div>
            <p className="text-xs font-semibold text-gray-700 group-hover:text-blue-600 transition-colors leading-tight">
              {label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;