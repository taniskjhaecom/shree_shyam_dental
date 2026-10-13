import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Building2,
} from 'lucide-react';
import apiClient from '../../api/apiClient';
import { useSettings } from '../../context/SettingsContext';
import SEO from '../../components/common/SEO';
import SectionHeading from '../../components/common/SectionHeading';
import { CLINIC_BRANCHES } from '../../constants/clinicBranches';

const ContactPage = () => {
  const { settings } = useSettings();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeMapBranch, setActiveMapBranch] = useState(1);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const clinicName = settings?.clinicName || 'Shree Shyam Dental Hospital';
  const phone = settings?.phone || '+91 98765 43210';
  const secondaryPhone = settings?.secondaryPhone;
  const whatsapp = settings?.whatsapp || '+91 98765 43210';
  const email = settings?.email || 'care@shreeshyamdental.com';

  const mainBranchAddress = CLINIC_BRANCHES.main.fullAddress;
  const branch2Address = CLINIC_BRANCHES.branch2.fullAddress;

  const mainMapUrl = CLINIC_BRANCHES.main.mapEmbedUrl;
  const branch2MapUrl = CLINIC_BRANCHES.branch2.mapEmbedUrl;

  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrorMessage('');
    try {
      const payload = {
        fullName: data.name || data.fullName,
        email: data.email ? data.email.trim() : '',
        phone: data.phone,
        subject: data.subject || 'General Inquiry',
        message: data.message,
      };
      const res = await apiClient.post('/contact', payload);
      if (res.data.success) {
        setSuccess(true);
        reset();
      } else {
        setErrorMessage(res.data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Unable to send your message. Please reach us by phone.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact Us & Clinic Directions"
        description={`Reach ${clinicName} for appointments, queries, directions, and emergency dental consultations.`}
      />

      {/* Hero Header */}
      <section className="pt-12 pb-14 bg-gradient-to-b from-teal-50/50 via-white to-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            Always Here For Your Smile
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight max-w-3xl mx-auto">
            Get in Touch With Us
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Have questions about treatments, costs, or want to schedule an in-person dental consultation? Connect with our care team today.
          </p>
        </div>
      </section>

      {/* Contact Cards Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Phone */}
            <div className="p-6 rounded-2xl bg-teal-50/50 border border-teal-100 flex flex-col justify-between space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-slate-900 text-base">Call Support</h3>
                <p className="text-xs text-slate-500 mt-1">Direct phone line for bookings</p>
                <div className="mt-3 space-y-1.5">
                  <a
                    href={`tel:${cleanPhone}`}
                    className="block text-sm font-bold text-teal-700 hover:text-teal-800 transition-colors"
                  >
                    {phone}
                  </a>
                  {secondaryPhone && (
                    <a
                      href={`tel:${secondaryPhone.replace(/[^0-9+]/g, '')}`}
                      className="block text-sm font-bold text-teal-700 hover:text-teal-800 transition-colors"
                    >
                      {secondaryPhone}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col justify-between space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-slate-900 text-base">WhatsApp Desk</h3>
                <p className="text-xs text-slate-500 mt-1">Fast messaging & quick queries</p>
                <a
                  href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                    `Hello ${clinicName}, I would like to enquire about a dental consultation.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-3 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  {whatsapp} &rarr;
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="p-6 rounded-2xl bg-cyan-50/50 border border-cyan-100 flex flex-col justify-between space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-md shadow-cyan-600/20">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-slate-900 text-base">Email Us</h3>
                <p className="text-xs text-slate-500 mt-1">For reports, queries & corporate</p>
                <a
                  href={`mailto:${email}`}
                  className="inline-block mt-3 text-sm font-bold text-cyan-800 hover:text-cyan-900 transition-colors break-all"
                >
                  {email}
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-md">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-slate-900 text-base">Hospital Locations</h3>
                <div className="mt-2 text-xs text-slate-600 space-y-2">
                  <div>
                    <span className="block font-semibold text-teal-700 uppercase tracking-wider text-[10px]">
                      {CLINIC_BRANCHES.main.label}
                    </span>
                    <p className="mt-0.5">{mainBranchAddress}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <span className="block font-semibold text-cyan-700 uppercase tracking-wider text-[10px]">
                      {CLINIC_BRANCHES.branch2.label}
                    </span>
                    <p className="mt-0.5">{branch2Address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form and Map Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Contact Form */}
            <div className="lg:col-span-6 bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-heading font-bold text-2xl text-slate-900 mb-2">
                Send Us a Message
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-6">
                Fill in the details below and our hospital reception will get back to you promptly.
              </p>

              {success ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-heading font-bold text-emerald-900 text-lg">Message Sent Successfully!</h4>
                  <p className="text-xs sm:text-sm text-emerald-700 max-w-sm mx-auto">
                    Thank you for writing to us. Our clinical coordinator will respond within 2-4 business hours.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-2 px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 cursor-pointer transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        {...register('name', { required: 'Please enter your name' })}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      {errors.name && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        {...register('phone', {
                          required: 'Please enter your phone number',
                          pattern: {
                            value: /^[0-9+\s-]{8,15}$/,
                            message: 'Please enter a valid phone number',
                          },
                        })}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      {errors.phone && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="email"
                        {...register('email', {
                          validate: (val) =>
                            !val || /^\S+@\S+\.\S+$/i.test(val) || 'Please enter a valid email address',
                        })}
                        placeholder="yourname@gmail.com"
                        className={`w-full px-4 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          errors.email ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Subject / Treatment
                      </label>
                      <input
                        type="text"
                        {...register('subject')}
                        placeholder="e.g. Dental Implants Enquiry"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Message *
                    </label>
                    <textarea
                      rows={4}
                      {...register('message', { required: 'Please enter your message' })}
                      placeholder="Please describe what dental care or assistance you need..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    ></textarea>
                    {errors.message && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-lg shadow-teal-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {submitting ? (
                      <span>Sending message...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right: Map & Location details */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
                <button
                  onClick={() => setActiveMapBranch(1)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeMapBranch === 1
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Main Branch Map</span>
                </button>
                <button
                  onClick={() => setActiveMapBranch(2)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeMapBranch === 2
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Kankaria Branch Map</span>
                </button>
              </div>

              <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200 aspect-[16/10] w-full bg-slate-100">
                <iframe
                  title="Shree Shyam Dental Hospital Google Map"
                  src={activeMapBranch === 2 && branch2MapUrl ? branch2MapUrl : mainMapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
