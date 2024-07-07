import { getIngredientById } from "../../database/ingredients/get.js";
import { linkIngredientToRecipe } from "../../database/ingredients/link_ingredient_to_recipe.js";
import { createRecipe } from "../../database/recipes/create_recipe.js";
import { linkUserToRecipe } from "../../database/recipes/link_user_to_recipe.js";
import { getRecipeTypeById } from "../../database/recipes/recipe_types.js";
import { isRecipeCreationData, Recipe } from "../../utils/types/recipe.js";
import { isIngredientRecipeList } from "../../utils/types/ingredient.js";
import { isUuid } from "../../utils/types/other.js";

export async function createCustomRecipe(userId: unknown, recipe: unknown, ingredients: unknown) {
    if(!isUuid(userId) || !isRecipeCreationData(recipe) || !isIngredientRecipeList(ingredients)) return 'Invalid input';

    if(!getRecipeTypeById(recipe.typeId)) return 'Invalid recipe type';

    const unexistingIngredients = (await Promise.all(ingredients.map(async (ingredient) => typeof await getIngredientById(ingredient.id) === "string"))).filter((result) => result);
    if(unexistingIngredients.length >= 1) return 'Invalid ingredients provided';

    const dbResult = await createRecipe({ 
        name: recipe.name, 
        description: recipe.description, 
        instructions: recipe.instructions, 
        createdById: userId, 
        cookingTime: recipe.cookingTime, 
        waitingTime: recipe.waitingTime, 
        servings: recipe.servings, 
        public: false, 
        typeId: recipe.typeId, 
        sourceUrl: undefined, 
        imageUrl: recipe.imageUrl
    });

    if(typeof dbResult === "string") return dbResult;
    const valid = ingredients.map(async (ingredient, i) => {
        const linkResult = await linkIngredientToRecipe(ingredient.id, dbResult.id, ingredient.amount, ingredient.unit ? ingredient.unit : null);
        if(typeof linkResult === "string") return linkResult;
        else return undefined;
    }).filter((result) => result).length >= 1;

    if(!valid) return 'Error linking ingredients to recipe';

    const userLinkResult = await linkUserToRecipe(userId, dbResult.id);
    if(typeof userLinkResult === "string") return userLinkResult;
    return dbResult as Recipe;
}