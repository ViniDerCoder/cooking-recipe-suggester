import express from 'express';

import verifyRequest from '../utils/defaultVerification.js';
import limit from '../utils/rate-limiter.js';

const router = express.Router();

router.use(async (req, res, next) => {
    verifyRequest(req, res, next);
});

router.get('/', limit(1000 * 60 * 5, 5), async (req, res) => {
    res.send('Get suggestions for current day');
});

router.post('/', limit(1000 * 60 * 2, 3), async (req, res) => {
    res.send('Remake suggestions for current day');
});

export default router;
