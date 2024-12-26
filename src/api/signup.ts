import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '../lib/dbConnect';
import User from '@/models/user';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { fullName, email, password, username } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(409).json({ message: 'Username already in use' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const user = new User({
      fullName,
      email,
      password: hash,
      username
    });

    await user.save();

    res.status(201).json({ message: 'User created successfully', user: { fullName, email, username } });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}
