import query from "../../utils/query.js";
import { Uuid } from "../../utils/types/other.js";

export async function updateIngredientInRecipe(ingredientId: Uuid, recipeId: Uuid, amount: number, unit: string | null, description: string | null) {
    const params = [amount, unit, description, recipeId, ingredientId];
    const q = ''
    + 'UPDATE '
    + 'cooking_recipe_suggester.recipe_ingredients '
    + 'SET quantity = ?, unit = ?, description = ? '
    + 'WHERE recipe_id = ? AND ingredient_id = ?';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error updating ingredient in recipe';
    else return {
        recipeId: recipeId,
        ingredientId: ingredientId,
        amount: amount,
        unit: unit
    };
}