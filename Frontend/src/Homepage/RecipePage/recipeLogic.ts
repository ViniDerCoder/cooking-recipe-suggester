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

export async function setRatingForRecipe(recipeId: unknown, rating: unknown) {
    if(typeof rating !== 'number') return [false, 'Invalid rating']
    if(rating < 0 || rating > 10) return [false, 'Invalid rating. Rating must be between 0 and 10']
    if(typeof recipeId !== 'string') return [false, 'Invalid id']

    const token = getAuthToken()

    try {
        const result = await Backend.Recipes.setRating(token ? token : "", recipeId, rating)
        if(result.error) return [false, result.error]
        else return [true, 'Rating was set successfully']
    } catch (error) {
        return [false, 'Error: ' + errorFromError(error)]
    }
}

let timeout = setTimeout(() => {})
export async function setNotesForRecipe(recipeId: unknown, notes: unknown) {
    if(typeof notes !== 'string') return [false, 'Invalid notes']
    if(notes.length > 500) return [false, 'Notes must be less than 500 characters long']
    if(typeof recipeId !== 'string') return [false, 'Invalid id']
    clearTimeout(timeout)
    timeout = setTimeout(async () => {

        const token = getAuthToken()
    
        try {
            const result = await Backend.Recipes.setNotes(token ? token : "", recipeId, notes)
            if(result.error) return [false, result.error]
            else return [true, 'Notes were set successfully']
        } catch (error) {
            return [false, 'Error: ' + errorFromError(error)]
        }
    }, 1500)
}