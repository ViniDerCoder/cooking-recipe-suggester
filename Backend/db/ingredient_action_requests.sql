CREATE TABLE IF NOT EXISTS cooking_recipe_suggester.ingredient_action_requests (
    id UUID PRIMARY KEY,
    action TEXT,
    created_at TIMESTAMP,
    created_by UUID,

    ingredient_id UUID,

    data TEXT
);