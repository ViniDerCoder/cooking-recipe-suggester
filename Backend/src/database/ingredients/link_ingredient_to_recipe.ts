import query from "../../utils/query.js";

export async function linkIngredientToRecipe(ingredientId: string, recipeId: string, amount: number, unit: string | null) {
    const params = [recipeId, ingredientId, amount, unit];
    const q = ''
    + 'INSERT INTO '
    + 'cooking_recipe_suggester.recipe_ingredients '
    + '(recipe_id, ingredient_id, quantity, unit) '
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