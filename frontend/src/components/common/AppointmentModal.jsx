import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck } from 'lucide-react';
import { useAppointmentModal } from '../../context/AppointmentModalContext';
import AppointmentForm from './AppointmentForm';
import { useSettings } from '../../context/SettingsContext';

const AppointmentModal = () => {
  const { isOpen, closeModal, initialTreatment } = useAppointmentModal();
  const { settings } = useSettings();

  const clinicName = settings?.clinicName || 'Shree Shyam Dental Hospital';

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
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
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeModal]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
          {/* Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm cursor-pointer"
            aria-hidden="true"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-xl max-h-[92vh] sm:max-h-[90vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 flex flex-col my-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Header (Sticky / Shrink-0 so Close Button is ALWAYS in view) */}
            <div className="shrink-0 bg-gradient-to-r from-teal-900 via-teal-800 to-cyan-900 text-white px-4 py-3.5 sm:px-6 sm:py-5 border-b border-teal-700/40 relative flex items-center justify-between gap-3 shadow-sm">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-teal-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>Priority Consultation Slot</span>
                </div>
                <h2 id="modal-title" className="font-heading font-bold text-lg sm:text-2xl text-white leading-tight">
                  Book Your Appointment
                </h2>
                <p className="text-teal-100/80 text-[11px] sm:text-xs truncate max-w-xs sm:max-w-md mt-0.5">
                  {clinicName} — Advanced Dental Care
                </p>
              </div>

              {/* Close Button - Highly Visible & Touch Friendly */}
              <button
                onClick={closeModal}
                id="appointment-modal-close-btn"
                className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer border border-white/25 shadow-sm"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5 text-white stroke-[2.5]" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-4 sm:p-6 md:p-7 overflow-y-auto overscroll-contain flex-1">
              <AppointmentForm
                initialTreatment={initialTreatment}
                onSuccessCallback={() => {}}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AppointmentModal;
