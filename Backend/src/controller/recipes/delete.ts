import { deleteRecipe as dbDeleteRecipe } from "../../database/recipes/delete_recipe.js";
import { getRecipeById } from "../../database/recipes/get_recipe.js";

export async function deleteRecipe(recipeId: string, userId: string) {
    if(typeof recipeId !== "string" || typeof userId !== "string") return 'Invalid input';
    
    const recipe = await getRecipeById(recipeId);

    if(typeof recipe === "string") return recipe;
    if(recipe.createdById !== userId) return 'User does not have permission to delete this recipe';
    

    const dbResult = await dbDeleteRecipe(recipe);

    if(typeof dbResult === "string") return dbResult;
    else return dbResult;
}