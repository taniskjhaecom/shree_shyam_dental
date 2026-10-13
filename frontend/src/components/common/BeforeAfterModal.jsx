import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronsLeftRight,
  Clock,
  User,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Sparkles,
  Stethoscope,
  Maximize2,
  Split,
  Eye,
  Award,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useAppointmentModal } from '../../context/AppointmentModalContext';

const BeforeAfterModal = ({ item, isOpen, onClose }) => {
  const { settings } = useSettings();
  const { openModal } = useAppointmentModal();

  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState('slider'); // 'slider' | 'side-by-side' | 'before' | 'after'
  const containerRef = useRef(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setSliderPos(50);
      setViewMode('slider');
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Interactive slider mechanics
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

  if (!item) return null;

  const beforeSrc =
    item.beforeImage?.secure_url ||
    'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=1200&q=80';
  const afterSrc =
    item.afterImage?.secure_url ||
    'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80';

  const clinicName = settings?.clinicName || 'Shree Shyam Dental Hospital';
  const cleanWhatsapp = (settings?.whatsapp || '+91 98765 43210').replace(/[^0-9]/g, '');

  const handleBookClick = () => {
    onClose();
    setTimeout(() => {
      openModal(item.treatmentName || 'Smile Transformation');
    }, 200);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Doctor, I saw the case study for "${item.treatmentName}" (Patient: ${item.patientName}) at ${clinicName} and would like to inquire about similar treatment for myself.`
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 flex flex-col my-auto"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
                  {item.treatmentCategory || 'Clinical Transformation'}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Case Study
                </span>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white hover:bg-slate-200 border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                aria-label="Close Case Details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto p-5 sm:p-7 space-y-6">
              {/* Case Title */}
              <div className="space-y-1">
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl lg:text-3xl text-slate-900 leading-tight">
                  {item.treatmentName}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Treated at {clinicName} • Lead Surgeon: Dr. Jitendra Saini (B.D.S.)
                </p>
              </div>

              {/* View Mode Switcher */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-teal-600" />
                  Visual Comparison Mode:
                </span>
                <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 text-xs font-semibold">
                  <button
                    onClick={() => setViewMode('slider')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      viewMode === 'slider'
                        ? 'bg-white text-teal-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ChevronsLeftRight className="w-3.5 h-3.5" />
                    Interactive Slider
                  </button>
                  <button
                    onClick={() => setViewMode('side-by-side')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      viewMode === 'side-by-side'
                        ? 'bg-white text-teal-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Split className="w-3.5 h-3.5" />
                    Side-by-Side
                  </button>
                  <button
                    onClick={() => setViewMode('before')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === 'before'
                        ? 'bg-white text-teal-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Before Only
                  </button>
                  <button
                    onClick={() => setViewMode('after')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === 'after'
                        ? 'bg-white text-teal-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    After Only
                  </button>
                </div>
              </div>

              {/* Image Preview Area */}
              <div className="rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-100 shadow-inner">
                {viewMode === 'slider' && (
                  <div
                    ref={containerRef}
                    onMouseDown={handleStart}
                    onMouseUp={handleEnd}
                    onMouseLeave={handleEnd}
                    onMouseMove={handleMouseMove}
                    onTouchStart={handleStart}
                    onTouchEnd={handleEnd}
                    onTouchMove={handleTouchMove}
                    className="relative w-full aspect-[16/10] sm:aspect-[16/9] select-none cursor-ew-resize overflow-hidden touch-none"
                  >
                    {/* After Image */}
                    <img
                      src={afterSrc}
                      alt={item.afterImage?.alt || 'After Result'}
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    />
                    <div className="absolute top-4 right-4 z-10">
                      <span className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-teal-600 text-white shadow-md">
                        After Result
                      </span>
                    </div>

                    {/* Before Image with Clip */}
                    <div
                      style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                      className="absolute inset-0 w-full h-full overflow-hidden"
                    >
                      <img
                        src={beforeSrc}
                        alt={item.beforeImage?.alt || 'Before Result'}
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                      />
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-900/85 text-white backdrop-blur-md shadow-md">
                          Before Treatment
                        </span>
                      </div>
                    </div>

                    {/* Divider Line & Handle */}
                    <div
                      style={{ left: `${sliderPos}%` }}
                      className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.6)] z-20 pointer-events-none"
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-teal-700 shadow-xl border-2 border-teal-300 flex items-center justify-center">
                        <ChevronsLeftRight className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Instruction hint */}
                    <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none z-10">
                      <span className="px-3 py-1 rounded-full bg-slate-950/60 backdrop-blur-md text-white text-[11px] font-medium shadow-xs">
                        ↔️ Drag slider to compare transformation
                      </span>
                    </div>
                  </div>
                )}

                {viewMode === 'side-by-side' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2 bg-slate-900">
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                      <img
                        src={beforeSrc}
                        alt="Before Case"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase bg-slate-900/80 text-white backdrop-blur-xs">
                        Before
                      </span>
                    </div>
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                      <img
                        src={afterSrc}
                        alt="After Case"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase bg-teal-600 text-white shadow-xs">
                        After
                      </span>
                    </div>
                  </div>
                )}

                {viewMode === 'before' && (
                  <div className="relative aspect-[16/10] sm:aspect-[16/9]">
                    <img
                      src={beforeSrc}
                      alt="Before Result Full"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-bold uppercase bg-slate-900/80 text-white">
                      Before Treatment State
                    </span>
                  </div>
                )}

                {viewMode === 'after' && (
                  <div className="relative aspect-[16/10] sm:aspect-[16/9]">
                    <img
                      src={afterSrc}
                      alt="After Result Full"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-4 right-4 px-3 py-1.5 rounded-lg text-xs font-bold uppercase bg-teal-600 text-white shadow-md">
                      Final Transformation State
                    </span>
                  </div>
                )}
              </div>

              {/* Case Profile Quick Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="block text-[11px] font-medium text-slate-400">Patient</span>
                  <span className="font-heading font-bold text-sm text-slate-800">
                    {item.patientName || 'Anonymous'}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="block text-[11px] font-medium text-slate-400">Patient Age</span>
                  <span className="font-heading font-bold text-sm text-slate-800">
                    {item.age ? `${item.age} Years` : 'Adult'}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="block text-[11px] font-medium text-slate-400">Treatment Duration</span>
                  <span className="font-heading font-bold text-sm text-teal-700">
                    {item.treatmentDuration || '1–2 Sessions'}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="block text-[11px] font-medium text-slate-400">Category</span>
                  <span className="font-heading font-bold text-sm text-slate-800 truncate block">
                    {item.treatmentCategory || 'Cosmetic'}
                  </span>
                </div>
              </div>

              {/* Clinical Presentation (Description) */}
              {item.description && (
                <div className="p-5 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-2">
                  <div className="flex items-center gap-2 text-teal-900 font-heading font-bold text-sm">
                    <Stethoscope className="w-4 h-4 text-teal-600" />
                    <span>Clinical Case Problem & Procedure</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )}

              {/* Doctor Notes & Clinical Outcome */}
              {item.doctorNotes && (
                <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-heading font-bold text-sm">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Doctor's Clinical Notes & Result</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed italic">
                    "{item.doctorNotes}"
                  </p>
                </div>
              )}

              {/* Hospital Quality Stamp */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Award className="w-5 h-5" />
                </div>
                <div className="text-xs text-slate-600 leading-snug">
                  <span className="font-bold text-slate-900 block">
                    100% Authentic Case from {clinicName}
                  </span>
                  Performed under hospital-grade sterilization with German digital dentistry tools.
                </div>
              </div>
            </div>

            {/* Modal Sticky Footer CTAs */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="text-xs text-slate-500 hidden sm:block">
                Want similar smile results? Book a slot with our senior surgeon.
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a
                  href={`https://wa.me/${cleanWhatsapp}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl shadow-md transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Ask on WhatsApp</span>
                </a>

                <button
                  onClick={handleBookClick}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book This Treatment</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BeforeAfterModal;
