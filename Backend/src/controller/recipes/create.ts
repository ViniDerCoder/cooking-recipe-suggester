import { getIngredientById } from "../../database/ingredients/get.js";
import { linkIngredientToRecipe } from "../../database/ingredients/link_ingredient_to_recipe.js";
import { createRecipe } from "../../database/recipes/create_recipe.js";
import { linkUserToRecipe } from "../../database/recipes/link_user_to_recipe.js";
import { getRecipeTypeById } from "../../database/recipes/recipe_types.js";
import { IngredientRecipeData, Recipe, RecipeCreationData, validRecipeUnits } from "../../utils/types.js";

export async function createCustomRecipe(userId: string, recipe: RecipeCreationData, ingredients: Array<IngredientRecipeData>) {
    console.log(userId, recipe, ingredients);
    if(typeof userId !== "string" || typeof recipe !== "object" || !Array.isArray(ingredients)) return 'Invalid input';

    //check ingredients validity
    const invalidIngredients = ingredients.filter((ingredient) => {
        if(typeof ingredient !== "object") return true;
        if(typeof ingredient.id !== "string") return true;
        if(typeof ingredient.amount !== "number") return true;
        if(ingredient.unit) {
            if(typeof ingredient.unit !== "string") return true;
            if(!validRecipeUnits.includes(ingredient.unit)) return true;
        }
        return false;
    });
    console.log(invalidIngredients);
    if(invalidIngredients.length >= 1) return 'Invalid ingredient list provided';

    //check recipe validity
    if(typeof recipe.name !== "string") return 'Invalid recipe name';
    if(typeof recipe.description !== "string") return 'Invalid recipe description';
    if(!Array.isArray(recipe.instructions) || recipe.instructions.filter((instr) => typeof instr !== "string").length > 0) return 'Invalid recipe instructions';
    if(typeof recipe.cookingTime !== "number") return 'Invalid recipe cooking time';
    if(typeof recipe.waitingTime !== "number") return 'Invalid recipe waiting time';
    if(typeof recipe.servings !== "number") return 'Invalid recipe servings';
    if(recipe.imageUrl && typeof recipe.imageUrl !== "string") return 'Invalid recipe image url';
    if(typeof recipe.typeId !== "string" || !getRecipeTypeById(recipe.typeId)) return 'Invalid recipe type';

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