import { createRecipe } from "../../database/recipes/create_recipe.js";
import { Ingredient, Recipe } from "../../utils/types.js";

export async function createCustomRecipe(userId: string, recipe: {
    name: string,
    description: string,
    instructions: Array<string>,
    cookingTime: number,
    waitingTime: number,
    servings: number,
    typeId: string,
    imageUrl?: string
}, ingredientIds: Array<string>) {

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
    //link Ingredients to recipe
    //link user to recipe
}