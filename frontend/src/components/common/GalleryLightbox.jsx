import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

const GalleryLightbox = ({ items = [] }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const openLightbox = (index) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % items.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + items.length) % items.length);
    }
  };

  const currentItem =
    selectedImageIndex !== null ? items[selectedImageIndex] : null;

  return (
    <div className="space-y-8">
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {items.map((item, idx) => {
          const imgSrc =
            item.image?.secure_url ||
            'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80';

          return (
            <motion.div
              key={item._id || idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: (idx % 4) * 0.05 }}
              onClick={() => openLightbox(idx)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300"
            >
              <img
                src={imgSrc}
                alt={item.image?.alt || item.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
              />

              {/* Overlay with Title and Caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end text-white">
                <h4 className="font-heading font-bold text-sm sm:text-base line-clamp-2">
                  {item.title}
                </h4>
                {item.caption && (
                  <p className="text-[11px] text-slate-300 line-clamp-2 mt-1">
                    {item.caption}
                  </p>
                )}

                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {currentItem && (
          <div
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-5 right-5 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Prev Arrow */}
            {items.length > 1 && (
              <button
                onClick={prevImage}
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Main Lightbox Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl"
            >
              <div className="aspect-[16/10] sm:aspect-[16/9] w-full bg-black flex items-center justify-center">
                <img
                  src={
                    currentItem.image?.secure_url ||
                    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt={currentItem.image?.alt || currentItem.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Title & Caption Footer */}
              <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className="font-heading font-bold text-base sm:text-lg">
                    {currentItem.title}
                  </h3>
                  {currentItem.caption && (
                    <p className="text-xs text-slate-400 mt-0.5">{currentItem.caption}</p>
                  )}
                </div>

                <div className="text-xs text-slate-500 font-mono">
                  {selectedImageIndex + 1} / {items.length}
                </div>
              </div>
            </motion.div>

            {/* Right Next Arrow */}
            {items.length > 1 && (
              <button
                onClick={nextImage}
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryLightbox;
