const mongoose = require('mongoose');

const clinicSettingsSchema = new mongoose.Schema(
  {
    clinicName: {
      type: String,
      required: true,
      default: 'Shree Shyam Dental Hospital',
      trim: true,
    },
    tagline: {
      type: String,
      default: 'Every Smile Matters — Advanced Dental & Implant Center',
    },
    logo: {
      public_id: { type: String, default: '' },
      secure_url: { type: String, default: '' },
      alt: { type: String, default: 'Shree Shyam Dental Hospital Logo' },
    },
    phone: {
      type: String,
      required: true,
      default: '+91 98765 43210',
    },
    secondaryPhone: {
      type: String,
      default: '+91 98765 43211',
    },
    whatsapp: {
      type: String,
      required: true,
      default: '+91 98765 43210',
    },
    email: {
      type: String,
      required: true,
      default: 'care@shreeshyamdental.com',
    },
    branch1Name: {
      type: String,
      default: 'Main Branch',
    },
    address: {
      street: { type: String, default: 'Shanti Nagar, Newari Road, Chofuliya' },
      city: { type: String, default: 'Jhunjhunu' },
      state: { type: String, default: 'Rajasthan' },
      pincode: { type: String, default: '333053' },
      fullAddress: {
        type: String,
        default: 'Shanti Nagar, Newari Road, Chofuliya, Jhunjhunu, Rajasthan 333053',
      },
    },
    googleMapsEmbedUrl: {
      type: String,
      default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3611650.505210623!2d70.75712901250004!3d27.87119520000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396cd5f7fbc7410b%3A0xa76b463d52193661!2sShree%20shyam%20dental%20%26%20general%20hospital!5e0!3m2!1sen!2sin!4v1790949514040!5m2!1sen!2sin',
    },
    branch2Name: {
      type: String,
      default: '',
    },
    branch2Address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
      fullAddress: {
        type: String,
        default: '',
      },
    },
    branch2GoogleMapsEmbedUrl: {
      type: String,
      default: '',
    },
    operatingHours: {
      weekdays: { type: String, default: 'Monday – Saturday: 09:00 AM – 08:30 PM' },
      sunday: { type: String, default: 'Sunday: 10:00 AM – 02:00 PM (Prior Appointment)' },
      emergency: { type: String, default: '24/7 Emergency Dental Assistance Available' },
    },
    hero: {
      badge: { type: String, default: 'Leading Dental Hospital & Implant Center' },
      heading: { type: String, default: 'Every Smile Matters' },
      subheading: {
        type: String,
        default: 'Experience painless, world-class dental care with hospital-grade sterilization, digital precision, and experienced dental surgeons.',
      },
      heroImage: {
        public_id: { type: String, default: '' },
        secure_url: { type: String, default: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80' },
        alt: { type: String, default: 'Modern Dental Clinic Hospital' },
      },
      ctaPrimaryText: { type: String, default: 'Book an Appointment' },
      ctaSecondaryText: { type: String, default: 'Explore Treatments' },
    },
    stats: [
      {
        value: { type: String, default: '6+' },
        label: { type: String, default: 'Years Experience' },
        subtext: { type: String, default: 'Clinical excellence & innovation' },
        icon: { type: String, default: 'Award' },
      },
      {
        value: { type: String, default: '10,000+' },
        label: { type: String, default: 'Happy Patients' },
        subtext: { type: String, default: 'Trusted for lifetime oral wellness' },
        icon: { type: String, default: 'Users' },
      },
      {
        value: { type: String, default: '2,500+' },
        label: { type: String, default: 'Implants Placed' },
        subtext: { type: String, default: 'Precision titanium & zirconia' },
        icon: { type: String, default: 'Sparkles' },
      },
      {
        value: { type: String, default: '98%' },
        label: { type: String, default: 'Success Rate' },
        subtext: { type: String, default: 'Long-term proven outcomes' },
        icon: { type: String, default: 'ShieldCheck' },
      },
    ],
    whyChooseUs: {
      type: [
        {
          number: { type: String, default: '01' },
          title: { type: String, default: 'Experienced Dental Surgeon' },
          description: { type: String, default: 'B.D.S. Dental Surgeon with 6+ years of clinical excellence and 2,500+ implants placed.' },
          icon: { type: String, default: 'UserCheck' },
        },
      ],
      default: () => [
        {
          number: '01',
          title: 'Experienced Dental Surgeon',
          description: 'B.D.S. Chief Dental Surgeon with 6+ years of clinical excellence and 2,500+ successful implant and surgical restorations.',
          icon: 'UserCheck',
        },
        {
          number: '02',
          title: 'Advanced Tech & Digital Imaging',
          description: 'Equipped with digital RVG X-rays, intra-oral cameras, electronic apex locators and painless rotary endodontics.',
          icon: 'Cpu',
        },
        {
          number: '03',
          title: 'Class-B Hospital Sterilisation',
          description: 'Hospital-grade Class-B autoclaving, sealed sterile pouches, and 100% disposable instruments for complete infection control.',
          icon: 'Shield',
        },
        {
          number: '04',
          title: 'Painless Gentle Procedures',
          description: 'Computerized localized anesthesia and gentle clinical techniques ensure completely anxiety-free visits for all ages.',
          icon: 'HeartPulse',
        },
        {
          number: '05',
          title: 'Complete Family Dentistry',
          description: 'From pediatric preventive dental care to full-mouth rehabilitation and dentures, we cater to every generation under one roof.',
          icon: 'Smile',
        },
        {
          number: '06',
          title: 'Transparent Smile Guarantee',
          description: 'Honest clinical assessments, zero hidden costs, and warranties on implants and zirconia restorations for lifetime confidence.',
          icon: 'Sparkles',
        },
      ],
    },
    warningSigns: {
      type: [
        {
          title: { type: String, default: 'Tooth Pain' },
          description: { type: String, default: 'Sharp ache or throbbing' },
          icon: { type: String, default: 'Zap' },
        },
      ],
      default: () => [
        {
          title: 'Tooth Pain & Throbbing',
          description: 'Sharp or lingering ache, often signaling nerve inflammation or deep decay.',
          icon: 'Zap',
        },
        {
          title: 'Bleeding & Swollen Gums',
          description: 'Bleeding during brushing or flossing indicates gingivitis or early periodontitis.',
          icon: 'AlertCircle',
        },
        {
          title: 'Hot & Cold Sensitivity',
          description: 'Sharp discomfort to cold water, tea, or sweets indicating enamel erosion or nerve exposure.',
          icon: 'Thermometer',
        },
        {
          title: 'Persistent Bad Breath',
          description: 'Halitosis that persists after brushing may point to hidden bacterial infection or gum disease.',
          icon: 'Wind',
        },
        {
          title: 'Loose or Shifting Teeth',
          description: 'Wobbling teeth or changes in bite alignment signal underlying bone or ligament loss.',
          icon: 'Activity',
        },
        {
          title: 'Cavities & Dark Spots',
          description: 'Visible black spots, holes, or food trap areas that worsen if left untreated.',
          icon: 'ShieldAlert',
        },
        {
          title: 'Crooked or Crowded Teeth',
          description: 'Misaligned bite or overlapping teeth causing jaw tension and aesthetic concerns.',
          icon: 'Grid',
        },
        {
          title: 'Missing Tooth Spaces',
          description: 'Unreplaced gaps causing adjacent teeth to tilt and jaw bone resorption.',
          icon: 'PlusCircle',
        },
      ],
    },
    smileJourney: [
      {
        step: { type: Number, default: 1 },
        title: { type: String, default: 'Book Online' },
        description: { type: String, default: 'Call, WhatsApp or fill the form. Get a confirmed slot within 24 hours.' },
      },
      {
        step: { type: Number, default: 2 },
        title: { type: String, default: 'Consultation' },
        description: { type: String, default: 'Digital X-ray, smile preview & a crystal-clear treatment plan.' },
      },
      {
        step: { type: Number, default: 3 },
        title: { type: String, default: 'Painless Treatment' },
        description: { type: String, default: 'Modern, sterile and gentle clinical care — at your comfort.' },
      },
      {
        step: { type: Number, default: 4 },
        title: { type: String, default: 'Smile Aftercare' },
        description: { type: String, default: 'Scheduled follow-ups & smile warranty for lifelong confidence.' },
      },
    ],
    ctaBanner: {
      badge: { type: String, default: 'Smile Makeover' },
      heading: { type: String, default: "Ready for the Smile You've Always Wanted?" },
      subheading: {
        type: String,
        default: 'Book a 1-on-1 consultation with our senior specialist — your personalised smile transformation starts here.',
      },
      buttonText: { type: String, default: 'Book an Appointment' },
      whatsappText: { type: String, default: 'Chat on WhatsApp' },
    },
    socialLinks: {
      instagram: { type: String, default: 'https://instagram.com' },
      facebook: { type: String, default: 'https://facebook.com' },
      youtube: { type: String, default: 'https://youtube.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
      twitter: { type: String, default: 'https://twitter.com' },
    },
    seoDefaults: {
      metaTitle: {
        type: String,
        default: 'Shree Shyam Dental Hospital | Advanced Dental & Implant Center',
      },
      metaDescription: {
        type: String,
        default: 'Shree Shyam Dental Hospital provides state-of-the-art painless dental implants, cosmetic dentistry, root canal treatments, and pediatric care with hospital sterilization.',
      },
      ogImage: {
        type: String,
        default: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
      },
      keywords: {
        type: String,
        default: 'dental hospital, dental clinic, dental implants, cosmetic dentistry, root canal, teeth whitening, veneers, dentist near me',
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ClinicSettings', clinicSettingsSchema);
