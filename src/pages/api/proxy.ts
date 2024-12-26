import { NextApiRequest, NextApiResponse } from 'next';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method, body } = req;

    if (method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }

    try {
        console.log('Sending request to backend:', process.env.BACKEND_VM_URL);

        const response = await fetch(`${process.env.BACKEND_VM_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response from backend:', errorText);
            throw new Error(`Network response was not ok: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received data from backend:', data);
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error in API route:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
