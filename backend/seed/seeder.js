const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const seedData = require('./seedData');

const Admin = require('../models/Admin');
const ClinicSettings = require('../models/ClinicSettings');
const Doctor = require('../models/Doctor');
const Treatment = require('../models/Treatment');
const BeforeAfterResult = require('../models/BeforeAfterResult');
const Gallery = require('../models/Gallery');
const Testimonial = require('../models/Testimonial');
const FAQ = require('../models/FAQ');
const Blog = require('../models/Blog');
const Appointment = require('../models/Appointment');
const ContactMessage = require('../models/ContactMessage');
const { invalidateSitemapCache } = require('../utils/sitemapGenerator');

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    console.log('[Seeder] Clearing old records...');
    await Admin.deleteMany();
    await ClinicSettings.deleteMany();
    await Doctor.deleteMany();
    await Treatment.deleteMany();
    await BeforeAfterResult.deleteMany();
    await Gallery.deleteMany();
    await Testimonial.deleteMany();
    await FAQ.deleteMany();
    await Blog.deleteMany();
    await Appointment.deleteMany();
    await ContactMessage.deleteMany();

    console.log('[Seeder] Seeding Admin...');
    await Admin.create({ ...seedData.admin });

    console.log('[Seeder] Seeding Clinic Settings...');
    await ClinicSettings.create(seedData.settings);

    console.log('[Seeder] Seeding Doctor Profile...');
    await Doctor.create(seedData.doctor);

    console.log(`[Seeder] Seeding ${seedData.treatments.length} Specialised Treatments...`);
    await Treatment.insertMany(seedData.treatments);

    console.log(`[Seeder] Seeding ${seedData.beforeAfter.length} Real Patient Transformations...`);
    await BeforeAfterResult.insertMany(seedData.beforeAfter);

    console.log(`[Seeder] Seeding ${seedData.gallery.length} Hospital Gallery items...`);
    await Gallery.insertMany(seedData.gallery);

    console.log(`[Seeder] Seeding ${seedData.testimonials.length} Patient Testimonials...`);
    await Testimonial.insertMany(seedData.testimonials);

    console.log(`[Seeder] Seeding ${seedData.faqs.length} FAQs...`);
    await FAQ.insertMany(seedData.faqs);

    console.log(`[Seeder] Seeding ${seedData.blogs.length} Dental Blogs...`);
    await Blog.insertMany(seedData.blogs);

    console.log(`[Seeder] Seeding initial Appointments...`);
    await Appointment.insertMany(seedData.appointments);

    invalidateSitemapCache();

    console.log('--------------------------------------------------');
    console.log('✅ [Seeder] Database Seeded Successfully for Shree Shyam Dental Hospital!');
    console.log('🔑 Admin Credentials:');
    console.log('   Email:    admin@shreeshyamdental.com');
    console.log('   Password: admin123456');
    console.log('--------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error(`❌ [Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Admin.deleteMany();
    await ClinicSettings.deleteMany();
    await Doctor.deleteMany();
    await Treatment.deleteMany();
    await BeforeAfterResult.deleteMany();
    await Gallery.deleteMany();
    await Testimonial.deleteMany();
    await FAQ.deleteMany();
    await Blog.deleteMany();
    await Appointment.deleteMany();
    await ContactMessage.deleteMany();
    invalidateSitemapCache();

    console.log('🗑️ [Seeder] All database records deleted.');
    process.exit(0);
  } catch (error) {
    console.error(`❌ [Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
