import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Award,
  Zap,
  Users,
  Calendar,
  CheckCircle2,
  Cpu,
  HeartPulse,
  HeartHandshake,
  Activity,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useAppointmentModal } from '../../context/AppointmentModalContext';
import SEO from '../../components/common/SEO';
import SectionHeading from '../../components/common/SectionHeading';
import StatCard from '../../components/common/StatCard';

const AboutPage = () => {
  const { settings, doctor } = useSettings();
  const { openModal } = useAppointmentModal();

  const clinicName = settings?.clinicName || 'Shree Shyam Dental Hospital';
  const phone = settings?.phone || '+91 98765 43210';

  const statsList = settings?.stats?.length
    ? settings.stats
    : [
        { value: '6+', label: 'Years Experience', subtext: 'Clinical excellence & innovation', icon: 'Award' },
        { value: '10,000+', label: 'Happy Patients', subtext: 'Trusted for lifetime oral wellness', icon: 'Users' },
        { value: '2,500+', label: 'Implants Placed', subtext: 'Precision titanium & zirconia', icon: 'HeartPulse' },
        { value: '98%', label: 'Success Rate', subtext: 'Long-term proven outcomes', icon: 'ShieldCheck' },
      ];

  const safetyProtocols = [
    {
      title: 'Class-B Vacuum Autoclaves',
      desc: 'All surgical instruments undergo 134°C pressurized steam sterilization under micro-processor control.',
    },
    {
      title: '100% Single-Use Disposables',
      desc: 'Gloves, suction tips, patient drapes, needle tips, and impression trays are used only once and incinerated.',
    },
    {
      title: 'Chemical Surface Disinfection',
      desc: 'Dental chairs and operatory surfaces are wiped with hospital-grade disinfectant between every single patient.',
    },
    {
      title: 'Sealed Sterile Packaging',
      desc: 'Sterilized pouches with chemical indicator strips are opened directly in front of the patient.',
    },
  ];

  const techEquipment = [
    {
      title: '3D Digital Intraoral Optical Scanner',
      desc: 'Captures thousand images per second for accurate, goo-free digital impressions in minutes.',
      icon: Cpu,
    },
    {
      title: 'Rotary Single-Sitting Endodontics',
      desc: 'Nickel-titanium rotary files and apex locators that make root canals comfortable and fast.',
      icon: HeartPulse,
    },
    {
      title: 'Low-Radiation Digital RVG X-Rays',
      desc: 'Instant high-definition radiovisiography with 90% less radiation than conventional dental films.',
      icon: Activity,
    },
    {
      title: 'Laser-Assisted Gum Contouring',
      desc: 'Minimally invasive soft-tissue laser for painless gum shaping with zero bleeding.',
      icon: Zap,
    },
  ];

  return (
    <>
      <SEO
        title="About Us & Dentist Profile"
        description={`Learn about ${clinicName}, led by Dr. Jitendra Saini (B.D.S. Dental Surgeon), our hospital sterilization protocols, and advanced digital dentistry.`}
      />

      {/* Hero Header */}
      <section className="pt-12 pb-16 bg-gradient-to-b from-teal-50/50 via-white to-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            About Our Dental Hospital
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight max-w-3xl mx-auto">
            World-Class Dental Excellence in a Caring, Sterile Environment
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Combining specialist clinical mastery, 3D computer-aided precision, and gentle painless care to create healthy, confident smiles that last a lifetime.
          </p>
        </div>
      </section>

     

      {/* Doctor Profile Section */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white p-6 sm:p-10 lg:p-12 rounded-3xl border border-slate-200/80 shadow-xl">
            {/* Left Doctor Image */}
            <div className="lg:col-span-5">
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

                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
                  {doctor?.name || 'Dr. Jitendra Saini'}
                </h2>
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

             

              <div className="pt-2">
                <button
                  onClick={() => openModal()}
                  className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Consultation with Dr. Jitendra Saini</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
 {/* Stats Bar */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {statsList.map((stat, idx) => (
              <StatCard key={idx} stat={stat} index={idx} />
            ))}
          </div>
        </div>
      </section>
      {/* Hospital Infrastructure & Sterilization */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Infection Control"
            badgeIcon={ShieldCheck}
            title="Hospital-Grade Sterilization & Patient Safety"
            subtitle="Your safety is our highest priority. We follow 5-tier international sterilization protocols."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {safetyProtocols.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-teal-200 hover:shadow-lg transition-all text-left space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
                  0{idx + 1}
                </div>
                <h3 className="font-heading font-bold text-base text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Advanced Technology */}
          <SectionHeading
            badge="Digital Precision"
            badgeIcon={Cpu}
            title="State-of-the-Art Dental Technology"
            subtitle="Equipped with next-generation digital dentistry tools for unmatched precision and speed."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techEquipment.map((tech, idx) => {
              const IconComp = tech.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-gradient-to-b from-white to-slate-50 border border-slate-200/80 hover:border-cyan-200 hover:shadow-lg transition-all text-left space-y-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-slate-900">{tech.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{tech.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-14 bg-gradient-to-r from-teal-700 to-cyan-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white">
            Ready to Experience Gentle, Specialist Dental Care?
          </h2>
          <p className="text-sm sm:text-base text-teal-100 max-w-xl mx-auto">
            Book a 1-on-1 consultation slot at {clinicName} today.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 bg-white text-teal-900 font-bold px-7 py-3.5 rounded-xl shadow-lg hover:bg-slate-100 transition-all cursor-pointer text-sm"
            >
              <Calendar className="w-4 h-4 text-teal-700" />
              <span>Book an Appointment</span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
