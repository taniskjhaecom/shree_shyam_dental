import React, { useEffect, useState } from 'react';
import { HelpCircle, MessageSquare, Phone } from 'lucide-react';
import apiClient from '../../api/apiClient';
import { useSettings } from '../../context/SettingsContext';
import { useAppointmentModal } from '../../context/AppointmentModalContext';
import SEO from '../../components/common/SEO';
import SectionHeading from '../../components/common/SectionHeading';
import FAQAccordion from '../../components/common/FAQAccordion';
import Loader from '../../components/common/Loader';
import { Skeleton } from '../../components/common/Skeleton';

const FAQPage = () => {
  const { settings } = useSettings();
  const { openModal } = useAppointmentModal();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/faqs');
        if (res.data.success) {
          setFaqs(res.data.data);
        }
      } catch (err) {
        console.error('Error loading FAQs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  const clinicName = settings?.clinicName || 'Shree Shyam Dental Hospital';
  const cleanWhatsapp = (settings?.whatsapp || '+91 98765 43210').replace(/[^0-9]/g, '');

  // JSON-LD FAQPage Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <>
      <SEO
        title="Frequently Asked Questions (FAQs)"
        description={`Get answers to common questions regarding dental implants, smile makeovers, root canal treatments, cost, insurance, and appointments at ${clinicName}.`}
        schema={faqSchema}
      />

      {/* Hero Header */}
      <section className="pt-12 pb-14 bg-gradient-to-b from-teal-50/50 via-white to-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
            Clear Answers
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight max-w-3xl mx-auto">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Everything you would want to know before visiting our dental hospital. Search below or select a category.
          </p>
        </div>
      </section>

      {/* Main Accordion Showcase */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="w-3/4 h-5 bg-slate-200 rounded" />
                  <div className="w-6 h-6 rounded-full bg-slate-200" />
                </div>
              ))}
            </div>
          ) : (
            <FAQAccordion faqs={faqs} showSearch={true} />
          )}

          {/* Still Have Questions Box */}
          <div className="mt-16 p-8 rounded-3xl bg-slate-50 border border-slate-200/80 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-xl text-slate-900">
              Still Have Questions?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Can't find the answer you're looking for? Speak directly with our clinical desk on WhatsApp or book a consultation.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hello Doctor, I have a dental question.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-3 px-5 rounded-xl shadow-md transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ask on WhatsApp</span>
              </a>

              <button
                onClick={() => openModal()}
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs py-3 px-5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <span>Book a Consultation</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQPage;
