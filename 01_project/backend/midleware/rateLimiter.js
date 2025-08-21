
import ratelimit from "../config/upstash.js";


const rateLimiter = async (req, res, next) => {
    try {
        const { success } = await ratelimit.limit(req.ip);
        if (!success) {
            return res.status(429).json({ message: 'Rate limit exceeded' });
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'rate limit in Server Error' });
    }
}

export default rateLimiter;