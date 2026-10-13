# Shree Shyam Dental Hospital — Premium MERN Dental Web Application

A full-stack, conversion-focused, modern web application for **Shree Shyam Dental Hospital** built using the **MERN Stack (MongoDB, Express, React, Node.js) + Cloudinary + Tailwind CSS + Framer Motion**.

---

## 🌟 Key Features

### 1. Public Front-End Experience
- **Hero Section**: High-definition dental branding, conversion-focused CTAs, interactive statistics counter, and trust markers.
- **Trust & Statistics**: 6+ Years Experience, 10,000+ Happy Patients, 2,500+ Implants Placed, 98% Success Rate.
- **Meet Your Dentist**: Dynamic profile section for **Dr. Jitendra Saini (B.D.S., Dental Surgeon)** with degrees, clinical bio, memberships, signature quote, and consultation CTA.
- **Why Patients Trust Us**: 6 hospital difference pillars (Expert Specialist, Advanced Tech, Sterilised Setup, Painless Care, Family Friendly, Smile Guarantee).
- **16 Specialised Treatments**: Dedicated pages and cards with procedure breakdowns, benefits, recovery times, and FAQs:
  1. Dental Implants
  2. Cosmetic Dentistry
  3. E-max Veneers
  4. Dental Bridge
  5. Digital Smile Design
  6. Composite Bonding
  7. Teeth Whitening
  8. Root Canal (RCT)
  9. Crowns & Caps
  10. Full-Mouth Rehab
  11. Dentures
  12. Pediatric Dentistry
  13. Clear Aligners
  14. Wisdom Tooth Removal
  15. Gum Treatment & Periodontics
  16. Cleaning & Scaling
- **Warning Signs Section**: 8 interactive cards for early symptom detection (Tooth pain, bleeding gums, sensitivity, cavities, etc.).
- **Real Patient Transformations**: 8 interactive Before & After horizontal swipe comparison sliders with touch and drag support.
- **Smile Journey**: 4-step structured clinical path (Book Online -> Consultation -> Painless Treatment -> Smile Aftercare).
- **Hospital Gallery**: Masonry/grid gallery with category filtering and a full-screen image lightbox modal.
- **Dental Health Blogs**: Patient education articles with author credits, read times, tag filtering, and dynamic SEO schema.
- **Testimonial Carousel**: Auto-sliding reviews with pause-on-hover, verified patient badges, and star ratings.
- **Searchable FAQs**: Categorized accordion FAQs with schema structured data.
- **Appointment Booking System**: Modal and dedicated booking page with frontend & backend validation, slot selection, and MongoDB persistence.
- **Floating Action CTAs**: Floating WhatsApp & Emergency Call buttons connected to live Admin settings (auto-hidden on `/admin`).
- **Interactive Google Maps**: Configurable embed location.

### 2. Comprehensive Admin CMS Dashboard (`/admin`)
- **JWT Authentication & Security**: Encrypted admin login with token expiration and protected routes.
- **Analytics Dashboard**: Real-time counters for total, pending, confirmed, and completed appointments, treatments, blogs, and reviews.
- **Appointment Manager**: Filter by status (Pending, Confirmed, Completed, Cancelled), add doctor/admin notes, and delete records.
- **16 Treatments CMS**: Full CRUD, Cloudinary image upload, benefits list, procedure steps, and custom SEO metadata.
- **Before & After CMS**: Upload before and after photos, configure treatment duration, patient name, and clinical notes.
- **Hospital Gallery CMS**: Category management, captions, and Cloudinary uploads.
- **Blogs CMS**: Create, edit, draft, publish, and delete blog articles.
- **Patient Reviews CMS**: Add and manage verified reviews with star ratings.
- **FAQs CMS**: Categorize, reorder, and update FAQ answers.
- **Doctor Profile CMS**: Update doctor name, title, degrees, bio, quote, memberships, and photo.
- **Clinic Settings & SEO**: Manage hospital phone, secondary phone, WhatsApp, email, physical address, Google Maps URL, operating hours, social links, and meta defaults.
- **Contact Inquiries**: Review and resolve messages sent via the contact form.

### 3. Technical SEO & Performance
- **Dynamic Sitemap (`/sitemap.xml`)**: Generates XML with all static pages, published treatments (`/treatments/:slug`), and blogs (`/blogs/:slug`). Includes 1-hour in-memory cache with instant invalidation on CMS content changes.
- **Dynamic Robots.txt (`/robots.txt`)**: Correctly allows public crawl, disallows `/admin` and `/api`, and references the dynamic sitemap URL.
- **Per-Page Technical SEO (React Helmet Async)**: Dynamic titles, meta descriptions, Open Graph (OG) tags, Twitter cards, and canonical URLs.
- **Structured Data (JSON-LD)**: `Dentist` / `MedicalBusiness`, `MedicalProcedure`, `BlogPosting` / `Article`, and `FAQPage` schemas.
- **Performance Optimization**: Express Gzip compression, route-level code splitting with React Lazy & Suspense, responsive Cloudinary transformations, and zero layout shift.

---

## 📁 Project Structure

```
shri/
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   └── cloudinary.js         # Cloudinary configuration
│   ├── controllers/              # REST API controllers
│   ├── middleware/               # Auth, Upload, and Error handling
│   ├── models/                   # Mongoose schemas (10 schemas)
│   ├── routes/                   # Express routes
│   ├── seed/
│   │   ├── seedData.js           # 16 treatments, 8 before/after, doctor, FAQs, blogs
│   │   └── seeder.js             # Seeder runner script
│   ├── utils/
│   │   ├── cloudinaryUpload.js   # Cloudinary buffer stream uploader
│   │   └── sitemapGenerator.js   # Dynamic sitemap with 1-hr cache & invalidation
│   ├── server.js                 # Express server with compression & helmet
│   ├── test_suite.js             # 15 automated integration tests
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/apiClient.js      # Axios instance with JWT interceptor
│   │   ├── context/              # SettingsContext, AuthContext, AppointmentModalContext
│   │   ├── components/
│   │   │   ├── common/           # Navbar, Footer, SEO, BeforeAfterSlider, etc.
│   │   │   └── admin/            # AdminLayout, Sidebar, Header
│   │   ├── pages/
│   │   │   ├── public/           # Home, About, Treatments, Results, Gallery, Blogs, etc.
│   │   │   └── admin/            # Dashboard, Appointments, Treatments CMS, Settings, etc.
│   │   ├── App.jsx               # Routes with code-splitting
│   │   ├── main.jsx              # App entrypoint
│   │   └── index.css             # Tailwind CSS v4 styling & glassmorphism
│   ├── index.html                # Google Fonts preconnect & meta
│   ├── vite.config.js            # Vite config with backend proxy
│   └── package.json
│
├── PROJECT_PROGRESS.md           # Progress tracking and validation log
└── README.md                     # Setup and documentation
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://127.0.0.1:27017` (or MongoDB Atlas URI)

### 2. Backend Setup
```bash
cd backend
npm install

# Seed the database with all 16 treatments, 8 case studies, doctor profile, and admin user
npm run seed

# Start backend server (runs on port 5001)
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Start Vite frontend dev server (runs on port 5173 / proxying to 5001)
npm run dev
```

---

## 🔑 Admin Credentials
- **Portal URL**: `http://localhost:5173/admin/login`
- **Email**: `admin@shreeshyamdental.com`
- **Password**: `admin123456`
*(You can also use the "Auto-Fill Demo Admin Credentials" button on the login screen).*

---

## 🧪 Validation & Testing
Run the automated backend integration test suite anytime:
```bash
cd backend
node test_suite.js
```
