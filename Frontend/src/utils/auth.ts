import { getToken } from "./cookies";

export function getAuthToken() {
    //token validation? (not using backend /api/auth/ since it's used to often)
    const token = getToken()
    if (!token) {
        return null
    } else {
        return token
    }
}