CREATE TABLE IF NOT EXISTS cooking_recipe_suggester.recipes (
    id UUID PRIMARY KEY,
    name TEXT,
    description TEXT,
    instructions LIST<TEXT>,
    created_at TIMESTAMP,
    created_by UUID,
    cooking_time INT,
    waiting_time INT,
    servings INT,
    public BOOLEAN,
    type_id UUID,
    source_url TEXT,
    image_url TEXT
);