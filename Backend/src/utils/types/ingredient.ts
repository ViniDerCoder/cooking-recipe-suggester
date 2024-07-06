import { isUuid, Uuid } from "./other.js";


export type IngredientProperties = {
    vegan: boolean,
    vegetarian: boolean,
    glutenFree: boolean,
    dairyFree: boolean,
    nutFree: boolean,
    eggFree: boolean,
    fishFree: boolean,
    shellfishFree: boolean,
    soyFree: boolean
}

export function isIngredientProperties(any: any): any is IngredientProperties {
    if(typeof any !== "object" || !any) return false;

    if(typeof any.vegan !== "boolean") return false;
    if(typeof any.vegetarian !== "boolean") return false;
    if(typeof any.glutenFree !== "boolean") return false;
    if(typeof any.dairyFree !== "boolean") return false;
    if(typeof any.nutFree !== "boolean") return false;
    if(typeof any.eggFree !== "boolean") return false;
    if(typeof any.fishFree !== "boolean") return false;
    if(typeof any.shellfishFree !== "boolean") return false;
    if(typeof any.soyFree !== "boolean") return false;

    return true;
}


export type Ingredient = {
    id: Uuid,
    name: string,
    properties: IngredientProperties
}

export function isIngredient(any: any): any is Ingredient {
    if(typeof any !== "object" || !any) return false;

    if(!isUuid(any.id)) return false;
    if(typeof any.name !== "string") return false;
    if(!isIngredientProperties(any.properties)) return false;

    return true;
}


export type IngredientRecipeData = {
    id: Uuid,
    amount: number,
    unit: RecipeIngredientUnit
}

export function isIngredientRecipeData(any: any): any is IngredientRecipeData {
    if(typeof any !== "object" || !any) return false;

    if(!isUuid(any.id)) return false;
    if(typeof any.amount !== "number") return false;
    if(!isRecipeIngredientUnit(any.unit)) return false;

    return true;
}


export const validRecipeUnits = [undefined, null, 'cup', 'tablespoon', 'teaspoon', 'gram', 'kilogram', 'milliliter', 'liter', 'some', 'big', 'small', 'shot', 'pinch', 'drop', 'packet'] as const
export type RecipeIngredientUnit = typeof validRecipeUnits[number]

export function isRecipeIngredientUnit(any: any): any is RecipeIngredientUnit {
    if(!validRecipeUnits.includes(any)) return false;

    return true;
}


export type RecipeIngredientUpdateAcions = {
    type: "ADD" | "UPDATE",
    ingredientId: Uuid,
    amount: number,
    unit: RecipeIngredientUnit
} | {
    type: "REMOVE",
    ingredientId: Uuid
}

export function isRecipeIngredientUpdateAcions(any: any): any is RecipeIngredientUpdateAcions {
    if(typeof any !== "object" || !any) return false;

    if(any.type === "ADD" || any.type === "UPDATE") {
        if(!isUuid(any.ingredientId)) return false;
        if(typeof any.amount !== "number") return false;
        if(!isRecipeIngredientUnit(any.unit)) return false;
    } else if(any.type === "REMOVE") {
        if(!isUuid(any.ingredientId)) return false;
    } else {
        return false;
    }

    return true;
}


export const ingredientPropertyFilters = ["vegan", "vegetarian", "glutenFree", "dairyFree", "nutFree", "eggFree", "fishFree", "shellfishFree", "soyFree"] as const
export type IngredientPropertyFilter = typeof ingredientPropertyFilters[number]

export function isIngredientPropertyFilter(any: any): any is IngredientPropertyFilter {
    if(!ingredientPropertyFilters.includes(any)) return false;

    return true;
}