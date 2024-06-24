import express from 'express';

import register from '../controller/authentication/register.js';

const router = express.Router();

router.get('/', async (req, res) => {
    res.send('Validate user token');
});

router.get('/login', async (req, res) => {
    res.send('Login user and return token');
});

router.post('/login/validate-email', async (req, res) => {
    res.send('Sends an email with a verification code to the user (to login)');
});

router.post('/register', async (req, res) => {
    const { email, username, fistName, lastName, emailVerificationCode } = req.body;

    const registrationResult = register(email, username, fistName, lastName, emailVerificationCode);

    if(registrationResult) return res.status(400).send({error: registrationResult});
    else {
        return res.send('Register a new user and return token');
    }
});

router.post('/register/validate-email', async (req, res) => {
    const { email } = req.body;
    
    res.send('Sends an email with a verification code to the user (to register)');
});

export default router;