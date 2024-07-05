import query from "../../utils/query.js";

export async function updateIngredientInRecipe(ingredientId: string, recipeId: string, amount: number, unit: string | null) {
    const params = [recipeId, ingredientId, amount, unit];
    const q = ''
    + 'UPDATE '
    + 'cooking_recipe_suggester.recipe_ingredients '
    + 'SET quantity = ?, unit = ? '
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