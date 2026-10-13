import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import SEO from '../../components/common/SEO';

const TermsPage = () => {
  const { settings } = useSettings();
  const clinicName = settings?.clinicName || 'Shree Shyam Dental Hospital';

  return (
    <>
      <SEO
        title="Terms & Conditions"
        description={`Terms and conditions for clinical consultations and services at ${clinicName}.`}
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
              Terms & Conditions
            </h1>
            <p className="text-xs text-slate-400">Last updated: October 2026</p>
          </div>

          <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-6">
            <p>
              Welcome to the official website of <strong>{clinicName}</strong>. By accessing or using our website and appointment request forms, you agree to comply with and be bound by the following terms.
            </p>

            <h3 className="font-heading font-bold text-lg text-slate-900">1. Nature of Online Information</h3>
            <p>
              Content, blog posts, and treatment summaries on this website are for educational and informative purposes only. They do not constitute a formal diagnosis or personalized treatment prescription. A direct in-person clinical examination and diagnostic radiograph are required prior to any dental procedure.
            </p>

            <h3 className="font-heading font-bold text-lg text-slate-900">2. Appointment Scheduling</h3>
            <p>
              Submitting an online appointment request does not guarantee immediate booking. Our clinic desk will contact you via phone or WhatsApp to confirm the final time slot based on doctor availability.
            </p>

            <h3 className="font-heading font-bold text-lg text-slate-900">3. Cancellations and Rescheduling</h3>
            <p>
              We appreciate at least 24 hours advance notice if you need to cancel or reschedule your scheduled consultation or surgical procedure.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsPage;
