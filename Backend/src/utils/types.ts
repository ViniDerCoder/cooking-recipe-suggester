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

export const validRecipeUnits = [null, 'cups', 'tablespoons', 'teaspoons', 'grams', 'kilograms', 'milliliters', 'liters', 'some', 'big', 'small', 'shot', 'pinch', 'drop', 'packet'] as const
export type RecipeIngredientUnit = typeof validRecipeUnits[number]