export type CleanupType = "DATABASE" | "MEMORY"

export type User = {
    id: string,
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    createdAt: Date
}

export type AuthenticationUser = {
    userId: string,
    expiresAt: Date
}

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

export type Ingredient = {
    id: string,
    name: string,
    properties: IngredientProperties
}

export type IngredientRecipeData = {
    id: string,
    amount: number,
    unit: RecipeIngredientUnit
}

export type Recipe = {
    id: string,
    name: string,
    description: string,
    instructions: Array<string>,
    createdAt: Date,
    createdById: string,
    cookingTime: number,
    waitingTime: number,
    servings: number,
    public: boolean,
    typeId: string,
    sourceUrl: string | null | undefined,
    imageUrl: string | null | undefined
}

export type RecipeCreationData = {
    name: string,
    description: string,
    instructions: Array<string>,
    cookingTime: number,
    waitingTime: number,
    servings: number,
    typeId: string,
    imageUrl: string | null | undefined
}

export type RecipeType = {
    id: string,
    name: string
}

export type RecipeUserData = {
    recipeId: string,
    userId: string,
    rating: number | null | undefined,
    notes: string | null | undefined,
    cooked: Array<Date>,
    recipeDeletedName: string | null | undefined
}

export const validRecipeUnits = [undefined, null, 'cup', 'tablespoon', 'teaspoon', 'gram', 'kilogram', 'milliliter', 'liter', 'some', 'big', 'small', 'shot', 'pinch', 'drop', 'packet'] as const
export type RecipeIngredientUnit = typeof validRecipeUnits[number]

export const editabelRecipeProperties = ["name", "description", "instructions", "cookingTime", "waitingTime", "servings", "public", "typeId", "imageUrl"] as const
export type EditableRecipePropertie = typeof editabelRecipeProperties[number]

export type RecipeIngredientUpdateAcions = {
    type: "ADD" | "UPDATE",
    ingredientId: string,
    amount: number,
    unit: RecipeIngredientUnit
} | {
    type: "REMOVE",
    ingredientId: string
}

export const ingredientPropertyFilters = ["vegan", "vegetarian", "glutenFree", "dairyFree", "nutFree", "eggFree", "fishFree", "shellfishFree", "soyFree"] as const
export type IngredientPropertyFilter = typeof ingredientPropertyFilters[number]


export type SuggestionsSettings = {
    userId: string,

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

export type MealSuggestionsSettings = {
    minRating: number,
    unratedAllowed: boolean,

    minTimesCooked: number,
    timeoutAfterLastCooked: number

    vegan: boolean,
    vegetarian: boolean,
    glutenFree: boolean,
    dairyFree: boolean,
    nutFree: boolean,
    eggFree: boolean,
    fishFree: boolean,
    shellfishFree: boolean,
    soyFree: boolean,

    maxPreparationTime: number,

    recipeTypesWhitelist: Array<string>,
    recipeTypesBlacklist: Array<string>
}