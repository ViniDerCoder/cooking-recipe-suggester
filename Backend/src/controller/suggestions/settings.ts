import * as uuid from "uuid";

import editSettingsOfUser from "../../database/suggestions/suggestionSettings/edit.js";
import getSettingsOfUser from "../../database/suggestions/suggestionSettings/get.js";
import { MealSuggestionsSettings, SuggestionsSettings } from "../../utils/types.js";


export async function getSuggestionsSettings(userId: string) {
    if(typeof userId !== "string" || !uuid.validate(userId)) return 'Invalid user id';

    const settings = await getSettingsOfUser(userId);
    return settings
}

export async function editSuggestionsSettings(userId: string, settings: SuggestionsSettings) {
    if(typeof userId !== "string" || !uuid.validate(userId)) return 'Invalid user id';

    if(typeof settings !== "object" || !settings) return 'Invalid settings';

    if(!settings.meals) return 'Invalid settings';
    if(!settings.meals.morning || !settings.meals.midday || !settings.meals.evening) return 'Invalid settings, missing meals';
    if(!settings.meals.morning.settings || !settings.meals.midday.settings || !settings.meals.evening.settings) return 'Invalid settings, missing meal settings';
    if(typeof settings.meals.morning.enabled !== "boolean" || typeof settings.meals.midday.enabled !== "boolean" || typeof settings.meals.evening.enabled !== "boolean") return 'Invalid settings, missing meal enabled';
    if(!isValidMealSetting(settings.meals.morning.settings) || !isValidMealSetting(settings.meals.midday.settings) || !isValidMealSetting(settings.meals.evening.settings)) return 'Invalid settings, invalid meal settings';

    const oldSettings = await getSettingsOfUser(userId);
    if(typeof oldSettings === "string") return oldSettings;

    const changes = getChangesBetweenSettings(oldSettings, settings);
    
    if(changes.length === 0) return 'No changes';
    
    const result = await editSettingsOfUser(userId, changes)
    if(typeof result === "string") return result;
    else return settings
}

function isValidMealSetting(mealSetting: MealSuggestionsSettings): boolean {
    if(typeof mealSetting.minRating                !== "number")    return false;
    if(typeof mealSetting.unratedAllowed           !== "boolean")   return false;
    if(typeof mealSetting.minTimesCooked           !== "number")    return false;
    if(typeof mealSetting.timeoutAfterLastCooked   !== "number")    return false;
    if(typeof mealSetting.vegan                    !== "boolean" && mealSetting.vegan !== null)         return false;
    if(typeof mealSetting.vegetarian               !== "boolean" && mealSetting.vegetarian !== null)    return false;
    if(typeof mealSetting.glutenFree               !== "boolean" && mealSetting.glutenFree !== null)    return false;
    if(typeof mealSetting.dairyFree                !== "boolean" && mealSetting.dairyFree !== null)     return false;
    if(typeof mealSetting.nutFree                  !== "boolean" && mealSetting.nutFree !== null)       return false;
    if(typeof mealSetting.eggFree                  !== "boolean" && mealSetting.eggFree !== null)       return false;
    if(typeof mealSetting.fishFree                 !== "boolean" && mealSetting.fishFree !== null)      return false;
    if(typeof mealSetting.shellfishFree            !== "boolean" && mealSetting.shellfishFree !== null) return false;
    if(typeof mealSetting.soyFree                  !== "boolean" && mealSetting.soyFree !== null)       return false;
    if(typeof mealSetting.maxPreparationTime       !== "number")    return false;
    
    if(!Array.isArray(mealSetting.recipeTypesWhitelist) || !mealSetting.recipeTypesWhitelist.every((type) => typeof type === "string")) return false;
    if(!Array.isArray(mealSetting.recipeTypesBlacklist) || !mealSetting.recipeTypesBlacklist.every((type) => typeof type === "string")) return false;
    
    return true
}


