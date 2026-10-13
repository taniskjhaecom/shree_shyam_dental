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
    whyChooseUs: [
      {
        number: { type: String, default: '01' },
        title: { type: String, default: 'Experienced Dental Surgeon' },
        description: { type: String, default: 'B.D.S. Dental Surgeon with 6+ years of clinical excellence and 2,500+ implants placed.' },
        icon: { type: String, default: 'UserCheck' },
      },
      {
        number: { type: String, default: '02' },
        title: { type: String, default: 'Advanced Tech' },
        description: { type: String, default: 'Digital X-rays, intra-oral scanners & rotary endodontics.' },
        icon: { type: String, default: 'Cpu' },
      },
      {
        number: { type: String, default: '03' },
        title: { type: String, default: 'Sterilised Setup' },
        description: { type: String, default: 'Hospital-grade autoclave & one-time-use disposables.' },
        icon: { type: String, default: 'Shield' },
      },
      {
        number: { type: String, default: '04' },
        title: { type: String, default: 'Painless Care' },
        description: { type: String, default: 'Modern anaesthesia and gentle techniques — even kids love us.' },
        icon: { type: String, default: 'HeartPulse' },
      },
      {
        number: { type: String, default: '05' },
        title: { type: String, default: 'Family Friendly' },
        description: { type: String, default: 'Care for kids, adults and seniors under one roof.' },
        icon: { type: String, default: 'Smile' },
      },
      {
        number: { type: String, default: '06' },
        title: { type: String, default: 'Smile Guarantee' },
        description: { type: String, default: "If you're not happy with the result, we make it right." },
        icon: { type: String, default: 'Sparkles' },
      },
    ],
    warningSigns: [
      { title: { type: String, default: 'Tooth Pain' }, description: { type: String, default: 'Sharp ache or throbbing' }, icon: { type: String, default: 'Zap' } },
      { title: { type: String, default: 'Bleeding Gums' }, description: { type: String, default: 'While brushing or flossing' }, icon: { type: String, default: 'AlertCircle' } },
      { title: { type: String, default: 'Sensitivity' }, description: { type: String, default: 'To hot, cold or sweet' }, icon: { type: String, default: 'Thermometer' } },
      { title: { type: String, default: 'Bad Breath' }, description: { type: String, default: "That just won't fade" }, icon: { type: String, default: 'Wind' } },
      { title: { type: String, default: 'Loose Teeth' }, description: { type: String, default: 'Wobbling or shifting' }, icon: { type: String, default: 'Activity' } },
      { title: { type: String, default: 'Cavities' }, description: { type: String, default: 'Visible decay or holes' }, icon: { type: String, default: 'ShieldAlert' } },
      { title: { type: String, default: 'Crooked Smile' }, description: { type: String, default: 'Gaps or misalignment' }, icon: { type: String, default: 'Grid' } },
      { title: { type: String, default: 'Missing Teeth' }, description: { type: String, default: 'Time to replace' }, icon: { type: String, default: 'PlusCircle' } },
    ],
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
