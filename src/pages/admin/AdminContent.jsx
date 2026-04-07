import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { adminAPI } from '../../api';
import Spinner from '../../components/common/Spinner';
import { Upload, Trash2, Image, BarChart2, Phone, Save } from 'lucide-react';

const AdminContent = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingSlider, setUploadingSlider] = useState(false);

  const [savingStats, setSavingStats] = useState(false);
  const [savingContact, setSavingContact] = useState(false);
  const [activeTab, setActiveTab] = useState('slider');

  const { register: regStats, handleSubmit: handleStats, reset: resetStats } = useForm();
  const { register: regContact, handleSubmit: handleContact, reset: resetContact } = useForm();

  const fetchContent = () => {
    adminAPI.getContent().then(({ data }) => {
      setContent(data);
      resetStats(data.stats);
      resetContact(data.contactInfo);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchContent(); }, []);

  const handleSliderUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingSlider(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      await adminAPI.addSliderImage(formData);
      toast.success('Slider image added!');
      fetchContent();
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploadingSlider(false);
      e.target.value = '';
    }
  };



  const handleDeleteSlider = async (id) => {
    if (!confirm('Delete this image?')) return;
    try {
      await adminAPI.deleteSliderImage(id);
      toast.success('Image deleted');
      fetchContent();
    } catch { toast.error('Failed to delete'); }
  };



  const onSaveStats = async (data) => {
    setSavingStats(true);
    try {
      await adminAPI.updateStats(data);
      toast.success('Stats updated!');
    } catch { toast.error('Failed to update stats'); }
    finally { setSavingStats(false); }
  };

  const onSaveContact = async (data) => {
    setSavingContact(true);
    try {
      await adminAPI.updateContactInfo(data);
      toast.success('Contact info updated!');
    } catch { toast.error('Failed to update'); }
    finally { setSavingContact(false); }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-24">
      <Spinner size="lg" />
    </div>
  );

  const tabs = [
    { key: 'slider',  label: 'Slider Images', icon: Image    },
    { key: 'stats',   label: 'Stats',          icon: BarChart2},
    { key: 'contact', label: 'Contact Info',   icon: Phone    },
  ];

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">Site Content</h2>
        <p className="text-gray-400 text-sm mt-1">Manage homepage images, statistics, and contact info</p>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 w-full sm:w-fit overflow-x-auto">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold
              transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {/* ── Slider Images ── */}
      {activeTab === 'slider' && (
        <div className="space-y-4">

          {/* Upload button */}
          <label className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
            cursor-pointer transition-all shadow-sm ${
            uploadingSlider
              ? 'bg-blue-400 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
          }`}>
            <Upload size={15} />
            {uploadingSlider ? 'Uploading...' : 'Upload Slider Image'}
            <input
              type="file" accept="image/*" className="hidden"
              onChange={handleSliderUpload} disabled={uploadingSlider}
            />
          </label>

          {/* Grid */}
          {(!content?.sliderImages || content.sliderImages.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-14 bg-white
              rounded-2xl border border-dashed border-gray-200 text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                <Image size={24} className="text-gray-300" />
              </div>
              <p className="text-gray-400 font-medium text-sm">No slider images yet</p>
              <p className="text-gray-300 text-xs mt-1">Upload your first image above</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {content.sliderImages.map((img) => (
                <div key={img._id}
                  className="relative group rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50"
                  style={{ aspectRatio: '210/297' }}>
                  <img
                    src={img.url} alt={img.title || 'Slider'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent
                    opacity-0 group-hover:opacity-100 transition-opacity
                    flex items-end justify-between p-3">
                    {img.title && (
                      <p className="text-white text-xs font-semibold truncate">{img.title}</p>
                    )}
                    <button
                      onClick={() => handleDeleteSlider(img._id)}
                      className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-xl
                        flex items-center justify-center transition-colors ml-auto flex-shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Stats ── */}
      {activeTab === 'stats' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 max-w-lg">
          <h3 className="font-bold text-gray-900 text-sm mb-4">Homepage Statistics</h3>
          <form onSubmit={handleStats(onSaveStats)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'happyClients',         label: 'Happy Clients'       },
                { name: 'successfulPlacements', label: 'Successful Placements'},
                { name: 'conversionRate',       label: 'Conversion Rate (%)'  },
                { name: 'awards',               label: 'Awards Won'           },
              ].map(({ name, label }) => (
                <div key={name} className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">
                    {label}
                  </label>
                  <input
                    {...regStats(name, { valueAsNumber: true })}
                    type="number"
                    className="w-full bg-transparent text-xl font-black text-gray-900
                      focus:outline-none placeholder:text-gray-300"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
            <button
              type="submit" disabled={savingStats}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800
                text-white rounded-xl text-sm font-bold shadow-sm hover:shadow-md
                transition-all disabled:opacity-60 w-full justify-center"
            >
              <Save size={15} />
              {savingStats ? 'Saving...' : 'Save Statistics'}
            </button>
          </form>
        </div>
      )}

      {/* ── Contact Info ── */}
      {activeTab === 'contact' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 max-w-lg">
          <h3 className="font-bold text-gray-900 text-sm mb-4">Contact Information</h3>
          <form onSubmit={handleContact(onSaveContact)} className="space-y-3">
            {[
              { name: 'phone',     label: 'Phone',          placeholder: '+91 98765 43210'          },
              { name: 'email',     label: 'Email',          placeholder: 'info@maasavitri.com'      },
              { name: 'address',   label: 'Address',        placeholder: 'New Delhi, India'         },
              { name: 'facebook',  label: 'Facebook URL',   placeholder: 'https://facebook.com/...' },
              { name: 'instagram', label: 'Instagram URL',  placeholder: 'https://instagram.com/...' },
              { name: 'twitter',   label: 'Twitter/X URL',  placeholder: 'https://twitter.com/...'  },
              { name: 'whatsapp',  label: 'WhatsApp Number',placeholder: '+91 98765 43210'          },
              { name: 'telegram',  label: 'Telegram URL',   placeholder: 'https://t.me/...'         },
            ].map(({ name, label, placeholder }) => (
              <div key={name}>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  {label}
                </label>
                <input
                  {...regContact(name)}
                  placeholder={placeholder}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    hover:border-blue-200 transition-colors"
                />
              </div>
            ))}
            <button
              type="submit" disabled={savingContact}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800
                text-white rounded-xl text-sm font-bold shadow-sm hover:shadow-md
                transition-all disabled:opacity-60 w-full justify-center mt-2"
            >
              <Save size={15} />
              {savingContact ? 'Saving...' : 'Save Contact Info'}
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default AdminContent;