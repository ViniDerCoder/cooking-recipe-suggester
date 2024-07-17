import { getIngredientsByIds } from "../../../database/ingredients/get.js";
import { getIngredientsOfRecipe } from "../../../database/ingredients/get_ingredients_of_recipe.js";
import { getRecipeById } from "../../../database/recipes/get_recipe.js";
import { FullRecipeIngredient } from "../../../utils/types/ingredient.js";
import { isUuid } from "../../../utils/types/other.js";


export async function getRecipesIngredients(userId: unknown, recipeId: unknown) {
    if(!isUuid(recipeId) || !isUuid(userId)) return 'Invalid input';

    const recipe = await getRecipeById(recipeId);
    if(typeof recipe === "string") return recipe;

    if(recipe.createdById !== userId && !recipe.public) return 'User does not have permission to view this recipe';

    const recipesUserData = await getIngredientsOfRecipe(recipeId);
    if(typeof recipesUserData === "string") return recipesUserData;
    
    const ingredients = await getIngredientsByIds(recipesUserData.map((data) => data.id));
    if(typeof ingredients === "string") return ingredients;

    const fullIngredients = recipesUserData.map((data) => {
        const ingredient = ingredients.find((ingredient) => ingredient.id === data.id);
        if(!ingredient) return 'Error getting ingredient';
        return {
            id: data.id,
            name: ingredient.name,
            amount: data.amount,
            unit: data.unit,
            properties: ingredient.properties,
            description: data.description
        } as FullRecipeIngredient;
    });
    if(fullIngredients.some((ingr) => typeof ingr === "string")) return 'Error getting ingredient';
    else return fullIngredients as FullRecipeIngredient[];
}   