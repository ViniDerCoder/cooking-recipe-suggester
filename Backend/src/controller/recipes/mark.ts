import * as uuid from 'uuid';

import { isUserLinkedToRecipe, linkUserToRecipe, unlinkUserFromRecipe } from '../../database/recipes/link_user_to_recipe.js';
import { addCookedTimeToUserRecipe } from '../../database/recipes/edit_user_recipe.js';

export async function markRecipe(userId: string, recipeId: string) {
    if(typeof userId !== "string" || typeof recipeId !== "string") return 'Invalid input';
    if(!uuid.validate(userId)) return 'Invalid User ID';
    if(!uuid.validate(recipeId)) return 'Invalid Recipe ID';

    return await linkUserToRecipe(recipeId, userId);
}

export async function unmarkRecipe(userId: string, recipeId: string) {
    if(typeof userId !== "string" || typeof recipeId !== "string") return 'Invalid input';
    if(!uuid.validate(userId)) return 'Invalid User ID';
    if(!uuid.validate(recipeId)) return 'Invalid Recipe ID';

    const userLinked = await isUserLinkedToRecipe(userId, recipeId)
    if(typeof userLinked === "string") return 'Error checking if user is linked to recipe';
    if(!userLinked) return 'User is not linked to recipe';

    return await unlinkUserFromRecipe(recipeId, userId);
}

export async function cookedRecipe(recipeId: string, userId: string) {
    if(typeof userId !== "string" || typeof recipeId !== "string") return 'Invalid input';
    if(!uuid.validate(userId)) return 'Invalid User ID';
    if(!uuid.validate(recipeId)) return 'Invalid Recipe ID';

    const userLinked = await isUserLinkedToRecipe(userId, recipeId)
    if(typeof userLinked === "string") return 'Error checking if user is linked to recipe';
    if(!userLinked) return 'User is not linked to recipe';

    return await addCookedTimeToUserRecipe(recipeId, userId);
}