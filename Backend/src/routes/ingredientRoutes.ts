import express from 'express';

import verifyRequest from '../utils/defaultVerification.js';
import limit from '../utils/rate-limiter.js';
import { getAllIngredientIds, getIngredientById, getIngredientIdsMatchingFilter } from '../controller/ingredients/get.js';
import { doActionRequest } from '../controller/ingredients/actionRequest.js';
import { AuthenticationUser } from '../utils/types/authentication.js';
import { getIngredientsOfRecipe } from '../database/ingredients/get_ingredients_of_recipe.js';
import { getRecipesIngredients } from '../controller/recipes/ingredients/getRecipesIngredients.js';

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

router.post('/filter', limit(1000 * 60), async (req, res) => {
    const { filters } = req.body

    const result = await getIngredientIdsMatchingFilter(filters);
    
    if(typeof result === "string") return res.status(400).send({error: result});
    else return res.status(200).send({message: "Fetching of filtered ingredients was successfull", error: undefined, data: { ingredients: result }});
});

router.get('/:id', limit(1000 * 60), async (req, res) => {
    const id = req.params.id;

    const result = await getIngredientById(id);

    if(typeof result === "string") return res.status(400).send({error: result});
    else return res.status(200).send({message: "Fetching ingredient was successfull", error: undefined, data: { ingredient: result }});
});

router.post('/', limit(1000 * 60 * 2, 5), async (req, res) => {
    const user = req.body.user as AuthenticationUser;
    const { name, properties } = req.body

    const result = await doActionRequest(user.userId, {type: "CREATE", ingredient: {name: name, props: properties}});

    if(typeof result === "string") return res.status(400).send({error: result});
    else return res.status(200).send({message: "Create ingredient request was created successfull", error: undefined, data: { request: result }});
});

router.put('/:id', limit(1000 * 60, 2), async (req, res) => {
    const user = req.body.user as AuthenticationUser;
    const id = req.params.id;
    const { name, properties } = req.body

    const result = await doActionRequest(user.userId, {type: "UPDATE", id: id, ingredient: {name: name, props: properties}});

    if(typeof result === "string") return res.status(400).send({error: result});
    else return res.status(200).send({message: "Update ingredient request was created successfull", error: undefined, data: { request: result }});

});

router.delete('/:id', limit(1000 * 60 * 2, 3), async (req, res) => {
    const user = req.body.user as AuthenticationUser;
    const id = req.params.id;

    const result = await doActionRequest(user.userId, {type: "DELETE", id: id});

    if(typeof result === "string") return res.status(400).send({error: result});
    else return res.status(200).send({message: "Delete ingredient request was created successfull", error: undefined, data: { request: result }});
});

router.get('/recipe/:id', limit(1000 * 60), async (req, res) => {
    const user = req.body.user as AuthenticationUser;
    const id = req.params.id;

    const result = await getRecipesIngredients(user.userId, id);

    if(typeof result === "string") return res.status(400).send({error: result});
    else return res.status(200).send({message: "Fetching ingredients of recipe was successfull", error: undefined, data: { ingredients: result }});
})

export default router;