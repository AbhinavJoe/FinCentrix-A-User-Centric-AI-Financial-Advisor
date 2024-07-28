// pages/api/logout.js
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // Clear the cookie
    res.setHeader("Set-Cookie", "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httpOnly; SameSite=Strict;");
    res.status(200).json({ message: "Logged out successfully" });
}
