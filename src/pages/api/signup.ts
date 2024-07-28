// // pages/api/signup.ts
// import type { NextApiRequest, NextApiResponse } from 'next';
// import { dbConnect } from '../../lib/dbConnect';
// import User from '@/models/user';
// import bcrypt from 'bcryptjs';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { fullName, email, password } = req.body;

//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   try {
//     // Connect to MongoDB
//     await dbConnect();

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({ message: 'User already exists' });
//     }

//     // Hash the password
//     const salt = bcrypt.genSaltSync(10);
//     const hash = bcrypt.hashSync(password, salt);

//     // Create a new user
//     const user = new User({
//       fullName,
//       email,
//       password: hash
//     });

//     await user.save();

//     // Respond with success
//     res.status(201).json({ message: 'User created successfully', user: { fullName, email } });
//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error', error });
//   }
// }


// pages/api/signup.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '../../lib/dbConnect';
import User from '@/models/user';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { fullName, email, password, username } = req.body; // Include username in the destructuring

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Connect to MongoDB
    await dbConnect();

    // Check if email or username already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Check if username already exists
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(409).json({ message: 'Username already in use' });
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // Create a new user
    const user = new User({
      fullName,
      email,
      password: hash,
      username  // Make sure to include the username in the user creation
    });

    await user.save();

    // Respond with success
    res.status(201).json({ message: 'User created successfully', user: { fullName, email, username } });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}
