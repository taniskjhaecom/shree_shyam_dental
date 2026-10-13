import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  ArrowRight,
  ShieldCheck,
  Phone,
  MessageSquare,
  Award,
  Users,
  CheckCircle2,
  Clock,
  MapPin,
  Mail,
  Zap,
  AlertCircle,
  Thermometer,
  Wind,
  Activity,
  ShieldAlert,
  Grid,
  PlusCircle,
  UserCheck,
  Cpu,
  Shield,
  HeartPulse,
  Smile,
  HelpCircle,
  BookOpen,
  ScanFace,
  HeartHandshake,
} from 'lucide-react';

import apiClient from '../../api/apiClient';
import { useSettings } from '../../context/SettingsContext';
import { useAppointmentModal } from '../../context/AppointmentModalContext';
import SEO from '../../components/common/SEO';
import SectionHeading from '../../components/common/SectionHeading';
import StatCard from '../../components/common/StatCard';
import { CLINIC_BRANCHES } from '../../constants/clinicBranches';
import TreatmentCard from '../../components/common/TreatmentCard';
import BeforeAfterSlider from '../../components/common/BeforeAfterSlider';
import BeforeAfterModal from '../../components/common/BeforeAfterModal';
import TestimonialCarousel from '../../components/common/TestimonialCarousel';
import FAQAccordion from '../../components/common/FAQAccordion';
import BlogCard from '../../components/common/BlogCard';
import AppointmentForm from '../../components/common/AppointmentForm';
import { CardSkeleton } from '../../components/common/Skeleton';

const warningIconMap = {
  Zap,
  AlertCircle,
  Thermometer,
  Wind,
  Activity,
  ShieldAlert,
  Grid,
  PlusCircle,
};

const whyChooseIconMap = {
  UserCheck,
  Cpu,
  Shield,
  HeartPulse,
  Smile,
  Award,
};

const DEFAULT_SMILE_JOURNEY = [
  {
    number: '01',
    icon: Calendar,
    title: 'Book Consultation',
    description: 'Schedule effortlessly online, call us, or message directly on WhatsApp with your preferred slot.',
  },
  {
    number: '02',
    icon: ScanFace,
    title: '3D Digital Assessment',
    description: 'Comprehensive digital imaging, intraoral camera check, and transparent treatment planning.',
  },
  {
    number: '03',
    icon: Smile,
    title: 'Painless Precision Care',
    description: 'Relax in our ergonomic dental suites while specialists execute gentle, high-tech treatments.',
  },
  {
    number: '04',
    icon: HeartHandshake,
    title: 'Lifelong Smile Support',
    description: 'Routine maintenance checkups, and round-the-clock aftercare support.',
  },
];

