import { getIngredientIdsOfRecipes } from "../../database/ingredients/get_ingredients_of_recipe.js";
import { getRecipeById, getRecipesWithTypeIn, getRecipesByIds } from "../../database/recipes/get_recipe.js";
import { getUserDataFromRecipes, listUsersAddedRecipeData } from "../../database/recipes/list_recipes.js";
import getSettingsOfUser from "../../database/suggestions/suggestionSettings/get.js";
import onInterval from "../../utils/listener/interval.js";
import { isUuid, Uuid } from "../../utils/types/other.js";
import { Recipe, RecipeUserData } from "../../utils/types/recipe.js";
import { Suggestion, MealSuggestionsSettings, MealSuggestionRecipeFilter, MealSuggestionFullRecipe, SuggestionFullRecipe } from "../../utils/types/suggestion.js";
import { getIngredientsByIds } from "../ingredients/get.js";

let suggestions: { [key: Uuid]: Suggestion } = {}

onInterval('redoSuggestions', 60 * 24, async () => {
    suggestions = {}
}, new Date().setHours(0, 0, 0, 0));

export function removeUserSuggestions(userId: Uuid) {
    delete suggestions[userId];
}

export async function getSuggestionsForUser(userId: unknown) {
    if(!isUuid(userId)) return "Invalid userId";

    if(suggestions[userId]) return await loadDataForSuggestion(userId, suggestions[userId]);
    
    const suggestionSettings = await getSettingsOfUser(userId);
    if(typeof suggestionSettings === "string") return suggestionSettings;

    const unFilteredUserRecipes = await listUsersAddedRecipeData(userId);
    if(typeof unFilteredUserRecipes === "string") return unFilteredUserRecipes;
    
    suggestions[userId] = { morning: null, midday: null, evening: null} 

    let usedRecipes: Array<Uuid> = []

    const morningSuggestions = suggestionSettings.meals.morning.enabled ? await getMealSuggestions(userId, suggestionSettings.meals.morning.settings, unFilteredUserRecipes, usedRecipes) : null;
    if(typeof morningSuggestions === "string") return morningSuggestions;
    else suggestions[userId].morning = morningSuggestions ? {recipes: morningSuggestions.recipes.map((r) => r.recipe.id)} : null;

    if(suggestions[userId].morning) usedRecipes = usedRecipes.concat(suggestions[userId].morning.recipes);

    const middaySuggestions = suggestionSettings.meals.midday.enabled ? await getMealSuggestions(userId, suggestionSettings.meals.midday.settings, unFilteredUserRecipes, usedRecipes) : null;
    if(typeof middaySuggestions === "string") return middaySuggestions;
    else suggestions[userId].midday = middaySuggestions ? {recipes: middaySuggestions.recipes.map((r) => r.recipe.id)} : null;

    if(suggestions[userId].midday) usedRecipes = usedRecipes.concat(suggestions[userId].midday.recipes);

    const eveningSuggestions = suggestionSettings.meals.evening.enabled ? await getMealSuggestions(userId, suggestionSettings.meals.evening.settings, unFilteredUserRecipes, usedRecipes) : null;
    if(typeof eveningSuggestions === "string") return eveningSuggestions;
    else suggestions[userId].evening = eveningSuggestions ? {recipes: eveningSuggestions.recipes.map((r) => r.recipe.id)} : null;

    return {
        morning: morningSuggestions,
        midday: middaySuggestions,
        evening: eveningSuggestions
    } as SuggestionFullRecipe;
}

async function getMealSuggestions(userId: Uuid, meal: MealSuggestionsSettings, userRecipes: RecipeUserData[], blackListed: Array<Uuid> = []): Promise<MealSuggestionFullRecipe | string | null> {

    if(typeof userRecipes === "string") return "Error getting user recipes";
    if(userRecipes.length === 0) return null;

    const filteredUserRecipes = userRecipes.filter((recipe) => {
        if(blackListed.includes(recipe.recipeId)) return false;
        if(!meal.unratedAllowed && !recipe.rating) return false;
        if(meal.unratedAllowed && (!recipe.rating ? Infinity : recipe.rating) < meal.minRating) return false;
        if(recipe.cooked.length < meal.minTimesCooked) return false;
        if(meal.timeoutAfterLastCooked !== 0) {
            recipe.cooked.sort((a, b) => b.getTime() - a.getTime());
            if((Date.now() - recipe.cooked[0].getTime()) < meal.timeoutAfterLastCooked * 60 * 60 * 1000) return false;
        }
        if(typeof recipe.recipeDeletedName === "string") return false;

        return true;
    });
    if(filteredUserRecipes.length === 0) return null;

    const preFilteredRecipes = await getRecipesByFilters(filteredUserRecipes.map((recipe) => recipe.recipeId), {
        vegan: meal.vegan,
        vegetarian: meal.vegetarian,
        glutenFree: meal.glutenFree,
        dairyFree: meal.dairyFree,
        nutFree: meal.nutFree,
        eggFree: meal.eggFree,
        fishFree: meal.fishFree,
        shellfishFree: meal.shellfishFree,
        soyFree: meal.soyFree,

        recipeTypesWhitelist: meal.recipeTypesWhitelist
    } as MealSuggestionRecipeFilter);
    
    if(typeof preFilteredRecipes === "string") return "Error getting recipes";
    if(preFilteredRecipes.length === 0) return null;

    const filteredRecipes = preFilteredRecipes.filter((recipe) => {
        if(recipe.public === false && userId !== recipe.createdById) return false;
        if(recipe.waitingTime + recipe.cookingTime > (meal.maxPreparationTime ? meal.maxPreparationTime : Infinity)) return false;
        if(meal.recipeTypesBlacklist.includes(recipe.typeId)) return false;

        return true;
    });

    if(filteredRecipes.length === 0) return null;

    const linkedRecipes = filteredRecipes.map((recipe) => {
        return {
            recipe: recipe,
            userData: filteredUserRecipes.find((userRecipe) => userRecipe.recipeId === recipe.id) as RecipeUserData
        }
    });

    return generateSuggestionsFromRecipes(linkedRecipes, 3);
}

