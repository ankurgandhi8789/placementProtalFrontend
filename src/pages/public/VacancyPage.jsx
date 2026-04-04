import { useEffect, useState } from 'react';
import { publicAPI } from '../../api';
import { Briefcase, MapPin, DollarSign, BookOpen, Search } from 'lucide-react';
import Spinner from '../../components/common/Spinner';


import FloatingHelpButton from '../../components/common/FloatingHelpButton'

const VacancyPage = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    publicAPI.getVacancies()
      .then(({ data }) => setVacancies(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = vacancies.filter(v =>
    v.title?.toLowerCase().includes(search.toLowerCase()) ||
    v.subject?.toLowerCase().includes(search.toLowerCase()) ||
    v.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <FloatingHelpButton></FloatingHelpButton> 
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Current Vacancies</h1>
        <p className="text-gray-500 max-w-xl mx-auto">Browse available teaching positions across top schools in India.</p>
      </div>

      <div className="relative max-w-md mx-auto mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by subject, location..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      {loading ? <Spinner /> : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No vacancies found.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((v) => (
            <div key={v._id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Open</span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">{v.title}</h3>
              <div className="space-y-2 mt-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <BookOpen className="w-4 h-4 text-blue-400" /> {v.subject} — {v.classLevel}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 text-red-400" /> {v.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <DollarSign className="w-4 h-4 text-green-400" /> {v.salary}
                </div>
              </div>
              {v.description && <p className="text-gray-500 text-sm mt-3 line-clamp-2">{v.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VacancyPage;