export function getChangesBetweenSettings(oldSettings: SuggestionsSettings, newSettings: SuggestionsSettings): {key: string, value: any}[] {
    const changes: {key: string, value: any}[] = [];
    
    for (const meal in newSettings.meals) {
        if(meal === "morning") {
            if(oldSettings.meals.morning.enabled !== newSettings.meals.morning.enabled) changes.push({key: "suggest_morning_meal", value: newSettings.meals.morning.enabled})
            changes.push(...getChangesInMealSettings(oldSettings.meals.morning.settings, newSettings.meals.morning.settings).map((change) => { 
                return {key: "morning_meal_" + change.key, value: change.value}
            }))
        } else if(meal === "midday") {
            if(oldSettings.meals.midday.enabled !== newSettings.meals.midday.enabled) changes.push({key: "suggest_midday_meal", value: newSettings.meals.midday.enabled})
            changes.push(...getChangesInMealSettings(oldSettings.meals.midday.settings, newSettings.meals.midday.settings).map((change) => { 
                return {key: "midday_meal_" + change.key, value: change.value}
            }))
        } else if(meal === "evening") {
            if(oldSettings.meals.evening.enabled !== newSettings.meals.evening.enabled) changes.push({key: "suggest_evening_meal", value: newSettings.meals.evening.enabled})
            changes.push(...getChangesInMealSettings(oldSettings.meals.evening.settings, newSettings.meals.evening.settings).map((change) => { 
                return {key: "evening_meal_" + change.key, value: change.value}
            }))
        }
    }
    
    return changes
}

function getChangesInMealSettings(oldSettings: MealSuggestionsSettings, newSettings: MealSuggestionsSettings): {key: string, value: any}[] {
    const changes: {key: string, value: any}[] = [];
    
    if(oldSettings.minRating                !== newSettings.minRating)              changes.push({key: "suggest_minimum_rating", value: newSettings.minRating})
    if(oldSettings.unratedAllowed           !== newSettings.unratedAllowed)         changes.push({key: "suggest_unrated", value: newSettings.unratedAllowed})
    if(oldSettings.minTimesCooked           !== newSettings.minTimesCooked)         changes.push({key: "suggest_minimum_times_cooked", value: newSettings.minTimesCooked})
    if(oldSettings.timeoutAfterLastCooked   !== newSettings.timeoutAfterLastCooked) changes.push({key: "suggest_timeout_hours_since_cooked", value: newSettings.timeoutAfterLastCooked})
    if(oldSettings.vegan                    !== newSettings.vegan)                  changes.push({key: "filter_vegan", value: newSettings.vegan})
    if(oldSettings.vegetarian               !== newSettings.vegetarian)             changes.push({key: "filter_vegetarian", value: newSettings.vegetarian})
    if(oldSettings.glutenFree               !== newSettings.glutenFree)             changes.push({key: "filter_gluten_free", value: newSettings.glutenFree})
    if(oldSettings.dairyFree                !== newSettings.dairyFree)              changes.push({key: "filter_dairy_free", value: newSettings.dairyFree})
    if(oldSettings.nutFree                  !== newSettings.nutFree)                changes.push({key: "filter_nut_free", value: newSettings.nutFree})
    if(oldSettings.eggFree                  !== newSettings.eggFree)                changes.push({key: "filter_egg_free", value: newSettings.eggFree})
    if(oldSettings.fishFree                 !== newSettings.fishFree)               changes.push({key: "filter_fish_free", value: newSettings.fishFree})
    if(oldSettings.shellfishFree            !== newSettings.shellfishFree)          changes.push({key: "filter_shellfish_free", value: newSettings.shellfishFree})
    if(oldSettings.soyFree                  !== newSettings.soyFree)                changes.push({key: "filter_soy_free", value: newSettings.soyFree})
    if(oldSettings.maxPreparationTime       !== newSettings.maxPreparationTime)     changes.push({key: "filter_max_prep_time", value: newSettings.maxPreparationTime})
    if(oldSettings.recipeTypesWhitelist     !== newSettings.recipeTypesWhitelist)   changes.push({key: "filter_recipe_types_whitelist", value: newSettings.recipeTypesWhitelist})
    if(oldSettings.recipeTypesBlacklist     !== newSettings.recipeTypesBlacklist)   changes.push({key: "filter_recipe_types_blacklist", value: newSettings.recipeTypesBlacklist})
    
    return changes
}