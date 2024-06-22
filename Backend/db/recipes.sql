CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY,
    name TEXT,
    description TEXT
    instructions LIST<TEXT>,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    cooking_time INT,
    waiting_time INT,
    servings INT,
    public BOOLEAN DEFAULT FALSE,
    type_id UUID,
    FOREIGN KEY (type_id) REFERENCES recipe_types(id)
);