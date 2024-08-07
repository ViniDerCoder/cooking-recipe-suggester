import express from 'express';

import { AuthenticationUser } from '../utils/types/authentication.js';
import { getCookedOfRecipe, getRecipeById, getUserDataOfRecipe, getUserRecipes, getUsersAdddedRecipes } from '../controller/recipes/get.js';
import { createRecipe } from '../controller/recipes/create.js';
import { deleteRecipe } from '../controller/recipes/delete.js';
import { editRecipeById } from '../controller/recipes/edit.js';
import verifyRequest from '../utils/defaultVerification.js';
import limit from '../utils/rate-limiter.js';
import { cookedRecipe, markRecipe, unmarkRecipe } from '../controller/recipes/mark.js';
import { getRecipesIngredients } from '../controller/recipes/ingredients/getRecipesIngredients.js';
import { setNotesForRecipe, setRatingForRecipe } from '../controller/recipes/addUserData.js';
import { getAllRecipeTypes, getRecipeTypeById } from '../controller/recipes/recipeTypes.js';
import bodyParser from 'body-parser';
import { getRecipeData } from '../controller/recipes/importRecipe.js';
const router = express.Router();


router.use(async (req, res, next) => {
    verifyRequest(req, res, next);
});

router.get('/', limit(1000 * 20, 2), async (req, res) => {
    const user = req.body.user as AuthenticationUser;

    const recipes = await getUserRecipes(user.userId)

    if(typeof recipes === "string") return res.status(400).send({error: recipes});
    else return res.status(200).send({message: "Fetching of all created recipes was successfull", error: undefined, data: { recipes: recipes }});
});

router.get('/mark', limit(1000 * 20, 2), async (req, res) => {
    const user = req.body.user as AuthenticationUser;

    const recipes = await getUsersAdddedRecipes(user.userId)

    if(typeof recipes === "string") return res.status(400).send({error: recipes});
    else return res.status(200).send({message: "Fetching of all marked recipe was successfull", error: undefined, data: { userRecipes: recipes }});
});

router.get('/mark/:id', limit(1000 * 20, 2), async (req, res) => {
    const user = req.body.user as AuthenticationUser;
    const id = req.params.id;

    const recipes = await getUserDataOfRecipe(user.userId, id)

    if(typeof recipes === "string") return res.status(400).send({error: recipes});
    else return res.status(200).send({message: "Fetching of all marked recipe was successfull", error: undefined, data: { userRecipes: recipes }});
});

router.post('/mark/:id', limit(1000 * 20, 5), async (req, res) => {
    const user = req.body.user as AuthenticationUser;
    const recipeId = req.params.id;

    const result = await markRecipe(user.userId, recipeId);

    if(typeof result === "string") return res.status(400).send({error: result});
    else return res.status(200).send({message: "Recipe was marked successfull", error: undefined});
});

router.delete('/mark/:id', limit(1000 * 20, 5), async (req, res) => {
    const user = req.body.user as AuthenticationUser;
    const recipeId = req.params.id;

    const result = await unmarkRecipe(user.userId, recipeId);

    if(typeof result === "string") return res.status(400).send({error: result});
    else return res.status(200).send({message: "Recipe was unmarked successfull", error: undefined});
})

router.get('/cooked/:id', limit(1000 * 20, 2), async (req, res) => {
    const user = req.body.user as AuthenticationUser;
    const recipeId = req.params.id;

    const result = await getCookedOfRecipe(user.userId, recipeId);

    if(typeof result === "string") return res.status(400).send({error: result});
    else return res.status(200).send({message: "Fetching of cooked times was successfull", error: undefined, data: { cooked: result }});
});

router.post('/cooked/:id', limit(1000 * 20, 1), async (req, res) => {
    const user = req.body.user as AuthenticationUser;
    const recipeId = req.params.id;

    const result = await cookedRecipe(recipeId, user.userId);

    if(typeof result === "string") return res.status(400).send({error: result});
    else return res.status(200).send({message: "Recipe was marked as cooked successfull", error: undefined});
});

router.post('/rating/:id', limit(1000 * 20, 1), async (req, res) => {
    const user = req.body.user as AuthenticationUser;
    const recipeId = req.params.id;
    const { rating } = req.body;

    const result = await setRatingForRecipe(recipeId, user.userId, rating);

    if(typeof result === "string") return res.status(400).send({error: result});
    else return res.status(200).send({message: "Rating was successfull", error: undefined});
});

