import { isUuid } from "../../utils/types/other";
import { getRecipeTypeById as dbGetRecipeTypeById, getAllRecipeTypes as dbGetAllRecipeTypes } from "../../database/recipes/recipe_types";


export function getRecipeTypeById(id: unknown) {
    if(!isUuid(id)) return "Invalid id";

    const recipe = dbGetRecipeTypeById(id)
    if(!recipe) return "Recipe type not found";
    return recipe;
}

export function getAllRecipeTypes() {
    const recipeTypes = dbGetAllRecipeTypes();
    if(recipeTypes.length === 0) return "Error getting recipe types";
    return recipeTypes;
}