import { getUserFromEmail } from "../../database/authentication/find_user_by_email.js";
import { checkIfEmailExists } from "../../database/authentication/register_validation.js";
import { insertToken } from "../../database/authentication/user_token.js";
import onCleanup from "../../utils/listener/cleanup.js";
import { emailRegex, sendVerificationEmail } from "../../utils/emailer.js";
import {generateToken, generateVerificationCode} from "../../utils/generateTokens.js";

let emailVerificationSessions: { email: string, verificationCode: string, expirationDate: number }[] = [];

onCleanup("emailLoginVerificationSessions", "MEMORY", async () => {
    emailVerificationSessions = emailVerificationSessions.filter(session => session.expirationDate > Date.now());
    return true;
});

export async function login(email: string, emailVerificationCode: string) {
    if(typeof email !== 'string' || typeof emailVerificationCode !== "string") return "Invalid input";

    if(!emailVerificationSessions.find(session => session.email === email && session.verificationCode === emailVerificationCode && session.expirationDate > Date.now())) return "Invalid or expired email verification code";

    const user = await getUserFromEmail(email);

    if(typeof user === "string") return user;

    const newToken = generateToken();
    const success = await insertToken(newToken, user.id);

    if(typeof success === "string") return "Failed to create new login token";
    else return { token: newToken, user: user };
}

export async function sendLoginEmail(email: string) {
    if(typeof email !== 'string') return "Invalid input";

    if(!email.match(emailRegex)) return "Invalid email";

    if(!await checkIfEmailExists(email)) return "Email does not exist";

    const verificationCode = generateVerificationCode();
    console.log(verificationCode);
    emailVerificationSessions.push({ email, verificationCode, expirationDate: (Date.now() + 1000 * 60 * 30) });

    await sendVerificationEmail(email, verificationCode);
}