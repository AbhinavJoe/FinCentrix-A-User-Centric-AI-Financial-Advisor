import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const login = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    // Attempt to connect to the database
    await dbConnect();

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User does not exist" });
        }

        if (!user.isApproved) {
            return res.status(403).json({ error: "Account not approved. Please contact admin." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const tokenPayload = {
            id: user._id,
            email: user.email,
            username: user.username,
            fullName: user.fullName
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, { expiresIn: "1d" });

        // res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict; ${process.env.NODE_ENV === 'production' ? ' Secure;' : ''}`);
        res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict;`);

        return res.status(200).json({
            message: "Login successful",
            success: true,
            username: user.username
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export default login;