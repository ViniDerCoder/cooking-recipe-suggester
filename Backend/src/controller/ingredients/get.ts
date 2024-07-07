import { getAllIngredients as dbGetAllIngredients, getIngredientById as dbGetIngredientById } from "../../database/ingredients/get.js";
import { IngredientFilters, isIngredientFilters } from "../../utils/types/ingredient.js";
import { isUuid } from "../../utils/types/other.js";

export async function getAllIngredientIds() {
    const result = await dbGetAllIngredients();
    if(typeof result === "string") return result;
    else return result.map((ingredient) => { return { id: ingredient.id, name: ingredient.name } });
}

export async function getIngredientById(ingredientId: unknown) {
    if(!isUuid(ingredientId)) return 'Invalid input';

    const result = await dbGetIngredientById(ingredientId);
    return result;
}

export async function getIngredientIdsMatchingFilter(filters: IngredientFilters) {
    if(!isIngredientFilters(filters)) return 'Invalid input';
    if(filters.length < 1) return await getAllIngredientIds();

    const result = await dbGetAllIngredients();
    if(typeof result === "string") return result;

    return result.filter((ingredient) => {
        return filters.every((filter) => {
            if(filter.name === "vegan") return ingredient.properties.vegan === filter.value;
            if(filter.name === "vegetarian") return ingredient.properties.vegetarian === filter.value;
            if(filter.name === "glutenFree") return ingredient.properties.glutenFree === filter.value;
            if(filter.name === "dairyFree") return ingredient.properties.dairyFree === filter.value;
            if(filter.name === "nutFree") return ingredient.properties.nutFree === filter.value;
            if(filter.name === "eggFree") return ingredient.properties.eggFree === filter.value;
            if(filter.name === "fishFree") return ingredient.properties.fishFree === filter.value;
            if(filter.name === "shellfishFree") return ingredient.properties.shellfishFree === filter.value;
            if(filter.name === "soyFree") return ingredient.properties.soyFree === filter.value;
            return false;
        });
    }).map((ingredient) => { return { id: ingredient.id, name: ingredient.name } });
}