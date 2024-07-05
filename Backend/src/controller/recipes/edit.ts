import { getIngredientsOfRecipe } from "../../database/ingredients/get_ingredients_of_recipe.js";
import { getRecipeById } from "../../database/recipes/get_recipe.js";
import { editabelRecipeProperties } from "../../utils/types.js";


export async function editRecipeById(recipeId: string, userId: string, newRecipe: any, newIngredients: any) {
    if(typeof recipeId !== "string" || typeof userId !== "string") return 'Invalid input';

    if(typeof newRecipe !== "object" || !Array.isArray(newIngredients)) return 'Invalid input';

    const recipe = await getRecipeById(recipeId);
    if(typeof recipe === "string") return recipe;
    
    if(recipe.createdById !== userId) return 'User does not have permission to edit this recipe';

    const recipeIngredients = await getIngredientsOfRecipe(recipe.id);
    if(typeof recipeIngredients === "string") return recipe

    const newRecipeData: {[key: string]: Array<string> | string | boolean | number} = {}
    if(newRecipe) {
        for(const key in newRecipe) {
            if(!editabelRecipeProperties.includes(key as any)) return 'Invalid recipe changes provided (' + key + ')';
            if(key === "instructions") {
                if(!Array.isArray(newRecipe[key]) || newRecipe[key].filter((instr) => typeof instr !== "string").length > 0) return 'Invalid recipe ' + key;
            } else if(key === "cookingTime" || key === "waitingTime" || key === "servings") {
                if(typeof newRecipe[key] !== "number") return 'Invalid recipe ' + key;
            } else if(key === "public") {
                if(typeof newRecipe[key] !== "boolean") return 'Invalid recipe ' + key;
            } else {
                if(typeof newRecipe[key] !== "string") return 'Invalid recipe ' + key;
            }
            newRecipeData[key] = newRecipe[key];
        }
    }
}