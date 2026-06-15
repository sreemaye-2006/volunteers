import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';
import connectDB from './db.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const adminExists = await Admin.findOne({ username: 'admin' });

    if (adminExists) {
      console.log('Admin user already exists. Skipping seed.');
      process.exit();
    }

    const defaultAdmin = new Admin({
      username: 'admin',
      password: 'admin123', // This will be pre-saved hashed by mongoose pre-save hook
    });

    await defaultAdmin.save();
    console.log('Default admin user successfully seeded: username="admin", password="admin123"');
    process.exit();
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
