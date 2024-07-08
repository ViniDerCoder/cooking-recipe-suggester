import { Backend } from "../../utils/backendConnection/routes"
import { isEmail } from "../../utils/emails"
import { errorFromError } from "../../utils/backendConnection/utils";
import { setToken } from "../../utils/cookies";


export async function login(email: unknown, verificationCode: unknown): Promise<[boolean, string]> {
    if (typeof email !== 'string' || typeof verificationCode !== 'string') {
        return [false, 'email or verification code is not a string']
    } else if(!isEmail(email)) {
        return [false, 'email is not an email']
    } else if(verificationCode.length !== 6) {
        return [false, 'verification code is not 6 characters long']
    } else {
        try {
            const result = await Backend.Auth.login(email, verificationCode);
            setToken(result.data.token)
            return [true, result.message]
        } catch (error) {
            return [false, 'Error: ' + errorFromError(error)]
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