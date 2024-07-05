import query from "../../utils/query.js";

export async function unlinkIngredientFromRecipe(ingredientId: string, recipeId: TemplateStringsArray) {
    const params = [recipeId, ingredientId];
    const q = ''
    + 'DELETE FROM '
    + 'cooking_recipe_suggester.recipe_ingredients '
    + 'WHERE recipe_id = ? AND ingredient_id = ?';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error unlinking ingredient from recipe';
    else return undefined;
}