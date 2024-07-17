import query from "../../utils/query.js";
import { Uuid } from "../../utils/types/other.js";

export async function linkIngredientToRecipe(ingredientId: Uuid, recipeId: Uuid, amount: number, unit: string | null, description: string | null) {
    const params = [recipeId, ingredientId, amount, unit, description];
    const q = ''
    + 'INSERT INTO '
    + 'cooking_recipe_suggester.recipe_ingredients '
    + '(recipe_id, ingredient_id, quantity, unit, description) '
    + 'VALUES (?, ?, ?, ?, ?)';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error linking ingredient to recipe';
    else return {
        recipeId: recipeId,
        ingredientId: ingredientId,
        amount: amount,
        unit: unit,
        description: description
    };
}