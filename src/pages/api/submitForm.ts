import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/lib/dbConnect';  // Adjust path as necessary
import Form from '@/models/formModel';   // Adjust path as necessary

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    await dbConnect();

    try {
      const form = new Form(req.body);
      await form.save();
      res.status(201).send({ message: 'Data saved successfully' });
    } catch (error) {
      res.status(500).send({ message: 'Failed to save data', error });
    }
  } else {
    res.status(405).send({ message: 'Method not allowed' });
  }
}
