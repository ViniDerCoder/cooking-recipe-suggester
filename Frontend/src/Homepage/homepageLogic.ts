import { SuggestionFullRecipe } from "../../../Backend/src/utils/types/suggestion";


export async function getSuggestions(): Promise<[boolean, SuggestionFullRecipe | string]> {
    return [false, "Not implemented"];
}

export async function getOwnRecipes(): Promise<[boolean, string]> {
    return [false, "Not implemented"];
}