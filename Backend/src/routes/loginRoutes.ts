import express from 'express';

import { sendRegistrationEmail, register } from '../controller/authentication/register.js';
import { isTokenValid } from '../controller/authentication/validate.js';
import limit from '../utils/rate-limiter.js';
import { insertToken } from '../database/authentication/user_token.js';
import { v4 } from 'uuid';
import { cleanup } from '../utils/cleanup.js';

const router = express.Router();


router.get('/', limit(1000 * 60 * 2), async (req, res) => {
    if(!req.headers.authorization) return res.status(400).send({error: 'No token provided. Provide it in the header as `authorization`'});
    const isTokenValidResult = await isTokenValid(req.headers.authorization);
    if(!isTokenValidResult) return res.status(400).send({error: 'Invalid or expired token'});
    else {
        res.send('Return user data');
    }
});

router.get('/login', limit(), async (req, res) => {
    insertToken('test3', v4());
    res.send('Login user and return token');
});

router.post('/login/validate-email', limit(), async (req, res) => {
    cleanup();
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