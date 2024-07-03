CREATE TABLE IF NOT EXISTS cooking_recipe_suggester.ingredients (
    id UUID PRIMARY KEY,
    name TEXT,

    vegan BOOLEAN,
    vegetarian BOOLEAN,
    gluten_free BOOLEAN,
    dairy_free BOOLEAN,
    nut_free BOOLEAN,
    egg_free BOOLEAN,
    fish_free BOOLEAN,
    shellfish_free BOOLEAN,
    soy_free BOOLEAN
);