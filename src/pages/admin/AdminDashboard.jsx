import { useEffect, useState } from 'react';
import { adminAPI } from '../../api';
import Spinner from '../../components/common/Spinner';
import { Users, School, UserCheck, Clock, TrendingUp } from 'lucide-react';

const stageBadge = {
  applied:        'bg-gray-100 text-gray-600',
  registered:     'bg-gray-100 text-gray-600',
  contacted:      'bg-blue-100 text-blue-700',
  test_scheduled: 'bg-purple-100 text-purple-700',
  interview:      'bg-amber-100 text-amber-700',
  assigned:       'bg-emerald-100 text-emerald-700',
  completed:      'bg-teal-100 text-teal-700',
  rejected:       'bg-red-100 text-red-700',
};

const stageBar = {
  applied:        'bg-gray-400',
  registered:     'bg-gray-400',
  contacted:      'bg-blue-500',
  test_scheduled: 'bg-purple-500',
  interview:      'bg-amber-400',
  assigned:       'bg-emerald-500',
  completed:      'bg-teal-500',
  rejected:       'bg-red-500',
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard().then(({ data }) => setStats(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner size="lg" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">Overview of the placement portal</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users,     label: 'Total Teachers', value: stats?.totalTeachers || 0, trend: 'Registered',       iconBg: 'bg-blue-50',    iconColor: 'text-blue-600',    numColor: 'text-blue-600' },
          { icon: School,    label: 'Total Schools',  value: stats?.totalSchools  || 0, trend: 'Registered',       iconBg: 'bg-amber-50',   iconColor: 'text-amber-500',   numColor: 'text-amber-500' },
          { icon: UserCheck, label: 'Assigned',       value: stats?.assigned      || 0, trend: 'Placements done',  iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', numColor: 'text-emerald-600' },
          { icon: Clock,     label: 'Pending',        value: stats?.pending       || 0, trend: 'Awaiting action',  iconBg: 'bg-red-50',     iconColor: 'text-red-500',     numColor: 'text-red-500' },
        ].map(({ icon: Icon, label, value, trend, iconBg, iconColor, numColor }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-blue-200 transition-all duration-200"
          >
            <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
            <p className={`font-extrabold text-2xl ${numColor} mt-1`}>{value}</p>
            <p className="text-emerald-500 text-xs font-semibold mt-1">{trend}</p>
          </div>
        ))}
      </div>

      {/* Pipeline Breakdown */}
      {stats?.statusBreakdown?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-900">Teacher Pipeline Breakdown</h3>
          </div>
          <div className="space-y-3">
            {stats.statusBreakdown.map(({ _id, count }) => {
              const pct = stats.totalTeachers > 0 ? Math.round((count / stats.totalTeachers) * 100) : 0;
              return (
                <div key={_id}>
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${stageBadge[_id] || 'bg-gray-100 text-gray-600'}`}
                    >
                      {_id?.replace('_', ' ')}
                    </span>
                    <span className="text-sm font-semibold text-gray-700">{count} <span className="text-gray-400 font-normal">({pct}%)</span></span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${stageBar[_id] || 'bg-gray-400'} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
