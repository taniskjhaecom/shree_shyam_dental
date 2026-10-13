import React, { useState } from 'react';
import { HeartPulse, Search, Filter } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import SEO from '../../components/common/SEO';
import SectionHeading from '../../components/common/SectionHeading';
import TreatmentCard from '../../components/common/TreatmentCard';
import { CardSkeleton } from '../../components/common/Skeleton';

const TreatmentsPage = () => {
  const { treatments, settings, loading } = useSettings();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Implants',
    'Cosmetic',
    'Restorative',
    'General',
    'Orthodontics',
    'Pediatric',
    'Surgical',
  ];

  const filteredTreatments = treatments.filter((t) => {
    const matchesCategory =
      selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const clinicName = settings?.clinicName || 'Shree Shyam Dental Hospital';

  return (
    <>
      <SEO
        title="16 Specialised Dental Treatments"
        description={`Explore all 16 advanced dental treatments at ${clinicName}: Dental Implants, E-max Veneers, Painless RCT, Clear Aligners, Teeth Whitening, and Pediatric Care.`}
      />

      {/* Hero Header */}
      <section className="pt-12 pb-14 bg-gradient-to-b from-teal-50/50 via-white to-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold uppercase tracking-wider">
            <HeartPulse className="w-3.5 h-3.5 text-teal-600" />
            Comprehensive Dental Services
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight max-w-3xl mx-auto">
            16 Specialised Treatments Under One Roof
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Delivering hospital-grade sterilization, digital 3D precision, and gentle techniques tailored to every family member.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-72 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search treatments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
              />
            </div>
          </div>

          {/* Treatments Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : filteredTreatments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTreatments.map((treatment, idx) => (
                <TreatmentCard key={treatment.slug || idx} treatment={treatment} index={idx} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-sm">
              <p>No treatments found matching "{searchQuery}".</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-3 text-xs font-semibold text-teal-600 underline"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default TreatmentsPage;
