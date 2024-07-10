import { Recipe } from "../../../../Backend/src/utils/types/recipe"
import { getAuthToken } from "../../utils/auth"
import { Backend } from "../../utils/backendConnection/routes"
import { errorFromError } from "../../utils/backendConnection/utils"


export async function getRecipeById(id: unknown): Promise<[boolean, Recipe | string]> {
    if(typeof id !== 'string') return [false, 'Invalid id']

    const token = getAuthToken()

    try {
        const result = await Backend.Recipes.getRecipe(token ? token : "",id)
        if(result.data.recipe) return [true, result.data.recipe as Recipe]
        else return [false, result.error]
    } catch (error) {
        return [false, 'Error: ' + errorFromError(error)]
    }
}

export async function getIngredientsOfRecipe(recipeId: unknown) {
    if(typeof recipeId !== 'string') return [false, 'Invalid id']

    const token = getAuthToken()

    try {
        const result = await Backend.Ingredients.getIngredientsOfRecipe(token ? token : "", recipeId)
        if(result.data.ingredients) return [true, result.data.ingredients]
        else return [false, result.error]
    } catch (error) {
        return [false, 'Error: ' + errorFromError(error)]
    }
}

export async function getUserDataOfRecipe(recipeId: unknown) {
    if(typeof recipeId !== 'string') return [false, 'Invalid id']

    const token = getAuthToken()

    try {
        const result = await Backend.Recipes.getUserDataOfRecipe(token ? token : "", recipeId)
        if(result.data.userRecipes) return [true, result.data.userRecipes]
        else return [false, result.error]
    } catch (error) {
        return [false, 'Error: ' + errorFromError(error)]
    }
}

export async function setMarkingOfRecipe(recipeId: unknown, mark: boolean | null) {
    if(mark === null) return [false, 'Invalid mark']
    if(typeof recipeId !== 'string') return [false, 'Invalid id']

    const token = getAuthToken()

    try {
        const result = await Backend.Recipes.markRecipe(token ? token : "", recipeId)
        if(result.error) return [false, result.error]
        else return [true, 'Recipe was marked successfully']
    } catch (error) {
        return [false, 'Error: ' + errorFromError(error)]
    }
}