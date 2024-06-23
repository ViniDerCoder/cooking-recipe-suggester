CREATE TABLE IF NOT EXISTS cooking_recipe_suggester.users (
    id UUID PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    username TEXT,
    email TEXT,
    created_at TIMESTAMP
);