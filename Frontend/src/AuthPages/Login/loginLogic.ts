import { Backend } from "../../utils/backendConnection/routes"
import { isEmail } from "../../utils/emails"
import { errorFromError } from "../../utils/backendConnection/utils";


export async function login(email: unknown, verificationCode: unknown): Promise<boolean> {
    if (typeof email !== 'string' || typeof verificationCode !== 'string') {
        return false
    } else if(!isEmail(email)) {
        return false
    } else {
        try {
            await Backend.Auth.login(email, verificationCode);
            return true
        } catch (error) {
            return false
        }
    }
}

export async function sendLoginValidationEmail(email: unknown): Promise<[boolean, string]> {
    if (typeof email !== 'string') {
        return [false, 'email is not a string']
    } else if(!isEmail(email)) {
        return [false, 'email is not an email']
    } else {
        try {
            const result = await Backend.Auth.sendLoginValidationEmail(email);
            return [true, result.message]
        } catch (error) {
            console.log(error)
            return [false, 'Error: ' + errorFromError(error)]
        }
    }
}