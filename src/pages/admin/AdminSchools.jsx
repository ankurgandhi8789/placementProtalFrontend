// src/pages/admin/AdminSchools.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../api';
import Spinner from '../../components/common/Spinner';
import {
  Search, Eye, CheckCircle, XCircle,
  ChevronLeft, ChevronRight, School, X, Building2
} from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Mobile card ─────────────────────────────────────────────────────────
const SchoolCard = ({ s, onVerify }) => {
  const initials = (s.schoolName || 'S').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-blue-100 transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {s.logo ? <img src={s.logo} alt="" className="w-full h-full object-cover" /> :
            <span className="font-bold text-amber-600 text-sm">{initials}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm truncate">{s.schoolName}</p>
          <p className="text-gray-400 text-xs">
            {[s.city, s.state].filter(Boolean).join(', ') || '—'}
          </p>
        </div>
        <button onClick={() => onVerify(s._id, s.isVerified)}
          className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 transition-all ${
            s.isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500 hover:bg-amber-100 hover:text-amber-700'
          }`}>
          {s.isVerified ? <CheckCircle size={10} /> : <XCircle size={10} />}
          {s.isVerified ? 'Verified' : 'Verify'}
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <span className="text-[10px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
            {s.vacancies?.length || 0} vacancies
          </span>
          {s.accommodationProvided && (
            <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Accom.</span>
          )}
        </div>
        <Link to={`/admin/schools/${s._id}`}
          className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 text-white rounded-xl text-xs font-semibold hover:bg-amber-600 transition-colors">
          <Eye size={12} /> View
        </Link>
      </div>
    </div>
  );
};

const AdminSchools = () => {
  const [schools, setSchools]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]         = useState(0);

  const fetchSchools = (reset = false) => {
    setLoading(true);
    const pg = reset ? 1 : page;
    if (reset) setPage(1);
    adminAPI.getSchools({ search, page: pg, limit: 10 })
      .then(({ data }) => {
        setSchools(data.schools || []);
        setTotalPages(data.pages || 1);
        setTotal(data.total || 0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSchools(); }, [page]);

  const handleVerify = async (id, isVerified) => {
    try {
      await adminAPI.verifySchool(id, { isVerified: !isVerified });
      toast.success(`School ${!isVerified ? 'verified' : 'unverified'}`);
      fetchSchools();
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <School size={20} className="text-amber-600" /> Schools
          </h2>
          <p className="text-gray-400 text-xs mt-0.5">{total} registered schools</p>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); fetchSchools(true); }} className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search schools..."
            className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
          {search && (
            <button type="button" onClick={() => { setSearch(''); fetchSchools(true); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <X size={14} />
            </button>
          )}
        </div>
        <button type="submit" className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
          Search
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : schools.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
          <School size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No schools found</p>
        </div>
      ) : (
        <>
          {/* Mobile: cards */}
          <div className="lg:hidden space-y-3">
            {schools.map(s => <SchoolCard key={s._id} s={s} onVerify={handleVerify} />)}
          </div>

          {/* Desktop: table */}
          <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['School', 'Location', 'Director Contact', 'Vacancies', 'Facilities', 'Verified', ''].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {schools.map(s => {
                  const initials = (s.schoolName || 'S').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
                  return (
                    <tr key={s._id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {s.logo ? <img src={s.logo} alt="" className="w-full h-full object-cover" /> :
                              <span className="font-bold text-amber-600 text-xs">{initials}</span>}
                          </div>
                          <p className="font-semibold text-gray-900 text-sm">{s.schoolName}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">
                        {[s.city, s.state].filter(Boolean).join(', ') || '—'}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{s.directorContact || '—'}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-600 font-semibold">
                        {s.vacancies?.length || 0}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-1 flex-wrap">
                          {s.accommodationProvided && (
                            <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-semibold">Accom.</span>
                          )}
                          {s.healthInsuranceProvided && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full font-semibold">Health</span>
                          )}
                          {!s.accommodationProvided && !s.healthInsuranceProvided && (
                            <span className="text-[10px] text-gray-300">None</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => handleVerify(s._id, s.isVerified)}
                          className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full transition-all ${
                            s.isVerified ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-gray-100 text-gray-500 hover:bg-amber-100 hover:text-amber-700'
                          }`}>
                          {s.isVerified ? <CheckCircle size={11} /> : <XCircle size={11} />}
                          {s.isVerified ? 'Verified' : 'Verify'}
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <Link to={`/admin/schools/${s._id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-xl text-xs font-semibold hover:bg-amber-100 transition-colors">
                          <Eye size={13} /> View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
              <p className="text-xs text-gray-500">Page <span className="font-bold">{page}</span> of {totalPages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold disabled:opacity-40 hover:bg-gray-50">
                  <ChevronLeft size={13} /> Prev
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold disabled:opacity-40 hover:bg-gray-50">
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

export default AdminSchools;