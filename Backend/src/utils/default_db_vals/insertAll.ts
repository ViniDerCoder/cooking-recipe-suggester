import { insertIngredientDefaults } from "./ingredients.js";
import { insertRecipeTypeDefaults } from "./recipeTypes.js";

const doInsertion = false;

export async function insertAll() {
    if(!doInsertion) return
    await insertIngredientDefaults()
    await insertRecipeTypeDefaults()
}