CREATE TABLE IF NOT EXISTS cooking_recipe_suggester.suggestions_user_settings (
    user_id UUID PRIMARY KEY,


    suggest_minimum_rating INT,
    suggest_unrated BOOLEAN,
    suggest_minimum_times_cooked INT,
    suggest_timeout_hours_since_cooked INT,

    suggest_morning_meal BOOLEAN,
    suggest_midday_meal BOOLEAN,
    suggest_evening_meal BOOLEAN,


    morning_meal_filter_vegan BOOLEAN,
    morning_meal_filter_vegetarian BOOLEAN,
    morning_meal_filter_gluten_free BOOLEAN,
    morning_meal_filter_dairy_free BOOLEAN,
    morning_meal_filter_nut_free BOOLEAN,
    morning_meal_filter_egg_free BOOLEAN,
    morning_meal_filter_fish_free BOOLEAN,
    morning_meal_filter_shellfish_free BOOLEAN,
    morning_meal_filter_soy_free BOOLEAN,

    midday_meal_filter_vegan BOOLEAN,
    midday_meal_filter_vegetarian BOOLEAN,
    midday_meal_filter_gluten_free BOOLEAN,
    midday_meal_filter_dairy_free BOOLEAN,
    midday_meal_filter_nut_free BOOLEAN,
    midday_meal_filter_egg_free BOOLEAN,
    midday_meal_filter_fish_free BOOLEAN,
    midday_meal_filter_shellfish_free BOOLEAN,
    midday_meal_filter_soy_free BOOLEAN,

    evening_meal_filter_vegan BOOLEAN,
    evening_meal_filter_vegetarian BOOLEAN,
    evening_meal_filter_gluten_free BOOLEAN,
    evening_meal_filter_dairy_free BOOLEAN,
    evening_meal_filter_nut_free BOOLEAN,
    evening_meal_filter_egg_free BOOLEAN,
    evening_meal_filter_fish_free BOOLEAN,
    evening_meal_filter_shellfish_free BOOLEAN,
    evening_meal_filter_soy_free BOOLEAN


    morning_meal_filter_max_prep_time INT,

    midday_meal_filter_max_prep_time INT,

    evening_meal_filter_max_prep_time INT


    morning_meal_filter_recipe_types_whitelist LIST<TEXT>,
    morning_meal_filter_recipe_types_blacklist LIST<TEXT>,

    midday_meal_filter_recipe_types_whitelist LIST<TEXT>,
    midday_meal_filter_recipe_types_blacklist LIST<TEXT>,

    evening_meal_filter_recipe_types_whitelist LIST<TEXT>
    evening_meal_filter_recipe_types_blacklist LIST<TEXT>
);