import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, Video, Play, ExternalLink } from 'lucide-react';
import apiClient from '../../api/apiClient';
import { useSettings } from '../../context/SettingsContext';
import SEO from '../../components/common/SEO';
import GalleryLightbox from '../../components/common/GalleryLightbox';
import { Skeleton } from '../../components/common/Skeleton';
import { getYouTubeEmbedUrl, getYouTubeVideoId } from '../../utils/youtube';

const GalleryPage = () => {
  const { settings } = useSettings();
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('photos'); // 'photos' | 'videos'

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/gallery');
        if (res.data.success) {
          setGalleryItems(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const clinicName = settings?.clinicName || 'Shree Shyam Dental Hospital';

  const photos = galleryItems.filter((item) => (item.mediaType || 'photo') === 'photo');
  const videos = galleryItems.filter((item) => item.mediaType === 'video' && item.youtubeUrl);

  return (
    <>
      <SEO
        title="Gallery"
        description={`Explore photos and videos of ${clinicName}.`}
      />

      {/* Top Header with 2 Toggle Options: Photos (Left) | Videos (Right) */}
      <section className="pt-8 pb-8 bg-gradient-to-b from-teal-50/40 via-white to-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Gallery
          </h1>

          {/* Toggle Options: Left = Photos | Right = Videos */}
          <div className="flex justify-center pt-1">
            <div className="inline-flex p-1.5 rounded-2xl bg-white border border-slate-200 shadow-md">
              <button
                onClick={() => setActiveTab('photos')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'photos'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Photos</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeTab === 'photos' ? 'bg-teal-800 text-teal-100' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {photos.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('videos')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'videos'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Videos</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeTab === 'videos' ? 'bg-teal-800 text-teal-100' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {videos.length}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Showcase Section */}
      <section className="py-10 bg-white min-h-[500px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton key={i} className="h-60 sm:h-72 w-full rounded-2xl" />
              ))}
            </div>
          ) : activeTab === 'photos' ? (
            /* PHOTOS VIEW (Clean, No Category pills) */
            photos.length > 0 ? (
              <GalleryLightbox items={photos} />
            ) : (
              <div className="text-center py-16 text-slate-400">
                <ImageIcon className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                <p className="text-sm">No photos uploaded yet in the gallery.</p>
              </div>
            )
          ) : (
            /* VIDEOS VIEW: 3-column grid with controllable YouTube players */
            videos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {videos.map((video, idx) => {
                  const embedUrl = getYouTubeEmbedUrl(video.youtubeUrl);
                  const videoId = getYouTubeVideoId(video.youtubeUrl);

                  return (
                    <div
                      key={video._id || idx}
                      className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
                    >
                      {/* 16:9 YouTube Player with all controls */}
                      <div className="relative aspect-video bg-slate-900 overflow-hidden">
                        {embedUrl ? (
                          <iframe
                            src={embedUrl}
                            title={video.title}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                            Invalid YouTube Link
                          </div>
                        )}
                      </div>

                      {/* Video Title and Caption */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2">
                            {video.title}
                          </h3>
                          {video.caption && (
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                              {video.caption}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400">
                <Video className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                <p className="text-sm">No videos added yet in the gallery.</p>
              </div>
            )
          )}
        </div>
      </section>
    </>
  );
};

export default GalleryPage;
