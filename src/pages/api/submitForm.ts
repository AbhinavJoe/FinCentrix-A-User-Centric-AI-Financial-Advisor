// import { NextApiRequest, NextApiResponse } from 'next';
// import { dbConnect } from '@/lib/dbConnect';  // Adjust path as necessary
// import Form from '@/models/formModel';   // Adjust path as necessary

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === 'POST') {
//     await dbConnect();

//     try {
//       const form = new Form(req.body);
//       await form.save();
//       res.status(201).send({ message: 'Data saved successfully' });
//     } catch (error) {
//       res.status(500).send({ message: 'Failed to save data', error });
//     }
//   } else {
//     res.status(405).send({ message: 'Method not allowed' });
//   }
// }


import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/lib/dbConnect';
import Form from '@/models/formModel';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    await dbConnect();
    const { username, ...formData } = req.body;

    try {
      // Check if the user has already submitted the form
      let form = await Form.findOne({ username });
      if (form) {
        // Update existing form data
        await Form.updateOne({ username }, { $set: formData });
      } else {
        // Create a new form entry
        form = new Form({ username, ...formData });
        await form.save();
      }
      res.status(201).send({ message: 'Data saved successfully' });
    } catch (error) {
      res.status(500).send({ message: 'Failed to save data', error });
    }
  } else {
    res.status(405).send({ message: 'Method not allowed' });
  }
}
