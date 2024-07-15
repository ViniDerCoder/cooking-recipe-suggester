import { SuggestionsSettings } from "../../../../Backend/src/utils/types/suggestion";
import { getAuthToken } from "../../utils/auth";
import { Backend } from "../../utils/backendConnection/routes";
import { errorFromError } from "../../utils/backendConnection/utils";


export async function getSuggestionSettings(): Promise<[boolean, SuggestionsSettings | string]> {
    const cache = JSON.parse(sessionStorage.getItem("suggestion-settings") || JSON.stringify({ date: 0 }));
    if(cache.date > Date.now() - 1000 * 60 * 30) return [true, cache.data];

    const token = getAuthToken();

    try {
        const result = await Backend.Suggestions.getSuggestionsSettings(token ? token : "");
        if(result.data.settings) {
            sessionStorage.setItem("suggestion-settings", JSON.stringify({date: Date.now(), data: result.data.settings}));
            return [true, result.data.settings]
        }
        else return [false, result.error]
    } catch (error) {
        return [false, 'Error: ' + errorFromError(error)]
    }
}

export async function updateSuggestionSettings(settings: SuggestionsSettings): Promise<[boolean, SuggestionsSettings | string]> {

    const token = getAuthToken()

    try {
        const result = await Backend.Suggestions.updateSuggestionsSettings(token ? token : "", settings);
        if(result.data.settings) {
            sessionStorage.setItem("suggestion-settings", JSON.stringify({date: Date.now(), data: result.data.settings}));
            return [true, result.data.settings]
        }
        else return [false, result.error]
    } catch (error) {
        return [false, 'Error: ' + errorFromError(error)]
    }
}