import getSettingsOfUser from "../../database/suggestions/suggestionSettings/get.js";
import onInterval from "../../utils/listener/interval.js";
import { isUuid, Uuid } from "../../utils/types/other.js";
import { Suggestion, MealSuggestion } from "../../utils/types/suggestion.js";

let suggestions: { [key: Uuid]: Suggestion } = {}

onInterval('redoSuggestions', 60 * 24, async () => {
    suggestions = {}
}, new Date().setHours(0, 0, 0, 0));

export async function getSuggestionsForUser(userId: unknown) {
    if(!isUuid(userId)) return "Invalid userId";

    if(suggestions[userId]) return suggestions[userId];
    
    const suggestionSettings = await getSettingsOfUser(userId);
    if(typeof suggestionSettings === "string") return suggestionSettings;
    
    suggestions[userId] = {
        morning: suggestionSettings.meals.morning.enabled ? { recipes: [] } : null,
        midday: suggestionSettings.meals.midday.enabled ? { recipes: [] } : null,
        evening: suggestionSettings.meals.evening.enabled ? { recipes: [] } : null
    }

    
}