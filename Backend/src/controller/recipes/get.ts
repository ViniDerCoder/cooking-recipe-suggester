import * as uuid from "uuid";

import { getRecipeById as dbRecipeById, getRecipesByIds } from "../../database/recipes/get_recipe.js";
import { listUserRecipes, listUsersAddedRecipeData } from "../../database/recipes/list_recipes.js";
import { Recipe } from "../../utils/types/recipe.js";

export async function getRecipeById(id: string, userId: string) {
    if(typeof id !== "string" || typeof userId !== "string") return 'Invalid input';
    if(!uuid.validate(id)) return 'Invalid Recipe ID';
    if(!uuid.validate(userId)) return 'Invalid User ID';
    const dbResult = await dbRecipeById(id);

    if(typeof dbResult === "string") return dbResult;
    if(dbResult.createdById !== userId && !dbResult.public) return 'User does not have permission to view this recipe';
    else return dbResult;
}

export async function getUserRecipes(id: string) {
    if(typeof id !== "string") return 'Invalid input';
    if(!uuid.validate(id)) return 'Invalid User ID';
    const recipe = await listUserRecipes(id);
    return recipe
}

export async function getUsersAdddedRecipes(id: string) {
    if(typeof id !== "string") return 'Invalid input';
    if(!uuid.validate(id)) return 'Invalid User ID';
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