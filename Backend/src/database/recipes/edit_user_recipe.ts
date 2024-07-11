import query from "../../utils/query.js";
import { Uuid } from "../../utils/types/other.js";
import { UserRecipeEditData } from "../../utils/types/recipe.js";

export async function editUserRecipe(recipeId: Uuid, userId: Uuid, recipeData: UserRecipeEditData) {

    const params = [recipeData.value, recipeId, userId];
    const q = ''
    + 'UPDATE '
    + 'cooking_recipe_suggester.user_recipes '
    + 'SET '
    + (recipeData.key === "notes" ? "notes = ? " : 'rating = ? ')
    + 'WHERE recipe_id = ? AND user_id = ?';

    const result = await query(q, params);
    if(typeof result === "string") return 'Error editing user recipe';
    return undefined;
}   

export async function addCookedTimeToUserRecipe(recipeId: Uuid, userId: Uuid) {
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