CREATE TABLE IF NOT EXISTS cooking_recipe_suggester.user_authentication (
    authentication_token TEXT PRIMARY KEY,
    user_id UUID,
    expires_at TIMESTAMP
);