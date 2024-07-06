import query from "../../utils/query.js";

export async function editUserRecipe(recipeId: string, userId: string, recipeData: {key: "notes", value: string} | {key: "rating", value: number}) {

    const params = [recipeData.value, recipeId, userId];
    const q = ''
    + 'UPDATE '
    + 'cooking_recipe_suggester.user_recipes '
    + 'SET '
    + recipeData.key === "notes" ? "notes = ? " : 'rating = ? '
    + 'WHERE id = ? AND user_id = ?';

    const result = await query(q, params);
    if(typeof result === "string") return 'Error editing user recipe';
    return undefined;
}   

export async function addCookedTimeToUserRecipe(recipeId: string, userId: string) {
    const time = new Date()

    const params = [[time], recipeId, userId];
    const q = ''
    + 'UPDATE '
    + 'cooking_recipe_suggester.user_recipes '
    + 'SET cooked = cooked + ? '
    + 'WHERE recipe_id = ? AND user_id = ?';

    const result = await query(q, params);
    if(typeof result === "string") return 'Error adding cooked time to user recipe';
    return undefined;
}