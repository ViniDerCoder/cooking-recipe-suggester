import { MealSuggestionsSettings, SuggestionsSettings } from "../../utils/types.js";


export function getChangesBetweenSettings(oldSettings: SuggestionsSettings, newSettings: SuggestionsSettings): {key: string, value: any}[] {
    const changes: {key: string, value: any}[] = [];
    
    for (const meal in newSettings.meals) {
        if(meal === "morning") {
            if(oldSettings.meals.morning.enabled !== newSettings.meals.morning.enabled) changes.push({key: "suggest_morning_meal", value: newSettings.meals.morning.enabled})
            changes.push(...getChangesInMealSettings(oldSettings.meals.morning.settings, newSettings.meals.morning.settings))
        } else if(meal === "midday") {
            if(oldSettings.meals.midday.enabled !== newSettings.meals.midday.enabled) changes.push({key: "suggest_midday_meal", value: newSettings.meals.midday.enabled})
            changes.push(...getChangesInMealSettings(oldSettings.meals.midday.settings, newSettings.meals.midday.settings))
        } else if(meal === "evening") {
            if(oldSettings.meals.evening.enabled !== newSettings.meals.evening.enabled) changes.push({key: "suggest_evening_meal", value: newSettings.meals.evening.enabled})
            changes.push(...getChangesInMealSettings(oldSettings.meals.evening.settings, newSettings.meals.evening.settings))
        }
    }
    
    return changes
}

function getChangesInMealSettings(oldSettings: MealSuggestionsSettings, newSettings: MealSuggestionsSettings): {key: string, value: any}[] {
    const changes: {key: string, value: any}[] = [];
    // changes
    return changes
}