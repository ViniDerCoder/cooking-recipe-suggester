import query from "../../../utils/query.js";
import { Uuid } from "../../../utils/types/other.js";
import { MealSuggestionsSettings, SuggestionsSettings } from "../../../utils/types/suggestion.js";

export default async function getSettingsOfUser(userId: Uuid) {

    const params = [userId];

    const q = ''
    + 'SELECT * FROM '
    + 'cooking_recipe_suggester.suggestions_user_settings '
    + 'WHERE user_id = ?';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error getting settings';
    else if(result.rows.length < 1) return 'No settings found';
    else return rowToSettings(userId, result.rows[0])
}

function rowToSettings(userId: Uuid, row: any) {
    return {
        userId: userId,
        meals: {
            morning: {
                enabled: defaults(row.suggest_morning_meal, true) as boolean,
                settings: {
                    minRating: defaults(row.morning_meal_suggest_minimum_rating, 0),
                    unratedAllowed: defaults(row.morning_meal_suggest_unrated, true),
                    
                    minTimesCooked: defaults(row.morning_meal_suggest_minimum_times_cooked, 1),
                    timeoutAfterLastCooked: defaults(row.morning_meal_suggest_timeout_hours_since_cooked, 24 * 7),
                    
                    vegan: defaults(row.morning_meal_filter_vegan, null),
                    vegetarian: defaults(row.morning_meal_filter_vegetarian, null),
                    glutenFree: defaults(row.morning_meal_filter_gluten_free, null),
                    dairyFree: defaults(row.morning_meal_filter_dairy_free, null),
                    nutFree: defaults(row.morning_meal_filter_nut_free, null),
                    eggFree: defaults(row.morning_meal_filter_egg_free, null),
                    fishFree: defaults(row.morning_meal_filter_fish_free, null),
                    shellfishFree: defaults(row.morning_meal_filter_shellfish_free, null),
                    soyFree: defaults(row.morning_meal_filter_soy_free, null),

                    maxPreparationTime: defaults(row.morning_meal_filter_max_prep_time, null),

                    recipeTypesWhitelist: defaults(row.morning_meal_filter_recipe_types_whitelist, []),
                    recipeTypesBlacklist: defaults(row.morning_meal_filter_recipe_types_blacklist, []),
                } as MealSuggestionsSettings
            },
            midday: {
                enabled: defaults(row.suggest_midday_meal, true) as boolean,
                settings: {
                    minRating: defaults(row.midday_meal_suggest_minimum_rating, 0),
                    unratedAllowed: defaults(row.midday_meal_suggest_unrated, true),
                    
                    minTimesCooked: defaults(row.midday_meal_suggest_minimum_times_cooked, 1),
                    timeoutAfterLastCooked: defaults(row.midday_meal_suggest_timeout_hours_since_cooked, 24 * 7),
                    
                    vegan: defaults(row.midday_meal_filter_vegan, null),
                    vegetarian: defaults(row.midday_meal_filter_vegetarian, null),
                    glutenFree: defaults(row.midday_meal_filter_gluten_free, null),
                    dairyFree: defaults(row.midday_meal_filter_dairy_free, null),
                    nutFree: defaults(row.midday_meal_filter_nut_free, null),
                    eggFree: defaults(row.midday_meal_filter_egg_free, null),
                    fishFree: defaults(row.midday_meal_filter_fish_free, null),
                    shellfishFree: defaults(row.midday_meal_filter_shellfish_free, null),
                    soyFree: defaults(row.midday_meal_filter_soy_free, null),

                    maxPreparationTime: defaults(row.midday_meal_filter_max_prep_time, null),

                    recipeTypesWhitelist: defaults(row.midday_meal_filter_recipe_types_whitelist, []),
                    recipeTypesBlacklist: defaults(row.midday_meal_filter_recipe_types_blacklist, []),
                } as MealSuggestionsSettings
            },
            evening: {
                enabled: defaults(row.suggest_evening_meal, true) as boolean,
                settings: {
                    minRating: defaults(row.evening_meal_suggest_minimum_rating, 0),
                    unratedAllowed: defaults(row.evening_meal_suggest_unrated, true),
                    
                    minTimesCooked: defaults(row.evening_meal_suggest_minimum_times_cooked, 1),
                    timeoutAfterLastCooked: defaults(row.evening_meal_suggest_timeout_hours_since_cooked, 24 * 7),
                    
                    vegan: defaults(row.evening_meal_filter_vegan, null),
                    vegetarian: defaults(row.evening_meal_filter_vegetarian, null),
                    glutenFree: defaults(row.evening_meal_filter_gluten_free, null),
                    dairyFree: defaults(row.evening_meal_filter_dairy_free, null),
                    nutFree: defaults(row.evening_meal_filter_nut_free, null),
                    eggFree: defaults(row.evening_meal_filter_egg_free, null),
                    fishFree: defaults(row.mevening_meal_filter_fish_free, null),
                    shellfishFree: defaults(row.evening_meal_filter_shellfish_free, null),
                    soyFree: defaults(row.evening_meal_filter_soy_free, null),

                    maxPreparationTime: defaults(row.evening_meal_filter_max_prep_time, null),

                    recipeTypesWhitelist: defaults(row.evening_meal_filter_recipe_types_whitelist, []),
                    recipeTypesBlacklist: defaults(row.evening_meal_filter_recipe_types_blacklist, []),
                } as MealSuggestionsSettings
            }
        }
    } as SuggestionsSettings;
}

function defaults(val: any, def: any) {
    if(val !== null && val !== undefined) return val;
    else return def;
}