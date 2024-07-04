import express from 'express';
import { getAuthUserFromToken } from '../database/authentication/user_token.js';
import { AuthenticationUser } from '../utils/types.js';
import { listUserRecipes } from '../database/recipes/list_recipes.js';
import { getRecipeById } from '../controller/recipes/get.js';
const router = express.Router();


router.use(async (req, res, next) => {
    if(!req.headers.authorization) return res.status(401).send({error: 'No authorization token provided'});
    req.body.user = await getAuthUserFromToken(req.headers.authorization);
    if(typeof req.body.user === "string") return res.status(401).send({error: 'Invalid authorization token provided'});
    else next();
});

router.get('/', async (req, res) => {
    const user = req.body.user as AuthenticationUser;
    const recipes = await listUserRecipes(user.userId)

    if(typeof recipes === "string") return res.status(400).send({error: recipes});
    else return res.status(200).send({error: undefined, data: { recipes: recipes }});
});

//late feature
router.get('/search', async (req, res) => {
    res.send('Search for recipes by name, ingredients, etc.');
});

router.get('/:id', async (req, res) => {
    const user = req.body.user as AuthenticationUser;
    const recipe = await getRecipeById(req.params.id, user.userId);

    if(typeof recipe === "string") return res.status(400).send({error: recipe});
    if(("createdById" in recipe && recipe.createdById === user.userId) || ("createdBy" in recipe && recipe.createdBy.id === user.userId)) return res.status(200).send({error: undefined, data: { recipe: recipe }});
    else return res.status(403).send({error: 'You are not authorized to view this recipe'})
});

router.post('/', async (req, res) => {
    res.send('Create a new recipe in users collection');

    //units: NULL, 'cups', 'tablespoons', 'teaspoons', 'grams', 'kilograms', 'milliliters', 'liters', 'some', 'big', 'small', 'shot', 'pinch', 'drop', 'packet' 
});

router.put('/:id', async (req, res) => {
    res.send('Update a users recipe by id: ' + req.params.id);
});

router.delete('/:id', async (req, res) => {
    res.send('Delete a users recipe by id: ' + req.params.id);
});

export default router;