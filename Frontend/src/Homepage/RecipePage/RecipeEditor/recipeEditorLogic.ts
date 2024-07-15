import { IngredientRecipeList, IngredientUpdateActionList} from "../../../../../Backend/src/utils/types/ingredient"
import { RecipeCreationData, RecipeEditData } from "../../../../../Backend/src/utils/types/recipe"
import { getAuthToken } from "../../../utils/auth"
import { Backend } from "../../../utils/backendConnection/routes"
import { errorFromError } from "../../../utils/backendConnection/utils"


export async function editRecipe(recipeId: unknown, recipe: RecipeEditData, ingredients: IngredientUpdateActionList): Promise<[boolean, string]> {
    if(typeof recipeId !== 'string') return [false, 'Invalid id']
    if(typeof recipe !== 'object' || !Array.isArray(ingredients)) return [false, 'Invalid recipe/ingredients']
    
    const token = getAuthToken()

    try {
        const result = await Backend.Recipes.updateRecipe(token ? token : "", recipeId, recipe, ingredients)
        if(result.data.recipe) {

            const cache = JSON.parse(sessionStorage.getItem("recipe-cache") || "{}")
            sessionStorage.setItem("recipe-cache", JSON.stringify({...cache, [recipeId]: [new Date(), result.data.recipe]}))
            
            const ingredientCache = JSON.parse(sessionStorage.getItem("recipe-ingredients-cache") || "{}")
            delete ingredientCache[recipeId]
            sessionStorage.setItem("recipe-ingredients-cache", JSON.stringify(ingredientCache))
            
            const ownRecipeCache = JSON.parse(sessionStorage.getItem("own-recipes") || "{}")
            if(ownRecipeCache.data) {
                const index = ownRecipeCache.data.findIndex((element: any) => element.recipe.id === recipeId)
                if(index !== -1) {
                    ownRecipeCache.data[index].recipe = result.data.recipe
                    sessionStorage.setItem("own-recipes", JSON.stringify(ownRecipeCache))
                }
            
            }
            const suggestionCache = JSON.parse(sessionStorage.getItem("suggestions") || "{}")
            if(suggestionCache.data) {
                Object.keys(suggestionCache.data).forEach((key: string) => {
                    const index = (suggestionCache.data[key] ? suggestionCache.data[key].recipes : []).findIndex((element: any) => element.recipe.id === recipeId)
                    if(index !== -1) {
                        suggestionCache.data[key].recipes[index].recipe = result.data.recipe
                        sessionStorage.setItem("suggestions", JSON.stringify(suggestionCache))
                    }
                })
            }
            
            return [true, '']
        }
        else return [false, result.error]
    } catch (error) {
        return [false, 'Error: ' + errorFromError(error)]
    }
}

export async function createRecipe(recipe: RecipeCreationData, ingredients: IngredientRecipeList): Promise<[boolean, string]> {
    if(typeof recipe !== 'object' || !Array.isArray(ingredients)) return [false, 'Invalid recipe/ingredients']
    
    const token = getAuthToken()

    try {
        const result = await Backend.Recipes.createRecipe(token ? token : "", recipe, ingredients)
        if(result.data.recipe) {
            const cache = JSON.parse(sessionStorage.getItem("recipe-cache") || "{}")
            sessionStorage.setItem("recipe-cache", JSON.stringify({...cache, [result.data.recipe.id]: [new Date(), result.data.recipe]}))
            return [true, '']
        }
        else return [false, result.error]
    } catch (error) {
        return [false, 'Error: ' + errorFromError(error)]
    }
}

export async function getRecipeTypes() {
    const cache = JSON.parse(sessionStorage.getItem("recipe-types") || JSON.stringify({ date: 0 }))
    if(cache.date > Date.now() - 1000 * 60 * 60) return [true, cache.data]
    const token = getAuthToken()

    try {
        const result = await Backend.Recipes.getRecipeTypes(token ? token : "")
        if(result.data.types) {
            sessionStorage.setItem("recipe-types", JSON.stringify({ date: Date.now(), data: result.data.types }))
            return [true, result.data.types]
        }
        else return [false, result.error]
    } catch (error) {
        return [false, 'Error: ' + errorFromError(error)]
    }
}