// import { NextApiRequest, NextApiResponse } from 'next';
// import { dbConnect } from "@/lib/dbConnect";
// import User from "@/models/user";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// const login = async (req: NextApiRequest, res: NextApiResponse) => {
//     // Check if the request method is POST
//     if (req.method !== "POST") {
//         return res.status(405).json({ message: "Method not allowed" });
//     }

//     // Attempt to connect to the database
//     await dbConnect();

//     try {
//         // Extract email and password from request body
//         const { email, password } = req.body;

//         // Attempt to find the user by email
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ error: "User does not exist" });
//         }

//         // Check if the provided password matches the stored hashed password
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(401).json({ error: "Invalid credentials" });
//         }

//         // Prepare the JWT token payload
//         const tokenPayload = {
//             id: user._id,
//             email: user.email,
//             fullName: user.fullName
//         };

//         // Sign the JWT token
//         const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, { expiresIn: "1d" });

//         // Set the HTTP Only cookie with the token
//         res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict;${process.env.NODE_ENV === 'production' ? ' Secure;' : ''}`);

//         // Return the success response
//         return res.status(200).json({
//             message: "Login successful",
//             success: true
//         });

//     } catch (error) {
//         console.error("Login error:", error);
//         // Return a generic server error message
//         return res.status(500).json({ error: "Internal server error" });
//     }
// };

// export default login;

import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const login = async (req: NextApiRequest, res: NextApiResponse) => {
    // Check if the request method is POST
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    // Attempt to connect to the database
    await dbConnect();

    try {
        // Extract email and password from request body
        const { email, password } = req.body;

        // Attempt to find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User does not exist" });
        }

        // Check if the user account is approved
        if (!user.isApproved) {
            return res.status(403).json({ error: "Account not approved. Please contact admin." });
        }

        // Check if the provided password matches the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Prepare the JWT token payload
        const tokenPayload = {
            id: user._id,
            email: user.email,
            fullName: user.fullName
        };

        // Sign the JWT token
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, { expiresIn: "1d" });

        // Set the HTTP Only cookie with the token
        res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict;${process.env.NODE_ENV === 'production' ? ' Secure;' : ''}`);

        // Return the success response
        return res.status(200).json({
            message: "Login successful",
            success: true
        });

    } catch (error) {
        console.error("Login error:", error);
        // Return a generic server error message
        return res.status(500).json({ error: "Internal server error" });
    }
};

export default login;
