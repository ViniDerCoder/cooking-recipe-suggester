CREATE TABLE IF NOT EXISTS user_recipes (
    user_id INT,
    recipe_id INT,
    rating INT,
    notes TEXT,
    cooked LIST<TIMESTAMP>,
    PRIMARY KEY (user_id, recipe_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);