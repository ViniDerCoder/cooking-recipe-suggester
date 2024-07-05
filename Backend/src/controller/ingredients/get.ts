import * as uuid from "uuid";

import { getAllIngredients as dbGetAllIngredients, getIngredientById as dbGetIngredientById } from "../../database/ingredients/get.js";


export async function getAllIngredientIds() {
    const result = await dbGetAllIngredients();
    if(typeof result === "string") return result;
    else return result.map((ingredient) => { return { id: ingredient.id, name: ingredient.name } });
}

export async function getIngredientById(ingredientId: string) {
    if(typeof ingredientId !== "string") return 'Invalid input';
    if(!uuid.validate(ingredientId)) return 'Invalid Ingredient ID';

    const result = await dbGetIngredientById(ingredientId);
    return result;
}