import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../api';
import Spinner from '../../components/common/Spinner';
import { Search, Eye, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSchools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSchools = () => {
    setLoading(true);
    adminAPI.getSchools({ search, page, limit: 10 })
      .then(({ data }) => { setSchools(data.schools); setTotalPages(data.pages); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSchools(); }, [page]);

  const handleVerify = async (id, isVerified) => {
    try {
      await adminAPI.verifySchool(id, { isVerified: !isVerified });
      toast.success(`School ${!isVerified ? 'verified' : 'unverified'}`);
      fetchSchools();
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Schools</h2>
        <p className="text-gray-500 text-sm mt-1">Manage all registered schools</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); fetchSchools(); }} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search schools..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
        </div>
        <button type="submit" className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">Search</button>
      </form>

      {loading ? <Spinner /> : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['School Name', 'City', 'Type', 'Requirements', 'Verified', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {schools.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No schools found</td></tr>
                ) : schools.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {s.logo ? <img src={s.logo} alt="" className="w-8 h-8 rounded-lg object-cover" /> :
                          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 font-bold text-sm">
                            {s.schoolName?.[0]?.toUpperCase()}
                          </div>}
                        <span className="font-medium text-gray-900 text-sm">{s.schoolName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{s.city || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 capitalize">{s.schoolType || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{s.requirements?.length || 0}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleVerify(s._id, s.isVerified)}
                        className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${s.isVerified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {s.isVerified ? <><CheckCircle className="w-3 h-3" /> Verified</> : <><XCircle className="w-3 h-3" /> Unverified</>}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/admin/schools/${s._id}`} className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors">
                        <Eye className="w-3.5 h-3.5" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminSchools;
