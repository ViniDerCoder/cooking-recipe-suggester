import { linkIngredientToRecipe } from "../../database/ingredients/link_ingredient_to_recipe.js";
import { createRecipe } from "../../database/recipes/create_recipe.js";
import { linkUserToRecipe } from "../../database/recipes/link_user_to_recipe.js";
import { IngredientRecipeData, Recipe, RecipeCreationData } from "../../utils/types.js";

export async function createCustomRecipe(userId: string, recipe: RecipeCreationData, ingredients: Array<IngredientRecipeData>) {
    console.log(userId, recipe, ingredients);
    if(typeof userId !== "string" || typeof recipe !== "object" || !Array.isArray(ingredients)) return 'Invalid input';

    //check ingredients validity
    const invalidIngredients = ingredients.filter((ingredient) => {
        if(typeof ingredient !== "object") return true;
        if(typeof ingredient.id !== "string") return true;
        if(typeof ingredient.amount !== "number") return true;
        if(typeof ingredient.unit !== "string") return true;
        //check if unit is valid
        return false;
    });
    if(invalidIngredients.length >= 1) return 'Invalid ingredient list provided';

    //check recipe validity
    if(typeof recipe.name !== "string") return 'Invalid recipe name';
    if(typeof recipe.description !== "string") return 'Invalid recipe description';
    if(!Array.isArray(recipe.instructions) || recipe.instructions.filter((instr) => typeof instr !== "string").length > 0) return 'Invalid recipe instructions';
    if(typeof recipe.cookingTime !== "number") return 'Invalid recipe cooking time';
    if(typeof recipe.waitingTime !== "number") return 'Invalid recipe waiting time';
    if(typeof recipe.servings !== "number") return 'Invalid recipe servings';
    if(typeof recipe.typeId !== "string") return 'Invalid recipe type';
    //check if type is valid
    if(recipe.imageUrl && typeof recipe.imageUrl !== "string") return 'Invalid recipe image url';


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
        const linkResult = await linkIngredientToRecipe(ingredient.id, dbResult.id, ingredient.amount, ingredient.unit);
        if(typeof linkResult === "string") return linkResult;
        else return undefined;
    }).filter((result) => result).length >= 1;

    if(!valid) return 'Error linking ingredients to recipe';

    const userLinkResult = await linkUserToRecipe(userId, dbResult.id);
    if(typeof userLinkResult === "string") return userLinkResult;
    return dbResult as Recipe;
}