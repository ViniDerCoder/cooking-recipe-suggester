import { getAllIngredients as dbGetAllIngredients, getIngredientById as dbGetIngredientById, getIngredientsByIds as dbGetIngredientsByIds } from "../../database/ingredients/get.js";
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

export async function getIngredientsByIds(ingredientIds: unknown) {
    if(!Array.isArray(ingredientIds)) return 'Invalid input';
    if(ingredientIds.some((id) => !isUuid(id))) return 'Invalid input';
    if(ingredientIds.length < 1) return [];

    const result = await dbGetIngredientsByIds(ingredientIds);
    if(typeof result === "string") return result;

    return result;
}

export async function getIngredientIdsMatchingFilter(filters: unknown, limit: unknown, offset: unknown) {
    if(!isIngredientFilters(filters)) return 'Invalid input';

    const result = await dbGetAllIngredients(typeof offset === "number" && typeof limit === "number" ? limit + offset + 1 : undefined);
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
            if(filter.name === "name") return ingredient.name.toLowerCase().includes(filter.value.toLowerCase());
            return false;
        });
    }).slice(typeof offset === "number" && typeof limit === "number" ? offset : undefined, typeof offset === "number" && typeof limit === "number" ? offset + limit : undefined);
}