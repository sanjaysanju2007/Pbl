// Central site configuration for Chittukurumbakam Play School
// Any field awaiting official confirmation is marked with // TODO

export const siteConfig = {
  name: 'Chittukurumbakam Play School',
  shortName: 'Chittukurumbakam',
  tagline: 'Sunny Beginnings',
  motto: 'Where Every Child Blossoms With Joy & Wonder',
  establishedYear: 2009,

  // Contact Information (Real data from school campus)
  phone: {
    display: '+91 99522 85838',
    value: '+919952285838',
    digitsOnly: '919952285838'
  },
  whatsapp: {
    number: '919952285838', // Digits only for wa.me links
    display: '+91 99522 85838',
    defaultMessage: 'Hello, I would like to enquire about admission at Chittukurumbakam Play School.'
  },
  email: {
    info: 'info@chittukurumbakam.com',
    admissions: 'admissions@chittukurumbakam.com'
  },

  // Campus Address & Location
  address: {
    street: 'Dharapuram - Tiruppur Rd, L S G Nagar, Palaniandavar Nagar',
    area: 'K Chettipalayam',
    city: 'Tiruppur',
    state: 'Tamil Nadu',
    pincode: '641604',
    full: 'Dharapuram - Tiruppur Rd, L S G Nagar, Palaniandavar Nagar, K Chettipalayam, Tiruppur, Tamil Nadu 641604',
    mapsLink: 'https://maps.app.goo.gl/ceBNW1M9cNawmBKG7',
    mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3914.5!2d77.3421!3d11.1085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba9a9ef24133e67%3A0x14b4747dc58b5257!2sChittu%20kurumbagam%20Daycare%20and%20playgroup!5e0!3m2!1sen!2sin!4v1724685900000!5m2!1sen!2sin'
  },

  // Leadership
  principal: {
    name: 'Mrs. Lakshmi Devi',
    role: 'Founder & Principal',
    credentials: '20+ Years in Early Childhood Education',
    messageLink: '/principal-message'
  },

  // Office & Campus Visiting Hours
  // Sunday = 0, Monday = 1, ..., Saturday = 6
  officeHours: {
    weekdays: '8:30 AM – 4:30 PM',
    saturday: '9:00 AM – 1:00 PM',
    sunday: 'Closed',
    // Schedule matrix for client-side OpenStatus computation (in 24hr format)
    schedule: {
      0: null, // Sunday: Closed
      1: { open: 8.5, close: 16.5 }, // Monday: 8:30 AM - 4:30 PM
      2: { open: 8.5, close: 16.5 }, // Tuesday: 8:30 AM - 4:30 PM
      3: { open: 8.5, close: 16.5 }, // Wednesday: 8:30 AM - 4:30 PM
      4: { open: 8.5, close: 16.5 }, // Thursday: 8:30 AM - 4:30 PM
      5: { open: 8.5, close: 16.5 }, // Friday: 8:30 AM - 4:30 PM
      6: { open: 9.0, close: 13.0 }  // Saturday: 9:00 AM - 1:00 PM
    }
  },

  // School Program Timings
  programTimings: {
    playgroup: { name: 'Playgroup', age: '1.5 – 2.5 years', hours: '9:00 AM – 12:00 PM', ratio: '1:6' },
    nursery:   { name: 'Nursery',   age: '2.5 – 3.5 years', hours: '9:00 AM – 1:00 PM',  ratio: '1:8' },
    lkg:       { name: 'LKG',       age: '3.5 – 4.5 years', hours: '9:00 AM – 2:00 PM',  ratio: '1:10' },
    ukg:       { name: 'UKG',       age: '4.5 – 5.5 years', hours: '9:00 AM – 2:30 PM',  ratio: '1:12' }
  },

  // Safety Highlights (Derived strictly from Safety content)
  safetyHighlights: [
    { title: 'CCTV Monitored', desc: 'Full high-definition CCTV coverage across all classrooms, play areas and entries.' },
    { title: 'Verified Loving Staff', desc: 'Police-verified educators with mandatory background and pediatric first-aid training.' },
    { title: 'Strict Pickup Protocols', desc: 'Secure authorized guardian release policy with ID verification and visitor logging.' }
  ],

  // Admissions & Enquiry Policy Placeholders
  admission: {
    currentAcademicYear: '2026-2027',
    advanceAcademicYear: '2027-2028',
    estimatedTimeMinutes: 5,
    expectedReviewDays: '2 to 3 business days',
    expectedEnquiryReplyTime: 'within 24 to 48 hours',
    // TODO: Official fee schedule is published by school management per academic year upon request
    feesScheduleNotice: 'Fee structure varies by program and optional transport services. Please request our official fee breakdown below.'
  }
};

export default siteConfig;

