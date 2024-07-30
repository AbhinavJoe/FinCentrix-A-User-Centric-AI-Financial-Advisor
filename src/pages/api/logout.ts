import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookieDomain = process.env.NODE_ENV === 'production' ? `Domain=${process.env.COOKIE_DOMAIN};` : '';

    res.setHeader('Set-Cookie', [
        `token=deleted; Path=/; Max-Age=0; HttpOnly; SameSite=Strict; ${cookieDomain} Secure`,
    ]);
    res.status(200).json({ message: "Logged out successfully" });
}


// import { NextApiRequest, NextApiResponse } from 'next';

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//     // Check if the environment is production
//     const cookieDomain = process.env.NODE_ENV === 'production' ? `Domain=${process.env.COOKIE_DOMAIN};` : '';

//     res.setHeader('Set-Cookie', [
//         `token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict; ${cookieDomain} Secure`,
//     ]);
//     res.status(200).json({ message: "Logged out successfully" });
// }
