
import * as dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import connectDB from '../lib/db';
import User from '../models/User';

async function createAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();

    const email = 'nhuthang@admin.com';
    const password = 'nhuthangl24';
    const name = 'Admin Nhu Thang';

    console.log(`Creating admin user: ${email}`);

    // Check if user exists
    const existingUser = await User.findOne({ email });
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    if (existingUser) {
      console.log('User exists. Updating password and role...');
      existingUser.passwordHash = passwordHash;
      existingUser.role = 'admin';
      existingUser.name = name;
      await existingUser.save();
      console.log('User updated successfully.');
    } else {
      console.log('Creating new user...');
      const newUser = new User({
        name,
        email,
        passwordHash,
        role: 'admin',
      });
      await newUser.save();
      console.log('User created successfully.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
