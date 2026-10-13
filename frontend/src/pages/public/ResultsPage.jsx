import React, { useEffect, useState } from 'react';
import { Award, Calendar, ArrowRight } from 'lucide-react';
import apiClient from '../../api/apiClient';
import { useSettings } from '../../context/SettingsContext';
import { useAppointmentModal } from '../../context/AppointmentModalContext';
import SEO from '../../components/common/SEO';
import SectionHeading from '../../components/common/SectionHeading';
import BeforeAfterSlider from '../../components/common/BeforeAfterSlider';
import BeforeAfterModal from '../../components/common/BeforeAfterModal';
import Loader from '../../components/common/Loader';
import { CardSkeleton } from '../../components/common/Skeleton';

const ResultsPage = () => {
  const { settings } = useSettings();
  const { openModal } = useAppointmentModal();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/before-after');
        if (res.data.success) {
          setResults(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching before/after results:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const clinicName = settings?.clinicName || 'Shree Shyam Dental Hospital';
  const categories = ['All', ...new Set(results.map((r) => r.treatmentCategory).filter(Boolean))];

  const filteredResults = results.filter((r) => {
    if (selectedCategory === 'All') return true;
    return r.treatmentCategory === selectedCategory;
  });

  return (
    <>
      <SEO
        title="Real Patient Transformations & Smile Before-After Cases"
        description={`View genuine smile makeover, dental implant, veneer, and aligner results treated at ${clinicName} with interactive comparison sliders.`}
      />

      {/* Hero Header */}
      <section className="pt-12 pb-14 bg-gradient-to-b from-teal-50/50 via-white to-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-teal-600" />
            Verified Case Transformations
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight max-w-3xl mx-auto">
            Real Patient Transformations
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Genuine before & after photos from patients treated at {clinicName}. Slide left/right on any photo to compare.
          </p>
        </div>
      </section>

      {/* Main Showcase */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Category Filter */}
          {categories.length > 2 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredResults.map((item, idx) => (
                <BeforeAfterSlider
                  key={item._id || idx}
                  item={item}
                  onOpenDetails={setSelectedCase}
                />
              ))}
            </div>
          )}

          {/* CTA Box */}
          <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-teal-700 to-cyan-900 text-white text-center space-y-4">
            <h3 className="font-heading font-bold text-2xl">
              Ready for Your Own Smile Transformation?
            </h3>
            <p className="text-xs sm:text-sm text-teal-100 max-w-md mx-auto">
              Schedule a personalized consultation with Dr. Jitendra Saini for digital smile design and smile preview.
            </p>
            <button
              onClick={() => openModal('Smile Transformation / Makeover')}
              className="inline-flex items-center gap-2 bg-white text-teal-900 font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-slate-100 transition-all cursor-pointer text-xs sm:text-sm"
            >
              <Calendar className="w-4 h-4 text-teal-700" />
              <span>Book Transformation Consultation</span>
            </button>
          </div>
        </div>
      </section>

      {/* Full Transformation Case Detail Modal */}
      <BeforeAfterModal
        item={selectedCase}
        isOpen={!!selectedCase}
        onClose={() => setSelectedCase(null)}
      />
    </>
  );
};

export default ResultsPage;
