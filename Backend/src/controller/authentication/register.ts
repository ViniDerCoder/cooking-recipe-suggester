import { checkIfEmailExists, checkIfUsernameExists } from "../../database/authentication/register_validation.js";
import { emailRegex, sendMail, sendVerificationEmail } from "../../utils/emailer.js";
import { registerNewUser } from "../../database/authentication/register_new_user.js";
import onCleanup from "../../utils/listener/cleanup.js";
import {generateToken, generateVerificationCode} from "../../utils/generateTokens.js";
import { insertToken } from "../../database/authentication/user_token.js";

let emailVerificationSessions: { email: string, verificationCode: string, expirationDate: number }[] = [];

onCleanup("emailRegisterVerificationSessions", "MEMORY", async () => {
    emailVerificationSessions = emailVerificationSessions.filter(session => session.expirationDate > Date.now());
    return true;
});

/**
 * Registers a new user
 * @param email must be verified first (email verification code)
 * @param username length must be between 4 and 30 characters
 * @param fistName length must be between 2 and 20 characters
 * @param lastName length must be between 2 and 20 characters
 * @param emailVerificationCode must be valid and not expired (verify email)
 * @returns undefined if the input is valid, otherwise a string with the error
 */
export async function register(email: string, username: string, fistName: string, lastName: string, emailVerificationCode: string) {
    if(typeof email !== 'string' || typeof username !== 'string' || typeof fistName !== 'string' || typeof lastName !== 'string' || typeof emailVerificationCode !== "string") return "Invalid input";

    if(!emailVerificationSessions.find(session => session.email === email && session.verificationCode === emailVerificationCode && session.expirationDate > Date.now())) return "Invalid or expired email verification code";

    //constraints
    if(username.length < 4 || username.length > 30) return "Username must be between 4 and 30 characters";
    if(fistName.length < 2 || fistName.length > 20) return "First name must be between 2 and 20 characters";
    if(lastName.length < 2 || lastName.length > 20) return "Last name must be between 2 and 20 characters";

    if(await checkIfEmailExists(email)) return "Email already exists";
    if(await checkIfUsernameExists(username)) return "Username already exists";

    const dbResult = await registerNewUser(username, email, fistName, lastName);
    if(typeof dbResult === "string") return "Error registering user";
    else {
        const newToken = generateToken();
        const success = await insertToken(newToken, dbResult.user.id);

        if(typeof success === "string") return "Failed to create new login token";
        else return { token: newToken, user: dbResult.user };
    }
}


/**
 * Sends a random email verification code to register a new user
 * @param email
 * @returns the verification code
 */
export async function sendRegistrationEmail(email: string) {
    if(typeof email !== 'string') return "Invalid input";

    if(!email.match(emailRegex)) return "Invalid email";

    if(await checkIfEmailExists(email)) return "Email already exists";

    const verificationCode = generateVerificationCode();
    console.log(verificationCode);
    emailVerificationSessions.push({ email, verificationCode, expirationDate: (Date.now() + 1000 * 60 * 30) });

    await sendVerificationEmail(email, verificationCode);
}

