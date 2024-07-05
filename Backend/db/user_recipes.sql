CREATE TABLE IF NOT EXISTS cooking_recipe_suggester.user_recipes (
    user_id UUID,
    recipe_id UUID,
    rating INT,
    notes TEXT,
    cooked LIST<TIMESTAMP>,
    recipe_deleted_name TEXT,
    PRIMARY KEY (user_id, recipe_id)
);