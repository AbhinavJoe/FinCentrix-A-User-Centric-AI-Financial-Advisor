import { NextApiRequest, NextApiResponse } from "next";

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//     // Clear the cookie
//     res.setHeader("Set-Cookie", "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httpOnly; SameSite=Strict; Secure;");
//     res.status(200).json({ message: "Logged out successfully" });
// }


export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Set-Cookie', [
        'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict',
        'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict; Secure'
    ]);
    res.status(200).json({ message: "Logged out successfully" });
}