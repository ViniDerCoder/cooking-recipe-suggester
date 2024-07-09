import { getAuthToken } from "../../utils/auth"
import { Backend } from "../../utils/backendConnection/routes"
import { errorFromError } from "../../utils/backendConnection/utils"


export async function getRecipeById(id: unknown) {
    if(typeof id !== 'string') return [false, 'Invalid id']

    const token = getAuthToken()

    try {
        const result = await Backend.Recipes.getRecipe(token ? token : "",id)
        if(result.data.recipe) return [true, result.data.recipe]
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
        if(result.data.recipes) return [true, result.data.recipes]
        else return [false, result.error]
    } catch (error) {
        return [false, 'Error: ' + errorFromError(error)]
    }
}