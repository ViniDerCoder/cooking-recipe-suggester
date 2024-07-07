import { getRecipesByFilters } from "../../database/recipes/get_recipe.js";
import { listUsersAddedRecipeData } from "../../database/recipes/list_recipes.js";
import getSettingsOfUser from "../../database/suggestions/suggestionSettings/get.js";
import onInterval from "../../utils/listener/interval.js";
import { isUuid, Uuid } from "../../utils/types/other.js";
import { Recipe, RecipeUserData } from "../../utils/types/recipe.js";
import { Suggestion, MealSuggestion, MealSuggestionsSettings, MealSuggestionUserDataFilter, MealSuggestionRecipeFilter } from "../../utils/types/suggestion.js";

let suggestions: { [key: Uuid]: Suggestion } = {}

onInterval('redoSuggestions', 60 * 24, async () => {
    suggestions = {}
}, new Date().setHours(0, 0, 0, 0));

export function removeUserSuggestions(userId: Uuid) {
    delete suggestions[userId];
}

export async function getSuggestionsForUser(userId: unknown) {
    if(!isUuid(userId)) return "Invalid userId";

    if(suggestions[userId]) return suggestions[userId];
    
    const suggestionSettings = await getSettingsOfUser(userId);
    if(typeof suggestionSettings === "string") return suggestionSettings;

    const unFilteredUserRecipes = await listUsersAddedRecipeData(userId);
    if(typeof unFilteredUserRecipes === "string") return unFilteredUserRecipes;
    
    suggestions[userId] = { morning: null, midday: null, evening: null} 

    let usedRecipes: Array<Uuid> = []

    const morningSuggestions = suggestionSettings.meals.morning.enabled ? await getMealSuggestions(userId, suggestionSettings.meals.morning.settings, unFilteredUserRecipes, usedRecipes) : null;
    if(typeof morningSuggestions === "string") return morningSuggestions;
    else suggestions[userId].morning = morningSuggestions;

    if(suggestions[userId].morning) usedRecipes = usedRecipes.concat(suggestions[userId].morning.recipes);

    const middaySuggestions = suggestionSettings.meals.midday.enabled ? await getMealSuggestions(userId, suggestionSettings.meals.midday.settings, unFilteredUserRecipes, usedRecipes) : null;
    if(typeof middaySuggestions === "string") return middaySuggestions;
    else suggestions[userId].midday = middaySuggestions;

    if(suggestions[userId].midday) usedRecipes = usedRecipes.concat(suggestions[userId].midday.recipes);

    const eveningSuggestions = suggestionSettings.meals.evening.enabled ? await getMealSuggestions(userId, suggestionSettings.meals.evening.settings, unFilteredUserRecipes, usedRecipes) : null;
    if(typeof eveningSuggestions === "string") return eveningSuggestions;
    else suggestions[userId].evening = eveningSuggestions;

    return suggestions[userId];
}

async function getMealSuggestions(userId: Uuid, meal: MealSuggestionsSettings, userRecipes: RecipeUserData[], blackListed: Array<Uuid> = []): Promise<MealSuggestion | string | null> {

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

function generateSuggestionsFromRecipes(recipes: Array<{recipe: Recipe, userData: RecipeUserData}>, suggestions: number) {
    
    const sortedRecipes = recipes.sort((a, b) => {
        const rating = compareRecipes(a, b);
        return rating;
    });

    return {
        recipes: sortedRecipes.map((recipe) => recipe.recipe.id).slice(0, suggestions),
    } as MealSuggestion;
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