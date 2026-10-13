import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle2, User } from 'lucide-react';

const TestimonialCarousel = ({ testimonials = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const validTestimonials = testimonials.length > 0 ? testimonials : [
    {
      patientName: 'Pooja Sharma',
      rating: 5,
      treatmentTaken: 'Dental Implants',
      review: 'I had lost two molars and was terrified of implants. Dr. Jitendra Saini explained the procedure so clearly with 3D scans. The surgery was 100% painless and I could eat comfortably from the very next day.',
      isVerified: true,
    }
  ];

  const total = validTestimonials.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  useEffect(() => {
    if (!isPaused && total > 1) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, total, currentIndex]);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      className="relative max-w-6xl mx-auto"
    >
      {/* Grid of responsive cards displaying multiple cards on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[0, 1, 2].map((offset) => {
          const itemIndex = (currentIndex + offset) % total;
          const item = validTestimonials[itemIndex];
          if (!item) return null;

          return (
            <motion.div
              key={`${offset}-${itemIndex}-${item.patientName || item._id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className={`p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${
                offset > 0 ? 'hidden md:flex' : 'flex'
              } ${offset === 2 ? 'hidden lg:flex' : ''}`}
            >
              <div className="space-y-4">
                {/* Rating stars & quote icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-teal-200" />
                </div>

                <p className="text-sm text-slate-600 leading-relaxed italic">
                  "{item.review}"
                </p>
              </div>

              {/* Patient Info */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
                  {item.patientName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-heading font-bold text-sm text-slate-900">
                      {item.patientName}
                    </h4>
                    {item.isVerified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" title="Verified Patient" />
                    )}
                  </div>
                  {item.treatmentTaken && (
                    <p className="text-[11px] text-teal-700 font-medium">
                      {item.treatmentTaken}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Controls & Indicators */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prevSlide}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 flex items-center justify-center shadow-sm transition-all"
            aria-label="Previous Testimonials"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {validTestimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-6 bg-teal-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 flex items-center justify-center shadow-sm transition-all"
            aria-label="Next Testimonials"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TestimonialCarousel;
