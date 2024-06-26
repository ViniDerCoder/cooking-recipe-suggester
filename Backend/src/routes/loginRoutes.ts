import express from 'express';

import { sendRegistrationEmail, register } from '../controller/authentication/register.js';
import { isTokenValid } from '../controller/authentication/validate.js';
import limit from '../utils/rate-limiter.js';
import { login } from '../controller/authentication/login.js';

const router = express.Router();


router.get('/', limit(1000 * 60 * 2), async (req, res) => {
    if(!req.headers.authorization) return res.status(400).send({error: 'No token provided. Provide it in the header as `authorization`'});
    const isTokenValidResult = await isTokenValid(req.headers.authorization);
    if(typeof isTokenValidResult === "string") return res.status(400).send({error: "Error on checking the provided token" });
    if(!isTokenValidResult) return res.status(200).send({error: undefined, message: "Token is invalid or expired", data: { tokenValid: false }});
    else {
        res.status(200).send({ error: undefined, message: "Token is valid", data: { tokenValid: true }});
    }
});

router.get('/login', limit(), async (req, res) => {
    const { email, emailVerificationCode } = req.body;

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
    res.send('Sends an email with a verification code to the user (to login)');
});

router.post('/register', limit(), async (req, res) => {
    const { email, username, firstName, lastName, emailVerificationCode } = req.body;

    const registrationResult = await register(email, username, firstName, lastName, emailVerificationCode);

    if(registrationResult) return res.status(400).send({error: registrationResult});
    else {
        return res.send('Register a new user and return token');
    }
});

router.post('/register/validate-email', limit(1, 1), async (req, res) => {
    const { email } = req.body;

    const emailSendResult = await sendRegistrationEmail(email);

    if(emailSendResult) return res.status(400).send({error: emailSendResult});
    else {
        res.send('Sends an email with a verification code to the user (to register)');
    }
});

export default router;