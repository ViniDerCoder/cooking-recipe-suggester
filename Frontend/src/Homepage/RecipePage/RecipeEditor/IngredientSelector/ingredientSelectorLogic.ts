import { Ingredient, IngredientFilters } from "../../../../../../Backend/src/utils/types/ingredient";
import { getAuthToken } from "../../../../utils/auth";
import { Backend } from "../../../../utils/backendConnection/routes";
import { errorFromError } from "../../../../utils/backendConnection/utils";


export async function getIngredients(filter: unknown, amount: unknown, page: unknown): Promise<[boolean, Ingredient[] | string]> {
    if(typeof filter !== 'object' || typeof amount !== 'number' || typeof page !== 'number') return [false, 'Invalid input']
    if(!Array.isArray(filter)) return [false, 'Invalid filter']
    if(!filter.every(f => typeof f === 'object' && (f.name === 'name' ? typeof f.value === 'string' : validFilters.includes(f.name) ? typeof f.value === 'boolean' : false))) return [false, 'Invalid filter']

    const cache = JSON.parse(sessionStorage.getItem("ingredient-info-cache") || "{}")
    const token = getAuthToken()

    try {
        const result = await Backend.Ingredients.filterIngredientsWithPaging(token ? token : "", filter as IngredientFilters, page, amount)
        if(result.data.ingredients) {
            sessionStorage.setItem("ingredient-info-cache", JSON.stringify({...cache, ...result.data.ingredients}))
            return [true, result.data.ingredients]
        }
        else return [false, result.error]
    } catch (error) {
        return [false, 'Error: ' + errorFromError(error)]
    }
}

export async function getIngredientInfosByIds(ids: unknown) {
    if(!Array.isArray(ids) || ids.some(id => typeof id !== 'string')) return [false, 'Invalid ids']
    const cache = JSON.parse(sessionStorage.getItem("ingredient-info-cache") || "{}")
    const missingIds = ids.filter(id => !cache[id])

    if(missingIds.length === 0) return [true, ids.map(id => cache[id])]
    else {
        try{
            const token = getAuthToken()
            const result = await Backend.Ingredients.filterIngredientsByIds(token ? token : "", missingIds)
            if(result.data.ingredients) {
                sessionStorage.setItem("ingredient-info-cache", JSON.stringify({...cache, ...result.data.ingredients}))
                return [true, ids.map(id => cache[id]).filter((ingr) => ingr).concat(result.data.ingredients)]
            }
            else return [false, result.error]
        } catch (error) {
            return [false, 'Error: ' + errorFromError(error)]
        }
    }
}

export const validFilters = ["vegan", "vegetarian", "glutenFree", "dairyFree", "nutFree", "eggFree", "fishFree", "shellfishFree", "soyFree"]

export const validUnits         = [undefined,   null,   'cup',      'tablespoon',   'teaspoon',     'gram',     'kilogram',     'milliliter',   'liter',    'some',     'big',          'small',        'shot',     'pinch',    'drop',     'packet'];
export const validUnitsName     = ["-",         "-",    "Tasse",    "Esslöffel",    "Teelöffel",    "Gramm",    "Kilogramm",    "Milliliter",   "Liter",    "etwas",    "groß(e/es)",  "klein(e/es)",   "Schuss",   "Prise",    "Tropfen",  "Päckchen"];