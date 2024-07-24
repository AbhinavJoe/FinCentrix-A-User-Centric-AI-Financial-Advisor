// pages/api/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const login = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        await dbConnect();

        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User does not exist" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Prepare the token payload with fullName
        const tokenPayload = {
            id: user._id,
            email: user.email,
            fullName: user.fullName
        };

        // Sign the JWT token
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, { expiresIn: "1d" });

        res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict;${process.env.NODE_ENV === 'production' ? ' Secure;' : ''}`);

        return res.status(200).json({
            message: "Login successful",
            success: true
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export default login;


// import { NextRequest, NextResponse } from "next/server";
// import { dbConnect } from "@/lib/dbConnect";
// import User from "@/models/user";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export async function POST(req: NextRequest) {
//     await dbConnect();

//     try {
//         const reqBody = await req.json();
//         const { email, password } = reqBody;

//         const user = await User.findOne({ email });
//         if (!user) {
//             return NextResponse.json({ error: "User does not exist" }, { status: 404 });
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
//         }

//         // Prepare the token payload
//         const tokenPayload = {
//             id: user._id,
//             email: user.email
//         };

//         // Sign the JWT token
//         const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, { expiresIn: "1d" });

//         const response = NextResponse.json({
//             message: "Login successful",
//             success: true,
//             token
//         });

//         // Set the cookie securely
//         response.cookies.set("token", token, {
//             httpOnly: true,
//             sameSite: 'strict',  // Helps mitigate CSRF attacks
//             path: '/',
//             secure: process.env.NODE_ENV === "production",  // Use secure cookies in production
//         });

//         return response;

//     } catch (error) {
//         console.error("Login error:", error);
//         return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//     }
// }
