import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Upload, Save, X, Eye, EyeOff, BookOpen, Calendar, Sparkles } from 'lucide-react';
import apiClient from '../../api/apiClient';
import Loader from '../../components/common/Loader';

const AdminBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [isSeoManuallyEdited, setIsSeoManuallyEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/blogs/admin/all');
      if (res.data.success) {
        setBlogs(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', 'blogs');

    try {
      setUploadingImage(true);
      const res = await apiClient.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setEditingBlog((prev) => ({
          ...prev,
          featuredImage: {
            public_id: res.data.data.public_id,
            secure_url: res.data.data.secure_url,
            alt: prev.title || 'Blog photo',
          },
        }));
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) {
        await apiClient.post('/blogs', editingBlog);
      } else {
        await apiClient.put(`/blogs/${editingBlog._id}`, editingBlog);
      }
      setEditingBlog(null);
      setIsNew(false);
      fetchBlogs();
    } catch (err) {
      console.error('Error saving blog:', err);
      alert(err.response?.data?.message || 'Error saving article.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog article?')) return;
    try {
      await apiClient.delete(`/blogs/${id}`);
      fetchBlogs();
    } catch (err) {
      console.error('Error deleting blog:', err);
    }
  };

  const generateBlogSEO = (title) => {
    const t = (title || '').trim();
    if (!t) return { seoTitle: '', metaDescription: '' };
    return {
      seoTitle: `${t} | Dental Guide - Shree Shyam Dental Hospital`,
      metaDescription: `Read this comprehensive guide on ${t.toLowerCase()} by Dr. Jitendra Saini at Shree Shyam Dental Hospital Jhunjhunu. Clinical symptoms, procedure details, and prevention tips.`,
    };
  };

  const handleTitleChange = (newTitle) => {
    setEditingBlog((prev) => {
      const updated = { ...prev, title: newTitle };
      if (isNew && !isSeoManuallyEdited) {
        const seo = generateBlogSEO(newTitle);
        updated.seoTitle = seo.seoTitle;
        updated.metaDescription = seo.metaDescription;
      }
      return updated;
    });
  };

  const startNew = () => {
    setIsNew(true);
    setIsSeoManuallyEdited(false);
    setEditingBlog({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'Oral Health Tips',
      tags: [],
      readTime: '',
      isPublished: true,
      featuredImage: {
        public_id: '',
        secure_url: '',
        alt: '',
      },
      author: {
        name: 'Dr. Jitendra Saini',
        title: 'Chief Dental Surgeon (BDS)',
      },
      seoTitle: '',
      metaDescription: '',
    });
  };

  const handleEditClick = (b) => {
    setIsNew(false);
    setIsSeoManuallyEdited(Boolean(b.seoTitle || b.metaDescription));
    setEditingBlog({
      ...b,
      featuredImage: b.featuredImage || { public_id: '', secure_url: '', alt: '' },
    });
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
            Dental Blogs & Guides CMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish educational articles, maintain SEO metadata, and configure rich content.
          </p>
        </div>

        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-teal-600/20 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {loading ? (
        <Loader message="Loading articles..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md p-4 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 relative">
                  <img
                    src={b.featuredImage?.secure_url}
                    alt={b.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-900/80 text-teal-300">
                    {b.category}
                  </span>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900 line-clamp-2">
                    {b.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{b.excerpt}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className={`font-semibold ${b.isPublished ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {b.isPublished ? 'Published' : 'Draft'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditClick(b)}
                    className="p-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(b._id)}
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

      {/* Edit / Write Modal */}
      {editingBlog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl text-left my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-heading font-bold text-xl text-slate-900">
                {isNew ? 'New Blog Article' : `Edit Article`}
              </h2>
              <button
                onClick={() => setEditingBlog(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5 Signs You Need a Root Canal Treatment"
                  value={editingBlog.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Oral Health Tips, Dental Implants"
                    value={editingBlog.category}
                    onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Read Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 4 min read"
                    value={editingBlog.readTime || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, readTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-2">Featured Image</label>
                <div className="flex items-center gap-4">
                  {editingBlog.featuredImage?.secure_url ? (
                    <div className="relative group">
                      <img
                        src={editingBlog.featuredImage.secure_url}
                        alt="Preview"
                        className="w-24 h-16 object-cover rounded-xl border border-slate-200 shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setEditingBlog((prev) => ({
                            ...prev,
                            featuredImage: { public_id: '', secure_url: '', alt: '' },
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
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Featured Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Excerpt *</label>
                <textarea
                  rows="2"
                  required
                  placeholder="Short 1-2 sentence overview for blog cards..."
                  value={editingBlog.excerpt}
                  onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Article Content *</label>
                <textarea
                  rows="8"
                  required
                  value={editingBlog.content}
                  onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  placeholder="Supports headings, lists, paragraphs..."
                ></textarea>
              </div>

              {/* SEO Inputs with Auto-Fill */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-teal-700 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      <span>SEO Metadata (Google Search Optimization)</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Auto-generated based on article title for top Google rankings.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const seo = generateBlogSEO(editingBlog.title);
                      setEditingBlog((prev) => ({
                        ...prev,
                        seoTitle: seo.seoTitle,
                        metaDescription: seo.metaDescription,
                      }));
                      setIsSeoManuallyEdited(false);
                    }}
                    disabled={!editingBlog.title?.trim()}
                    className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 disabled:opacity-40 text-teal-800 text-[11px] font-semibold border border-teal-200 cursor-pointer transition-colors shadow-2xs"
                    title="Click to auto-generate SEO metadata"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>Auto Fill Best SEO</span>
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-600 font-medium">Custom SEO Title</label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {(editingBlog.seoTitle || '').length} chars
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. 5 Signs You Need a Root Canal | Shree Shyam Dental Hospital"
                    value={editingBlog.seoTitle || ''}
                    onChange={(e) => {
                      setIsSeoManuallyEdited(true);
                      setEditingBlog({ ...editingBlog, seoTitle: e.target.value });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-600 font-medium">Meta Description</label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {(editingBlog.metaDescription || '').length} chars
                    </span>
                  </div>
                  <textarea
                    rows="2"
                    placeholder="Search engine snippet description..."
                    value={editingBlog.metaDescription || ''}
                    onChange={(e) => {
                      setIsSeoManuallyEdited(true);
                      setEditingBlog({ ...editingBlog, metaDescription: e.target.value });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={editingBlog.isPublished}
                    onChange={(e) => setEditingBlog({ ...editingBlog, isPublished: e.target.checked })}
                    className="rounded text-teal-600 w-4 h-4"
                  />
                  <span>Publish Immediately (Make Live)</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingBlog(null)}
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
                  <span>{saving ? 'Saving...' : 'Save Article'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogsPage;
