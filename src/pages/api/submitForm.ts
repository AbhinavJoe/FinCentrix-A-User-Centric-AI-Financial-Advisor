import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/lib/dbConnect';
import Form from '@/models/formModel';
import fs from 'fs';
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    await dbConnect();
    const { username, ...formData } = req.body;

    try {
      let form = await Form.findOne({ username });
      if (form) {
        await Form.updateOne({ username }, { $set: formData });
      } else {
        form = new Form({ username, ...formData });
        await form.save();
      }

      // Define the directory and file path
      const directoryPath = "C:\\Users\\Abhinav\\Desktop\\Fin Local Backend\\UserInfo"
      const filePath = path.join(directoryPath, 'userInfo.txt');

      // Ensure the directory exists
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
      }

      // Create a .txt file with the introductory line and form data
      const formContent = JSON.stringify({ username, ...formData }, null, 2);
      const fileContent = `User information below:\n${formContent}`;
      fs.writeFileSync(filePath, fileContent);

      res.status(201).send({ message: 'Data saved successfully' });
    } catch (error) {
      res.status(500).send({ message: 'Failed to save data', error });
    }
  } else {
    res.status(405).send({ message: 'Method not allowed' });
  }
}
