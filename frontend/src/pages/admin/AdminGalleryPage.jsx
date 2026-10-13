import React, { useEffect, useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  Save,
  X,
  Image as ImageIcon,
  Video,
  Play,
  ExternalLink,
  CheckCircle2,
  Film,
  Search,
} from 'lucide-react';
import apiClient from '../../api/apiClient';
import Loader from '../../components/common/Loader';
import { getYouTubeEmbedUrl, getYouTubeVideoId, getYouTubeThumbnail } from '../../utils/youtube';

const AdminGalleryPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('photos'); // 'photos' | 'videos'
  const [editingItem, setEditingItem] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notification, setNotification] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/gallery/admin/all');
      if (res.data.success) {
        setItems(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching gallery items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', 'gallery');

    try {
      setUploadingImage(true);
      const res = await apiClient.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setEditingItem((prev) => ({
          ...prev,
          image: {
            public_id: res.data.data.public_id,
            secure_url: res.data.data.secure_url,
            alt: prev.title || 'Gallery Photo',
          },
        }));
        showToast('Image uploaded successfully.');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Upload failed. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...editingItem };

      if (payload.mediaType === 'video' && payload.youtubeUrl) {
        const videoId = getYouTubeVideoId(payload.youtubeUrl);
        if (!videoId) {
          alert('Please enter a valid YouTube video URL or ID.');
          setSaving(false);
          return;
        }
        if (!payload.image?.secure_url) {
          payload.image = {
            public_id: `yt_${videoId}`,
            secure_url: getYouTubeThumbnail(payload.youtubeUrl),
            alt: payload.title || 'YouTube Video',
          };
        }
      }

      if (isNew) {
        await apiClient.post('/gallery', payload);
        showToast(
          payload.mediaType === 'video'
            ? 'YouTube video added successfully!'
            : 'Gallery photo added successfully!'
        );
      } else {
        await apiClient.put(`/gallery/${payload._id}`, payload);
        showToast(
          payload.mediaType === 'video'
            ? 'Video updated successfully!'
            : 'Photo updated successfully!'
        );
      }
      setEditingItem(null);
      setIsNew(false);
      fetchGallery();
    } catch (err) {
      console.error('Error saving gallery item:', err);
      alert(err.response?.data?.message || 'Error saving gallery item.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title || 'this item'}" permanently?`)) return;
    try {
      await apiClient.delete(`/gallery/${id}`);
      showToast('Item deleted successfully.');
      fetchGallery();
    } catch (err) {
      console.error('Error deleting gallery item:', err);
      alert('Failed to delete item.');
    }
  };

  const startNewPhoto = () => {
    setIsNew(true);
    setEditingItem({
      title: '',
      caption: '',
      mediaType: 'photo',
      order: items.filter((i) => (i.mediaType || 'photo') === 'photo').length + 1,
      isPublished: true,
      image: {
        public_id: '',
        secure_url: '',
        alt: '',
      },
    });
  };

  const startNewVideo = () => {
    setIsNew(true);
    setEditingItem({
      title: '',
      caption: '',
      mediaType: 'video',
      youtubeUrl: '',
      order: items.filter((i) => i.mediaType === 'video').length + 1,
      isPublished: true,
      image: {
        secure_url: '',
        alt: 'YouTube Video',
      },
    });
  };

  const photos = items.filter((item) => (item.mediaType || 'photo') === 'photo');
  const videos = items.filter((item) => item.mediaType === 'video');

  const currentList = activeTab === 'photos' ? photos : videos;

  const filteredItems = currentList.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title?.toLowerCase().includes(q) ||
      item.caption?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 flex items-center gap-2">
            <Film className="w-7 h-7 text-teal-600" />
            <span>Gallery CMS</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Add, update, or delete gallery photos and YouTube videos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'photos' ? (
            <button
              onClick={startNewPhoto}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-teal-600/20 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Photo</span>
            </button>
          ) : (
            <button
              onClick={startNewVideo}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-red-600/20 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add YouTube Video</span>
            </button>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification('')} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Tabs Switcher: Photos (Left) | Videos (Right) & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
        {/* Photos vs Videos Tabs */}
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200/80 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('photos')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'photos'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Photos</span>
            <span
              className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                activeTab === 'photos' ? 'bg-teal-800 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {photos.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'videos'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Videos</span>
            <span
              className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                activeTab === 'videos' ? 'bg-red-800 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {videos.length}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
          />
        </div>
      </div>

      {/* Main Grid Content */}
      {loading ? (
        <Loader message="Loading gallery items..." />
      ) : activeTab === 'photos' ? (
        /* ============================================================== */
        /* PHOTOS GRID (Clean, No Category Badges)                         */
        /* ============================================================== */
        filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md p-4 space-y-3 flex flex-col justify-between group transition-all"
              >
                <div className="space-y-3">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src={item.image?.secure_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-sm text-slate-900 line-clamp-1">
                      {item.title}
                    </h3>
                    {item.caption && (
                      <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{item.caption}</p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span
                    className={`font-semibold ${item.isPublished ? 'text-emerald-600' : 'text-slate-400'}`}
                  >
                    {item.isPublished ? 'Live' : 'Draft'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setIsNew(false);
                        setEditingItem(item);
                      }}
                      className="p-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 transition-colors cursor-pointer"
                      title="Edit Title & Photo"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id, item.title)}
                      className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-400 space-y-3">
            <ImageIcon className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-sm font-medium">No photos found.</p>
            <button
              onClick={startNewPhoto}
              className="text-xs font-semibold text-teal-600 hover:underline cursor-pointer"
            >
              Add First Photo
            </button>
          </div>
        )
      ) : (
        /* ============================================================== */
        /* VIDEOS GRID (3-Column Layout, No Category Badges)              */
        /* ============================================================== */
        filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const videoId = getYouTubeVideoId(item.youtubeUrl);
              const embedUrl = getYouTubeEmbedUrl(item.youtubeUrl);

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg p-4 space-y-3 flex flex-col justify-between group transition-all"
                >
                  <div className="space-y-3">
                    {/* YouTube Embed Player with full controls */}
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-xs">
                      {embedUrl ? (
                        <iframe
                          src={embedUrl}
                          title={item.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                          No Video URL
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-heading font-bold text-base text-slate-900 line-clamp-2">
                        {item.title}
                      </h3>
                      {item.caption && (
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                          {item.caption}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span
                      className={`font-semibold ${item.isPublished ? 'text-emerald-600' : 'text-slate-400'}`}
                    >
                      {item.isPublished ? 'Live' : 'Draft'}
                    </span>

                    <div className="flex items-center gap-2">
                      {item.youtubeUrl && (
                        <a
                          href={item.youtubeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                          title="Open on YouTube"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => {
                          setIsNew(false);
                          setEditingItem(item);
                        }}
                        className="p-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 transition-colors cursor-pointer"
                        title="Edit Title & Video Link"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id, item.title)}
                        className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
                        title="Delete Video"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-400 space-y-3">
            <Video className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-sm font-medium">No YouTube videos added yet.</p>
            <button
              onClick={startNewVideo}
              className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
            >
              Add First YouTube Video
            </button>
          </div>
        )
      )}

      {/* ============================================================== */}
      {/* EDIT / CREATE MODAL (No Category Dropdowns)                     */}
      {/* ============================================================== */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl text-left my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    editingItem.mediaType === 'video'
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'bg-teal-50 text-teal-700 border border-teal-200'
                  }`}
                >
                  {editingItem.mediaType === 'video' ? (
                    <Video className="w-4 h-4" />
                  ) : (
                    <ImageIcon className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h2 className="font-heading font-bold text-lg text-slate-900">
                    {isNew
                      ? editingItem.mediaType === 'video'
                        ? 'Add YouTube Video'
                        : 'Add Gallery Photo'
                      : editingItem.mediaType === 'video'
                      ? 'Edit YouTube Video'
                      : 'Edit Gallery Photo'}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    {editingItem.mediaType === 'video'
                      ? 'Configure YouTube URL and title'
                      : 'Update photo title and image'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Title Field */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {editingItem.mediaType === 'video' ? 'Video Title *' : 'Photo Title *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    editingItem.mediaType === 'video'
                      ? 'e.g. 3D Dental Implant Surgical Procedure'
                      : 'e.g. Modern Dental Operatory Room'
                  }
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                />
              </div>

              {/* VIDEO SPECIFIC: YouTube URL & Live Player Preview */}
              {editingItem.mediaType === 'video' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      YouTube Video Link *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                      value={editingItem.youtubeUrl || ''}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, youtubeUrl: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Enter any YouTube URL. Video will be embedded with full playback controls.
                    </p>
                  </div>

                  {/* Real-time YouTube Preview */}
                  {editingItem.youtubeUrl && getYouTubeVideoId(editingItem.youtubeUrl) ? (
                    <div>
                      <span className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Player Preview:
                      </span>
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm">
                        <iframe
                          src={getYouTubeEmbedUrl(editingItem.youtubeUrl)}
                          title="Preview"
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                /* PHOTO SPECIFIC: Cloudinary Image Upload */
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Photo Upload *
                  </label>
                  <div className="flex items-center gap-4">
                    {editingItem.image?.secure_url ? (
                      <div className="relative group">
                        <img
                          src={editingItem.image.secure_url}
                          alt="Preview"
                          className="w-24 h-16 object-cover rounded-xl border border-slate-200 shadow-2xs"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setEditingItem((prev) => ({
                              ...prev,
                              image: { public_id: '', secure_url: '', alt: '' },
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
                        onChange={handleUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="Or paste Direct Image URL..."
                    value={editingItem.image?.secure_url || ''}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        image: {
                          ...editingItem.image,
                          secure_url: e.target.value,
                          alt: editingItem.title || 'Gallery photo',
                        },
                      })
                    }
                    className="w-full mt-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                  />
                </div>
              )}

              {/* Order */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={editingItem.order || 0}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, order: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
              </div>

              {/* Caption / Description */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Description / Caption (Optional)
                </label>
                <textarea
                  rows="3"
                  placeholder="Short description or notes..."
                  value={editingItem.caption || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, caption: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 resize-none"
                ></textarea>
              </div>

              {/* Published Toggle */}
              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={editingItem.isPublished !== false}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, isPublished: e.target.checked })
                    }
                    className="rounded text-teal-600 w-4 h-4 cursor-pointer"
                  />
                  <span>Publish & Display on Live Website</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className={`px-5 py-2.5 rounded-xl text-white font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-70 ${
                    editingItem.mediaType === 'video'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-teal-600 hover:bg-teal-700'
                  }`}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Gallery Item'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGalleryPage;
