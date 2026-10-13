import React, { useEffect, useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  Check,
  X,
  Eye,
  EyeOff,
  Save,
  Search,
  Sparkles,
} from 'lucide-react';
import apiClient from '../../api/apiClient';
import Loader from '../../components/common/Loader';
import { useSettings } from '../../context/SettingsContext';

const AdminTreatmentsPage = () => {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTreatment, setEditingTreatment] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [isSeoManuallyEdited, setIsSeoManuallyEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { refreshSettings } = useSettings();

  const fetchTreatments = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/treatments/admin/all');
      if (res.data.success) {
        setTreatments(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin treatments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreatments();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', 'treatments');

    try {
      setUploadingImage(true);
      const res = await apiClient.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setEditingTreatment((prev) => ({
          ...prev,
          heroImage: {
            public_id: res.data.data.public_id,
            secure_url: res.data.data.secure_url,
            alt: prev.title || 'Treatment photo',
          },
        }));
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Failed to upload image to Cloudinary.');
    } finally {
      setUploadingImage(false);
    }
  };

  const generateBestSEO = (treatmentTitle, category) => {
    const t = (treatmentTitle || '').trim();
    if (!t) return { seoTitle: '', seoDescription: '' };

    const catText = category && category !== 'General' ? ` (${category})` : '';
    const seoTitle = `${t}${catText} in Jhunjhunu | Painless Dental Care - Shree Shyam Dental Hospital`;
    const seoDescription = `Looking for the best ${t.toLowerCase()} in Jhunjhunu? Shree Shyam Dental Hospital provides advanced, painless ${t.toLowerCase()} by experienced dental surgeons with 100% sterile hospital protocols. Book an appointment today!`;

    return { seoTitle, seoDescription };
  };

  const handleTitleChange = (newTitle) => {
    setEditingTreatment((prev) => {
      const updated = { ...prev, title: newTitle };
      if (isNew && !isSeoManuallyEdited) {
        const seo = generateBestSEO(newTitle, prev?.category);
        updated.seoTitle = seo.seoTitle;
        updated.seoDescription = seo.seoDescription;
      }
      return updated;
    });
  };

  const handleCategoryChange = (newCategory) => {
    setEditingTreatment((prev) => {
      const updated = { ...prev, category: newCategory };
      if (isNew && !isSeoManuallyEdited && prev?.title?.trim()) {
        const seo = generateBestSEO(prev.title, newCategory);
        updated.seoTitle = seo.seoTitle;
        updated.seoDescription = seo.seoDescription;
      }
      return updated;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) {
        await apiClient.post('/treatments', editingTreatment);
      } else {
        await apiClient.put(`/treatments/${editingTreatment._id}`, editingTreatment);
      }
      setEditingTreatment(null);
      setIsNew(false);
      fetchTreatments();
      refreshSettings();
    } catch (err) {
      console.error('Error saving treatment:', err);
      alert(err.response?.data?.message || 'Error saving treatment.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this treatment?')) return;
    try {
      await apiClient.delete(`/treatments/${id}`);
      fetchTreatments();
      refreshSettings();
    } catch (err) {
      console.error('Error deleting treatment:', err);
    }
  };

  const startNewTreatment = () => {
    setIsNew(true);
    setIsSeoManuallyEdited(false);
    setEditingTreatment({
      title: '',
      slug: '',
      shortDescription: '',
      detailedContent: '',
      category: 'General',
      duration: '',
      recoveryTime: '',
      anesthesia: '',
      isPopular: false,
      isPublished: true,
      order: treatments.length + 1,
      heroImage: {
        public_id: '',
        secure_url: '',
        alt: '',
      },
      benefits: [],
      process: [],
      faqs: [],
      seoTitle: '',
      seoDescription: '',
    });
  };

  const handleEditClick = (t) => {
    setIsNew(false);
    setIsSeoManuallyEdited(Boolean(t.seoTitle || t.seoDescription));
    setEditingTreatment({
      ...t,
      heroImage: t.heroImage || { public_id: '', secure_url: '', alt: '' },
    });
  };

  const filtered = treatments.filter((t) =>
    t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
            16 Specialised Treatments CMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage procedures, Cloudinary images, benefits, process workflows, and SEO metadata.
          </p>
        </div>

        <button
          onClick={startNewTreatment}
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-teal-600/20 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Treatment</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search treatments by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
          />
        </div>
        <span className="text-xs text-slate-500 font-semibold">
          Total: {treatments.length}
        </span>
      </div>

      {/* Treatments List Grid */}
      {loading ? (
        <Loader message="Loading treatments..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((t) => (
            <div
              key={t._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between p-4 space-y-3"
            >
              <div className="space-y-3">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={t.heroImage?.secure_url}
                    alt={t.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-900/80 text-teal-300 backdrop-blur-xs">
                    {t.category}
                  </span>
                  {t.isPopular && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500 text-white shadow-xs">
                      Popular
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900 line-clamp-1">
                    {t.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {t.shortDescription}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className={`flex items-center gap-1 font-semibold ${t.isPublished ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {t.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{t.isPublished ? 'Live' : 'Draft'}</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditClick(t)}
                    className="p-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Modal Form */}
      {editingTreatment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl text-left my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="font-heading font-bold text-xl text-slate-900">
                {isNew ? 'Create New Treatment' : `Edit: ${editingTreatment.title}`}
              </h2>
              <button
                onClick={() => setEditingTreatment(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Treatment Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Painless Root Canal (RCT), Dental Implants"
                    value={editingTreatment.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingTreatment.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 cursor-pointer"
                  >
                    {['Implants', 'Cosmetic', 'Restorative', 'General', 'Orthodontics', 'Pediatric', 'Surgical'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block font-semibold text-slate-700 mb-2">Cloudinary Hero Image</label>
                <div className="flex items-center gap-4">
                  {editingTreatment.heroImage?.secure_url ? (
                    <div className="relative group">
                      <img
                        src={editingTreatment.heroImage.secure_url}
                        alt="Preview"
                        className="w-24 h-16 object-cover rounded-xl border border-slate-200 shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setEditingTreatment((prev) => ({
                            ...prev,
                            heroImage: { public_id: '', secure_url: '', alt: '' },
                          }))
                        }
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs hover:bg-red-700 shadow-xs cursor-pointer"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-16 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400 text-xs font-medium">
                      No Image
                    </div>
                  )}
                  <label className="inline-flex items-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-800 px-4 py-2.5 rounded-xl cursor-pointer border border-teal-200 font-semibold transition-colors text-xs">
                    <Upload className="w-4 h-4" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Description (for cards) *</label>
                <textarea
                  rows="2"
                  required
                  placeholder="Short 1-2 sentence summary for treatment cards..."
                  value={editingTreatment.shortDescription}
                  onChange={(e) => setEditingTreatment({ ...editingTreatment, shortDescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Content (Full Overview) *</label>
                <textarea
                  rows="5"
                  required
                  placeholder="Comprehensive treatment description, clinical indications, procedure details..."
                  value={editingTreatment.detailedContent}
                  onChange={(e) => setEditingTreatment({ ...editingTreatment, detailedContent: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 45 mins"
                    value={editingTreatment.duration || ''}
                    onChange={(e) => setEditingTreatment({ ...editingTreatment, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Recovery</label>
                  <input
                    type="text"
                    placeholder="e.g. Immediate"
                    value={editingTreatment.recoveryTime || ''}
                    onChange={(e) => setEditingTreatment({ ...editingTreatment, recoveryTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Anaesthesia</label>
                  <input
                    type="text"
                    placeholder="e.g. Painless Local"
                    value={editingTreatment.anesthesia || ''}
                    onChange={(e) => setEditingTreatment({ ...editingTreatment, anesthesia: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={editingTreatment.isPopular}
                    onChange={(e) => setEditingTreatment({ ...editingTreatment, isPopular: e.target.checked })}
                    className="rounded text-teal-600 w-4 h-4"
                  />
                  <span>Mark as Popular on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={editingTreatment.isPublished}
                    onChange={(e) => setEditingTreatment({ ...editingTreatment, isPublished: e.target.checked })}
                    className="rounded text-teal-600 w-4 h-4"
                  />
                  <span>Publish / Active on Live Website</span>
                </label>
              </div>

              {/* SEO Inputs with Auto-Fill */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-teal-700 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      <span>SEO Metadata (Search Engine Optimization)</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Auto-generated based on treatment name for Google ranking in Jhunjhunu.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const seo = generateBestSEO(editingTreatment.title, editingTreatment.category);
                      setEditingTreatment((prev) => ({
                        ...prev,
                        seoTitle: seo.seoTitle,
                        seoDescription: seo.seoDescription,
                      }));
                      setIsSeoManuallyEdited(false);
                    }}
                    disabled={!editingTreatment.title?.trim()}
                    className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 disabled:opacity-40 text-teal-800 text-[11px] font-semibold border border-teal-200 cursor-pointer transition-colors shadow-2xs"
                    title="Click to auto-generate optimal SEO title and description"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>Auto Fill Best SEO</span>
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-600 font-medium">Custom SEO Title</label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {(editingTreatment.seoTitle || '').length} chars
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Dental Implants in Jhunjhunu | Painless Dental Care - Shree Shyam Dental Hospital"
                    value={editingTreatment.seoTitle || ''}
                    onChange={(e) => {
                      setIsSeoManuallyEdited(true);
                      setEditingTreatment({ ...editingTreatment, seoTitle: e.target.value });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-600 font-medium">Meta Description</label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {(editingTreatment.seoDescription || '').length} chars
                    </span>
                  </div>
                  <textarea
                    rows="2"
                    placeholder="Search engine snippet description..."
                    value={editingTreatment.seoDescription || ''}
                    onChange={(e) => {
                      setIsSeoManuallyEdited(true);
                      setEditingTreatment({ ...editingTreatment, seoDescription: e.target.value });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTreatment(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Treatment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTreatmentsPage;
