import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartPulse,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Award,
  HeartHandshake,
} from 'lucide-react';

const InstagramIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
import { useSettings } from '../../context/SettingsContext';
import { CLINIC_BRANCHES } from '../../constants/clinicBranches';

const Footer = () => {
  const { settings, treatments } = useSettings();

  const clinicName = settings?.clinicName || 'Shree Shyam Dental Hospital';
  const phone = settings?.phone || '+91 98765 43210';
  const secondaryPhone = settings?.secondaryPhone;
  const email = settings?.email || 'care@shreeshyamdental.com';
  const address = CLINIC_BRANCHES.main.fullAddress;
  const branch2Address = CLINIC_BRANCHES.branch2.fullAddress;

  const socialLinks = settings?.socialLinks || {};

  // Top featured treatments
  const featuredTreatments = treatments.slice(0, 6);

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-Column Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="flex items-center gap-3">
              <div>
                <span className="block font-heading font-bold text-xl text-white tracking-tight">
                  {clinicName}
                </span>
                <span className="block text-xs font-medium text-teal-400">
                  Advanced Dental & Implant Center
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed">
              Dedicated to delivering international dental standards, painless root canals, 3D smile design, and permanent dental implants in a sterile, comforting hospital environment.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-pink-400 hover:border-pink-500/30 transition-all"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
              )}
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-all"
                  aria-label="Facebook"
                >
                  <FacebookIcon />
                </a>
              )}
              {socialLinks.youtube && (
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all"
                  aria-label="YouTube"
                >
                  <YoutubeIcon />
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:border-sky-500/30 transition-all"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon />
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                  aria-label="Twitter"
                >
                  <TwitterIcon />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-heading font-semibold text-white text-base">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-teal-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-teal-400 transition-colors">
                  About Clinic & Doctor
                </Link>
              </li>
              <li>
                <Link to="/results" className="text-slate-400 hover:text-teal-400 transition-colors">
                  Real Patient Results
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-slate-400 hover:text-teal-400 transition-colors">
                  Hospital Gallery
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-slate-400 hover:text-teal-400 transition-colors">
                  Dental Health Blogs
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-slate-400 hover:text-teal-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/book-appointment" className="text-teal-400 hover:text-teal-300 font-medium transition-colors">
                  Book an Appointment
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Treatments */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-heading font-semibold text-white text-base">Key Treatments</h4>
            <ul className="space-y-2.5 text-sm">
              {featuredTreatments.length > 0 ? (
                featuredTreatments.map((t) => (
                  <li key={t.slug}>
                    <Link
                      to={`/treatments/${t.slug}`}
                      className="text-slate-400 hover:text-teal-400 transition-colors block truncate"
                    >
                      {t.title}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link to="/treatments" className="text-slate-400 hover:text-teal-400">Dental Implants</Link></li>
                  <li><Link to="/treatments" className="text-slate-400 hover:text-teal-400">E-max Porcelain Veneers</Link></li>
                  <li><Link to="/treatments" className="text-slate-400 hover:text-teal-400">Single Sitting RCT</Link></li>
                  <li><Link to="/treatments" className="text-slate-400 hover:text-teal-400">Clear Aligners</Link></li>
                </>
              )}
              <li>
                <Link to="/treatments" className="text-teal-400 hover:text-teal-300 font-semibold text-xs inline-flex items-center gap-1 mt-1">
                  View All 16 Treatments &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Visit Us & Contact Info */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-heading font-semibold text-white text-base">Visit Hospital</h4>
            <ul className="space-y-3.5 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[11px] font-semibold text-teal-300 uppercase tracking-wider mb-0.5">
                    {CLINIC_BRANCHES.main.label}
                  </span>
                  <span>{address}</span>
                </div>
              </li>
              <li className="flex items-start gap-3 pt-1 border-t border-slate-900">
                <MapPin className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[11px] font-semibold text-cyan-300 uppercase tracking-wider mb-0.5">
                    {CLINIC_BRANCHES.branch2.label}
                  </span>
                  <span>{branch2Address}</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-teal-400 shrink-0 mt-1" />
                <div className="space-y-1">
                  <a href={`tel:${phone}`} className="hover:text-white transition-colors block text-sm">
                    {phone}
                  </a>
                  {secondaryPhone && (
                    <a href={`tel:${secondaryPhone}`} className="hover:text-white transition-colors block text-sm">
                      {secondaryPhone}
                    </a>
                  )}
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {clinicName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-slate-400 transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
