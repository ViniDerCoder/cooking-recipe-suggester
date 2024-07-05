import express from 'express';

import verifyRequest from '../utils/defaultVerification.js';
import limit from '../utils/rate-limiter.js';
import { getAllIngredientIds, getIngredientById, getIngredientIdsMatchingFilter } from '../controller/ingredients/get.js';

const router = express.Router();

router.use(async (req, res, next) => {
    verifyRequest(req, res, next);
});

router.get('/', limit(1000 * 60 * 5, 5), async (req, res) => {
    const result = await getAllIngredientIds();

    if(typeof result === "string") return res.status(400).send({error: result});
    else return res.status(200).send({message: "Fetching of all ingredients was successfull", error: undefined, data: { ingredients: result }});
});

//late feature
router.get('/search', limit(), async (req, res) => {
    res.send('Search for ingredients by name, type, etc.');
});

router.get('/filter', limit(1000 * 60), async (req, res) => {
    const { filters } = req.body;

    const result = await getIngredientIdsMatchingFilter(filters);
    if(typeof result === "string") return res.status(400).send({error: result});
    else return res.status(200).send({message: "Fetching of filtered ingredients was successfull", error: undefined, data: { ingredients: result }});
});

router.get('/:id', limit(), async (req, res) => {
    const id = req.params.id;

    const result = await getIngredientById(id);
    if(typeof result === "string") return res.status(400).send({error: result});
    else return res.status(200).send({message: "Fetching ingredient was successfull", error: undefined, data: { ingredient: result }});
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