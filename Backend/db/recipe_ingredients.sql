CREATE TABLE IF NOT EXISTS cooking_recipe_suggester.recipe_ingredients (
    recipe_id INT,
    ingredient_id INT,
    quantity DECIMAL,
    unit TEXT,
    PRIMARY KEY (recipe_id, ingredient_id)
);