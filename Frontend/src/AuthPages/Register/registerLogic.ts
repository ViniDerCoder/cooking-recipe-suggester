import { Backend } from "../../utils/backendConnection/routes";
import { errorFromError } from "../../utils/backendConnection/utils";
import { setToken } from "../../utils/cookies";
import { isEmail } from "../../utils/emails";


export async function register(email: unknown, verificationCode: unknown, username: unknown, firstName: unknown, lastName: unknown): Promise<[boolean, string]> {
    if (typeof email !== 'string' || typeof verificationCode !== 'string' || typeof username !== 'string' || typeof firstName !== 'string' || typeof lastName !== 'string') {
        return [false, 'email, verification code, username, first name or last name is not a string']
    } else if(!isEmail(email)) {
        return [false, 'email is not an email']
    } else if(verificationCode.length !== 6) {
        return [false, 'verification code is not 6 characters long']
    } else {
        try {
            const result = await Backend.Auth.register(email, username, firstName, lastName, verificationCode);
            setToken(result.data.token)
            return [true, result.message]
        } catch (error) {
            return [false, 'Error: ' + errorFromError(error)]
        }
    }
}

export async function sendRegisterValidationEmail(email: unknown): Promise<[boolean, string]> {
    if (typeof email !== 'string') {
        return [false, 'email is not a string']
    } else if(!isEmail(email)) {
        return [false, 'email is not an email']
    } else {
        try {
            const result = await Backend.Auth.sendRegisterValidationEmail(email);
            return [true, result.message]
        } catch (error) {
            console.log(error)
            return [false, 'Error: ' + errorFromError(error)]
        }
    }
}