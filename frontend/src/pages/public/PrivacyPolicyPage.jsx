import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import SEO from '../../components/common/SEO';

const PrivacyPolicyPage = () => {
  const { settings } = useSettings();
  const clinicName = settings?.clinicName || 'Shree Shyam Dental Hospital';

  return (
    <>
      <SEO
        title="Privacy Policy"
        description={`Privacy Policy and Patient Data Protection statement for ${clinicName}.`}
      />

      <div className="py-14 bg-slate-50 min-h-screen text-left">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-sm">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="space-y-2">
            <h1 className="font-heading font-extrabold text-3xl text-slate-900">
              Privacy & Patient Data Policy
            </h1>
            <p className="text-xs text-slate-400">Last updated: October 2026</p>
          </div>

          <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-6">
            <p>
              At <strong>{clinicName}</strong>, we are committed to protecting the privacy, confidentiality, and security of all personal, contact, and medical information provided by our patients through our website, appointment forms, or in-clinic consultations.
            </p>

            <h3 className="font-heading font-bold text-lg text-slate-900">1. Information We Collect</h3>
            <p>
              When you submit an appointment request, contact inquiry, or consultation form, we collect your name, phone number, email address, preferred appointment date/slot, and any voluntary medical history or specific dental concerns you choose to share.
            </p>

            <h3 className="font-heading font-bold text-lg text-slate-900">2. How We Use Your Information</h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>To confirm, reschedule, or manage your dental appointment slots.</li>
              <li>To answer specific clinical inquiries and provide customized treatment details.</li>
              <li>To send appointment reminders via SMS, WhatsApp, or phone call.</li>
              <li>We <strong>never sell, rent, or trade</strong> patient personal or medical information to third-party marketers.</li>
            </ul>

            <h3 className="font-heading font-bold text-lg text-slate-900">3. Medical Confidentiality</h3>
            <p>
              All patient clinical records, radiographs, and treatment notes are securely stored in compliance with professional healthcare confidentiality guidelines.
            </p>

            <h3 className="font-heading font-bold text-lg text-slate-900">4. Contact Us</h3>
            <p>
              For privacy queries or requests regarding your data, please contact our hospital front desk at{' '}
              <a href={`mailto:${settings?.email || 'care@shreeshyamdental.com'}`} className="text-teal-600 font-semibold underline">
                {settings?.email || 'care@shreeshyamdental.com'}
              </a>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
