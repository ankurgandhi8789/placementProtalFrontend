// src/pages/admin/AdminTeachers.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../api';
import StatusBadge from '../../components/common/StatusBadge';
import Spinner from '../../components/common/Spinner';
import {
  Search, Eye, ChevronLeft, ChevronRight,
  Users, Filter, X, SlidersHorizontal
} from 'lucide-react';

const ALL_STATUSES = [
  { value: '',                   label: 'All Statuses' },
  { value: 'applied',            label: 'Applied' },
  { value: 'contacted',          label: 'Contacted' },
  { value: 'test_scheduled',     label: 'Test Scheduled' },
  { value: 'test_completed',     label: 'Test Completed' },
  { value: 'interview_scheduled',label: 'Interview' },
  { value: 'interview_completed',label: 'Int. Completed' },
  { value: 'assigned',           label: 'Assigned' },
  { value: 'completed',          label: 'Completed' },
  { value: 'rejected',           label: 'Rejected' },
];

const STAGE_COLORS = {
  applied:              'bg-gray-100 text-gray-600',
  contacted:            'bg-blue-100 text-blue-700',
  test_scheduled:       'bg-purple-100 text-purple-700',
  test_completed:       'bg-indigo-100 text-indigo-700',
  interview_scheduled:  'bg-amber-100 text-amber-700',
  interview_completed:  'bg-orange-100 text-orange-700',
  assigned:             'bg-emerald-100 text-emerald-700',
  completed:            'bg-teal-100 text-teal-700',
  rejected:             'bg-red-100 text-red-700',
};

// ─── Mobile card ─────────────────────────────────────────────────────────
const TeacherCard = ({ t }) => {
  const initials = (t.fullName || t.user?.name || 'T').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const stageCls = STAGE_COLORS[t.currentStatus] || 'bg-gray-100 text-gray-600';
  const stageLabel = ALL_STATUSES.find(s => s.value === t.currentStatus)?.label || t.currentStatus;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-blue-100 transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-900 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm truncate">{t.fullName || t.user?.name}</p>
          <p className="text-gray-400 text-xs truncate">{t.email || t.user?.email}</p>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${stageCls}`}>
          {stageLabel}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {t.subjects?.slice(0, 2).map(s => (
            <span key={s} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{s}</span>
          ))}
          {t.experienceYears ? (
            <span className="text-[10px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full">{t.experienceYears}yr exp</span>
          ) : null}
        </div>
        <Link to={`/admin/teachers/${t._id}`}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors flex-shrink-0">
          <Eye size={12} /> View
        </Link>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────
const AdminTeachers = () => {
  const [teachers, setTeachers]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [status, setStatus]       = useState('');
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]         = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);

  const fetchTeachers = (reset = false) => {
    setLoading(true);
    const pg = reset ? 1 : page;
    if (reset) setPage(1);
    adminAPI.getTeachers({ status, search, page: pg, limit: 10 })
      .then(({ data }) => {
        setTeachers(data.teachers || []);
        setTotalPages(data.pages || 1);
        setTotal(data.total || 0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTeachers(); }, [status, page]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <Users size={20} className="text-blue-600" /> Teachers
          </h2>
          <p className="text-gray-400 text-xs mt-0.5">{total} registered teachers</p>
        </div>
        <button onClick={() => setFilterOpen(o => !o)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-semibold transition-all ${
            filterOpen || status ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
          }`}>
          <SlidersHorizontal size={14} />
          Filter
          {status && <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />}
        </button>
      </div>

      {/* Search + filter bar */}
      <form onSubmit={(e) => { e.preventDefault(); fetchTeachers(true); }}
        className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name or email..."
            className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
          {search && (
            <button type="button" onClick={() => { setSearch(''); fetchTeachers(true); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}
        </div>
        <button type="submit"
          className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
          Search
        </button>
      </form>

      {/* Filter chips */}
      {filterOpen && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-100">
          {ALL_STATUSES.map(s => (
            <button key={s.value} onClick={() => { setStatus(s.value); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                status === s.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}>
              {s.label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : teachers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
          <Users size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No teachers found</p>
          {(search || status) && (
            <button onClick={() => { setSearch(''); setStatus(''); fetchTeachers(true); }}
              className="mt-3 text-blue-600 text-sm font-semibold hover:underline">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Mobile: cards */}
          <div className="lg:hidden space-y-3">
            {teachers.map(t => <TeacherCard key={t._id} t={t} />)}
          </div>

          {/* Desktop: table */}
          <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Teacher', 'Contact', 'Subjects', 'Experience', 'Status', ''].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {teachers.map(t => {
                  const initials = (t.fullName || t.user?.name || 'T').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
                  return (
                    <tr key={t._id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-900 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{t.fullName || t.user?.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{t.email || t.user?.email}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-1 flex-wrap">
                          {t.subjects?.slice(0, 2).map(s => (
                            <span key={s} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{s}</span>
                          ))}
                          {(t.subjects?.length || 0) > 2 && (
                            <span className="text-[10px] text-gray-400">+{t.subjects.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">
                        {t.experienceYears ? `${t.experienceYears} yr${t.experienceYears !== 1 ? 's' : ''}` : '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={t.currentStatus} />
                      </td>
                      <td className="px-5 py-3.5">
                        <Link to={`/admin/teachers/${t._id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600
                            rounded-xl text-xs font-semibold hover:bg-blue-100 transition-colors">
                          <Eye size={13} /> View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
              <p className="text-xs text-gray-500">
                Page <span className="font-bold text-gray-700">{page}</span> of {totalPages}
              </p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600
                    disabled:opacity-40 hover:bg-gray-50 transition-colors">
                  <ChevronLeft size={13} /> Prev
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600
                    disabled:opacity-40 hover:bg-gray-50 transition-colors">
                  Next <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminTeachers;