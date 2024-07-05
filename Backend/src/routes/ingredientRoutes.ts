import express from 'express';

import verifyRequest from '../utils/defaultVerification.js';
import limit from '../utils/rate-limiter.js';

const router = express.Router();

router.use(async (req, res, next) => {
    verifyRequest(req, res, next);
});

router.get('/', limit(1000 * 60 * 5, 5), async (req, res) => {
    res.send('Get all ingredients names and ids');
});

//late feature
router.get('/search', limit(), async (req, res) => {
    res.send('Search for ingredients by name, type, etc.');
});

router.get('/filter', limit(1000 * 60), async (req, res) => {

});

router.get('/:id', limit(), async (req, res) => {
    res.send('Get ingredient by id');
});

router.post('/', limit(1000 * 60 * 2, 5), async (req, res) => {
    res.send('Create ingredient creation request');
});

router.put('/:id', limit(1000 * 60, 2), async (req, res) => {
    res.send('Create ingredient update request');
});

router.delete('/:id', limit(1000 * 60 * 2, 3), async (req, res) => {
    res.send('Create ingredient deletion request');
});

export default router;