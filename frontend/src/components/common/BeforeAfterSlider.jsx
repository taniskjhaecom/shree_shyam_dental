import React, { useState, useRef, useCallback } from 'react';
import { ChevronsLeftRight, Clock, CheckCircle, Eye, ArrowRight, Maximize2 } from 'lucide-react';

const BeforeAfterSlider = ({ item, onOpenDetails }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPos(percentage);
  }, []);

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleStart = () => setIsDragging(true);
  const handleEnd = () => setIsDragging(false);

  const beforeSrc = item.beforeImage?.secure_url || 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=700&q=80';
  const afterSrc = item.afterImage?.secure_url || 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=700&q=80';

  const handleCardClick = () => {
    if (onOpenDetails) {
      onOpenDetails(item);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-teal-200 transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Interactive Slider Container */}
      <div
        ref={containerRef}
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onMouseMove={handleMouseMove}
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
        onTouchMove={handleTouchMove}
        className="relative w-full aspect-[4/3] select-none cursor-ew-resize overflow-hidden bg-slate-100 touch-none"
      >
        {/* AFTER IMAGE (Base Layer) */}
        <img
          src={afterSrc}
          alt={item.afterImage?.alt || 'After Smile Transformation'}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          {onOpenDetails && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails(item);
              }}
              title="View Case Details"
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md bg-white/90 text-teal-800 hover:bg-white hover:text-teal-600 shadow-xs cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-teal-600 text-white shadow-xs">
            After
          </span>
        </div>

        {/* BEFORE IMAGE (Clipped Overlay) */}
        <div
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          className="absolute inset-0 w-full h-full overflow-hidden"
        >
          <img
            src={beforeSrc}
            alt={item.beforeImage?.alt || 'Before Smile Transformation'}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-slate-900/80 text-white backdrop-blur-xs shadow-xs">
              Before
            </span>
          </div>
        </div>

        {/* Divider Handle Line */}
        <div
          style={{ left: `${sliderPos}%` }}
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
        >
          {/* Circular Button */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-teal-700 shadow-lg border border-teal-200 flex items-center justify-center">
            <ChevronsLeftRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Case Details */}
      <div
        onClick={handleCardClick}
        className={`p-5 flex-grow flex flex-col justify-between space-y-3 ${
          onOpenDetails ? 'cursor-pointer' : ''
        }`}
      >
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-teal-700">
              {item.patientName} {item.age ? `(${item.age} yrs)` : ''}
            </span>
            {item.treatmentDuration && (
              <span className="flex items-center gap-1 text-[11px] bg-slate-100 px-2 py-0.5 rounded-full">
                <Clock className="w-3 h-3 text-slate-400" />
                {item.treatmentDuration}
              </span>
            )}
          </div>
          <h4 className="font-heading font-bold text-base text-slate-900 line-clamp-1 group-hover:text-teal-600 transition-colors">
            {item.treatmentName}
          </h4>
          <p className="text-xs text-slate-600 mt-1 line-clamp-2">
            {item.description || item.doctorNotes}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium truncate">
            <CheckCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Verified Outcome</span>
          </div>

          {onOpenDetails && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails(item);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-800 transition-colors cursor-pointer shrink-0"
            >
              <span>View Case</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
