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
    type: RecipeType,
    source_url: string | undefined,
    image_url: string | undefined
} | {
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
    source_url: string | undefined,
    image_url: string | undefined
} | {
    id: string,
    name: string,
    description: string,
    instructions: Array<string>,
    createdAt: Date,
    createdBy: User,
    cookingTime: number,
    waitingTime: number,
    servings: number,
    public: boolean,
    type: RecipeType,
    source_url: string | undefined,
    image_url: string | undefined
} | {
    id: string,
    name: string,
    description: string,
    instructions: Array<string>,
    createdAt: Date,
    createdBy: User,
    cookingTime: number,
    waitingTime: number,
    servings: number,
    public: boolean,
    typeId: string,
    source_url: string | undefined,
    image_url: string | undefined
}

export type RecipeType = {
    id: string,
    name: string
}

export type RecipeUserData = {
    recipe: Recipe,
    user: User,
    rating: number | undefined,
    notes: string | undefined,
    cooked: Array<Date>
} | {
    recipeId: string,
    userId: string,
    rating: number | undefined,
    notes: string | undefined,
    cooked: Array<Date>
} | {
    recipe: Recipe,
    userId: string,
    rating: number | undefined,
    notes: string | undefined,
    cooked: Array<Date>
} | {
    recipeId: string,
    user: User,
    rating: number | undefined,
    notes: string | undefined,
    cooked: Array<Date>
}