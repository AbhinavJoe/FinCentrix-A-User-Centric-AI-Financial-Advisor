// pages/api/signup.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '../../lib/dbConnect';
import User from '@/models/user';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { fullName, email, password } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Connect to MongoDB
    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // Create a new user
    const user = new User({
      fullName,
      email,
      password: hash
    });

    await user.save();

    // Respond with success
    res.status(201).json({ message: 'User created successfully', user: { fullName, email } });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}
