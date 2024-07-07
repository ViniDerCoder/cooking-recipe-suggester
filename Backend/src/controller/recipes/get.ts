import { getRecipeById as dbRecipeById, getRecipesByIds } from "../../database/recipes/get_recipe.js";
import { listUserRecipes, listUsersAddedRecipeData } from "../../database/recipes/list_recipes.js";
import { Recipe } from "../../utils/types/recipe.js";
import { isUuid } from "../../utils/types/other.js";

export async function getRecipeById(id: unknown, userId: unknown) {
    if(!isUuid(id) || !isUuid(userId)) return 'Invalid input';

    const dbResult = await dbRecipeById(id);

    if(typeof dbResult === "string") return dbResult;
    if(dbResult.createdById !== userId && !dbResult.public) return 'User does not have permission to view this recipe';
    else return dbResult;
}

export async function getUserRecipes(id: unknown) {
    if(!isUuid(id)) return 'Invalid input';

    const recipe = await listUserRecipes(id);
    return recipe
}

export async function getUsersAdddedRecipes(id: unknown) {
    if(!isUuid(id)) return 'Invalid input';

    const recipesUserData = await listUsersAddedRecipeData(id);

    if(typeof recipesUserData === "string") return recipesUserData;
    
    const recipes = await getRecipesByIds(recipesUserData.filter((recipe) => !recipe.recipeDeletedName).map((recipe) => recipe.recipeId));

    if(typeof recipes === "string") return recipes;
    else {
        return recipesUserData.map((recipeUserData) => {
            return {
                userData: recipeUserData,
                recipe: recipes.find((recipe) => recipe.id === recipeUserData.recipeId) as Recipe
            }
        })
    }
}