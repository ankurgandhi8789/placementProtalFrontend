import { useEffect, useState } from 'react';
import { publicAPI } from '../../api';
import { Briefcase, MapPin, DollarSign, BookOpen, Search, School } from 'lucide-react';
import Spinner from '../../components/common/Spinner';
import FloatingHelpButton from '../../components/common/FloatingHelpButton';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <FloatingHelpButton />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 py-2 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs rounded-full bg-white/10 border border-white/20 text-white/80">
            <Briefcase size={12} />
            <span>Current Openings</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Teaching Vacancies</h1>
          <p className="text-blue-200 max-w-xl mx-auto text-sm sm:text-base">
            Browse available teaching positions across top schools in Bihar and Eastern UP
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by subject, location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-400">No vacancies found.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-5">
            {filtered.map((v) => (
              <div
                key={v._id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-blue-200"
              >
                {/* Mobile-First Layout */}
                <div className="flex flex-col sm:flex-row">
                  {/* Image Section */}
                  {v.image && (
                    <div className="w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
                      <img
                        src={v.image}
                        alt={v.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Content Section */}
                  <div className="flex-1 p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">
                            Open
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-2">
                          {v.title}
                        </h3>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BookOpen className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="truncate">{v.subject}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <School className="w-4 h-4 text-purple-500 flex-shrink-0" />
                        <span className="truncate">{v.classLevel}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span className="truncate">{v.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                        <DollarSign className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{v.salary}</span>
                      </div>
                    </div>

                    {/* Description */}
                    {v.description && (
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
                        {v.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VacancyPage;
