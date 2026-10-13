const http = require('http');

const request = (path, options = {}, body = null) => {
  return new Promise((resolve, reject) => {
    const defaultOptions = {
      hostname: 'localhost',
      port: 5001,
      path,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    if (body) {
      if (typeof body === 'object') {
        body = JSON.stringify(body);
        defaultOptions.headers['Content-Type'] = 'application/json';
      }
      defaultOptions.headers['Content-Length'] = Buffer.byteLength(body);
    }

    const req = http.request(defaultOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, data: json, raw: data });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
};

async function runTestSuite() {
  console.log('====================================================');
  console.log('🧪 Starting Full System Integration Validation Suite');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}:`, err.message);
      failed++;
    }
  };

  // 1. Health check
  await test('API Health Check', async () => {
    const res = await request('/api/health');
    if (res.status !== 200 || res.data?.status !== 'healthy') throw new Error('Health check failed');
  });

  // 2. Dynamic Sitemap XML
  await test('Dynamic /sitemap.xml Generation & Format', async () => {
    const res = await request('/sitemap.xml');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (!res.raw.includes('<?xml version="1.0" encoding="UTF-8"?>')) throw new Error('Invalid XML preamble');
    if (!res.raw.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) throw new Error('Missing sitemap urlset');
    if (!res.raw.includes('/treatments/dental-implants')) throw new Error('Missing treatment URL in sitemap');
    if (!res.raw.includes('<lastmod>')) throw new Error('Missing lastmod in sitemap');
  });

  // 3. Dynamic Robots.txt
  await test('Dynamic /robots.txt Directives & Sitemap Reference', async () => {
    const res = await request('/robots.txt');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (!res.raw.includes('Disallow: /admin')) throw new Error('Missing Disallow: /admin');
    if (!res.raw.includes('Disallow: /api')) throw new Error('Missing Disallow: /api');
    if (!res.raw.includes('Sitemap:')) throw new Error('Missing Sitemap directive');
  });

  // 4. Public Settings
  await test('Public Settings API', async () => {
    const res = await request('/api/settings');
    if (res.status !== 200 || res.data?.data?.clinicName !== 'Shree Shyam Dental Hospital') {
      throw new Error('Clinic settings mismatch');
    }
  });

  // 5. Doctor Profile
  await test('Doctor Profile API', async () => {
    const res = await request('/api/doctor');
    if (res.status !== 200 || !res.data?.data?.name) {
      throw new Error('Doctor profile missing');
    }
  });

  // 6. 16 Treatments API
  await test('16 Specialised Treatments API Count & Slugs', async () => {
    const res = await request('/api/treatments');
    if (res.status !== 200 || res.data?.count < 16) {
      throw new Error(`Expected at least 16 treatments, got ${res.data?.count}`);
    }
    const single = await request('/api/treatments/dental-implants');
    if (single.status !== 200 || single.data?.data?.slug !== 'dental-implants') {
      throw new Error('Single treatment slug lookup failed');
    }
  });

  // 7. Before / After Transformations
  await test('Before/After Patient Transformations API', async () => {
    const res = await request('/api/before-after');
    if (res.status !== 200 || res.data?.count < 8) {
      throw new Error(`Expected at least 8 transformations, got ${res.data?.count}`);
    }
  });

  // 8. Hospital Gallery
  await test('Hospital Gallery Items API', async () => {
    const res = await request('/api/gallery');
    if (res.status !== 200 || res.data?.count < 8) {
      throw new Error('Gallery items count mismatch');
    }
  });

  // 9. Testimonials & FAQs
  await test('Patient Testimonials & FAQs API', async () => {
    const res1 = await request('/api/testimonials');
    const res2 = await request('/api/faqs');
    if (res1.status !== 200 || res1.data?.count < 6) throw new Error('Testimonials mismatch');
    if (res2.status !== 200 || res2.data?.count < 7) throw new Error('FAQs mismatch');
  });

  // 10. Blogs API
  await test('Dental Health Blogs API & Slug Resolution', async () => {
    const res = await request('/api/blogs');
    if (res.status !== 200 || res.data?.count < 4) throw new Error('Blogs count mismatch');
    const single = await request('/api/blogs/dental-implants-vs-bridges-best-choice');
    if (single.status !== 200 || !single.data?.data?.title) throw new Error('Blog slug lookup failed');
  });

  // 11. Public Appointment Submission
  let createdAppointmentId = null;
  await test('Public Appointment Request Submission & Validation', async () => {
    const payload = {
      fullName: 'Vikram Test User',
      phone: '+91 99999 88888',
      email: 'vikram.test@example.com',
      treatmentRequired: 'Dental Implants',
      preferredDate: '2026-10-10',
      preferredSlot: 'Morning (10:00 AM - 01:00 PM)',
      notes: 'Automated test booking request',
    };
    const res = await request('/api/appointments', { method: 'POST' }, payload);
    if (res.status !== 201 || !res.data?.data?._id) {
      throw new Error('Appointment submission failed');
    }
    createdAppointmentId = res.data.data._id;
  });

  // 12. Public Contact Form Submission
  await test('Public Contact Form Submission', async () => {
    const payload = {
      fullName: 'Anjali Sharma',
      email: 'anjali@example.com',
      phone: '+91 98888 77777',
      subject: 'Inquiry on Clear Aligners',
      message: 'Hello, what is the cost of clear aligners?',
    };
    const res = await request('/api/contact', { method: 'POST' }, payload);
    if (res.status !== 201 || !res.data?.data?._id) {
      throw new Error('Contact message submission failed');
    }
  });

  // 13. Admin Login & JWT Authentication
  let adminToken = null;
  await test('Admin JWT Login Authentication', async () => {
    const res = await request(
      '/api/auth/login',
      { method: 'POST' },
      { email: 'admin@shreeshyamdental.com', password: 'admin123456' }
    );
    if (res.status !== 200 || !res.data?.data?.token) {
      throw new Error('Admin login failed');
    }
    adminToken = res.data.data.token;
  });

  // 14. Protected Admin Dashboard Stats
  await test('Admin Dashboard Stats API (Protected)', async () => {
    const res = await request('/api/dashboard/stats', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (res.status !== 200 || !res.data?.data?.stats) {
      throw new Error('Dashboard stats lookup failed');
    }
  });

  // 15. Admin Status Update Workflow & Delete
  await test('Admin Appointment Status Workflow (Pending -> Confirmed -> Deleted)', async () => {
    if (!createdAppointmentId) throw new Error('No appointment ID available');
    const updateRes = await request(
      `/api/appointments/${createdAppointmentId}`,
      { method: 'PUT', headers: { Authorization: `Bearer ${adminToken}` } },
      { status: 'Confirmed', adminNotes: 'Confirmed by Dr. Saini desk.' }
    );
    if (updateRes.status !== 200 || updateRes.data?.data?.status !== 'Confirmed') {
      throw new Error('Status update failed');
    }

    const deleteRes = await request(`/api/appointments/${createdAppointmentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (deleteRes.status !== 200) throw new Error('Delete failed');
  });

  console.log('\n====================================================');
  console.log(`📊 Validation Results: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================');

  if (failed === 0) {
    console.log('🎉 ALL INTEGRATION TESTS PASSED PERFECTLY!\n');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTestSuite();
