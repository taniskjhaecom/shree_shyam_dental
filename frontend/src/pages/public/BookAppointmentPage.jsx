import React from 'react';
import { Calendar, ShieldCheck, Clock, Phone } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import SEO from '../../components/common/SEO';
import SectionHeading from '../../components/common/SectionHeading';
import AppointmentForm from '../../components/common/AppointmentForm';

const BookAppointmentPage = () => {
  const { settings } = useSettings();

  const clinicName = settings?.clinicName || 'Shree Shyam Dental Hospital';
  const phone = settings?.phone || '+91 98765 43210';

  return (
    <>
      <SEO
        title="Book Dental Appointment Online"
        description={`Schedule your dental appointment or consultation slot with specialist doctors at ${clinicName}. Instant confirmation & zero waiting time.`}
      />

      {/* Hero Header */}
      <section className="pt-12 pb-14 bg-gradient-to-b from-teal-50/50 via-white to-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            Online Slot Booking
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight max-w-3xl mx-auto">
            Book Your Dental Appointment
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Reserve your preferred date and slot. Our hospital front desk will call you to confirm your consultation.
          </p>
        </div>
      </section>

      {/* Main Form Box */}
      <section className="py-14 bg-white">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xl space-y-6 text-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-heading font-bold text-xl text-slate-900">
                  Patient Consultation Request
                </h3>
                <p className="text-xs text-slate-500">
                  {clinicName} — All treatments under one roof
                </p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200/60">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                Hospital Confidentiality
              </span>
            </div>

            <AppointmentForm isCompact={false} />
          </div>
        </div>
      </section>
    </>
  );
};

export default BookAppointmentPage;
