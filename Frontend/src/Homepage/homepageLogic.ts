import { SuggestionFullRecipe } from "../../../Backend/src/utils/types/suggestion";
import { getAuthToken } from "../utils/auth";
import { Backend } from "../utils/backendConnection/routes";
import { errorFromError } from "../utils/backendConnection/utils";


export async function getSuggestions(): Promise<[boolean, SuggestionFullRecipe | string]> {
    const cache = JSON.parse(localStorage.getItem("suggestions") || JSON.stringify({ date: 0 }));
    if(cache.date > Date.now() - 1000 * 60 * 60) return [true, cache.data];

    const token = getAuthToken();

    try {
        const result = await Backend.Suggestions.getSuggestions(token ? token : "");
        if(result.data.suggestions) {
            sessionStorage.setItem("suggestions", JSON.stringify({ date: Date.now(), data: result.data.suggestions }));
            return [true, result.data.suggestions as SuggestionFullRecipe]
        }
        else return [false, result.error]
    }
    catch (error) {
        return [false, 'Error: ' + errorFromError(error)]
    }
}

export async function getOwnRecipes(): Promise<[boolean, string]> {
    const cache = JSON.parse(localStorage.getItem("own-recipes") || JSON.stringify({ date: 0 }));
    if(cache.date > Date.now() - 1000 * 60) return [true, cache.data];

    const token = getAuthToken();

    try {
        const result = await Backend.Recipes.getMarkedRecipes(token ? token : "");
        if(result.data.userRecipes) {
            sessionStorage.setItem("own-recipes", JSON.stringify({ date: Date.now(), data: result.data.userRecipes }));
            return [true, result.data.userRecipes]
        }
        else return [false, result.error]
    }
    catch (error) {
        return [false, 'Error: ' + errorFromError(error)]
    }
}