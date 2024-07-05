import express from 'express';
import { AuthenticationUser } from '../utils/types.js';
import { getRecipeById, getUserRecipes, getUsersAdddedRecipes } from '../controller/recipes/get.js';
import { createCustomRecipe } from '../controller/recipes/create.js';
import { isTokenValid } from '../controller/authentication/validate.js';
import { deleteRecipe } from '../controller/recipes/delete.js';
import { editRecipeById } from '../controller/recipes/edit.js';
const router = express.Router();


router.use(async (req, res, next) => {
    if(!req.headers.authorization) return res.status(401).send({error: 'No authorization token provided'});
    req.body.user = await isTokenValid(req.headers.authorization);
    if(typeof req.body.user === "string" || !req.body.user) return res.status(401).send({error: 'Invalid authorization token provided'});
    else next();
});

router.get('/', async (req, res) => {
    const user = req.body.user as AuthenticationUser;
    const recipes = await getUserRecipes(user.userId)

    if(typeof recipes === "string") return res.status(400).send({error: recipes});
    else return res.status(200).send({message: "Fetching of all created recipes was successfull", error: undefined, data: { recipes: recipes }});
});

router.get('/marked', async (req, res) => {
    const user = req.body.user as AuthenticationUser;
    const recipes = await getUsersAdddedRecipes(user.userId)

    if(typeof recipes === "string") return res.status(400).send({error: recipes});
    else return res.status(200).send({message: "Fetching of all marked recipe was successfull", error: undefined, data: { userRecipes: recipes }});
});

//late feature
router.get('/search', async (req, res) => {
    res.send('Search for recipes by name, ingredients, etc.');
});

router.get('/:id', async (req, res) => {
    const user = req.body.user as AuthenticationUser;
    const recipe = await getRecipeById(req.params.id, user.userId);

    if(typeof recipe === "string") return res.status(400).send({error: recipe});
    if("createdById" in recipe && recipe.createdById === user.userId) return res.status(200).send({message: "Fetching recipe was successfull", error: undefined, data: { recipe: recipe }});
    else return res.status(403).send({error: 'You are not authorized to view this recipe'})
});

router.post('/', async (req, res) => {
    const user = req.body.user as AuthenticationUser;
    const { recipe, ingredients } = req.body;

    const result = await createCustomRecipe(user.userId, recipe, ingredients);
    if(typeof result === "string") return res.status(400).send({error: result});
    else return res.status(200).send({message: "Recipe creation was successfull", error: undefined, data: { recipe: result }});
});

router.put('/:id', async (req, res) => {
    const user = req.body.user as AuthenticationUser;
    const recipeId = req.params.id;
    const { recipe, ingredients } = req.body;

    const result = await editRecipeById(recipeId, user.userId, recipe, ingredients);
    if(typeof result === "string") return res.status(400).send({error: result});
    else return res.status(200).send({message: "Editing was successfull", error: undefined, data: { recipe: result }});
});

router.delete('/:id', async (req, res) => {
    const user = req.body.user as AuthenticationUser;
    const recipeId = req.params.id

    const result = await deleteRecipe(recipeId, user.userId);
    if(typeof result === "string") return res.status(400).send({error: result});
    else return res.status(200).send({message: "Deletion was successfull", error: undefined});
});

export default router;