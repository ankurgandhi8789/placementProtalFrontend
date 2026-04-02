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
  const [uploadingBanner, setUploadingBanner] = useState(false);
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

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingBanner(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      await adminAPI.addBanner(formData);
      toast.success('Banner added!');
      fetchContent();
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploadingBanner(false);
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

  const handleDeleteBanner = async (id) => {
    if (!confirm('Delete this banner?')) return;
    try {
      await adminAPI.deleteBanner(id);
      toast.success('Banner deleted');
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

  if (loading) return <Spinner size="lg" />;

  const tabs = [
    { key: 'slider', label: 'Slider Images', icon: Image },
    { key: 'banners', label: 'Banners', icon: Image },
    { key: 'stats', label: 'Stats', icon: BarChart2 },
    { key: 'contact', label: 'Contact Info', icon: Phone },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Site Content</h2>
        <p className="text-gray-500 text-sm mt-1">Manage homepage content, images, and settings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === key ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* Slider Images */}
      {activeTab === 'slider' && (
        <div className="space-y-4">
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            {uploadingSlider ? 'Uploading...' : 'Upload Slider Image'}
            <input type="file" accept="image/*" className="hidden" onChange={handleSliderUpload} disabled={uploadingSlider} />
          </label>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {content?.sliderImages?.map((img) => (
              <div key={img._id} className="relative group rounded-xl overflow-hidden border border-gray-100">
                <img src={img.url} alt={img.title || 'Slider'} className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => handleDeleteSlider(img._id)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {img.title && <div className="p-2 bg-white"><p className="text-xs font-medium text-gray-700">{img.title}</p></div>}
              </div>
            ))}
            {(!content?.sliderImages || content.sliderImages.length === 0) && (
              <div className="col-span-3 text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">
                <Image className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>No slider images yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Banners */}
      {activeTab === 'banners' && (
        <div className="space-y-4">
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            {uploadingBanner ? 'Uploading...' : 'Upload Banner'}
            <input type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} disabled={uploadingBanner} />
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            {content?.banners?.map((banner) => (
              <div key={banner._id} className="relative group rounded-xl overflow-hidden border border-gray-100">
                <img src={banner.url} alt={banner.title || 'Banner'} className="w-full h-32 object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => handleDeleteBanner(banner._id)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {(!content?.banners || content.banners.length === 0) && (
              <div className="col-span-2 text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">
                <Image className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>No banners yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      {activeTab === 'stats' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-lg">
          <h3 className="font-semibold text-gray-900 mb-4">Homepage Statistics</h3>
          <form onSubmit={handleStats(onSaveStats)} className="space-y-4">
            {[
              { name: 'happyClients', label: 'Happy Clients' },
              { name: 'successfulPlacements', label: 'Successful Placements' },
              { name: 'conversionRate', label: 'Conversion Rate (%)' },
              { name: 'awards', label: 'Awards Won' },
            ].map(({ name, label }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input {...regStats(name, { valueAsNumber: true })} type="number"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
            ))}
            <button type="submit" disabled={savingStats}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
              <Save className="w-4 h-4" /> {savingStats ? 'Saving...' : 'Save Stats'}
            </button>
          </form>
        </div>
      )}

      {/* Contact Info */}
      {activeTab === 'contact' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-lg">
          <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
          <form onSubmit={handleContact(onSaveContact)} className="space-y-4">
            {[
              { name: 'phone', label: 'Phone', placeholder: '+91 98765 43210' },
              { name: 'email', label: 'Email', placeholder: 'info@maasavitri.com' },
              { name: 'address', label: 'Address', placeholder: 'New Delhi, India' },
              { name: 'facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/...' },
              { name: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
              { name: 'twitter', label: 'Twitter/X URL', placeholder: 'https://twitter.com/...' },
              { name: 'whatsapp', label: 'WhatsApp Number', placeholder: '+91 98765 43210' },
              { name: 'telegram', label: 'Telegram URL', placeholder: 'https://t.me/...' },
            ].map(({ name, label, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input {...regContact(name)} placeholder={placeholder}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
            ))}
            <button type="submit" disabled={savingContact}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
              <Save className="w-4 h-4" /> {savingContact ? 'Saving...' : 'Save Contact Info'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminContent;
