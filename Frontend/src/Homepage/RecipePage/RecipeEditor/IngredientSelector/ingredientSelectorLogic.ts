import { getAuthToken } from "../../../../utils/auth";
import { Backend } from "../../../../utils/backendConnection/routes";
import { errorFromError } from "../../../../utils/backendConnection/utils";


export function getIngredients(amount: number, page: number) {

}

export async function getIngredientInfosByIds(ids: string[]) {
    const cache = JSON.parse(sessionStorage.getItem("ingredient-info-cache") || "{}")
    const missingIds = ids.filter(id => !cache[id])

    if(missingIds.length === 0) return [true, ids.map(id => cache[id])]
    else {
        try{
            const token = getAuthToken()
            const result = await Backend.Ingredients.filterIngredientsByIds(token ? token : "", missingIds)
            if(result.data.ingredients) {
                sessionStorage.setItem("ingredient-info-cache", JSON.stringify({...cache, ...result.data.ingredients}))
                return [true, ids.map(id => cache[id]).concat(result.data.ingredients)]
            }
            else return [false, result.error]
        } catch (error) {
            return [false, 'Error: ' + errorFromError(error)]
        }
    }
}

export const validUnits         = [undefined,   null,   'cup',      'tablespoon',   'teaspoon',     'gram',     'kilogram',     'milliliter',   'liter',    'some',     'big',  'small',    'shot',     'pinch',    'drop',     'packet'];
export const validUnitsName     = ["-",         "-",    "Tasse",    "Esslöffel",    "Teelöffel",    "Gramm",    "Kilogramm",    "Milliliter",   "Liter",    "etwas",    "groß", "klein",    "Schuss",   "Prise",    "Tropfen",  "Päckchen"];