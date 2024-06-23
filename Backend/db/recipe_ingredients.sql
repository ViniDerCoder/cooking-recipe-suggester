CREATE TABLE IF NOT EXISTS recipe_ingredients (
    recipe_id INT,
    ingredient_id INT,
    quantity DECIMAL(10, 2),
    unit VARCHAR(20),
    PRIMARY KEY (recipe_id, ingredient_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
    CHECK (unit IN (
        NULL, 
        'cups', 
        'tablespoons', 'teaspoons', 
        'grams', 'kilograms', 
        'milliliters', 'liters', 
        'some', 'big', 'small',
        'shot', 'pinch', 'drop',
        'packet' 
    ))
);