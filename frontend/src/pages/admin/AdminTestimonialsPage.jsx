import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Star, CheckCircle2, MessageSquare } from 'lucide-react';
import apiClient from '../../api/apiClient';
import Loader from '../../components/common/Loader';

const AdminTestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/testimonials/admin/all');
      if (res.data.success) {
        setTestimonials(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) {
        await apiClient.post('/testimonials', editingItem);
      } else {
        await apiClient.put(`/testimonials/${editingItem._id}`, editingItem);
      }
      setEditingItem(null);
      setIsNew(false);
      fetchTestimonials();
    } catch (err) {
      console.error('Error saving testimonial:', err);
      alert('Error saving testimonial.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this patient testimonial?')) return;
    try {
      await apiClient.delete(`/testimonials/${id}`);
      fetchTestimonials();
    } catch (err) {
      console.error('Error deleting testimonial:', err);
    }
  };

  const startNew = () => {
    setIsNew(true);
    setEditingItem({
      patientName: '',
      treatmentTaken: '',
      rating: 5,
      review: '',
      isVerified: true,
      isFeatured: true,
      isPublished: true,
      order: testimonials.length + 1,
    });
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
            Patient Reviews & Testimonials CMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage verified feedback, star ratings, and homepage featured reviews.
          </p>
        </div>

        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-teal-600/20 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {loading ? (
        <Loader message="Loading reviews..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md p-5 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {t.isVerified && (
                    <span className="flex items-center gap-1 text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 italic leading-relaxed">"{t.review}"</p>

                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-900 text-sm block">{t.patientName}</span>
                  {t.treatmentTaken && (
                    <span className="text-[11px] text-teal-700 font-medium block">{t.treatmentTaken}</span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className={`font-semibold ${t.isPublished ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {t.isPublished ? 'Active' : 'Hidden'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsNew(false);
                      setEditingItem(t);
                    }}
                    className="p-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-heading font-bold text-lg text-slate-900">
                {isNew ? 'New Review' : 'Edit Review'}
              </h2>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Patient Name *</label>
                <input
                  type="text"
                  required
                  value={editingItem.patientName}
                  onChange={(e) => setEditingItem({ ...editingItem, patientName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Treatment Taken</label>
                  <input
                    type="text"
                    value={editingItem.treatmentTaken}
                    onChange={(e) => setEditingItem({ ...editingItem, treatmentTaken: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rating (1-5)</label>
                  <select
                    value={editingItem.rating}
                    onChange={(e) => setEditingItem({ ...editingItem, rating: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 cursor-pointer"
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Testimonial Review *</label>
                <textarea
                  rows="3"
                  required
                  value={editingItem.review}
                  onChange={(e) => setEditingItem({ ...editingItem, review: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 resize-none"
                ></textarea>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={editingItem.isVerified}
                    onChange={(e) => setEditingItem({ ...editingItem, isVerified: e.target.checked })}
                    className="rounded text-teal-600 w-4 h-4"
                  />
                  <span>Mark as Verified Patient</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={editingItem.isPublished}
                    onChange={(e) => setEditingItem({ ...editingItem, isPublished: e.target.checked })}
                    className="rounded text-teal-600 w-4 h-4"
                  />
                  <span>Publish</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Review'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonialsPage;