const HomePage = () => {
  const { settings, doctor, treatments } = useSettings();
  const { openModal } = useAppointmentModal();

  const [beforeAfterCases, setBeforeAfterCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [activeMapBranch, setActiveMapBranch] = useState(1);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [baRes, faqRes, testRes, blogRes] = await Promise.all([
          apiClient.get('/before-after'),
          apiClient.get('/faqs'),
          apiClient.get('/testimonials'),
          apiClient.get('/blogs?limit=4'),
        ]);

        if (baRes.data.success) setBeforeAfterCases(baRes.data.data);
        if (faqRes.data.success) setFaqs(faqRes.data.data);
        if (testRes.data.success) setTestimonials(testRes.data.data);
        if (blogRes.data.success) setBlogs(blogRes.data.data);
      } catch (err) {
        console.error('Error fetching home page data:', err);
      }
    };
    fetchHomeData();
  }, []);

  const clinicName = settings?.clinicName || 'Shree Shyam Dental Hospital';
  const phone = settings?.phone || '+91 98765 43210';
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const cleanWhatsapp = (settings?.whatsapp || '+91 98765 43210').replace(/[^0-9]/g, '');

  const heroHeading = settings?.hero?.heading || 'Every Smile Matters';
  const heroSubheading =
    (settings?.hero?.subheading
      ? settings.hero.subheading.replace(/Jaipur/gi, 'Jhunjhunu')
      : null) ||
    'Experience gentle, hospital-grade dental care with digital precision, painless procedures, and experienced dental surgeons in Jhunjhunu.';
  const heroImg =
    settings?.hero?.heroImage?.secure_url &&
      !settings.hero.heroImage.secure_url.includes('photo-1629909613654-28e377c37b09')
      ? settings.hero.heroImage.secure_url
      : '/hero-smile.jpg';

  const statsList = settings?.stats?.length
    ? settings.stats
    : [
      { value: '6+', label: 'Years Experience', subtext: 'Clinical excellence & innovation', icon: 'Award' },
      { value: '10,000+', label: 'Happy Patients', subtext: 'Trusted for lifetime oral wellness', icon: 'Users' },
      { value: '2,500+', label: 'Implants Placed', subtext: 'Precision titanium & zirconia', icon: 'HeartPulse' },
      { value: '98%', label: 'Success Rate', subtext: 'Long-term proven outcomes', icon: 'ShieldCheck' },
    ];

  const whyChooseItems = settings?.whyChooseUs || [];
  const warningSigns = settings?.warningSigns || [];
  const journeySteps =
    settings?.smileJourney && settings.smileJourney.length === 4
      ? settings.smileJourney.map((s, idx) => ({
        number: `0${s.step || idx + 1}`,
        icon: [Calendar, ScanFace, Smile, HeartHandshake][idx] || DEFAULT_SMILE_JOURNEY[idx]?.icon || Calendar,
        title: s.title || DEFAULT_SMILE_JOURNEY[idx]?.title,
        description: s.description || DEFAULT_SMILE_JOURNEY[idx]?.description,
      }))
      : DEFAULT_SMILE_JOURNEY;

  return (
    <>
      <SEO
        title="Shree Shyam Dental Hospital — Advanced Dental & Implant Center"
        description="Shree Shyam Dental Hospital in Jhunjhunu offers painless dental implants, cosmetic dentistry, root canal treatments, and comprehensive dental care with hospital-grade sterilization."
      />

      {/* ---------------- 1. HERO SECTION ---------------- */}
      <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden bg-gradient-to-b from-teal-50/40 via-white to-slate-50">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-cyan-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              {/* Main Heading */}
              <h1 className="font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl xl:text-[5rem] tracking-tight leading-[1.08] my-0">
                <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-500 bg-clip-text text-transparent">
                  {heroHeading}
                </span>
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                {heroSubheading}
              </p>

              {/* Trust Checkmarks */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs text-slate-700 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  BDS Dental Surgeon
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  Painless Anaesthesia
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  Class-B Sterilization
                </span>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={() => openModal()}
                  className="inline-flex items-center gap-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold px-6 py-4 rounded-xl shadow-lg shadow-teal-600/30 hover:shadow-xl hover:shadow-teal-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer text-sm sm:text-base"
                >
                  <Calendar className="w-5 h-5" />
                  <span>{settings?.hero?.ctaPrimaryText === 'Book Appointment' ? 'Book an Appointment' : (settings?.hero?.ctaPrimaryText || 'Book an Appointment')}</span>
                </button>

                <Link
                  to="/treatments"
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-6 py-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-teal-300 transition-all text-sm sm:text-base group"
                >
                  <span>{settings?.hero?.ctaSecondaryText || 'Explore Treatments'}</span>
                  <ArrowRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Right Visual Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-[4/3] sm:aspect-[4/3] bg-slate-100 group">
                <img
                  src={heroImg}
                  alt="Modern Dental Hospital Care"
                  className="w-full h-full object-cover object-[center_25%] group-hover:scale-103 transition-transform duration-700"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------------- 2. TRUST / STATS SECTION ---------------- */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {statsList.map((stat, idx) => (
              <StatCard key={idx} stat={stat} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 3. ABOUT / MEET YOUR DENTIST ---------------- */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Clinical Leadership"
            badgeIcon={Award}
            title="Meet Your Dentist"
            subtitle="Led by experienced Dental Surgeons dedicated to ethical, precise and painless oral health care."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white p-6 sm:p-10 lg:p-12 rounded-3xl border border-slate-200/80 shadow-xl">
            {/* Left Doctor Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border-2 border-slate-100 bg-slate-100">
                <img
                  src={
                    doctor?.image?.secure_url &&
                      !doctor.image.secure_url.includes('photo-1622253692010')
                      ? doctor.image.secure_url
                      : '/dr-jitendra-saini.jpg'
                  }
                  alt={doctor?.image?.alt || doctor?.name || 'Dr. Jitendra Saini'}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-5 text-white">
                  <span className="text-xs font-semibold text-teal-300 block uppercase tracking-wider">
                    {doctor?.title || 'Chief Dental Surgeon'}
                  </span>
                  <h3 className="font-heading font-bold text-xl">{doctor?.name || 'Dr. Jitendra Saini'}</h3>
                </div>
              </div>
            </div>

            {/* Right Doctor Bio */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {(doctor?.degrees || ['B.D.S.']).map(
                    (deg, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200/60"
                      >
                        {deg}
                      </span>
                    )
                  )}
                </div>

                <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
                  {doctor?.name || 'Dr. Jitendra Saini'}
                </h3>
                <p className="text-sm font-semibold text-teal-700">
                  {doctor?.title || 'Chief Dental Surgeon'} • {doctor?.experienceYears || 6}+ Years Experience
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {doctor?.bio ||
                  'Dr. Jitendra Saini is an experienced Dental Surgeon (B.D.S.) with over 6+ years of clinical excellence in dental implants, restorative care, and aesthetic smile transformations. He is dedicated to offering gentle, painless, and biologically sound oral treatments using global digital dentistry standards.'}
              </p>

              {/* Quote */}
              <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/70 border-l-4 border-teal-600 text-slate-800">
                <p className="text-sm sm:text-base italic font-medium">
                  {doctor?.quote ||
                    '“My goal is simple — to give every patient a smile they’re proud of, with the comfort and care they deserve.”'}
                </p>
              </div>

              {/* Specialization pills */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Key Clinical Expertise:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {(doctor?.specializations || []).slice(0, 4).map((spec, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{spec}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => openModal()}
                  className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-teal-600/25 transition-all cursor-pointer text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book a Consultation with Doctor</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 4. WHY PATIENTS TRUST US (6 DIFFERENCE PILLARS) ---------------- */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="The Clinic Advantage"
            badgeIcon={ShieldCheck}
            title="Shree Shyam Dental Hospital Difference"
            subtitle="Six reasons families and implant candidates choose us for lifetime dental wellness."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {whyChooseItems.map((item, idx) => {
              const IconComp = whyChooseIconMap[item.icon] || ShieldCheck;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="p-7 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-teal-200 hover:shadow-xl transition-all duration-300 relative group text-left"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono font-bold text-xs text-teal-600 tracking-wider bg-teal-100/70 px-2.5 py-1 rounded-md">
                      {item.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- 5. 16 SPECIALISED TREATMENTS ---------------- */}
      <section className="py-16 sm:py-24 bg-slate-50" id="treatments-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Comprehensive Care"
            badgeIcon={HeartPulse}
            title="16 Specialised Treatments Under One Roof"
            subtitle="From single-sitting painless RCTs and clear aligners to complex full-mouth implants and pediatric care."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {treatments.length > 0
              ? treatments.map((treatment, idx) => (
                <TreatmentCard key={treatment.slug || idx} treatment={treatment} index={idx} />
              ))
              : [1, 2, 3, 4, 5, 6, 7, 8].map((i) => <CardSkeleton key={i} />)}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/treatments"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-7 py-3.5 rounded-xl shadow-lg transition-all"
            >
              <span>View All 16 Treatment Details</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- 6. WARNING SIGNS SECTION ---------------- */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Early Intervention"
            badgeIcon={ShieldAlert}
            title="Don't Ignore These Warning Signs"
            subtitle="Early treatment saves teeth, money and pain — book a check-up if any of these sound familiar."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {warningSigns.map((sign, idx) => {
              const IconComp = warningIconMap[sign.icon] || Zap;

              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-gradient-to-b from-white to-slate-50 border border-slate-200/80 hover:border-red-200 hover:shadow-lg transition-all duration-300 flex items-start gap-4 text-left group"
                >
                  <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-slate-900 mb-0.5">
                      {sign.title}
                    </h4>
                    <p className="text-xs text-slate-500">{sign.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-4 py-2.5 rounded-xl border border-teal-200 transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Experiencing any symptom? Schedule a Preventive Checkup</span>
            </button>
          </div>
        </div>
      </section>

      {/* ---------------- 7. REAL RESULTS (BEFORE / AFTER COMPARISON) ---------------- */}
      <section className="py-16 sm:py-24 bg-slate-50" id="results-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Clinical Outcomes"
            badgeIcon={Award}
            title="Real Patient Transformations"
            subtitle="Genuine before & after photos from patients treated at the clinic. Drag horizontal slider to compare."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {beforeAfterCases.slice(0, 8).map((item, idx) => (
              <BeforeAfterSlider
                key={item._id || idx}
                item={item}
                onOpenDetails={setSelectedCase}
              />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/results"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all"
            >
              <span>Explore All Patient Case Studies</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- 8. SMILE JOURNEY IN 4 STEPS ---------------- */}
      <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-14 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-teal-50/90 border border-teal-200/80 text-teal-700 text-xs font-bold uppercase tracking-wider shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
              SIMPLE &amp; STRESS-FREE
            </span>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-[1.15]">
              Your 4-Step Journey to a Perfect <br className="hidden sm:inline" />
              Smile
            </h2>

            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              We have designed our patient workflow to ensure absolute comfort, clear communication, and predictable results from day one.
            </p>
          </div>

          {/* Cards Grid with Horizontal Line Background */}
          <div className="relative">
            {/* Desktop Connecting Line centered across the squircle icons */}
            <div className="hidden lg:block absolute top-[4.25rem] left-[10%] right-[10%] h-[2px] bg-teal-300/80 z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 relative z-10">
              {journeySteps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_32px_-6px_rgba(13,148,136,0.14)] hover:border-teal-200/80 transition-all duration-300 text-center flex flex-col items-center group relative"
                >
                  {/* Icon Box with Top-Right Yellow Step Badge */}
                  <div className="relative mb-6">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white flex items-center justify-center shadow-lg shadow-teal-600/25 group-hover:scale-105 transition-transform duration-300">
                      <step.icon className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2} />
                    </div>
                    {/* Yellow Step Number Badge */}
                    <div className="absolute -top-1.5 -right-2 bg-amber-400 text-slate-950 text-[10px] sm:text-[11px] font-extrabold px-1.5 py-0.5 rounded-full shadow-xs border-2 border-white leading-none min-w-[20px] text-center">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-slate-900 mb-2.5 group-hover:text-teal-700 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 9. HIGHLIGHTED CTA / PITCH BANNER ---------------- */}
      <section className="py-14 sm:py-20 bg-gradient-to-r from-teal-700 via-teal-800 to-cyan-900 text-white relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-teal-200 text-xs font-semibold uppercase tracking-wider">
            <HeartPulse className="w-3.5 h-3.5" />
            {settings?.ctaBanner?.badge || 'Smile Makeover'}
          </span>

          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            {settings?.ctaBanner?.heading || "Ready for the Smile You've Always Wanted?"}
          </h2>

          <p className="text-sm sm:text-base text-teal-100 max-w-2xl mx-auto leading-relaxed">
            {settings?.ctaBanner?.subheading ||
              'Book a 1-on-1 consultation with our senior dentist — your personalised smile transformation starts here.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-teal-900 font-bold px-7 py-4 rounded-xl shadow-xl hover:scale-105 transition-all cursor-pointer text-sm sm:text-base"
            >
              <Calendar className="w-5 h-5 text-teal-700" />
              <span>{settings?.ctaBanner?.buttonText === 'Book Appointment' ? 'Book an Appointment' : (settings?.ctaBanner?.buttonText || 'Book an Appointment')}</span>
            </button>

            <a
              href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hello Doctor, I would like to book a dental appointment.')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-7 py-4 rounded-xl shadow-xl hover:scale-105 transition-all text-sm sm:text-base"
            >
              <MessageSquare className="w-5 h-5" />
              <span>{settings?.ctaBanner?.whatsappText || 'Chat on WhatsApp'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* ---------------- 10. TESTIMONIALS CAROUSEL ---------------- */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Patient Love"
            badgeIcon={HeartPulse}
            title="Trusted for Lifetime Oral Wellness"
            subtitle="Read real experiences from patients who entrusted their smiles and implants to Shree Shyam Dental Hospital."
          />

          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* ---------------- 11. FAQS ACCORDION ---------------- */}
      <section className="py-16 sm:py-24 bg-white" id="faqs-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Got Questions?"
            badgeIcon={HelpCircle}
            title="Frequently Asked Questions"
            subtitle="Everything you'd want to know before your first consultation or dental procedure."
          />

          <FAQAccordion faqs={faqs} showSearch={false} />

          <div className="text-center mt-10">
            <Link
              to="/faqs"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800"
            >
              <span>View All FAQ Categories & Search Answers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- 12. LATEST DENTAL BLOGS ---------------- */}
      {blogs.length > 0 && (
        <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              badge="Oral Health Insights"
              badgeIcon={BookOpen}
              title="Latest Articles & Guides"
              subtitle="Evidence-based dental health advice from our specialist clinical team."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {blogs.map((blog, idx) => (
                <BlogCard key={blog.slug || idx} blog={blog} index={idx} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- 13. CONTACT / APPOINTMENT SECTION & MAP ---------------- */}
      <section className="py-16 sm:py-24 bg-white" id="appointment-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Get in Touch"
            badgeIcon={Calendar}
            title="Book Your Appointment Today"
            subtitle="Request your preferred time slot or contact our hospital desk directly."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left: Clinic Contact Info */}
            <div className="lg:col-span-5 flex flex-col justify-between text-left p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl h-full">
              <div className="space-y-5">
                <div>
                  <h3 className="font-heading font-bold text-2xl text-white">
                    {clinicName}
                  </h3>
                  <p className="text-xs text-teal-400 mt-1 font-medium">
                    Advanced Dental & Implant Center
                  </p>
                </div>

                <div className="space-y-4 text-sm text-slate-300">
                  {/* Branch 1 Address */}
                  <div className="flex items-start gap-3.5">
                    <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs font-semibold text-white uppercase tracking-wider mb-0.5">
                        {CLINIC_BRANCHES.main.label}
                      </span>
                      <span>{CLINIC_BRANCHES.main.fullAddress}</span>
                    </div>
                  </div>

                  {/* Branch 2 Address */}
                  <div className="flex items-start gap-3.5 pt-3 border-t border-slate-800/80">
                    <MapPin className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs font-semibold text-white uppercase tracking-wider mb-0.5">
                        {CLINIC_BRANCHES.branch2.label}
                      </span>
                      <span>{CLINIC_BRANCHES.branch2.fullAddress}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 pt-1">
                    <Phone className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="block text-xs font-semibold text-white uppercase tracking-wider mb-1">Helpline & Booking:</span>
                      <a href={`tel:${phone}`} className="hover:text-teal-300 block font-medium text-sm">{phone}</a>
                      {settings?.secondaryPhone && (
                        <a href={`tel:${settings.secondaryPhone}`} className="hover:text-teal-300 block font-medium text-sm">{settings.secondaryPhone}</a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 pt-1">
                    <Mail className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs font-semibold text-white uppercase tracking-wider mb-0.5">Email Desk:</span>
                      <a href={`mailto:${settings?.email || 'care@shreeshyamdental.com'}`} className="hover:text-teal-300 block font-medium text-sm">
                        {settings?.email || 'care@shreeshyamdental.com'}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 pt-1">
                    <Clock className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs font-semibold text-white uppercase tracking-wider mb-0.5">Operating Hours:</span>
                      <p className="text-xs text-slate-300">Monday – Sunday: 10:00 AM – 08:00 PM</p>
                      <p className="text-xs text-teal-400 font-semibold mt-1">24/7 Dental Emergency On-Call</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action Button */}
              <div className="pt-6 border-t border-slate-800/80 mt-6">
                <a
                  href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hello Shree Shyam Dental Hospital, I have an inquiry.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Instant WhatsApp Connect</span>
                </a>
              </div>
            </div>

            {/* Right: Appointment Request Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl text-left h-full flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-bold text-xl text-slate-900 mb-1">
                  Request a Consultation Slot
                </h3>
                <p className="text-xs text-slate-500 mb-5">
                  Fill the details below and our patient care team will call you back to confirm your appointment.
                </p>

                <AppointmentForm isCompact={false} />
              </div>
            </div>
          </div>

          {/* ---------------- 14. GOOGLE MAPS EMBED (MULTI-BRANCH SWITCHER) ---------------- */}
          <div className="mt-14 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 px-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span className="font-heading font-bold text-sm text-slate-800">
                  Find Our Hospital Locations on Map:
                </span>
              </div>
              <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveMapBranch(1)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeMapBranch === 1
                      ? 'bg-white text-teal-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📍 Main Branch
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMapBranch(2)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeMapBranch === 2
                      ? 'bg-white text-teal-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📍 Kankaria Branch
                </button>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200 aspect-[21/9] sm:aspect-[24/9] w-full bg-slate-100">
              <iframe
                title={`Shree Shyam Dental Hospital Location Map ${activeMapBranch === 2 ? 'Kankaria Branch' : 'Main Branch'}`}
                src={activeMapBranch === 2 ? CLINIC_BRANCHES.branch2.mapEmbedUrl : CLINIC_BRANCHES.main.mapEmbedUrl}
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
      </section>

      {/* Case Details Modal */}
      <BeforeAfterModal
        item={selectedCase}
        isOpen={!!selectedCase}
        onClose={() => setSelectedCase(null)}
      />
    </>
  );
};

export default HomePage;
