import * as uuid from "uuid";

import { getRecipeById as dbRecipeById, getRecipesById } from "../../database/recipes/get_recipe.js";
import { listUserRecipes, listUsersAddedRecipeData } from "../../database/recipes/list_recipes.js";
import { getRecipeTypeById } from "../../database/recipes/recipe_types.js";
import { Recipe, RecipeUserData } from "../../utils/types.js";

export async function getRecipeById(id: string, userId: string) {
    if(typeof id !== "string" || typeof userId !== "string") return 'Invalid input';
    if(!uuid.validate(id)) return 'Invalid Recipe ID';
    if(!uuid.validate(userId)) return 'Invalid User ID';
    const dbResult = await dbRecipeById(id);

    if(typeof dbResult === "string") return dbResult;
    else {
        if("typeId" in dbResult) {
            const recipe = dbResult as any;
            const type = getRecipeTypeById(dbResult.typeId);
            if(!type) return 'Error getting recipe type';
            else {
                delete recipe.typeId;
                return {
                    ...recipe,
                    type: type
                } as Recipe
            }
        } 
        else return dbResult;
    }
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
    
    const recipes = await getRecipesById(recipesUserData.filter((recipe) => !recipe.recipeDeletedName).map((recipe) => recipe.recipeId));

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