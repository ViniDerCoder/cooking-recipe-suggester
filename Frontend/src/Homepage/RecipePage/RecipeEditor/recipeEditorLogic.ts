import { IngredientUpdateActionList, isIngredientUpdateActionList } from "../../../../../Backend/src/utils/types/ingredient"
import { isRecipeEditData, RecipeEditData } from "../../../../../Backend/src/utils/types/recipe"
import { getAuthToken } from "../../../utils/auth"
import { Backend } from "../../../utils/backendConnection/routes"
import { errorFromError } from "../../../utils/backendConnection/utils"


export async function editRecipe(recipeId: unknown, recipe: RecipeEditData, ingredients: IngredientUpdateActionList): Promise<[boolean, string]> {
    if(typeof recipeId !== 'string') return [false, 'Invalid id']
    if(typeof recipe !== 'object' || !Array.isArray(ingredients)) return [false, 'Invalid recipe/ingredients']
    
    const token = getAuthToken()

    try {
        const result = await Backend.Recipes.updateRecipe(token ? token : "", recipeId, recipe, ingredients)
        if(result.data.recipe) return [true, '']
        else return [false, result.error]
    } catch (error) {
        return [false, 'Error: ' + errorFromError(error)]
    }
}

export async function getRecipeTypes() {
    const token = getAuthToken()

    try {
        const result = await Backend.Recipes.getRecipeTypes(token ? token : "")
        if(result.data.types) return [true, result.data.types]
        else return [false, result.error]
    } catch (error) {
        return [false, 'Error: ' + errorFromError(error)]
    }
}