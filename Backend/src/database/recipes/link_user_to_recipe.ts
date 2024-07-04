import query from "../../utils/query.js";

export async function linkUserToRecipe(userId: string, recipeId: string) {
    const params = [userId, recipeId];
    const q = ''
    + 'INSERT INTO '
    + 'cooking_recipe_suggester.user_recipes '
    + '(user_id, recipe_id) '
    + 'VALUES (?, ?)';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error linking ingredient to recipe';
    else return {
        userId: userId,
        recipeId: recipeId
    };
}