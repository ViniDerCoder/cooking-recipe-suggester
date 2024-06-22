CREATE TABLE recipe_ingredients (
    recipe_id INT,
    ingredient_id INT,
    quantity VARCHAR(255),
    PRIMARY KEY (recipe_id, ingredient_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
);