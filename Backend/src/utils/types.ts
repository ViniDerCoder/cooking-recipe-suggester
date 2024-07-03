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