import query from "../../utils/query.js";
import { Uuid } from "../../utils/types/other.js";

export async function linkUserToRecipe(userId: Uuid, recipeId: Uuid) {
    const params = [userId, recipeId];
    const q = ''
    + 'INSERT INTO '
    + 'cooking_recipe_suggester.user_recipes '
    + '(user_id, recipe_id) '
    + 'VALUES (?, ?)';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error linking user to recipe';
    else return {
        userId: userId,
        recipeId: recipeId
    };
}

export async function unlinkUserFromRecipe(userId: Uuid, recipeId: Uuid) {
    const params = [userId, recipeId];
    const q = ''
    + 'DELETE FROM '
    + 'cooking_recipe_suggester.user_recipes '
    + 'WHERE user_id = ? AND recipe_id = ?';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error unlinking user from recipe';
    else return {
        userId: userId,
        recipeId: recipeId
    };
}

export async function isUserLinkedToRecipe(userId: Uuid, recipeId: Uuid, includeDeleted = false) {
    const params = [userId, recipeId];
    const q = ''
    + 'SELECT * FROM '
    + 'cooking_recipe_suggester.user_recipes '
    + 'WHERE user_id = ? AND recipe_id = ?';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error checking if user is linked to recipe';
    else return result.rows.length > 0 && !(includeDeleted && typeof result.rows[0].recipe_deleted_name !== "string");
}