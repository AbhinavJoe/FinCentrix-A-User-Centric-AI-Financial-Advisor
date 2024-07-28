// import { NextApiRequest, NextApiResponse } from 'next';
// import { dbConnect } from '@/lib/dbConnect';
// import Form from '@/models/formModel';

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     if (req.method === 'GET') {
//         await dbConnect();
//         const { username } = req.query;

//         try {
//             const formData = await Form.findOne({ username });
//             if (formData) {
//                 res.status(200).json(formData);
//             } else {
//                 res.status(404).json({ message: 'No form data found for this user' });
//             }
//         } catch (error) {
//             res.status(500).json({ error: 'Failed to fetch data' });
//         }
//     } else {
//         res.status(405).json({ message: 'Method not allowed' });
//     }
// }

import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/lib/dbConnect';
import Form from '@/models/formModel';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        await dbConnect();
        const { username } = req.query;

        try {
            const formData = await Form.findOne({ username });

            if (formData) {
                // Return the existing form data
                res.status(200).json(formData);
            } else {
                // Return default/empty form data if no existing data is found
                res.status(200).json({
                    message: 'No form data found for this user. Starting with a blank form.',
                    form: {
                        username, // Include the username from the request query
                        age: '',
                        employmentStatus: '',
                        annualIncome: '',
                        financialGoals: '',
                        riskTolerance: '',
                        existingDebts: '',
                        monthlyBudget: '',
                        insuranceTypes: '',
                        retirementAge: ''
                    }
                });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch data' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
