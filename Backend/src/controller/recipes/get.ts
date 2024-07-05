import { getRecipeById as dbRecipeById } from "../../database/recipes/get_recipe.js";
import { listUserRecipes } from "../../database/recipes/list_recipes.js";
import { getRecipeTypeById } from "../../database/recipes/recipe_types.js";
import { Recipe } from "../../utils/types.js";

export async function getRecipeById(id: string, userId: string) {
    if(typeof id !== "string" || typeof userId !== "string") return 'Invalid input';
    const dbResult = await dbRecipeById(id);

    if(typeof dbResult === "string") return dbResult;
    else {
        if("typeId" in dbResult) {
            const recipe = dbResult as any;
            const type = getRecipeTypeById(dbResult.typeId);
            if(!type) return 'Error getting recipe type';
            else {
                delete recipe.typeId;
                return {
                    ...recipe,
                    type: type
                } as Recipe
            }
        } 
        else return dbResult;
    }
}

export async function getUserRecipes(id: string) {
    if(typeof id !== "string") return 'Invalid input';
    const recipe = await listUserRecipes(id);
    return recipe
}