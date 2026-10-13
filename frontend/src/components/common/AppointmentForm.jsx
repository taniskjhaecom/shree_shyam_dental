import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Calendar,
  User,
  Phone,
  Mail,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import apiClient from '../../api/apiClient';
import { useSettings } from '../../context/SettingsContext';

const AppointmentForm = ({ initialTreatment = '', onSuccessCallback, isCompact = false }) => {
  const { settings, treatments } = useSettings();
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      treatmentRequired: initialTreatment || '',
      preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      preferredSlot: 'Morning (10:00 AM - 01:00 PM)',
      notes: '',
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrorMessage('');
    try {
      const payload = {
        ...data,
        email: data.email ? data.email.trim() : '',
        treatmentRequired: data.treatmentRequired || 'General Consultation & Checkup',
      };
      const response = await apiClient.post('/appointments', payload);
      if (response.data.success) {
        setIsSuccess(true);
        setSubmittedData(response.data.data);
        reset();
        if (onSuccessCallback) {
          onSuccessCallback(response.data.data);
        }
      } else {
        setErrorMessage(response.data.message || 'Unable to book an appointment.');
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Something went wrong. Please call the clinic directly.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const clinicName = settings?.clinicName || 'Shree Shyam Dental Hospital';
  const clinicWhatsapp = settings?.whatsapp || '+91 98765 43210';
  const cleanWhatsapp = clinicWhatsapp.replace(/[^0-9]/g, '');

  if (isSuccess && submittedData) {
    const whatsappMsg = encodeURIComponent(
      `Hello Shree Shyam Dental Hospital, I have requested an appointment for ${submittedData.fullName} on ${submittedData.preferredDate} (${submittedData.preferredSlot}) for ${submittedData.treatmentRequired}.`
    );

    return (
      <div className="text-center py-8 px-4 sm:px-8 space-y-5 bg-gradient-to-b from-teal-50/50 to-white rounded-2xl border border-teal-100">
        <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <h3 className="font-heading font-bold text-2xl text-slate-900">
            Appointment Request Received!
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Thank you, <span className="font-semibold text-slate-800">{submittedData.fullName}</span>. Our desk is reviewing your preferred slot for{' '}
            <span className="font-semibold text-teal-700">{submittedData.preferredDate}</span> ({submittedData.preferredSlot}).
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2 max-w-sm mx-auto shadow-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Treatment:</span>
            <span className="font-semibold text-slate-800">{submittedData.treatmentRequired}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Phone Contact:</span>
            <span className="font-semibold text-slate-800">{submittedData.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Status:</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
              Pending Confirmation
            </span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`https://wa.me/${cleanWhatsapp}?text=${whatsappMsg}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-3 px-5 rounded-xl shadow-md transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Confirm on WhatsApp</span>
          </a>

          <button
            onClick={() => setIsSuccess(false)}
            className="inline-flex items-center justify-center text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 font-semibold text-xs py-3 px-5 rounded-xl transition-all"
          >
            Book Another Slot
          </button>
        </div>
      </div>
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMessage && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Row 1: Full Name & Phone */}
      <div className={`grid grid-cols-1 ${isCompact ? 'sm:grid-cols-1' : 'sm:grid-cols-2'} gap-4`}>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              {...register('fullName', { required: 'Full name is required' })}
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all ${errors.fullName ? 'border-red-400 bg-red-50/20' : 'border-slate-200 bg-white'
                }`}
            />
          </div>
          {errors.fullName && (
            <span className="text-[11px] text-red-500 mt-1 block">{errors.fullName.message}</span>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              placeholder="e.g. +91 98765 43210"
              {...register('phone', {
                required: 'Phone number is required',
                minLength: { value: 10, message: 'Please enter a valid phone number' },
              })}
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all ${errors.phone ? 'border-red-400 bg-red-50/20' : 'border-slate-200 bg-white'
                }`}
            />
          </div>
          {errors.phone && (
            <span className="text-[11px] text-red-500 mt-1 block">{errors.phone.message}</span>
          )}
        </div>
      </div>

      {/* Row 2: Email & Treatment Required */}
      <div className={`grid grid-cols-1 ${isCompact ? 'sm:grid-cols-1' : 'sm:grid-cols-2'} gap-4`}>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Email Address <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="e.g. rahul@example.com"
              {...register('email', {
                validate: (value) =>
                  !value || /^\S+@\S+\.\S+$/i.test(value) || 'Please enter a valid email address',
              })}
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all ${errors.email ? 'border-red-400 bg-red-50/20' : 'border-slate-200 bg-white'
                }`}
            />
          </div>
          {errors.email && (
            <span className="text-[11px] text-red-500 mt-1 block">{errors.email.message}</span>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Select Treatment
          </label>
          <div className="relative">
            <select
              {...register('treatmentRequired')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all cursor-pointer text-slate-700"
            >
              <option value="" disabled hidden>
                Choose Treatment
              </option>
              <option value="General Consultation & Checkup">General Consultation & Checkup</option>
              {treatments.map((t) => (
                <option key={t.slug} value={t.title}>
                  {t.title}
                </option>
              ))}
              <option value="Tooth Pain / Emergency">Tooth Pain / Emergency</option>
              <option value="Smile Makeover / Veneers">Smile Makeover / Veneers</option>
              <option value="Clear Aligners">Clear Aligners Consultation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Row 3: Date & Preferred Slot */}
      <div className={`grid grid-cols-1 ${isCompact ? 'sm:grid-cols-1' : 'sm:grid-cols-2'} gap-4`}>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Preferred Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="date"
              min={todayStr}
              {...register('preferredDate', { required: 'Please choose preferred date' })}
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all ${errors.preferredDate ? 'border-red-400 bg-red-50/20' : 'border-slate-200 bg-white'
                }`}
            />
          </div>
          {errors.preferredDate && (
            <span className="text-[11px] text-red-500 mt-1 block">{errors.preferredDate.message}</span>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Preferred Slot
          </label>
          <div className="relative">
            <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              {...register('preferredSlot')}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
            >
              <option value="Morning (10:00 AM - 01:00 PM)">Morning (10:00 AM - 01:00 PM)</option>
              <option value="Afternoon (02:00 PM - 05:00 PM)">Afternoon (02:00 PM - 05:00 PM)</option>
              <option value="Evening (05:00 PM - 08:30 PM)">Evening (05:00 PM - 08:00 PM)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Row 4: Notes */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Specific Concerns / Medical History (Optional)
        </label>
        <div className="relative">
          <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <textarea
            rows="2"
            placeholder="e.g. Sensitivity on right side, previous dental work, medication allergies..."
            {...register('notes')}
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
          ></textarea>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-md shadow-teal-600/25 hover:shadow-lg hover:shadow-teal-600/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
      >
        {submitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Submitting Request...</span>
          </>
        ) : (
          <>
            <Calendar className="w-4 h-4" />
            <span>Request Appointment</span>
          </>
        )}
      </button>

      {/* WhatsApp Direct Booking Prompt */}
      <div className="pt-1 text-center">
        <p className="text-xs sm:text-[13px] text-slate-600 font-medium">
          Prefer booking on WhatsApp directly?{' '}
          <a
            href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(`Hello ${clinicName}, I would like to book a dental consultation.`)}`}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-teal-700 hover:text-teal-800 hover:underline inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Click here</span>
            <span aria-hidden="true">&rarr;</span>
          </a>
        </p>
      </div>

      <p className="text-[11px] text-center text-slate-500 pt-1">
        🔒 Your personal details are completely secure under hospital patient confidentiality.
      </p>
    </form>
  );
};

export default AppointmentForm;
