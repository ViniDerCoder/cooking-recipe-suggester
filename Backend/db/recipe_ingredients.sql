CREATE TABLE IF NOT EXISTS cooking_recipe_suggester.recipe_ingredients (
    recipe_id UUID,
    ingredient_id UUID,
    quantity DECIMAL,
    unit TEXT,
    description TEXT,
    PRIMARY KEY (recipe_id, ingredient_id)
);