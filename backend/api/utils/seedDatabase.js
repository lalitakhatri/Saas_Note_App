// backend/api/utils/seedDatabase.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Tenant = require('../models/Tenant');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI;

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data to prevent duplicates
    await Tenant.deleteMany({});
    await User.deleteMany({});

    console.log('Cleared existing tenants and users.');

    // Create Tenants
    const acme = await Tenant.create({ name: 'Acme', slug: 'acme', plan: 'free' });
    const globex = await Tenant.create({ name: 'Globex', slug: 'globex', plan: 'free' });
    console.log('Created tenants: Acme, Globex');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password', salt);
    console.log('Password hashed.');

    // Create Users
    const users = [
      { email: 'admin@acme.test', password: hashedPassword, role: 'admin', tenantId: acme._id },
      { email: 'user@acme.test', password: hashedPassword, role: 'member', tenantId: acme._id },
      { email: 'admin@globex.test', password: hashedPassword, role: 'admin', tenantId: globex._id },
      { email: 'user@globex.test', password: hashedPassword, role: 'member', tenantId: globex._id },
    ];

    await User.insertMany(users);

    console.log('Database seeded successfully with test accounts!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seed();