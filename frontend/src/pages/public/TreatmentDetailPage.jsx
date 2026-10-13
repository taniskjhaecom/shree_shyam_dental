import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  HeartPulse,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Phone,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import apiClient from '../../api/apiClient';
import { useSettings } from '../../context/SettingsContext';
import { useAppointmentModal } from '../../context/AppointmentModalContext';
import SEO from '../../components/common/SEO';
import FAQAccordion from '../../components/common/FAQAccordion';
import TreatmentCard from '../../components/common/TreatmentCard';
import Loader from '../../components/common/Loader';
import { TreatmentDetailSkeleton } from '../../components/common/Skeleton';

const TREATMENT_IMAGE_MAP = {
  'dental-implants': {
    src: '/images/dental-implants-procedure-structure.png',
    alt: 'Dental Implant Procedure Structure with Titanium Screw, Abutment and Porcelain Crown',
  },
  'cosmetic-dentistry': {
    src: '/images/cosmetic-dentistry-smile-makeover.png',
    alt: 'Cosmetic Dentistry Smile Makeover Examination with Dental Mirror',
  },
  'e-max-veneers': {
    src: '/images/emax-porcelain-veneers-shade-matching.png',
    alt: 'E-max Porcelain Veneers Tooth Shade Matching and Aesthetic Smile Design',
  },
  'dental-bridge': {
    src: '/images/dental-bridge-fixed-restoration.png',
    alt: 'Fixed Dental Bridge Procedure Structure with Abutment Crowns and Pontic Tooth Replacement',
  },
  'digital-smile-design': {
    src: '/images/digital-smile-design-facial-mapping-simulation.png',
    alt: '3D Digital Smile Design Facial Mapping and Aesthetic Smile Simulation',
  },
  'composite-bonding': {
    src: '/images/composite-bonding-tooth-sculpting-smile.png',
    alt: 'Composite Bonding Tooth Sculpting for Seamless Natural Smile',
  },
  'teeth-whitening': {
    src: '/images/laser-teeth-whitening-before-after-results.png',
    alt: 'In-Office LED Laser Teeth Whitening Before and After Transformation',
  },
  'root-canal-rct': {
    src: '/images/rotary-root-canal-treatment-endodontics-procedure.jpg',
    alt: 'Painless Single Sitting Rotary Root Canal Treatment Procedure with Endodontic File',
  },
  'crowns-and-caps': {
    src: '/images/zirconia-dental-crown-tooth-cap-restoration.png',
    alt: 'Metal-Free Monolithic Zirconia Dental Crown and Tooth Cap Restoration',
  },
  'full-mouth-rehabilitation': {
    src: '/images/full-mouth-rehabilitation-implant-bridge-arch.png',
    alt: 'Full Mouth Rehabilitation All-on-4 Dental Implant Arch Reconstruction',
  },
  'dentures': {
    src: '/images/complete-dentures-upper-lower-prosthetics.png',
    alt: 'Complete Upper and Lower Modern Denture Prosthetics Set',
  },
  'pediatric-dentistry': {
    src: '/images/pediatric-dentistry-child-dental-checkup.png',
    alt: 'Gentle Child Friendly Pediatric Dentistry Examination and Consultation',
  },
  'clear-aligners': {
    src: '/images/invisible-clear-aligners-orthodontic-trays.png',
    alt: 'Transparent Invisible Clear Aligners Orthodontic Teeth Straightening',
  },
  'wisdom-tooth-removal': {
    src: '/images/impacted-wisdom-tooth-extraction-anatomy.png',
    alt: 'Impacted Wisdom Tooth Third Molar Extraction Anatomy and Surgical Removal',
  },
  'gum-treatment': {
    src: '/images/gum-disease-periodontal-treatment-gingivitis.png',
    alt: 'Periodontal Gum Disease Treatment and Gingivitis Care',
  },
  'cleaning-and-scaling': {
    src: '/images/ultrasonic-dental-scaling-teeth-cleaning.png',
    alt: 'Ultrasonic Dental Scaling and Professional Teeth Cleaning Procedure',
  },
};

