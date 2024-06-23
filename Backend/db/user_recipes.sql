CREATE TABLE IF NOT EXISTS cooking_recipe_suggester.user_recipes (
    user_id INT,
    recipe_id INT,
    rating INT,
    notes TEXT,
    cooked LIST<TIMESTAMP>,
    PRIMARY KEY (user_id, recipe_id)
);