router.post('/notes/:id', limit(1000 * 20, 1), async (req, res) => {
    const user = req.body.user as AuthenticationUser;
    const recipeId = req.params.id;
    const { notes } = req.body;

    const result = await setNotesForRecipe(recipeId, user.userId, notes);

    if(typeof result === "string") return res.status(400).send({error: result});
    else return res.status(200).send({message: "Setting notes was successfull", error: undefined});
});

//late feature
router.get('/search', limit(), async (req, res) => {
    res.send('Search for recipes by name, ingredients, etc.');
});

router.get('/types/', limit(1000 * 30), async (req, res) => {
    const result = getAllRecipeTypes();

    if(typeof result === "string") return res.status(400).send({error: result});
    else return res.status(200).send({message: "Fetching all recipe types was successfull", error: undefined, data: { types: result }});
})

router.get('/types/:id', limit(1000 * 30), async (req, res) => {
    const id = req.params.id;

    const result = getRecipeTypeById(id);

    if(typeof result === "string") return res.status(400).send({error: result});
    else return res.status(200).send({message: "Fetching recipe type was successfull", error: undefined, data: { type: result }});
});

router.get('/import/:url', limit(1000 * 60 * 20, 5), async (req, res) => {
    const url = req.params.url;

    const result = await getRecipeData(url);

    if(typeof result === "string" || !result) return res.status(400).send({error: result});
    else return res.status(200).send({message: "Importing recipe was successfull", error: undefined, data: { recipe: result }});
})

router.post('/import', limit(1000 * 60 * 20, 5), async (req, res) => {
    const user = req.body.user as AuthenticationUser;
    const { url, recipe, ingredients } = req.body;

    const result = await createRecipe(user.userId, recipe, ingredients, url);

    if(typeof result === "string") return res.status(400).send({error: result});
    else return res.status(200).send({message: "Recipe creation was successfull", error: undefined, data: { recipe: result }});
});

router.get('/:id', limit(1000 * 20, 2), async (req, res) => {
    const user = req.body.user as AuthenticationUser;

    const recipe = await getRecipeById(req.params.id, user.userId);

    if(typeof recipe === "string") return res.status(400).send({error: recipe});
    else return res.status(200).send({message: "Fetching recipe was successfull", error: undefined, data: { recipe: recipe }});
});

router.post('/', limit(1000 * 60 * 20, 5), bodyParser.json({ limit: "100mb" }), async (req, res) => {
    const user = req.body.user as AuthenticationUser;
    const { recipe, ingredients } = req.body

    const result = await createRecipe(user.userId, recipe, ingredients);

    if(typeof result === "string") return res.status(400).send({error: result});
    else return res.status(200).send({message: "Recipe creation was successfull", error: undefined, data: { recipe: result }});
});

router.put('/:id', limit(1000 * 60 * 20, 5), bodyParser.json({ limit: "100mb" }), async (req, res) => {
    const user = req.body.user as AuthenticationUser;
    const recipeId = req.params.id;
    const { recipe, ingredients } = req.body

    const result = await editRecipeById(recipeId, user.userId, recipe, ingredients);

    if(typeof result === "string") return res.status(400).send({error: result});
    else return res.status(200).send({message: "Editing was successfull", error: undefined, data: { recipe: result }});
});

router.delete('/:id', limit(1000 * 60 * 20, 5), async (req, res) => {
    const user = req.body.user as AuthenticationUser;
    const recipeId = req.params.id

    const result = await deleteRecipe(recipeId, user.userId);

    if(typeof result === "string") return res.status(400).send({error: result});
    else return res.status(200).send({message: "Deletion was successfull", error: undefined});
});

router.get('/ingredients/:id', limit(1000 * 60), async (req, res) => {
    const user = req.body.user as AuthenticationUser;
    const id = req.params.id;

    const result = await getRecipesIngredients(user.userId, id);

    if(typeof result === "string") return res.status(400).send({error: result});
    else return res.status(200).send({message: "Fetching ingredients of recipe was successfull", error: undefined, data: { ingredients: result }});
})

export default router;