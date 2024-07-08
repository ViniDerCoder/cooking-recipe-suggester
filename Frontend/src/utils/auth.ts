import { Backend } from "./backendConnection/routes";
import { getToken, removeToken } from "./cookies";

let validToken: string | undefined = undefined

export async function getAuthToken() {
    if (validToken) {
        return validToken
    }
    const token = getToken()
    if (!token) {
        return null
    } else {
        try {
            const valid = await Backend.Auth.validate(token)
            if (valid.data.tokenValid) {
                validToken = token
                return token
            } else {
                removeToken()
                return null
            }
        } catch (error) {
            return null
        }
    }
}