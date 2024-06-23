CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
    instructions LIST<TEXT>,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    created_by UUID,
    FOREIGN KEY (created_by) REFERENCES users(id),
    cooking_time INT,
    waiting_time INT,
    servings INT,
    public BOOLEAN DEFAULT FALSE,
    type_id UUID,
    FOREIGN KEY (type_id) REFERENCES recipe_types(id)
    source_url TEXT,
    image_url TEXT
);