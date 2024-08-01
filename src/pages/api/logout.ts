import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookieDomain = process.env.NODE_ENV === 'production' ? `Domain=${process.env.COOKIE_DOMAIN};` : '';
    const secureFlag = process.env.NODE_ENV === 'production' ? 'Secure;' : '';

    res.setHeader('Set-Cookie', `token=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict; ${cookieDomain} ${secureFlag}`);
    res.status(200).json({ message: "Logged out successfully" });
}