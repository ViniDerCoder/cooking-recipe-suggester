import query from "../../utils/query.js";
import { RecipeIngredientUnit } from "../../utils/types.js";

export async function linkIngredientToRecipe(ingredientId: string, recipeId: string, amount: string, unit: string) {
    const params = [recipeId, ingredientId, amount, unit];
    const q = ''
    + 'INSERT INTO '
    + 'cooking_recipe_suggester.recipe_ingredients '
    + '(recipe_id, ingredient_id, amount, unit) '
    + 'VALUES (?, ?, ?, ?)';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error linking ingredient to recipe';
    else return {
        recipeId: recipeId,
        ingredientId: ingredientId,
        amount: amount,
        unit: unit
    };
}