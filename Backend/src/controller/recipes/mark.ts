import { isUserLinkedToRecipe, linkUserToRecipe, unlinkUserFromRecipe } from '../../database/recipes/link_user_to_recipe.js';
import { addCookedTimeToUserRecipe } from '../../database/recipes/edit_user_recipe.js';
import { isUuid } from '../../utils/types/other.js';

export async function markRecipe(userId: unknown, recipeId: unknown) {
    if(!isUuid(userId) || !isUuid(recipeId)) return 'Invalid input';

    return await linkUserToRecipe(userId, recipeId);
}

export async function unmarkRecipe(userId: unknown, recipeId: unknown) {
    if(!isUuid(userId) || !isUuid(recipeId)) return 'Invalid input';

    const userLinked = await isUserLinkedToRecipe(userId, recipeId)
    if(typeof userLinked === "string") return 'Error checking if user is linked to recipe';
    if(!userLinked) return 'User is not linked to recipe';

    return await unlinkUserFromRecipe(userId, recipeId);
}

export async function cookedRecipe(recipeId: unknown, userId: unknown) {
    if(!isUuid(userId) || !isUuid(recipeId)) return 'Invalid input';

    const userLinked = await isUserLinkedToRecipe(userId, recipeId)
    if(typeof userLinked === "string") return 'Error checking if user is linked to recipe';
    if(!userLinked) return 'User is not linked to recipe';

    return await addCookedTimeToUserRecipe(recipeId, userId);
}