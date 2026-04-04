// src/pages/admin/AdminVacancies.jsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { adminAPI } from '../../api';
import Spinner from '../../components/common/Spinner';
import {
  Plus, Trash2, Edit3, X, Check, Briefcase,
  MapPin, DollarSign, BookOpen, School, ChevronDown,
  ToggleLeft, ToggleRight, Save, AlertCircle
} from 'lucide-react';

const SUBJECTS = ['Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Sanskrit', 'Social Studies', 'History', 'Geography', 'Economics', 'Commerce', 'Computer Science', 'Physical Education', 'Art & Craft', 'Music', 'EVS', 'Other'];
const CLASS_LEVELS = ['Nursery / Pre-Primary', 'KG', 'Class 1–2', 'Class 3–5 (Primary)', 'Class 6–8 (Middle)', 'Class 9–10 (Secondary)', 'Class 11–12 (Senior Secondary)'];

// ─── Vacancy Form (used for add & edit) ────────────────────────────────────
const VacancyForm = ({ onSubmit, defaultValues, onCancel, loading }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues });

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="font-bold text-blue-900 text-sm flex items-center gap-2">
          <Briefcase size={15} />
          {defaultValues ? 'Edit Vacancy' : 'Add New Vacancy'}
        </p>
        {onCancel && (
          <button type="button" onClick={onCancel} className="w-7 h-7 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 hover:bg-blue-300 transition-colors">
            <X size={13} />
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit((d) => { onSubmit(d); if (!defaultValues) reset(); })}
        className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          {/* Title */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Vacancy Title <span className="text-red-400">*</span>
            </label>
            <input {...register('title', { required: 'Title is required' })}
              placeholder="e.g. Mathematics Teacher Needed for Class 9–10"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white
                focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.title && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.title.message}</p>}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Subject <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select {...register('subject', { required: 'Required' })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white
                  focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                <option value="">Select subject</option>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Class level */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Class Level <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select {...register('classLevel', { required: 'Required' })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white
                  focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                <option value="">Select level</option>
                {CLASS_LEVELS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">
              <MapPin size={11} /> Location <span className="text-red-400">*</span>
            </label>
            <input {...register('location', { required: 'Required' })} placeholder="e.g. New Delhi"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white
                focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Salary */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">
              <DollarSign size={11} /> Salary <span className="text-red-400">*</span>
            </label>
            <input {...register('salary', { required: 'Required' })} placeholder="e.g. ₹25,000–₹35,000/month"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white
                focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Additional Details</label>
            <textarea {...register('description')} rows={2}
              placeholder="Experience required, skills, any other info..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white
                focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold
              hover:bg-blue-700 transition-colors disabled:opacity-60 shadow-sm">
            <Check size={14} /> {loading ? 'Saving...' : 'Save Vacancy'}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel}
              className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// ─── Vacancy card ──────────────────────────────────────────────────────────
const VacancyCard = ({ v, onEdit, onDelete, onToggle }) => (
  <div className={`bg-white border rounded-2xl p-4 shadow-sm transition-all ${
    v.isActive ? 'border-gray-100 hover:border-blue-100 hover:shadow-md' : 'border-gray-100 opacity-60'
  }`}>
    <div className="flex items-start justify-between gap-3 mb-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h3 className="font-bold text-gray-900 text-sm">{v.title}</h3>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            v.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
          }`}>
            {v.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
          <span className="flex items-center gap-0.5"><BookOpen size={10} />{v.subject}</span>
          <span className="text-gray-300">·</span>
          <span className="flex items-center gap-0.5"><School size={10} />{v.classLevel}</span>
          <span className="text-gray-300">·</span>
          <span className="flex items-center gap-0.5"><MapPin size={10} />{v.location}</span>
          <span className="text-gray-300">·</span>
          <span className="flex items-center gap-0.5 font-semibold text-emerald-600"><DollarSign size={10} />{v.salary}</span>
        </div>
        {v.description && (
          <p className="text-xs text-gray-400 mt-1.5 line-clamp-1">{v.description}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-1.5 flex-shrink-0">
        <button onClick={() => onToggle(v._id, v.isActive)}
          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
            v.isActive ? 'bg-gray-100 text-gray-500 hover:bg-amber-100 hover:text-amber-600' : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
          }`} title={v.isActive ? 'Deactivate' : 'Activate'}>
          {v.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
        </button>
        <button onClick={() => onEdit(v)}
          className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors">
          <Edit3 size={13} />
        </button>
        <button onClick={() => onDelete(v._id)}
          className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center text-red-500 hover:bg-red-200 transition-colors">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────
const AdminVacancies = () => {
  const [content, setContent]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editVacancy, setEditVacancy] = useState(null);
  const [submitting, setSubmitting]   = useState(false);
  const [filter, setFilter]     = useState('all');

  const fetchContent = () => {
    adminAPI.getContent().then(({ data }) => setContent(data.content || data)).finally(() => setLoading(false));
  };
  useEffect(() => { fetchContent(); }, []);

  const handleAdd = async (data) => {
    setSubmitting(true);
    try {
      await adminAPI.addVacancy(data);
      toast.success('Vacancy added!');
      setShowForm(false);
      fetchContent();
    } catch { toast.error('Failed to add'); }
    finally { setSubmitting(false); }
  };

  const handleUpdate = async (data) => {
    setSubmitting(true);
    try {
      await adminAPI.updateVacancy(editVacancy._id, data);
      toast.success('Vacancy updated!');
      setEditVacancy(null);
      fetchContent();
    } catch { toast.error('Failed to update'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vacancy?')) return;
    try {
      await adminAPI.deleteVacancy(id);
      toast.success('Vacancy deleted');
      fetchContent();
    } catch { toast.error('Failed to delete'); }
  };

  const handleToggle = async (id, isActive) => {
    try {
      await adminAPI.updateVacancy(id, { isActive: !isActive });
      toast.success(`Vacancy ${!isActive ? 'activated' : 'deactivated'}`);
      fetchContent();
    } catch { toast.error('Failed to update'); }
  };

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

  const vacancies = content?.vacancies || [];
  const filtered  = filter === 'active' ? vacancies.filter(v => v.isActive)
                  : filter === 'inactive' ? vacancies.filter(v => !v.isActive)
                  : vacancies;
  const activeCount   = vacancies.filter(v => v.isActive).length;
  const inactiveCount = vacancies.filter(v => !v.isActive).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <Briefcase size={20} className="text-blue-600" /> Vacancies
          </h2>
          <p className="text-gray-400 text-xs mt-0.5">
            {activeCount} active · {inactiveCount} inactive
          </p>
        </div>
        <button onClick={() => { setShowForm(v => !v); setEditVacancy(null); }}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
            showForm ? 'bg-gray-100 text-gray-600' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}>
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? 'Cancel' : 'Add Vacancy'}
        </button>
      </div>

      {/* Add form */}
      {showForm && !editVacancy && (
        <VacancyForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} loading={submitting} />
      )}

      {/* Filter tabs */}
      {vacancies.length > 0 && (
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
          {[
            { key: 'all',      label: `All (${vacancies.length})` },
            { key: 'active',   label: `Active (${activeCount})` },
            { key: 'inactive', label: `Inactive (${inactiveCount})` },
          ].map(t => (
            <button key={t.key} onClick={() => setFilter(t.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === t.key ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Edit form */}
      {editVacancy && (
        <VacancyForm
          defaultValues={{ title: editVacancy.title, subject: editVacancy.subject, classLevel: editVacancy.classLevel, location: editVacancy.location, salary: editVacancy.salary, description: editVacancy.description }}
          onSubmit={handleUpdate}
          onCancel={() => setEditVacancy(null)}
          loading={submitting}
        />
      )}

      {/* Vacancies list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
          <Briefcase size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">
            {vacancies.length === 0 ? 'No vacancies yet' : 'No vacancies match filter'}
          </p>
          {vacancies.length === 0 && (
            <button onClick={() => setShowForm(true)}
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
              <Plus size={14} /> Add First Vacancy
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(v => (
            <VacancyCard key={v._id} v={v}
              onEdit={v => { setEditVacancy(v); setShowForm(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminVacancies;