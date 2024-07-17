import { getIngredientsOfRecipe } from "../../database/ingredients/get_ingredients_of_recipe.js";
import { getRecipeById } from "../../database/recipes/get_recipe.js";
import { editabelRecipeProperties, isRecipeEditData } from "../../utils/types/recipe.js";
import { isIngredientUpdateActionList } from "../../utils/types/ingredient.js";
import { updateRecipe } from "../../database/recipes/update_recipe.js";
import { linkIngredientToRecipe } from "../../database/ingredients/link_ingredient_to_recipe.js";
import { updateIngredientInRecipe } from "../../database/ingredients/update_recipe_ingredients.js";
import { unlinkIngredientFromRecipe } from "../../database/ingredients/unlink_ingredient_from_recipe.js";
import { isUuid } from "../../utils/types/other.js";


export async function editRecipeById(recipeId: unknown, userId: unknown, newRecipe: any, newIngredients: any) {
    if(!isUuid(recipeId) || !isUuid(userId)) return 'Invalid input';

    if(!isRecipeEditData(newRecipe) && newRecipe !== undefined && newRecipe !== null) return 'Invalid input';

    if(!isIngredientUpdateActionList(newIngredients) && newIngredients !== undefined && newIngredients !== null) return 'Invalid input';

    if(newRecipe.cookingTime < 0 || newRecipe.servings < 1) return 'Invalid recipe data';
    if(newRecipe.description.length > 500) return 'Description too long';

    const recipe = await getRecipeById(recipeId);
    if(typeof recipe === "string") return recipe;
    
    if(recipe.createdById !== userId) return 'User does not have permission to edit this recipe';

    const recipeIngredients = await getIngredientsOfRecipe(recipe.id);
    if(typeof recipeIngredients === "string") return recipe

    const newRecipeData: {[key: string]: Array<string> | string | boolean | number} = {}
    if(newRecipe !== undefined && newRecipe !== null) {
        for(const key of Object.keys(newRecipe)) {
            if(!editabelRecipeProperties.includes(key as any)) continue;
            if(newRecipe[key] !== undefined && newRecipe[key] !== null) newRecipeData[key] = newRecipe[key];
        }
    }

    if(newIngredients !== undefined && newIngredients !== null) {
        for(const ingredientAction of newIngredients) {
            if(ingredientAction.type === "ADD") {
                const dbResult = await linkIngredientToRecipe(ingredientAction.ingredientId, recipeId, ingredientAction.amount, ingredientAction.unit, ingredientAction.description);
                if(typeof dbResult === "string") return dbResult;
            } else if(ingredientAction.type === "UPDATE") {
                const dbResult = await updateIngredientInRecipe(ingredientAction.ingredientId, recipeId, ingredientAction.amount, ingredientAction.unit, ingredientAction.description);
                if(typeof dbResult === "string") return dbResult;
            } else if(ingredientAction.type === "REMOVE") {
                const dbResult = await unlinkIngredientFromRecipe(ingredientAction.ingredientId, recipeId);
                if(typeof dbResult === "string") return dbResult;
            }
        }
    }

    if(Object.keys(newRecipeData).length > 0) {
        const dbResult = await updateRecipe(recipeId, newRecipeData);
        if(typeof dbResult === "string") return dbResult;
    }

    const editedRecipe = await getRecipeById(recipeId);
    return editedRecipe;
}