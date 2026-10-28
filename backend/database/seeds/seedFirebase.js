const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const { initFirebase, isFirebaseConnected } = require('../firebase');
const {
  adminUsersRepo,
  announcementsRepo,
  eventsRepo,
  faqsRepo,
  admissionsRepo
} = require('../firestoreRepository');

const seedFirebase = async () => {
  console.log('🌱 Starting Firebase Firestore seeding...');
  
  const db = initFirebase();
  if (!db || !isFirebaseConnected()) {
    console.error('❌ Firebase is not connected.');
    console.error('   Please place serviceAccountKey.json in the backend/ directory first.');
    process.exit(1);
  }

  try {
    // 1. Seed Default Admin User
    const existingAdmin = await adminUsersRepo.findOne('email', 'admin@chittukurumbakam.com');
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('changeme123', salt);

      await adminUsersRepo.create({
        name: 'Administrator',
        email: 'admin@chittukurumbakam.com',
        password: hashedPassword,
        role: 'superadmin',
        isActive: true
      }, 'admin-root-001');

      console.log('✅ Default admin user created in Firestore:');
      console.log('   Email: admin@chittukurumbakam.com');
      console.log('   Password: changeme123');
    } else {
      console.log('ℹ️  Admin user already exists in Firestore. Skipping.');
    }

    // 2. Seed Initial Announcements
    const announcementsCount = await announcementsRepo.countDocuments();
    if (announcementsCount === 0) {
      await announcementsRepo.create({
        title: 'Admissions Open for Academic Year 2026-2027',
        content: 'Applications are now being accepted for Playgroup, Nursery, LKG, and UKG programs. Early applications are advised as seats are limited.',
        priority: 'high',
        isActive: true,
        publishDate: new Date()
      });
      await announcementsRepo.create({
        title: 'Annual Sports & Play Day Scheduled',
        content: 'Join us next month for our annual outdoor activities and sports celebration for all children and parents.',
        priority: 'medium',
        isActive: true,
        publishDate: new Date()
      });
      console.log('✅ Seeded initial announcements.');
    }

    // 3. Seed Initial FAQs
    const faqsCount = await faqsRepo.countDocuments();
    if (faqsCount === 0) {
      await faqsRepo.create({
        question: 'What are the school operating hours?',
        answer: 'Our preschool operates Monday through Friday from 8:30 AM to 1:00 PM for Playgroup & Nursery, and 8:30 AM to 3:00 PM for LKG & UKG.',
        category: 'General',
        order: 1
      });
      await faqsRepo.create({
        question: 'What is the student-to-teacher ratio?',
        answer: 'We maintain a strict 8:1 ratio in Playgroup and 10:1 in Nursery to ensure personalized nurturing and safety.',
        category: 'Academics',
        order: 2
      });
      await faqsRepo.create({
        question: 'How can parents track their child’s admission status?',
        answer: 'Parents can use the Application Reference Number (e.g. CKP-2026-XXXXX) and registered mobile/email in our Portal tab to see real-time updates.',
        category: 'Admissions',
        order: 3
      });
      console.log('✅ Seeded initial FAQs.');
    }

    console.log('\n🎉 Firebase Firestore seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedFirebase();
