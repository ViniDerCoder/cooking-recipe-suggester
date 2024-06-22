CREATE TABLE IF NOT EXISTS ingredients (
    id UUID PRIMARY KEY,
    name TEXT,
    description TEXT,
    category_id UUID,
    FOREIGN KEY (category_id) REFERENCES ingredient_categorys(id)
);