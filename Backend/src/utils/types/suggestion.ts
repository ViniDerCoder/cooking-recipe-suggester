import { isUuid, Uuid } from "./other.js";


export type SuggestionsSettings = {
    userId: Uuid,
    meals: {
        morning: {
            enabled: boolean,
            settings: MealSuggestionsSettings
        },
        midday: {
            enabled: boolean,
            settings: MealSuggestionsSettings
        },
        evening: {
            enabled: boolean,
            settings: MealSuggestionsSettings
        },
    }
}

export function isSuggestionsSettings(any: any): any is SuggestionsSettings {
    if(typeof any !== "object" || !any) return false;

    if(!isUuid(any.userId)) return false;
    if(typeof any.meals !== "object" || !any.meals) return false;

    if(typeof any.meals.morning !== "object" || !any.meals.morning) return false;
    if(typeof any.meals.morning.enabled !== "boolean") return false;
    if(!isMealSuggestionsSettings(any.meals.morning.settings)) return false;

    if(typeof any.meals.midday !== "object" || !any.meals.midday) return false;
    if(typeof any.meals.midday.enabled !== "boolean") return false;
    if(!isMealSuggestionsSettings(any.meals.midday.settings)) return false;

    if(typeof any.meals.evening !== "object" || !any.meals.evening) return false;
    if(typeof any.meals.evening.enabled !== "boolean") return false;
    if(!isMealSuggestionsSettings(any.meals.evening.settings)) return false;

    return true;
}


export type MealSuggestionsSettings = {
    minRating: number,
    unratedAllowed: boolean,

    minTimesCooked: number,
    timeoutAfterLastCooked: number

    vegan: boolean | null,
    vegetarian: boolean | null,
    glutenFree: boolean | null,
    dairyFree: boolean | null,
    nutFree: boolean | null,
    eggFree: boolean | null,
    fishFree: boolean | null,
    shellfishFree: boolean | null,
    soyFree: boolean | null,

    maxPreparationTime: number,

    recipeTypesWhitelist: Array<Uuid>,
    recipeTypesBlacklist: Array<Uuid>
}

export function isMealSuggestionsSettings(any: any): any is MealSuggestionsSettings {
    if(typeof any !== "object" || !any) return false;

    if(typeof any.minRating !== "number") return false;
    if(typeof any.unratedAllowed !== "boolean") return false;

    if(typeof any.minTimesCooked !== "number") return false;
    if(typeof any.timeoutAfterLastCooked !== "number") return false;

    if(typeof any.vegan !== "boolean" && any.vegan !== null) return false;
    if(typeof any.vegetarian !== "boolean" && any.vegetarian !== null) return false;
    if(typeof any.glutenFree !== "boolean" && any.glutenFree !== null) return false;
    if(typeof any.dairyFree !== "boolean" && any.dairyFree !== null) return false;
    if(typeof any.nutFree !== "boolean" && any.nutFree !== null) return false;
    if(typeof any.eggFree !== "boolean" && any.eggFree !== null) return false;
    if(typeof any.fishFree !== "boolean" && any.fishFree !== null) return false;
    if(typeof any.shellfishFree !== "boolean" && any.shellfishFree !== null) return false;
    if(typeof any.soyFree !== "boolean" && any.soyFree !== null) return false;

    if(typeof any.maxPreparationTime !== "number") return false;

    if(!Array.isArray(any.recipeTypesWhitelist)) return false;
    if(!any.recipeTypesWhitelist.every((typeId: any) => isUuid(typeId))) return false;

    if(!Array.isArray(any.recipeTypesBlacklist)) return false;
    if(!any.recipeTypesBlacklist.every((typeId: any) => isUuid(typeId))) return false;

    return true;
}


export type Suggestion = {
    morning: MealSuggestion | null,
    midday: MealSuggestion | null,
    evening: MealSuggestion | null
}

export function isSuggestion(any: any): any is Suggestion {
    if(typeof any !== "object" || !any) return false;

    if(any.morning !== null && !isMealSuggestion(any.morning)) return false;
    if(any.midday !== null && !isMealSuggestion(any.midday)) return false;
    if(any.evening !== null && !isMealSuggestion(any.evening)) return false;

    return true;
}


export type MealSuggestion = {
    recipes: Array<Uuid>,
}

export function isMealSuggestion(any: any): any is MealSuggestion {
    if(typeof any !== "object" || !any) return false;

    if(!Array.isArray(any.recipes)) return false;
    if(!any.recipes.every((recipeId: any) => isUuid(recipeId))) return false;

    return true;
}


export type MealSuggestionUserDataFilter = {
    minRating: number,
    unratedAllowed: boolean,
}

export function isMealSuggestionUserDataFilter(any: any): any is MealSuggestionUserDataFilter {
    if(typeof any !== "object" || !any) return false;

    if(any.minRating !== undefined && typeof any.minRating !== "number") return false;
    if(any.unratedAllowed !== undefined && typeof any.unratedAllowed !== "boolean") return false;

    return true;
}


export type MealSuggestionRecipeFilter = {
    vegan: boolean | null,
    vegetarian: boolean | null,
    glutenFree: boolean | null,
    dairyFree: boolean | null,
    nutFree: boolean | null,
    eggFree: boolean | null,
    fishFree: boolean | null,
    shellfishFree: boolean | null,
    soyFree: boolean | null,

    recipeTypesWhitelist: Array<Uuid>
}

export function isMealSuggestionRecipeFilter(any: any): any is MealSuggestionRecipeFilter {
    if(typeof any !== "object" || !any) return false;

    if(typeof any.vegan !== "boolean" && any.vegan !== null) return false;
    if(typeof any.vegetarian !== "boolean" && any.vegetarian !== null) return false;
    if(typeof any.glutenFree !== "boolean" && any.glutenFree !== null) return false;
    if(typeof any.dairyFree !== "boolean" && any.dairyFree !== null) return false;
    if(typeof any.nutFree !== "boolean" && any.nutFree !== null) return false;
    if(typeof any.eggFree !== "boolean" && any.eggFree !== null) return false;
    if(typeof any.fishFree !== "boolean" && any.fishFree !== null) return false;
    if(typeof any.shellfishFree !== "boolean" && any.shellfishFree !== null) return false;
    if(typeof any.soyFree !== "boolean" && any.soyFree !== null) return false;

    if(typeof any.maxPreparationTime !== "number") return false;

    if(!Array.isArray(any.recipeTypesWhitelist)) return false;
    if(!any.recipeTypesWhitelist.every((typeId: any) => isUuid(typeId))) return false;

    if(!Array.isArray(any.recipeTypesBlacklist)) return false;
    if(!any.recipeTypesBlacklist.every((typeId: any) => isUuid(typeId))) return false;

    return true;
}