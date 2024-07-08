import express from 'express';

import { sendRegistrationEmail, register } from '../controller/authentication/register.js';
import { getUserInformation, isTokenValid } from '../controller/authentication/validate.js';
import limit from '../utils/rate-limiter.js';
import { login, sendLoginEmail } from '../controller/authentication/login.js';

const router = express.Router();


router.get('/', limit(1000 * 60 * 2), async (req, res) => {
    if(!req.headers.authorization) return res.status(400).send({error: 'No token provided. Provide it in the header as `authorization`'});
    const isTokenValidResult = await isTokenValid(req.headers.authorization);
    if(typeof isTokenValidResult === "string") return res.status(400).send({error: "Error on checking the provided token" });
    if(!isTokenValidResult) return res.status(200).send({error: undefined, message: "Token is invalid or expired", data: { tokenValid: false }});
    else {
        const userData = await getUserInformation(isTokenValidResult.userId);
        if(typeof userData === "string") return res.status(400).send({error: userData });
        else res.status(200).send({ error: undefined, message: "Token is valid", data: { 
            tokenValid: true,
            user: {
                username: userData.username,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName
            } 
        }});
    }
});

router.post('/login', limit(), async (req, res) => {
    const { email, emailVerificationCode } = req.body

    const loginResult = await login(email, emailVerificationCode);

    if(typeof loginResult === "string") return res.status(400).send({error: loginResult});
    else res.status(200).send({error: undefined, message: "Login successful", data: { 
        token: loginResult.token, 
        user: { 
            username: loginResult.user.username, 
            email: loginResult.user.email,
            firstName: loginResult.user.firstName,
            lastName: loginResult.user.lastName
        }
    }});
});

router.post('/login/validate-email', limit(), async (req, res) => {
    const { email } = req.body

    const emailSendResult = await sendLoginEmail(email);

    if(emailSendResult) return res.status(400).send({error: emailSendResult});
    else res.status(200).send({error: undefined, message: "Sent email succesfull", data: { address: email }});
});

router.post('/register', limit(), async (req, res) => {
    const { email, username, firstName, lastName, emailVerificationCode } = req.body

    const registrationResult = await register(email, username, firstName, lastName, emailVerificationCode);

    if(typeof registrationResult === "string") return res.status(400).send({error: registrationResult});
    else res.status(200).send({error: undefined, message: "Registration successful", data: { 
        token: registrationResult.token, 
        user: { 
            username: registrationResult.user.username, 
            email: registrationResult.user.email,
            firstName: registrationResult.user.firstName,
            lastName: registrationResult.user.lastName
        }
    }});
    
});

router.post('/register/validate-email', limit(), async (req, res) => {
    const { email } = req.body

    const emailSendResult = await sendRegistrationEmail(email);

    if(emailSendResult) return res.status(400).send({error: emailSendResult});
    else res.status(200).send({error: undefined, message: "Sent email succesfull", data: { address: email }});
});

export default router;