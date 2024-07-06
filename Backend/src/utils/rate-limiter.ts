import rateLimit from "express-rate-limit";

/**
 * @param t Time in ms - Default: 30 minutes
 * @param m Allowed requests in time - Default: 5
 * @returns rateLimit object
 */
export default function limit(t: number = 1000 * 60 * 30, m: number = 5) {
    return rateLimit({
        windowMs: t,
        max: m,
        message: { error: 'Too many requests to this route. Please try again later' }
    });
}