const TreatmentDetailPage = () => {
  const { slug } = useParams();
  const { settings } = useSettings();
  const { openModal } = useAppointmentModal();

  const [treatment, setTreatment] = useState(null);
  const [relatedTreatments, setRelatedTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTreatment = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await apiClient.get(`/treatments/${slug}`);
        if (res.data.success) {
          setTreatment(res.data.data);
          setRelatedTreatments(res.data.related || []);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching treatment details:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTreatment();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return <TreatmentDetailSkeleton />;
  }

  if (error || !treatment) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4 text-center">
        <h2 className="font-heading font-bold text-2xl text-slate-800">Treatment Not Found</h2>
        <p className="text-sm text-slate-500">The requested treatment procedure could not be located.</p>
        <Link
          to="/treatments"
          className="inline-flex items-center gap-2 bg-teal-600 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Treatments</span>
        </Link>
      </div>
    );
  }

  const clinicName = settings?.clinicName || 'Shree Shyam Dental Hospital';
  const phone = settings?.phone || '+91 98765 43210';
  const cleanWhatsapp = (settings?.whatsapp || '+91 98765 43210').replace(/[^0-9]/g, '');

  const customMapping =
    TREATMENT_IMAGE_MAP[slug] ||
    TREATMENT_IMAGE_MAP[treatment.slug] ||
    (slug?.includes('implant') || treatment.title?.toLowerCase().includes('implant') ? TREATMENT_IMAGE_MAP['dental-implants'] : null) ||
    (slug?.includes('cosmetic') || treatment.title?.toLowerCase() === 'cosmetic dentistry' ? TREATMENT_IMAGE_MAP['cosmetic-dentistry'] : null) ||
    (slug?.includes('veneer') || treatment.title?.toLowerCase().includes('veneer') ? TREATMENT_IMAGE_MAP['e-max-veneers'] : null) ||
    (slug?.includes('bridge') || treatment.title?.toLowerCase().includes('bridge') ? TREATMENT_IMAGE_MAP['dental-bridge'] : null) ||
    (slug?.includes('smile-design') || treatment.title?.toLowerCase().includes('smile design') ? TREATMENT_IMAGE_MAP['digital-smile-design'] : null) ||
    (slug?.includes('bonding') || treatment.title?.toLowerCase().includes('bonding') ? TREATMENT_IMAGE_MAP['composite-bonding'] : null) ||
    (slug?.includes('whitening') || treatment.title?.toLowerCase().includes('whitening') ? TREATMENT_IMAGE_MAP['teeth-whitening'] : null) ||
    (slug?.includes('root-canal') || slug?.includes('rct') || treatment.title?.toLowerCase().includes('root canal') ? TREATMENT_IMAGE_MAP['root-canal-rct'] : null) ||
    (slug?.includes('crown') || treatment.title?.toLowerCase().includes('crown') || treatment.title?.toLowerCase().includes('caps') ? TREATMENT_IMAGE_MAP['crowns-and-caps'] : null) ||
    (slug?.includes('full-mouth') || treatment.title?.toLowerCase().includes('full-mouth') || treatment.title?.toLowerCase().includes('full mouth') ? TREATMENT_IMAGE_MAP['full-mouth-rehabilitation'] : null) ||
    (slug?.includes('denture') || treatment.title?.toLowerCase().includes('denture') ? TREATMENT_IMAGE_MAP['dentures'] : null) ||
    (slug?.includes('pediatric') || slug?.includes('child') || treatment.title?.toLowerCase().includes('pediatric') || treatment.title?.toLowerCase().includes('kids') ? TREATMENT_IMAGE_MAP['pediatric-dentistry'] : null) ||
    (slug?.includes('aligner') || treatment.title?.toLowerCase().includes('aligner') || treatment.title?.toLowerCase().includes('braces') ? TREATMENT_IMAGE_MAP['clear-aligners'] : null) ||
    (slug?.includes('wisdom') || treatment.title?.toLowerCase().includes('wisdom') ? TREATMENT_IMAGE_MAP['wisdom-tooth-removal'] : null) ||
    (slug?.includes('gum') || slug?.includes('periodont') || treatment.title?.toLowerCase().includes('gum') ? TREATMENT_IMAGE_MAP['gum-treatment'] : null) ||
    (slug?.includes('scaling') || slug?.includes('cleaning') || treatment.title?.toLowerCase().includes('scaling') || treatment.title?.toLowerCase().includes('cleaning') ? TREATMENT_IMAGE_MAP['cleaning-and-scaling'] : null);

  const isUnsplashOrEmpty = !treatment.heroImage?.secure_url || treatment.heroImage.secure_url.includes('unsplash.com');

  const heroImg =
    customMapping && isUnsplashOrEmpty
      ? customMapping.src
      : treatment.heroImage?.secure_url || customMapping?.src || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80';

  const heroAlt =
    customMapping
      ? customMapping.alt
      : treatment.heroImage?.alt || treatment.title;

  const seoTitle = treatment.seoTitle || `${treatment.title} | ${clinicName}`;
  const seoDesc = treatment.seoDescription || treatment.shortDescription;

  // JSON-LD Schema for MedicalProcedure / Service
  const treatmentSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name: treatment.title,
    description: treatment.shortDescription,
    image: heroImg,
    provider: {
      '@type': 'Dentist',
      name: clinicName,
      telephone: phone,
    },
    procedureType: 'https://schema.org/NonSurgicalProcedure',
    bodyLocation: 'Mouth / Teeth',
  };

  return (
    <>
      <SEO
        title={treatment.title}
        description={seoDesc}
        ogImage={heroImg}
        schema={treatmentSchema}
      />

      {/* Hero Header */}
      <section className="relative pt-8 pb-16 bg-gradient-to-b from-teal-50/50 via-white to-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link to="/" className="hover:text-teal-600">Home</Link>
            <span>/</span>
            <Link to="/treatments" className="hover:text-teal-600">Treatments</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">{treatment.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-100 text-teal-800 text-xs font-semibold uppercase tracking-wider">
                <HeartPulse className="w-3.5 h-3.5 text-teal-600" />
                {treatment.category || 'Speciality Treatment'}
              </span>

              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-tight">
                {treatment.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                {treatment.shortDescription}
              </p>

              {/* Meta Quick Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                  <span className="block text-[11px] text-slate-400 font-medium">Typical Duration</span>
                  <span className="font-semibold text-slate-800 text-xs sm:text-sm">{treatment.duration || '30–60 mins'}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                  <span className="block text-[11px] text-slate-400 font-medium">Recovery Period</span>
                  <span className="font-semibold text-slate-800 text-xs sm:text-sm">{treatment.recoveryTime || 'Immediate'}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs col-span-2 sm:col-span-1">
                  <span className="block text-[11px] text-slate-400 font-medium">Anaesthesia Mode</span>
                  <span className="font-semibold text-teal-700 text-xs sm:text-sm">{treatment.anesthesia || 'Painless Computer-Guided'}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={() => openModal(treatment.title)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-md transition-all cursor-pointer text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book {treatment.title} Slot</span>
                </button>

                <a
                  href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(`Hello Doctor, I would like to inquire about ${treatment.title}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-3.5 rounded-xl shadow-md transition-all text-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                <img
                  src={heroImg}
                  alt={heroAlt}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Details & Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Detailed Content */}
          <div className="max-w-4xl mx-auto space-y-6 text-left">
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
              Overview & Clinical Approach
            </h2>
            <div className="prose prose-slate max-w-none text-slate-600 text-base leading-relaxed space-y-4">
              <p className="whitespace-pre-line">{treatment.detailedContent}</p>
            </div>
          </div>

          {/* Key Benefits Grid */}
          {treatment.benefits?.length > 0 && (
            <div className="max-w-4xl mx-auto space-y-6 text-left">
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
                Key Patient Benefits
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {treatment.benefits.map((benefit, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-teal-50/50 border border-teal-100/80 flex items-start gap-3.5"
                  >
                    <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-heading font-bold text-sm text-slate-900">{benefit.title}</h4>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step-by-Step Treatment Process */}
          {treatment.process?.length > 0 && (
            <div className="max-w-4xl mx-auto space-y-6 text-left">
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
                Step-by-Step Procedure Workflow
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {treatment.process.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 relative"
                  >
                    <span className="font-mono font-bold text-xs text-teal-700 bg-teal-100 px-2.5 py-1 rounded-md inline-block">
                      Step 0{step.step || idx + 1}
                    </span>
                    <h4 className="font-heading font-bold text-base text-slate-900">{step.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Treatment Specific FAQs */}
          {treatment.faqs?.length > 0 && (
            <div className="max-w-4xl mx-auto space-y-6 text-left">
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
                Frequently Asked Questions about {treatment.title}
              </h2>
              <FAQAccordion faqs={treatment.faqs} showSearch={false} />
            </div>
          )}

          {/* Related Treatments */}
          {relatedTreatments.length > 0 && (
            <div className="space-y-6 pt-12 border-t border-slate-100">
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 text-center">
                Related Dental Procedures
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedTreatments.map((rel, idx) => (
                  <TreatmentCard key={rel.slug || idx} treatment={rel} index={idx} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default TreatmentDetailPage;
