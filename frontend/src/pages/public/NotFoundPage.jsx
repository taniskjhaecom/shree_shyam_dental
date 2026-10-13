import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home, Phone } from 'lucide-react';
import SEO from '../../components/common/SEO';
import { useSettings } from '../../context/SettingsContext';

const NotFoundPage = () => {
  const { settings } = useSettings();
  const phone = settings?.phone || '+91 98765 43210';

  return (
    <>
      <SEO title="Page Not Found (404)" noindex={true} />

      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center space-y-6 bg-slate-50">
        <div className="w-20 h-20 rounded-3xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto shadow-md">
          <FileQuestion className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-sm font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Error 404
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-md transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <a
            href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
            className="inline-flex items-center gap-2 bg-white text-slate-800 border border-slate-200 font-semibold text-xs px-5 py-3 rounded-xl hover:bg-slate-50 transition-all"
          >
            <Phone className="w-4 h-4 text-teal-600" />
            <span>Call Reception</span>
          </a>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
