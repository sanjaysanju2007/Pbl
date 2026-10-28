const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const AdminUser = require('../models/AdminUser');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/chittukurumbakam');
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existing = await AdminUser.findOne({ email: 'admin@chittukurumbakam.com' });
    if (existing) {
      console.log('ℹ️  Admin user already exists. Skipping seed.');
      process.exit(0);
    }

    // Create default admin
    await AdminUser.create({
      name: 'Admin',
      email: 'admin@chittukurumbakam.com',
      password: 'changeme123',
      role: 'superadmin'
    });

    console.log('✅ Default admin user created:');
    console.log('   Email: admin@chittukurumbakam.com');
    console.log('   Password: changeme123');
    console.log('   ⚠️  Change these credentials after first login!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();