async function getRecipesByFilters(recipeIds: Uuid[], filters: MealSuggestionRecipeFilter) {
    const recipes = await getRecipesWithTypeIn(recipeIds, filters.recipeTypesWhitelist);
    if(typeof recipes === "string") return recipes;

    const recipesIngredientIds = await getIngredientIdsOfRecipes(recipes.map((recipe) => recipe.id));
    if(typeof recipesIngredientIds === "string") return recipesIngredientIds;

    const requiredIngredients: Uuid[] = []
    Object.keys(recipesIngredientIds).forEach((ingredientId) => {
        requiredIngredients.concat(recipesIngredientIds[ingredientId]);
    });
    const requiredIngredientsWithoutDuplicates = [...new Set(requiredIngredients)];

    const ingredients = await getIngredientsByIds(requiredIngredientsWithoutDuplicates);
    if(typeof ingredients === "string") return ingredients;

    return recipes.filter((recipe) => {
        const recipeIngredients = recipesIngredientIds[recipe.id];
        const recipeIngredientProperties = recipeIngredients.map((ingredientId) => ingredients.find((ingredient) => ingredient.id === ingredientId)?.properties);

        return recipeIngredientProperties.every((properties) => {
            if(!properties) return false;
            if(filters.vegan !== null && properties.vegan !== filters.vegan) return false;
            if(filters.vegetarian !== null && properties.vegetarian !== filters.vegetarian) return false;
            if(filters.glutenFree !== null && properties.glutenFree !== filters.glutenFree) return false;
            if(filters.dairyFree !== null && properties.dairyFree !== filters.dairyFree) return false;
            if(filters.nutFree !== null && properties.nutFree !== filters.nutFree) return false;
            if(filters.eggFree !== null && properties.eggFree !== filters.eggFree) return false;
            if(filters.fishFree !== null && properties.fishFree !== filters.fishFree) return false;
            if(filters.shellfishFree !== null && properties.shellfishFree !== filters.shellfishFree) return false;
            if(filters.soyFree !== null && properties.soyFree !== filters.soyFree) return false;

            return true;
        });
    })
}

function generateSuggestionsFromRecipes(recipes: Array<{recipe: Recipe, userData: RecipeUserData}>, suggestions: number) {
    
    const sortedRecipes = recipes.sort((a, b) => {
        const rating = compareRecipes(a, b);
        return rating;
    });

    return {
        recipes: sortedRecipes.slice(0, suggestions),
    } as MealSuggestionFullRecipe;
}

function compareRecipes(recipe1: {recipe: Recipe, userData: RecipeUserData}, recipe2: {recipe: Recipe, userData: RecipeUserData}) {
    let rating = 0;

    /**
     * Rating system:
     * 
     * + high timesCooked
     * + high rating
     * 
     * - high preparation time
     * - low time since last cooked
     */


    rating += recipe1.userData.cooked.length === recipe2.userData.cooked.length ? rnd(-1, 1) : recipe1.userData.cooked.length > recipe2.userData.cooked.length ? 2 : -3;
    rating += recipe1.userData.rating === recipe2.userData.rating && recipe1.userData.rating ? rnd(-1, 1) : (recipe1.userData.rating ? recipe1.userData.rating : rnd(3, 4)) > (recipe2.userData.rating ? recipe2.userData.rating : rnd(3, 4)) ? 2 : -2;

    rating += recipe1.recipe.waitingTime + recipe1.recipe.cookingTime < recipe2.recipe.waitingTime + recipe2.recipe.cookingTime ? 2 : -2;
    rating += recipe1.userData.cooked.length > 0 && recipe2.userData.cooked.length > 0 ? (Date.now() - recipe1.userData.cooked.sort((a, b) => b.getTime() - a.getTime())[0].getTime()) < (Date.now() - recipe2.userData.cooked.sort((a, b) => b.getTime() - a.getTime())[0].getTime()) ? 2 : -2 : 0;

    return rating;
}

function rnd(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}

async function loadDataForSuggestion(userId: Uuid, suggestion: Suggestion) {
    const recipes = await getRecipesByIds([...(suggestion.morning?.recipes || []), ...(suggestion.midday?.recipes || []), ...(suggestion.evening?.recipes || [])]);
    if(typeof recipes === "string") return recipes;
    if(recipes.length === 0) return 'No recipes found';
    const userRecipes = await getUserDataFromRecipes(recipes.map((recipe) => recipe.id), userId);
    if(typeof userRecipes === "string") return userRecipes;

    const linkedRecipes = recipes.map((recipe) => {
        return {
            recipe: recipe,
            userData: userRecipes.find((userRecipe) => userRecipe.recipeId === recipe.id) as RecipeUserData
        }
    });

    return {
        morning: suggestion.morning ? {recipes: linkedRecipes.filter((recipe) => suggestion.morning ? suggestion.morning.recipes.includes(recipe.recipe.id) : false)} : null,
        midday : suggestion.midday  ? {recipes: linkedRecipes.filter((recipe) => suggestion.midday  ? suggestion.midday.recipes.includes(recipe.recipe.id)  : false)} : null,
        evening: suggestion.evening ? {recipes: linkedRecipes.filter((recipe) => suggestion.evening ? suggestion.evening.recipes.includes(recipe.recipe.id) : false)} : null
    } as SuggestionFullRecipe;
}