import * as uuid from 'uuid';

import { isUserLinkedToRecipe } from '../../database/recipes/link_user_to_recipe.js';
import { editUserRecipe } from '../../database/recipes/edit_user_recipe.js';


export async function setRatingForRecipe(recipeId: string, userId: string, rating: number) {
    if(typeof userId !== "string" || typeof recipeId !== "string" || typeof rating !== "number") return 'Invalid input';
    if(!uuid.validate(userId)) return 'Invalid User ID';
    if(!uuid.validate(recipeId)) return 'Invalid Recipe ID';
    if(rating < 0 || rating > 10) return 'Invalid rating. Rating must be between 0 and 10';

    const userLinked = await isUserLinkedToRecipe(userId, recipeId)
    if(typeof userLinked === "string") return 'Error checking if user is linked to recipe';
    if(!userLinked) return 'User is not linked to recipe';

    return await editUserRecipe(recipeId, userId, { key: "rating", value: rating });
}

export async function setNotesForRecipe(recipeId: string, userId: string, notes: string) {
    if(typeof userId !== "string" || typeof recipeId !== "string" || typeof notes !== "string") return 'Invalid input';
    if(!uuid.validate(userId)) return 'Invalid User ID';
    if(!uuid.validate(recipeId)) return 'Invalid Recipe ID';

    if(notes.length > 500) return 'Notes must be less than 500 characters long';

    const userLinked = await isUserLinkedToRecipe(userId, recipeId)
    if(typeof userLinked === "string") return 'Error checking if user is linked to recipe';
    if(!userLinked) return 'User is not linked to recipe';

    return await editUserRecipe(recipeId, userId, { key: "notes", value: notes });
}