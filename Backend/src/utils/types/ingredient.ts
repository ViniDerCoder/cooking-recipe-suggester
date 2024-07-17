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


export type IngredientList = Array<Ingredient>

export function isIngredientList(any: any): any is IngredientList {
    if(!Array.isArray(any)) return false;

    if(!any.every((ingredient) => isIngredient(ingredient))) return false;

    return true;
}


export type IngredientRecipeData = {
    id: Uuid,
    amount: number,
    unit: RecipeIngredientUnit,
    description: string | null | undefined
}

export function isIngredientRecipeData(any: any): any is IngredientRecipeData {
    if(typeof any !== "object" || !any) return false;

    if(!isUuid(any.id)) return false;
    if(typeof any.amount !== "number") return false;
    if(!isRecipeIngredientUnit(any.unit)) return false;
    if(typeof any.description !== "string" && any.description !== null && any.description !== undefined) return false;

    return true;
}


export type IngredientRecipeList = Array<IngredientRecipeData>

export function isIngredientRecipeList(any: any): any is IngredientRecipeList {
    if(!Array.isArray(any)) return false;

    if(!any.every((ingredient) => isIngredientRecipeData(ingredient))) return false;

    return true;
}


export const validRecipeUnits = [undefined, null, 'cup', 'tablespoon', 'teaspoon', 'gram', 'kilogram', 'milliliter', 'liter', 'some', 'big', 'small', 'shot', 'pinch', 'drop', 'packet'] as const
export type RecipeIngredientUnit = typeof validRecipeUnits[number]

export function isRecipeIngredientUnit(any: any): any is RecipeIngredientUnit {
    if(!validRecipeUnits.includes(any)) return false;

    return true;
}


export type RecipeIngredientUpdateActions = {
    type: "ADD" | "UPDATE",
    ingredientId: Uuid,
    amount: number,
    unit: RecipeIngredientUnit,
    description: string | null | undefined
} | {
    type: "REMOVE",
    ingredientId: Uuid
}

export function isRecipeIngredientUpdateActions(any: any): any is RecipeIngredientUpdateActions {
    if(typeof any !== "object" || !any) return false;

    if(any.type === "ADD" || any.type === "UPDATE") {
        if(!isUuid(any.ingredientId)) return false;
        if(typeof any.amount !== "number") return false;
        if(!isRecipeIngredientUnit(any.unit)) return false;
        if(typeof any.description !== "string" && any.description !== null && any.description !== undefined) return false;
    } else if(any.type === "REMOVE") {
        if(!isUuid(any.ingredientId)) return false;
    } else {
        return false;
    }

    return true;
}


export type IngredientUpdateActionList = Array<RecipeIngredientUpdateActions>

export function isIngredientUpdateActionList(any: any): any is IngredientUpdateActionList {
    if(!Array.isArray(any)) return false;

    if(!any.every((action) => isRecipeIngredientUpdateActions(action))) return false;

    return true;
}


export const ingredientPropertyFilters = ["vegan", "vegetarian", "glutenFree", "dairyFree", "nutFree", "eggFree", "fishFree", "shellfishFree", "soyFree"] as const
export type IngredientPropertyFilter = typeof ingredientPropertyFilters[number]

export function isIngredientPropertyFilter(any: any): any is IngredientPropertyFilter {
    if(!ingredientPropertyFilters.includes(any)) return false;

    return true;
}


export type IngredientActionRequest = {
    type: "DELETE", 
    id: Uuid
} | {
    type: "CREATE", 
    ingredient: {
        name: string, 
        props: IngredientProperties
    }
} | {
    type: "UPDATE", 
    id: Uuid, 
    ingredient: {
        name: string, 
        props: IngredientProperties
    }
}

export function isIngredientActionRequest(any: any): any is IngredientActionRequest {
    if(typeof any !== "object" || !any) return false;

    if(any.type === "DELETE") {
        if(!isUuid(any.id)) return false;
    } else if(any.type === "CREATE") {
        if(typeof any.ingredient !== "object" || !any.ingredient) return false;
        if(typeof any.ingredient.name !== "string") return false;
        if(!isIngredientProperties(any.ingredient.props)) return false;
    } else if(any.type === "UPDATE") {
        if(!isUuid(any.id)) return false;
        if(typeof any.ingredient !== "object" || !any.ingredient) return false;
        if(typeof any.ingredient.name !== "string") return false;
        if(!isIngredientProperties(any.ingredient.props)) return false;
    } else {
        return false;
    }

    return true;
}


export type IngredientFilters = Array<{
    name: IngredientPropertyFilter,
    value: boolean
} | {
    name: "name",
    value: string
}>

export function isIngredientFilters(any: any): any is IngredientFilters {
    if(!Array.isArray(any)) return false;

    return any.every((filter) => {
        if(typeof filter !== "object" || !filter) return false;
        if(!isIngredientPropertyFilter(filter.name) && filter.name !== "name") return false;
        if(typeof filter.value !== (filter.name === "name" ? "string" : "boolean")) return false;

        return true;
    });
}


export type FullRecipeIngredient = {
    id: Uuid,
    name: string,
    properties: IngredientProperties,
    amount: number,
    unit: RecipeIngredientUnit,
    description: string | null | undefined
}

export function isFullRecipeIngredient(any: any): any is FullRecipeIngredient {
    if(typeof any !== "object" || !any) return false;

    if(!isUuid(any.id)) return false;
    if(typeof any.name !== "string") return false;
    if(!isIngredientProperties(any.properties)) return false;
    if(typeof any.amount !== "number") return false;
    if(!isRecipeIngredientUnit(any.unit)) return false;
    if(typeof any.description !== "string" && any.description !== null && any.description !== undefined) return false;

    return true;
}