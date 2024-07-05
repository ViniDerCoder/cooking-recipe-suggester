import * as uuid from "uuid";

import { getIngredientsOfRecipe } from "../../database/ingredients/get_ingredients_of_recipe.js";
import { getRecipeById } from "../../database/recipes/get_recipe.js";
import { editabelRecipeProperties, validRecipeUnits } from "../../utils/types.js";
import { updateRecipe } from "../../database/recipes/update_recipe.js";
import { linkIngredientToRecipe } from "../../database/ingredients/link_ingredient_to_recipe.js";
import { updateIngredientInRecipe } from "../../database/ingredients/update_recipe_ingredients.js";
import { unlinkIngredientFromRecipe } from "../../database/ingredients/unlink_ingredient_from_recipe.js";


export async function editRecipeById(recipeId: string, userId: string, newRecipe: any, newIngredients: any) {
    if(typeof recipeId !== "string" || typeof userId !== "string") return 'Invalid input';
    if(!uuid.validate(recipeId)) return 'Invalid Recipe ID';
    if(!uuid.validate(userId)) return 'Invalid User ID';

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
                if(!Array.isArray(newRecipe[key]) || newRecipe[key].filter((instr) => typeof instr !== "string").length > 0 || newRecipe[key].length < 1) return 'Invalid recipe ' + key;
            } else if(key === "cookingTime" || key === "waitingTime" || key === "servings") {
                if(typeof newRecipe[key] !== "number") return 'Invalid recipe ' + key;
            } else if(key === "public") {
                if(typeof newRecipe[key] !== "boolean") return 'Invalid recipe ' + key;
            } else if(key === "typeId") {
                if(typeof newRecipe[key] !== "string" || !uuid.validate(newRecipe[key])) return 'Invalid recipe ' + key;
            } else {
                if(typeof newRecipe[key] !== "string") return 'Invalid recipe ' + key;
            }
            newRecipeData[key] = newRecipe[key];
        }
    }

    if(newIngredients) {
        for(const ingredientAction of newIngredients) {
            if(typeof ingredientAction !== "object") return 'Invalid ingredient';
            if(!ingredientAction) return 'Invalid ingredient';

            if(ingredientAction.type === "ADD" || ingredientAction.type === "UPDATE") {
                if(typeof ingredientAction.id !== "string" || !uuid.validate(ingredientAction.id)) return 'Invalid ingredient id';
                if(typeof ingredientAction.amount !== "number") return 'Invalid ingredient amount';
                if(ingredientAction.unit) {
                    if(typeof ingredientAction.unit !== "string") return 'Invalid ingredient unit';
                    if(!validRecipeUnits.includes(ingredientAction.unit)) return 'Invalid ingredient unit';
                }
            } else if(ingredientAction.type === "REMOVE") {
                if(typeof ingredientAction.id !== "string" || !uuid.validate(ingredientAction.id)) return 'Invalid ingredient id';
            } else return 'Invalid ingredient action';
        }

        for(const ingredientAction of newIngredients) {
            if(ingredientAction.type === "ADD") {
                const dbResult = await linkIngredientToRecipe(recipeId, ingredientAction.id, ingredientAction.amount, ingredientAction.unit);
                if(typeof dbResult === "string") return dbResult;
            } else if(ingredientAction.type === "UPDATE") {
                const dbResult = await updateIngredientInRecipe(recipeId, ingredientAction.id, ingredientAction.amount, ingredientAction.unit);
                if(typeof dbResult === "string") return dbResult;
            } else if(ingredientAction.type === "REMOVE") {
                const dbResult = await unlinkIngredientFromRecipe(recipeId, ingredientAction.id);
                if(typeof dbResult === "string") return dbResult;
            }
        }
    }

    const dbResult = await updateRecipe(recipeId, newRecipeData);
    if(typeof dbResult === "string") return dbResult;

    const editedRecipe = await getRecipeById(recipeId);
    return editedRecipe;
}