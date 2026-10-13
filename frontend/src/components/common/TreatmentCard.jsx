import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Award } from 'lucide-react';
import { useAppointmentModal } from '../../context/AppointmentModalContext';

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

const TreatmentCard = ({ treatment, index = 0 }) => {
  const { openModal } = useAppointmentModal();

  const customMapping =
    TREATMENT_IMAGE_MAP[treatment.slug] ||
    (treatment.slug?.includes('implant') || treatment.title?.toLowerCase().includes('implant') ? TREATMENT_IMAGE_MAP['dental-implants'] : null) ||
    (treatment.slug?.includes('cosmetic') || treatment.title?.toLowerCase() === 'cosmetic dentistry' ? TREATMENT_IMAGE_MAP['cosmetic-dentistry'] : null) ||
    (treatment.slug?.includes('veneer') || treatment.title?.toLowerCase().includes('veneer') ? TREATMENT_IMAGE_MAP['e-max-veneers'] : null) ||
    (treatment.slug?.includes('bridge') || treatment.title?.toLowerCase().includes('bridge') ? TREATMENT_IMAGE_MAP['dental-bridge'] : null) ||
    (treatment.slug?.includes('smile-design') || treatment.title?.toLowerCase().includes('smile design') ? TREATMENT_IMAGE_MAP['digital-smile-design'] : null) ||
    (treatment.slug?.includes('bonding') || treatment.title?.toLowerCase().includes('bonding') ? TREATMENT_IMAGE_MAP['composite-bonding'] : null) ||
    (treatment.slug?.includes('whitening') || treatment.title?.toLowerCase().includes('whitening') ? TREATMENT_IMAGE_MAP['teeth-whitening'] : null) ||
    (treatment.slug?.includes('root-canal') || treatment.slug?.includes('rct') || treatment.title?.toLowerCase().includes('root canal') ? TREATMENT_IMAGE_MAP['root-canal-rct'] : null) ||
    (treatment.slug?.includes('crown') || treatment.title?.toLowerCase().includes('crown') || treatment.title?.toLowerCase().includes('caps') ? TREATMENT_IMAGE_MAP['crowns-and-caps'] : null) ||
    (treatment.slug?.includes('full-mouth') || treatment.title?.toLowerCase().includes('full-mouth') || treatment.title?.toLowerCase().includes('full mouth') ? TREATMENT_IMAGE_MAP['full-mouth-rehabilitation'] : null) ||
    (treatment.slug?.includes('denture') || treatment.title?.toLowerCase().includes('denture') ? TREATMENT_IMAGE_MAP['dentures'] : null) ||
    (treatment.slug?.includes('pediatric') || treatment.slug?.includes('child') || treatment.title?.toLowerCase().includes('pediatric') || treatment.title?.toLowerCase().includes('kids') ? TREATMENT_IMAGE_MAP['pediatric-dentistry'] : null) ||
    (treatment.slug?.includes('aligner') || treatment.title?.toLowerCase().includes('aligner') || treatment.title?.toLowerCase().includes('braces') ? TREATMENT_IMAGE_MAP['clear-aligners'] : null) ||
    (treatment.slug?.includes('wisdom') || treatment.title?.toLowerCase().includes('wisdom') ? TREATMENT_IMAGE_MAP['wisdom-tooth-removal'] : null) ||
    (treatment.slug?.includes('gum') || treatment.slug?.includes('periodont') || treatment.title?.toLowerCase().includes('gum') ? TREATMENT_IMAGE_MAP['gum-treatment'] : null) ||
    (treatment.slug?.includes('scaling') || treatment.slug?.includes('cleaning') || treatment.title?.toLowerCase().includes('scaling') || treatment.title?.toLowerCase().includes('cleaning') ? TREATMENT_IMAGE_MAP['cleaning-and-scaling'] : null);

  const isUnsplashOrEmpty = !treatment.heroImage?.secure_url || treatment.heroImage.secure_url.includes('unsplash.com');

  const imageUrl =
    customMapping && isUnsplashOrEmpty
      ? customMapping.src
      : treatment.heroImage?.secure_url || customMapping?.src || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80';

  const imageAlt =
    customMapping
      ? customMapping.alt
      : treatment.heroImage?.alt || treatment.title;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: (index % 4) * 0.08 }}
      whileHover={{ y: -6 }}
      className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-teal-200 transition-all duration-300 flex flex-col overflow-hidden group"
    >
      {/* Image container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={imageAlt}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Category tag */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/95 text-teal-800 backdrop-blur-md shadow-xs">
            {treatment.category || 'Speciality Care'}
          </span>
        </div>

        {treatment.isPopular && (
          <div className="absolute top-3 right-3">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs">
              <Award className="w-3 h-3" />
              Popular
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-1">
            <Link to={`/treatments/${treatment.slug}`}>{treatment.title}</Link>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {treatment.shortDescription}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <Link
            to={`/treatments/${treatment.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors group/link"
          >
            <span>Learn More</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
          </Link>

          <button
            onClick={() => openModal(treatment.title)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white transition-all cursor-pointer"
          >
            <Calendar className="w-3 h-3" />
            <span>Book</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TreatmentCard;
