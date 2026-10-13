import React from 'react';
import { useLocation } from 'react-router-dom';
import { Phone, MessageCircle, Calendar } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useAppointmentModal } from '../../context/AppointmentModalContext';

const FloatingActions = () => {
  const location = useLocation();
  const { settings } = useSettings();
  const { openModal } = useAppointmentModal();

  // Hide floating action buttons on Admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const phone = settings?.phone || '+91 98765 43210';
  const whatsapp = settings?.whatsapp || '+91 98765 43210';

  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');
  const clinicName = settings?.clinicName || 'Shree Shyam Dental Hospital';

  const whatsappMessage = encodeURIComponent(
    `Hello ${clinicName}, I would like to book a dental consultation / ask an inquiry.`
  );

  return (
    <div className="fixed bottom-6 right-4 sm:right-5 z-40 flex flex-col gap-2.5 sm:gap-3 items-end">
      {/* Book an Appointment Floating Action */}
      <button
        onClick={() => openModal()}
        className="group flex items-center gap-2 bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full shadow-lg shadow-teal-600/35 hover:shadow-xl hover:shadow-teal-600/50 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        aria-label="Book an Appointment"
      >
        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        <span className="font-semibold text-xs sm:text-xs tracking-wide">
          Book an Appointment
        </span>
      </button>

      {/* WhatsApp Floating Action */}
      <a
        href={`https://wa.me/${cleanWhatsapp}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full shadow-lg shadow-emerald-500/35 hover:shadow-xl hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-emerald-500" />
        <span className="font-semibold text-xs sm:text-xs tracking-wide">
          WhatsApp
        </span>
      </a>

      {/* Phone Call Floating Action */}
      <a
        href={`tel:${cleanPhone}`}
        className="group flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full shadow-lg shadow-slate-900/35 hover:shadow-xl hover:shadow-slate-900/50 hover:scale-105 active:scale-95 transition-all duration-300 border border-slate-700/50"
        aria-label="Call Hospital"
      >
        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
        <span className="font-semibold text-xs sm:text-xs tracking-wide">
          Call
        </span>
      </a>
    </div>
  );
};

export default FloatingActions;
