import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Upload, Save, X, Clock, CheckCircle } from 'lucide-react';
import apiClient from '../../api/apiClient';
import Loader from '../../components/common/Loader';
import BeforeAfterSlider from '../../components/common/BeforeAfterSlider';

const AdminBeforeAfterPage = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCase, setEditingCase] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingBefore, setUploadingBefore] = useState(false);
  const [uploadingAfter, setUploadingAfter] = useState(false);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/before-after/admin/all');
      if (res.data.success) {
        setCases(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching before/after cases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', 'before_after');

    const setLoader = type === 'before' ? setUploadingBefore : setUploadingAfter;

    try {
      setLoader(true);
      const res = await apiClient.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        if (type === 'before') {
          setEditingCase((prev) => ({
            ...prev,
            beforeImage: {
              public_id: res.data.data.public_id,
              secure_url: res.data.data.secure_url,
              alt: 'Before case photo',
            },
          }));
        } else {
          setEditingCase((prev) => ({
            ...prev,
            afterImage: {
              public_id: res.data.data.public_id,
              secure_url: res.data.data.secure_url,
              alt: 'After case photo',
            },
          }));
        }
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Upload failed.');
    } finally {
      setLoader(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) {
        await apiClient.post('/before-after', editingCase);
      } else {
        await apiClient.put(`/before-after/${editingCase._id}`, editingCase);
      }
      setEditingCase(null);
      setIsNew(false);
      fetchCases();
    } catch (err) {
      console.error('Error saving case:', err);
      alert('Error saving case.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this case study?')) return;
    try {
      await apiClient.delete(`/before-after/${id}`);
      fetchCases();
    } catch (err) {
      console.error('Error deleting case:', err);
    }
  };

  const startNew = () => {
    setIsNew(true);
    setEditingCase({
      patientName: '',
      age: '',
      treatmentName: '',
      treatmentCategory: 'Cosmetic Dentistry',
      treatmentDuration: '',
      description: '',
      doctorNotes: '',
      isFeatured: false,
      isPublished: true,
      order: cases.length + 1,
      beforeImage: {
        public_id: '',
        secure_url: '',
        alt: '',
      },
      afterImage: {
        public_id: '',
        secure_url: '',
        alt: '',
      },
    });
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
            Before & After Cases Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage real patient transformations and interactive horizontal comparison sliders.
          </p>
        </div>

        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-teal-600/20 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Transformation Case</span>
        </button>
      </div>

      {loading ? (
        <Loader message="Loading before & after cases..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cases.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md p-4 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="rounded-xl overflow-hidden border border-slate-100 shadow-xs">
                  <BeforeAfterSlider item={item} />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-xs font-semibold ${item.isPublished ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {item.isPublished ? 'Live on Site' : 'Draft'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsNew(false);
                      setEditingCase(item);
                    }}
                    className="p-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 transition-colors cursor-pointer"
                    title="Edit Case"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
                    title="Delete Case"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Case Modal */}
      {editingCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl text-left my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="font-heading font-bold text-xl text-slate-900">
                {isNew ? 'New Transformation Case' : `Edit: ${editingCase.patientName}`}
              </h2>
              <button
                onClick={() => setEditingCase(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Patient Name</label>
                  <input
                    type="text"
                    required
                    value={editingCase.patientName}
                    onChange={(e) => setEditingCase({ ...editingCase, patientName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Patient Age</label>
                  <input
                    type="text"
                    value={editingCase.age || ''}
                    onChange={(e) => setEditingCase({ ...editingCase, age: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Treatment Title *</label>
                  <input
                    type="text"
                    required
                    value={editingCase.treatmentName}
                    onChange={(e) => setEditingCase({ ...editingCase, treatmentName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Treatment Duration</label>
                  <input
                    type="text"
                    value={editingCase.treatmentDuration || ''}
                    onChange={(e) => setEditingCase({ ...editingCase, treatmentDuration: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Before and After Image Uploads */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                {/* Before Image */}
                <div className="space-y-2">
                  <label className="block font-semibold text-teal-800">Before Photo</label>
                  {editingCase.beforeImage?.secure_url ? (
                    <div className="relative group">
                      <img
                        src={editingCase.beforeImage.secure_url}
                        alt="Before"
                        className="w-full aspect-[4/3] object-cover rounded-xl border border-slate-200 shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setEditingCase((prev) => ({
                            ...prev,
                            beforeImage: { public_id: '', secure_url: '', alt: '' },
                          }))
                        }
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs hover:bg-red-700 shadow-md cursor-pointer"
                        title="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-slate-300 bg-white flex items-center justify-center text-slate-400 text-xs font-medium">
                      No Before Photo
                    </div>
                  )}
                  <label className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 py-2 rounded-xl cursor-pointer border border-slate-300 font-semibold shadow-2xs">
                    <Upload className="w-4 h-4 text-teal-600" />
                    <span>{uploadingBefore ? 'Uploading...' : 'Upload Before Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUpload(e, 'before')}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* After Image */}
                <div className="space-y-2">
                  <label className="block font-semibold text-teal-800">After Photo</label>
                  {editingCase.afterImage?.secure_url ? (
                    <div className="relative group">
                      <img
                        src={editingCase.afterImage.secure_url}
                        alt="After"
                        className="w-full aspect-[4/3] object-cover rounded-xl border border-slate-200 shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setEditingCase((prev) => ({
                            ...prev,
                            afterImage: { public_id: '', secure_url: '', alt: '' },
                          }))
                        }
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs hover:bg-red-700 shadow-md cursor-pointer"
                        title="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-slate-300 bg-white flex items-center justify-center text-slate-400 text-xs font-medium">
                      No After Photo
                    </div>
                  )}
                  <label className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 py-2 rounded-xl cursor-pointer border border-slate-300 font-semibold shadow-2xs">
                    <Upload className="w-4 h-4 text-teal-600" />
                    <span>{uploadingAfter ? 'Uploading...' : 'Upload After Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUpload(e, 'after')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Case Description</label>
                <textarea
                  rows="2"
                  value={editingCase.description || ''}
                  onChange={(e) => setEditingCase({ ...editingCase, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor's Clinical Notes</label>
                <textarea
                  rows="2"
                  value={editingCase.doctorNotes || ''}
                  onChange={(e) => setEditingCase({ ...editingCase, doctorNotes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 resize-none"
                ></textarea>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={editingCase.isFeatured}
                    onChange={(e) => setEditingCase({ ...editingCase, isFeatured: e.target.checked })}
                    className="rounded text-teal-600 w-4 h-4"
                  />
                  <span>Show on Homepage Grid</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={editingCase.isPublished}
                    onChange={(e) => setEditingCase({ ...editingCase, isPublished: e.target.checked })}
                    className="rounded text-teal-600 w-4 h-4"
                  />
                  <span>Publish Case</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCase(null)}
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
                  <span>{saving ? 'Saving...' : 'Save Case'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBeforeAfterPage;
