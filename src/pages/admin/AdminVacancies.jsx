import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { adminAPI } from '../../api';
import Spinner from '../../components/common/Spinner';
import { Plus, Trash2, Edit2, X, Check, Briefcase } from 'lucide-react';

const subjects = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Physical Education', 'Art', 'Music', 'Other'];
const classLevels = ['Nursery', 'KG', 'Class 1-5', 'Class 6-8', 'Class 9-10', 'Class 11-12'];

const VacancyForm = ({ onSubmit, defaultValues, onCancel, loading }) => {
  const { register, handleSubmit, reset } = useForm({ defaultValues });
  return (
    <form onSubmit={handleSubmit((d) => { onSubmit(d); reset(); })} className="bg-blue-50 rounded-xl p-5 space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input {...register('title', { required: true })} placeholder="e.g. Math Teacher Needed"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
          <select {...register('subject', { required: true })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
            <option value="">Select subject</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class Level *</label>
          <select {...register('classLevel', { required: true })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
            <option value="">Select level</option>
            {classLevels.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
          <input {...register('location', { required: true })} placeholder="e.g. New Delhi"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Salary *</label>
          <input {...register('salary', { required: true })} placeholder="e.g. ₹25,000/month"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input {...register('description')} placeholder="Additional details"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white" />
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={loading}
          className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
          <Check className="w-4 h-4" /> {loading ? 'Saving...' : 'Save'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50">
            <X className="w-4 h-4" /> Cancel
          </button>
        )}
      </div>
    </form>
  );
};

const AdminVacancies = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchContent = () => {
    adminAPI.getContent().then(({ data }) => setContent(data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchContent(); }, []);

  const handleAdd = async (data) => {
    setSubmitting(true);
    try {
      await adminAPI.addVacancy(data);
      toast.success('Vacancy added!');
      setShowForm(false);
      fetchContent();
    } catch {
      toast.error('Failed to add vacancy');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data) => {
    setSubmitting(true);
    try {
      await adminAPI.updateVacancy(editId, data);
      toast.success('Vacancy updated!');
      setEditId(null);
      fetchContent();
    } catch {
      toast.error('Failed to update');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this vacancy?')) return;
    try {
      await adminAPI.deleteVacancy(id);
      toast.success('Vacancy deleted');
      fetchContent();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleToggle = async (id, isActive) => {
    try {
      await adminAPI.updateVacancy(id, { isActive: !isActive });
      toast.success(`Vacancy ${!isActive ? 'activated' : 'deactivated'}`);
      fetchContent();
    } catch {
      toast.error('Failed to update');
    }
  };

  if (loading) return <Spinner size="lg" />;

  const vacancies = content?.vacancies || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vacancies</h2>
          <p className="text-gray-500 text-sm mt-1">Manage public vacancy listings</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Vacancy
        </button>
      </div>

      {showForm && <VacancyForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} loading={submitting} />}

      {vacancies.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">No vacancies yet. Add your first vacancy!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {vacancies.map((v) => (
            <div key={v._id} className="bg-white rounded-2xl border border-gray-100 p-5">
              {editId === v._id ? (
                <VacancyForm
                  defaultValues={{ title: v.title, subject: v.subject, classLevel: v.classLevel, location: v.location, salary: v.salary, description: v.description }}
                  onSubmit={handleUpdate}
                  onCancel={() => setEditId(null)}
                  loading={submitting}
                />
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{v.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${v.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {v.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{v.subject} • {v.classLevel} • {v.location} • {v.salary}</p>
                    {v.description && <p className="text-xs text-gray-400 mt-1">{v.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleToggle(v._id, v.isActive)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${v.isActive ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                      {v.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => setEditId(v._id)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(v._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminVacancies;
