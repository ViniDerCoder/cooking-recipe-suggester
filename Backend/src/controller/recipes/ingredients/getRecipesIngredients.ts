import { getIngredientsOfRecipe } from "../../../database/ingredients/get_ingredients_of_recipe";
import { getRecipeById } from "../../../database/recipes/get_recipe";
import { isUuid } from "../../../utils/types/other";


export async function getRecipesIngredients(userId: unknown, recipeId: unknown) {
    if(!isUuid(recipeId) || !isUuid(userId)) return 'Invalid input';

    const recipe = await getRecipeById(recipeId);
    if(typeof recipe === "string") return recipe;

    if(recipe.createdById !== userId && !recipe.public) return 'User does not have permission to view this recipe';

    const recipesUserData = await getIngredientsOfRecipe(recipeId);
    return recipesUserData
}   